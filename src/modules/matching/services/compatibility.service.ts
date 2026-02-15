import { Injectable } from '@nestjs/common';
import { Profile } from '../../profiles/entities/profile.entity';
import { PartnerPreferences } from '../../profiles/entities/partner-preferences.entity';
import { Gender } from '../../profiles/enums/profile.enums';

export interface ScoreBreakdown {
  religion: number;
  caste: number;
  age: number;
  height: number;
  education: number;
  location: number;
  diet: number;
  manglik: number;
  income: number;
  mother_tongue: number;
}

export interface CompatibilityResult {
  score: number;
  breakdown: ScoreBreakdown;
  isHardReject: boolean;
  rejectReason?: string;
}

// Weight configuration — total = 100
const WEIGHTS = {
  religion: 15,
  caste: 12,
  age: 12,
  height: 5,
  education: 10,
  location: 12,
  diet: 8,
  manglik: 10,
  income: 8,
  mother_tongue: 8,
};

// Income ranking for comparison
const INCOME_RANK: Record<string, number> = {
  below_2l: 1,
  '2l_5l': 2,
  '5l_10l': 3,
  '10l_20l': 4,
  '20l_50l': 5,
  '50l_1cr': 6,
  above_1cr: 7,
};

// Education ranking for comparison
const EDUCATION_RANK: Record<string, number> = {
  high_school: 1,
  diploma: 2,
  bachelors: 3,
  masters: 4,
  doctorate: 5,
  post_doctorate: 6,
};

@Injectable()
export class CompatibilityService {
  /**
   * Calculate compatibility between two profiles considering both users' preferences.
   * Returns a score from 0-100 and a breakdown by category.
   */
  calculateCompatibility(
    profileA: Profile,
    preferencesA: PartnerPreferences | null,
    profileB: Profile,
    preferencesB: PartnerPreferences | null,
  ): CompatibilityResult {
    // Hard reject: same gender
    if (profileA.gender && profileB.gender && profileA.gender === profileB.gender) {
      return { score: 0, breakdown: this.emptyBreakdown(), isHardReject: true, rejectReason: 'same_gender' };
    }

    // Hard reject: same gotra (important in Maithil community)
    if (profileA.gotra && profileB.gotra && profileA.gotra.toLowerCase() === profileB.gotra.toLowerCase()) {
      return { score: 0, breakdown: this.emptyBreakdown(), isHardReject: true, rejectReason: 'same_gotra' };
    }

    const breakdown: ScoreBreakdown = {
      religion: this.scoreReligion(profileA, preferencesA, profileB, preferencesB),
      caste: this.scoreCaste(profileA, preferencesA, profileB, preferencesB),
      age: this.scoreAge(profileA, preferencesA, profileB, preferencesB),
      height: this.scoreHeight(profileA, preferencesA, profileB, preferencesB),
      education: this.scoreEducation(profileA, preferencesA, profileB, preferencesB),
      location: this.scoreLocation(profileA, preferencesA, profileB, preferencesB),
      diet: this.scoreDiet(profileA, preferencesA, profileB, preferencesB),
      manglik: this.scoreManglik(profileA, preferencesA, profileB, preferencesB),
      income: this.scoreIncome(profileA, preferencesA, profileB, preferencesB),
      mother_tongue: this.scoreMotherTongue(profileA, preferencesA, profileB, preferencesB),
    };

    // Weighted total
    let totalScore = 0;
    for (const key of Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]) {
      totalScore += (breakdown[key] / 100) * WEIGHTS[key];
    }

