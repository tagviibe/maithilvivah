import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { PartnerPreferences } from '../../profiles/entities/partner-preferences.entity';
import { CompatibilityService } from './compatibility.service';
import { MatchRepository } from '../repositories/match.repository';
import { MatchStatus } from '../entities/match.entity';
import { Gender } from '../../profiles/enums/profile.enums';

interface CandidateScore {
  userId: string;
  score: number;
}

@Injectable()
export class MatchingEngineService {
  private readonly logger = new Logger(MatchingEngineService.name);

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(PartnerPreferences)
    private preferencesRepository: Repository<PartnerPreferences>,
    private compatibilityService: CompatibilityService,
    private matchRepository: MatchRepository,
  ) { }

  /**
   * Run Gale-Shapley inspired matching for a single user.
   * Finds the best matches from the opposite gender pool,
   * scores them, and stores top N matches.
   */
  async generateMatchesForUser(userId: string, maxMatches: number = 50): Promise<number> {
    const profile = await this.profileRepository.findOne({ where: { user_id: userId } });
    if (!profile || !profile.gender) {
      this.logger.warn(`Cannot generate matches for user ${userId}: missing profile or gender`);
      return 0;
    }

    const preferences = await this.preferencesRepository.findOne({ where: { user_id: userId } });

    // Get opposite gender profiles
    const oppositeGender = profile.gender === Gender.MALE ? Gender.FEMALE : Gender.FEMALE;
    const targetGender = profile.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;

    const candidates = await this.profileRepository.find({
      where: { gender: targetGender },
    });

    if (candidates.length === 0) {
      this.logger.log(`No candidates found for user ${userId}`);
      return 0;
    }

    // Load all candidate preferences in bulk
    const candidateUserIds = candidates.map(c => c.user_id);
    const allPreferences = await this.preferencesRepository.find({
      where: { user_id: In(candidateUserIds) },
    });
    const preferencesMap = new Map<string, PartnerPreferences>();
    allPreferences.forEach(p => preferencesMap.set(p.user_id, p));

    // Score each candidate
    const scoredCandidates: Array<{
      candidateUserId: string;
      score: number;
      breakdown: any;
    }> = [];

    for (const candidate of candidates) {
      if (candidate.user_id === userId) continue;

      const candidatePrefs = preferencesMap.get(candidate.user_id) || null;

      const result = this.compatibilityService.calculateCompatibility(
        profile,
        preferences,
        candidate,
        candidatePrefs,
      );

      if (result.isHardReject) continue;

      scoredCandidates.push({
        candidateUserId: candidate.user_id,
        score: result.score,
        breakdown: result.breakdown,
      });
    }

    // Sort by score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Take top N
    const topMatches = scoredCandidates.slice(0, maxMatches);

    // Store matches
    const matchData = topMatches.map((m, index) => ({
      user_id: userId,
      matched_user_id: m.candidateUserId,
      compatibility_score: m.score,
      score_breakdown: m.breakdown,
      rank: index + 1,
      status: MatchStatus.PENDING,
    }));

    await this.matchRepository.bulkUpsert(matchData);

    this.logger.log(`Generated ${topMatches.length} matches for user ${userId}`);
    return topMatches.length;
  }

  /**
   * Run Gale-Shapley stable matching algorithm across all users.
   * This creates stable pairings where no two people would prefer
   * each other over their current match.
   */
  async runGaleShapleyMatching(): Promise<{ totalPairs: number; duration: number }> {
    const startTime = Date.now();
    this.logger.log('Starting Gale-Shapley matching run...');

    // Load all profiles with gender
    const maleProfiles = await this.profileRepository.find({
      where: { gender: Gender.MALE },
    });
    const femaleProfiles = await this.profileRepository.find({
      where: { gender: Gender.FEMALE },
    });

    if (maleProfiles.length === 0 || femaleProfiles.length === 0) {
      this.logger.warn('Not enough profiles for matching');
      return { totalPairs: 0, duration: Date.now() - startTime };
    }

    // Load all preferences
    const allUserIds = [...maleProfiles, ...femaleProfiles].map(p => p.user_id);
    const allPreferences = await this.preferencesRepository.find({
      where: { user_id: In(allUserIds) },
    });
    const prefsMap = new Map<string, PartnerPreferences>();
    allPreferences.forEach(p => prefsMap.set(p.user_id, p));

    const profileMap = new Map<string, Profile>();
    [...maleProfiles, ...femaleProfiles].forEach(p => profileMap.set(p.user_id, p));

    // Build preference lists for males (proposers)
    // Each male ranks all females by one-directional score
    const malePreferenceLists = new Map<string, CandidateScore[]>();
    for (const male of maleProfiles) {
      const malePrefs = prefsMap.get(male.user_id) || null;
      const ranked: CandidateScore[] = [];

      for (const female of femaleProfiles) {
        const result = this.compatibilityService.calculateCompatibility(
          male,
          malePrefs,
          female,
          prefsMap.get(female.user_id) || null,
        );

        if (!result.isHardReject) {
          ranked.push({ userId: female.user_id, score: result.score });
        }
      }

      ranked.sort((a, b) => b.score - a.score);
      malePreferenceLists.set(male.user_id, ranked);
    }

    // Build preference rankings for females (evaluators)
    // Each female has a score for each male
    const femaleRankings = new Map<string, Map<string, number>>();
    for (const female of femaleProfiles) {
      const femalePrefs = prefsMap.get(female.user_id) || null;
      const rankings = new Map<string, number>();

      for (const male of maleProfiles) {
        const result = this.compatibilityService.calculateCompatibility(
          female,
          femalePrefs,
          male,
          prefsMap.get(male.user_id) || null,
        );

        if (!result.isHardReject) {
          rankings.set(male.user_id, result.score);
        }
      }

      femaleRankings.set(female.user_id, rankings);
    }

    // ─── Gale-Shapley Algorithm ───
    // Males propose, females accept/reject
    const freeMales = new Set(maleProfiles.map(m => m.user_id));
    const maleProposalIndex = new Map<string, number>(); // tracks which female each male proposes to next
    const currentPartner = new Map<string, string>(); // female -> male currently matched

    // Initialize proposal indices
    for (const male of maleProfiles) {
      maleProposalIndex.set(male.user_id, 0);
    }

    let iterations = 0;
    const maxIterations = maleProfiles.length * femaleProfiles.length;

    while (freeMales.size > 0 && iterations < maxIterations) {
      iterations++;

      // Pick a free male
      const maleId = freeMales.values().next().value;
      if (!maleId) break;

      const prefList = malePreferenceLists.get(maleId) || [];
      const proposalIdx = maleProposalIndex.get(maleId) || 0;

      // If male has exhausted all proposals
      if (proposalIdx >= prefList.length) {
        freeMales.delete(maleId);
        continue;
      }

      const targetFemaleId = prefList[proposalIdx].userId;
      maleProposalIndex.set(maleId, proposalIdx + 1);

      const femaleRanking = femaleRankings.get(targetFemaleId);
      if (!femaleRanking) {
        continue;
      }

      const maleScoreForFemale = femaleRanking.get(maleId) || 0;
      const currentMaleId = currentPartner.get(targetFemaleId);

      if (!currentMaleId) {
        // Female is free, accept proposal
        currentPartner.set(targetFemaleId, maleId);
        freeMales.delete(maleId);
      } else {
        // Female is taken, compare
        const currentScore = femaleRanking.get(currentMaleId) || 0;
        if (maleScoreForFemale > currentScore) {
          // New male is better, switch
          currentPartner.set(targetFemaleId, maleId);
          freeMales.delete(maleId);
          freeMales.add(currentMaleId); // old male becomes free
        }
        // else: female stays with current, male stays free and tries next
      }
    }

    this.logger.log(`Gale-Shapley completed in ${iterations} iterations`);

    // Store stable matches (both directions)
    let totalPairs = 0;
    for (const [femaleId, maleId] of currentPartner.entries()) {
      const maleProfile = profileMap.get(maleId);
      const femaleProfile = profileMap.get(femaleId);
      if (!maleProfile || !femaleProfile) continue;

      const result = this.compatibilityService.calculateCompatibility(
        maleProfile,
        prefsMap.get(maleId) || null,
        femaleProfile,
        prefsMap.get(femaleId) || null,
      );

      // Store match for male
      await this.matchRepository.upsertMatch({
        user_id: maleId,
        matched_user_id: femaleId,
        compatibility_score: result.score,
        score_breakdown: result.breakdown,
        rank: 1, // stable match gets top rank
        status: MatchStatus.PENDING,
      });

      // Store match for female
      await this.matchRepository.upsertMatch({
        user_id: femaleId,
        matched_user_id: maleId,
        compatibility_score: result.score,
        score_breakdown: result.breakdown,
        rank: 1,
        status: MatchStatus.PENDING,
      });

      totalPairs++;
    }

    const duration = Date.now() - startTime;
    this.logger.log(`Gale-Shapley matching complete: ${totalPairs} stable pairs in ${duration}ms`);

    // Also generate additional recommendations for each user
    for (const profile of [...maleProfiles, ...femaleProfiles]) {
      await this.generateMatchesForUser(profile.user_id, 50);
    }

    return { totalPairs, duration };
  }

  /**
   * Get recommended matches for a user with profile data.
   */
  async getRecommendations(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    matches: Array<{
      matchId: string;
      userId: string;
      compatibilityScore: number;
      scoreBreakdown: any;
      profile: Partial<Profile>;
      isShortlisted?: boolean;
      interestStatus?: string;
    }>;
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    // Check if user has matches, if not generate them
    const matchCount = await this.matchRepository.countByUserId(userId);
    if (matchCount === 0) {
      await this.generateMatchesForUser(userId);
    }

    const matches = await this.matchRepository.findByUserId(userId, limit, offset);
    const total = await this.matchRepository.countByUserId(userId);

    // Load profiles with user relation for email/phone
    const matchedUserIds = matches.map(m => m.matched_user_id);
    const profiles = matchedUserIds.length > 0
      ? await this.profileRepository.find({
        where: { user_id: In(matchedUserIds) },
        relations: ['user'],
      })
      : [];
    const profileMap = new Map<string, Profile>();
    profiles.forEach(p => profileMap.set(p.user_id, p));

    const result = matches.map(match => {
      const profile = profileMap.get(match.matched_user_id);
      return {
        matchId: match.id,
        userId: match.matched_user_id,
        compatibilityScore: Number(match.compatibility_score),
        scoreBreakdown: match.score_breakdown,
        profile: profile ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          height_cm: profile.height_cm,
          religion: profile.religion,
          caste: profile.caste,
          mother_tongue: profile.mother_tongue,
          highest_education: profile.highest_education,
          occupation: profile.occupation,
          annual_income: profile.annual_income,
          country: profile.country,
          state: profile.state,
          city: profile.city,
          about_me: profile.about_me,
          diet: profile.diet,
          manglik: profile.manglik,
          is_verified: profile.is_verified,
          email: profile.user?.email || null,
          phone: profile.user?.phone || null,
          last_login_at: profile.user?.last_login_at || null,
        } : {},
      };
    });

    return {
      matches: result,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