    return {
      score: Math.round(totalScore * 100) / 100,
      breakdown,
      isHardReject: false,
    };
  }

  /**
   * Score how well profileB matches profileA's preferences (one-directional).
   * Used for Gale-Shapley preference ranking.
   */
  scoreOneDirectional(
    profileA: Profile,
    preferencesA: PartnerPreferences | null,
    profileB: Profile,
  ): number {
    if (!preferencesA) return 50; // No preferences = neutral score

    let score = 0;
    let maxScore = 0;

    // Religion match
    if (preferencesA.religion?.length) {
      maxScore += WEIGHTS.religion;
      if (profileB.religion && preferencesA.religion.includes(profileB.religion)) {
        score += WEIGHTS.religion;
      }
    }

    // Caste match
    if (preferencesA.caste?.length) {
      maxScore += WEIGHTS.caste;
      if (profileB.caste && preferencesA.caste.includes(profileB.caste)) {
        score += WEIGHTS.caste;
      }
    }

    // Age match
    if (preferencesA.age_min || preferencesA.age_max) {
      maxScore += WEIGHTS.age;
      const age = this.calculateAge(profileB.date_of_birth);
      if (age) {
        const min = preferencesA.age_min || 18;
        const max = preferencesA.age_max || 100;
        if (age >= min && age <= max) {
          score += WEIGHTS.age;
        } else {
          // Partial score if within 3 years of range
          const diff = age < min ? min - age : age - max;
          if (diff <= 3) score += WEIGHTS.age * (1 - diff / 6);
        }
      }
    }

    // Height match
    if (preferencesA.height_min_cm || preferencesA.height_max_cm) {
      maxScore += WEIGHTS.height;
      if (profileB.height_cm) {
        const min = preferencesA.height_min_cm || 120;
        const max = preferencesA.height_max_cm || 250;
        if (profileB.height_cm >= min && profileB.height_cm <= max) {
          score += WEIGHTS.height;
        } else {
          const diff = profileB.height_cm < min ? min - profileB.height_cm : profileB.height_cm - max;
          if (diff <= 5) score += WEIGHTS.height * (1 - diff / 10);
        }
      }
    }

    // Education match
    if (preferencesA.education?.length) {
      maxScore += WEIGHTS.education;
      if (profileB.highest_education && preferencesA.education.includes(profileB.highest_education)) {
        score += WEIGHTS.education;
      } else if (profileB.highest_education) {
        // Partial score if education is higher than any preferred
        const bRank = EDUCATION_RANK[profileB.highest_education] || 0;
        const maxPrefRank = Math.max(...preferencesA.education.map(e => EDUCATION_RANK[e] || 0));
        if (bRank >= maxPrefRank) {
          score += WEIGHTS.education * 0.7;
        }
      }
    }

    // Location match
    if (preferencesA.country?.length) {
      maxScore += WEIGHTS.location;
      if (profileB.country) {
        if (preferencesA.country.includes(profileB.country)) {
          score += WEIGHTS.location * 0.5;
          // Bonus for same state
          if (preferencesA.state?.length && profileB.state && preferencesA.state.includes(profileB.state)) {
            score += WEIGHTS.location * 0.5;
          } else if (!preferencesA.state?.length) {
            score += WEIGHTS.location * 0.5;
          }
        }
      }
    }

    // Diet match
    if (preferencesA.diet?.length) {
      maxScore += WEIGHTS.diet;
      if (profileB.diet && preferencesA.diet.includes(profileB.diet)) {
        score += WEIGHTS.diet;
      }
    }

    // Manglik match
    if (preferencesA.manglik) {
      maxScore += WEIGHTS.manglik;
      if (profileB.manglik && profileB.manglik === preferencesA.manglik) {
        score += WEIGHTS.manglik;
      } else if (profileB.manglik === 'dont_know' || preferencesA.manglik === 'dont_know') {
        score += WEIGHTS.manglik * 0.5;
      }
    }

    // Mother tongue match
    if (preferencesA.mother_tongue?.length) {
      maxScore += WEIGHTS.mother_tongue;
      if (profileB.mother_tongue && preferencesA.mother_tongue.includes(profileB.mother_tongue)) {
        score += WEIGHTS.mother_tongue;
      }
    }

    if (maxScore === 0) return 50;
    return Math.round((score / maxScore) * 100 * 100) / 100;
  }

  // ─── Individual scoring functions (bidirectional) ───

  private scoreReligion(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.religion || !pB.religion) return 50;
    if (pA.religion === pB.religion) return 100;

    // Check if each accepts the other's religion
    let scoreA = 50, scoreB = 50;
    if (prA?.religion?.length) {
      scoreA = prA.religion.includes(pB.religion) ? 100 : 0;
    }
    if (prB?.religion?.length) {
      scoreB = prB.religion.includes(pA.religion) ? 100 : 0;
    }
    return (scoreA + scoreB) / 2;
  }

  private scoreCaste(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.caste || !pB.caste) return 50;
    if (pA.caste.toLowerCase() === pB.caste.toLowerCase()) return 100;

    let scoreA = 50, scoreB = 50;
    if (prA?.caste?.length) {
      scoreA = prA.caste.map(c => c.toLowerCase()).includes(pB.caste.toLowerCase()) ? 100 : 20;
    }
    if (prB?.caste?.length) {
      scoreB = prB.caste.map(c => c.toLowerCase()).includes(pA.caste.toLowerCase()) ? 100 : 20;
    }
    return (scoreA + scoreB) / 2;
  }

  private scoreAge(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    const ageA = this.calculateAge(pA.date_of_birth);
    const ageB = this.calculateAge(pB.date_of_birth);
    if (!ageA || !ageB) return 50;

    let scoreA = 100, scoreB = 100;

    if (prA?.age_min || prA?.age_max) {
      const min = prA.age_min || 18;
      const max = prA.age_max || 100;
      if (ageB >= min && ageB <= max) {
        scoreA = 100;
      } else {
        const diff = ageB < min ? min - ageB : ageB - max;
        scoreA = Math.max(0, 100 - diff * 15);
      }
    }

    if (prB?.age_min || prB?.age_max) {
      const min = prB.age_min || 18;
      const max = prB.age_max || 100;
      if (ageA >= min && ageA <= max) {
        scoreB = 100;
      } else {
        const diff = ageA < min ? min - ageA : ageA - max;
        scoreB = Math.max(0, 100 - diff * 15);
      }
    }

    return (scoreA + scoreB) / 2;
  }

  private scoreHeight(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.height_cm || !pB.height_cm) return 50;

    let scoreA = 100, scoreB = 100;

    if (prA?.height_min_cm || prA?.height_max_cm) {
      const min = prA.height_min_cm || 120;
      const max = prA.height_max_cm || 250;
      if (pB.height_cm >= min && pB.height_cm <= max) {
        scoreA = 100;
      } else {
        const diff = pB.height_cm < min ? min - pB.height_cm : pB.height_cm - max;
        scoreA = Math.max(0, 100 - diff * 8);
      }
    }

    if (prB?.height_min_cm || prB?.height_max_cm) {
      const min = prB.height_min_cm || 120;
      const max = prB.height_max_cm || 250;
      if (pA.height_cm >= min && pA.height_cm <= max) {
        scoreB = 100;
      } else {
        const diff = pA.height_cm < min ? min - pA.height_cm : pA.height_cm - max;
        scoreB = Math.max(0, 100 - diff * 8);
      }
    }

    return (scoreA + scoreB) / 2;
  }

  private scoreEducation(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.highest_education || !pB.highest_education) return 50;

    let scoreA = 70, scoreB = 70;

    if (prA?.education?.length) {
      if (prA.education.includes(pB.highest_education)) {
        scoreA = 100;
      } else {
        const bRank = EDUCATION_RANK[pB.highest_education] || 0;
        const maxPrefRank = Math.max(...prA.education.map(e => EDUCATION_RANK[e] || 0));
        scoreA = bRank >= maxPrefRank ? 70 : 30;
      }
    }

    if (prB?.education?.length) {
      if (prB.education.includes(pA.highest_education)) {
        scoreB = 100;
      } else {
        const aRank = EDUCATION_RANK[pA.highest_education] || 0;
        const maxPrefRank = Math.max(...prB.education.map(e => EDUCATION_RANK[e] || 0));
        scoreB = aRank >= maxPrefRank ? 70 : 30;
      }
    }

    return (scoreA + scoreB) / 2;
  }

  private scoreLocation(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    let scoreA = 50, scoreB = 50;

    // Same city = 100, same state = 80, same country = 60
    if (pA.city && pB.city && pA.city.toLowerCase() === pB.city.toLowerCase()) {
      scoreA = 100;
      scoreB = 100;
    } else if (pA.state && pB.state && pA.state.toLowerCase() === pB.state.toLowerCase()) {
      scoreA = 80;
      scoreB = 80;
    } else if (pA.country && pB.country && pA.country.toLowerCase() === pB.country.toLowerCase()) {
      scoreA = 60;
      scoreB = 60;
    }

    // Override with preference-based scoring if preferences exist
    if (prA?.country?.length && pB.country) {
      if (prA.country.includes(pB.country)) {
        scoreA = prA.state?.length && pB.state && prA.state.includes(pB.state) ? 100 : 70;
      } else {
        scoreA = 20;
      }
    }

    if (prB?.country?.length && pA.country) {
      if (prB.country.includes(pA.country)) {
        scoreB = prB.state?.length && pA.state && prB.state.includes(pA.state) ? 100 : 70;
      } else {
        scoreB = 20;
      }
    }

    return (scoreA + scoreB) / 2;
  }

  private scoreDiet(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.diet || !pB.diet) return 50;
    if (pA.diet === pB.diet) return 100;

    let scoreA = 60, scoreB = 60;
    if (prA?.diet?.length) {
      scoreA = prA.diet.includes(pB.diet) ? 100 : 20;
    }
    if (prB?.diet?.length) {
      scoreB = prB.diet.includes(pA.diet) ? 100 : 20;
    }
    return (scoreA + scoreB) / 2;
  }

  private scoreManglik(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.manglik || !pB.manglik) return 50;
    if (pA.manglik === pB.manglik) return 100;

    // dont_know is neutral
    if (pA.manglik === 'dont_know' || pB.manglik === 'dont_know') return 60;

    // Both manglik or both non-manglik = good
    const manglikValues = ['yes', 'anshik'];
    const aIsManglik = manglikValues.includes(pA.manglik);
    const bIsManglik = manglikValues.includes(pB.manglik);
    if (aIsManglik === bIsManglik) return 90;

    // One manglik, one not — check preferences
    let score = 30;
    if (prA?.manglik) {
      if (prA.manglik === pB.manglik) score = 80;
      else if (prA.manglik === 'dont_know') score = 50;
    }
    if (prB?.manglik) {
      if (prB.manglik === pA.manglik) score = Math.max(score, 80);
      else if (prB.manglik === 'dont_know') score = Math.max(score, 50);
    }
    return score;
  }

  private scoreIncome(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.annual_income || !pB.annual_income) return 50;

    const rankA = INCOME_RANK[pA.annual_income] || 0;
    const rankB = INCOME_RANK[pB.annual_income] || 0;

    // Similar income levels score higher
    const diff = Math.abs(rankA - rankB);
    if (diff === 0) return 100;
    if (diff === 1) return 85;
    if (diff === 2) return 65;
    return Math.max(30, 100 - diff * 15);
  }

  private scoreMotherTongue(pA: Profile, prA: PartnerPreferences | null, pB: Profile, prB: PartnerPreferences | null): number {
    if (!pA.mother_tongue || !pB.mother_tongue) return 50;
    if (pA.mother_tongue.toLowerCase() === pB.mother_tongue.toLowerCase()) return 100;

    let scoreA = 40, scoreB = 40;
    if (prA?.mother_tongue?.length) {
      scoreA = prA.mother_tongue.map(m => m.toLowerCase()).includes(pB.mother_tongue.toLowerCase()) ? 100 : 30;
    }
    if (prB?.mother_tongue?.length) {
      scoreB = prB.mother_tongue.map(m => m.toLowerCase()).includes(pA.mother_tongue.toLowerCase()) ? 100 : 30;
    }
    return (scoreA + scoreB) / 2;
  }

  // ─── Helpers ───

  private calculateAge(dob: Date | null | undefined): number | null {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  private emptyBreakdown(): ScoreBreakdown {
    return {
      religion: 0,
      caste: 0,
      age: 0,
      height: 0,
      education: 0,
      location: 0,
      diet: 0,
      manglik: 0,
      income: 0,
      mother_tongue: 0,
    };
  }
}
