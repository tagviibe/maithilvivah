import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfileRepository } from '@/modules/profiles/repositories/profile.repository';
import { PartnerPreferencesRepository } from '@/modules/profiles/repositories/partner-preferences.repository';
import { ProfilePhotoRepository } from '@/modules/profiles/repositories/profile-photo.repository';
import { OnboardingProgressLogRepository } from '@/modules/profiles/repositories/onboarding-progress-log.repository';
import { UserRepository } from '@/modules/auth/repositories/user.repository';
import { LoggerService } from '@/common/services/logger.service';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { PartnerPreferences } from '@/modules/profiles/entities/partner-preferences.entity';
import { BasicInfoDto } from '@/modules/profiles/dto/basic-info.dto';
import { CommunityInfoDto } from '@/modules/profiles/dto/community-info.dto';
import { LocationInfoDto } from '@/modules/profiles/dto/location-info.dto';
import { EducationInfoDto } from '@/modules/profiles/dto/education-info.dto';
import { FamilyInfoDto } from '@/modules/profiles/dto/family-info.dto';
import { LifestyleInfoDto } from '@/modules/profiles/dto/lifestyle-info.dto';
import { PartnerPreferencesDto } from '@/modules/profiles/dto/partner-preferences.dto';

@Injectable()
export class ProfilesService {
    private readonly SECTION_WEIGHTS = {
        'basic-info': 15,
        'community-info': 10,
        'location-info': 10,
        'education-info': 15,
        'family-info': 15,
        'lifestyle-info': 10,
        'partner-preferences': 15,
        photos: 10,
    };

    private readonly SECTION_ORDER = [
        'basic-info',
        'community-info',
        'location-info',
        'education-info',
        'family-info',
        'lifestyle-info',
        'partner-preferences',
        'photos',
    ];

    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly partnerPreferencesRepository: PartnerPreferencesRepository,
        private readonly profilePhotoRepository: ProfilePhotoRepository,
        private readonly progressLogRepository: OnboardingProgressLogRepository,
        private readonly userRepository: UserRepository,
        private readonly logger: LoggerService,
    ) { }

    // Basic Info
    async updateBasicInfo(userId: string, data: BasicInfoDto) {
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await this.profileRepository.createProfile(userId);
        }

        const updatedProfile = await this.profileRepository.updateBasicInfo(
            userId,
            data,
        );

        await this.trackProgress(userId, 'basic-info', 'saved');

        this.logger.log(
            `Basic info updated for user: ${userId}`,
            'ProfilesService',
        );

        return updatedProfile;
    }

    async getBasicInfo(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return {
            first_name: profile.first_name,
            middle_name: profile.middle_name,
            last_name: profile.last_name,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            height_cm: profile.height_cm,
            weight_kg: profile.weight_kg,
            marital_status: profile.marital_status,
            body_type: profile.body_type,
            complexion: profile.complexion,
            disability: profile.disability,
            about_me: profile.about_me,
        };
    }

    // Community Info
    async updateCommunityInfo(userId: string, data: CommunityInfoDto) {
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await this.profileRepository.createProfile(userId);
        }

        const updatedProfile = await this.profileRepository.updateCommunityInfo(
            userId,
            data,
        );

        await this.trackProgress(userId, 'community-info', 'saved');

        this.logger.log(
            `Community info updated for user: ${userId}`,
            'ProfilesService',
        );

        return updatedProfile;
    }

    async getCommunityInfo(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return {
            religion: profile.religion,
            caste: profile.caste,
            sub_caste: profile.sub_caste,
            gotra: profile.gotra,
            mother_tongue: profile.mother_tongue,
            manglik: profile.manglik,
        };
    }

    // Location Info
    async updateLocationInfo(userId: string, data: LocationInfoDto) {
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await this.profileRepository.createProfile(userId);
        }

        const updatedProfile = await this.profileRepository.updateLocationInfo(
            userId,
            data,
        );

        await this.trackProgress(userId, 'location-info', 'saved');

        this.logger.log(
            `Location info updated for user: ${userId}`,
            'ProfilesService',
        );

        return updatedProfile;
    }

    async getLocationInfo(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return {
            country: profile.country,
            state: profile.state,
            city: profile.city,
            zip_code: profile.zip_code,
            citizenship: profile.citizenship,
            residing_country: profile.residing_country,
            residing_city: profile.residing_city,
        };
    }

    // Education Info
    async updateEducationInfo(userId: string, data: EducationInfoDto) {
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await this.profileRepository.createProfile(userId);
        }

        const updatedProfile = await this.profileRepository.updateEducationInfo(
            userId,
            data,
        );

        await this.trackProgress(userId, 'education-info', 'saved');

        this.logger.log(
            `Education info updated for user: ${userId}`,
            'ProfilesService',
        );

        return updatedProfile;
    }

    async getEducationInfo(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return {
            highest_education: profile.highest_education,
            education_details: profile.education_details,
            college_name: profile.college_name,
            occupation: profile.occupation,
            occupation_details: profile.occupation_details,
            annual_income: profile.annual_income,
            employer_name: profile.employer_name,
        };
    }

    // Family Info
    async updateFamilyInfo(userId: string, data: FamilyInfoDto) {
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await this.profileRepository.createProfile(userId);
        }

        const updatedProfile = await this.profileRepository.updateFamilyInfo(
            userId,
            data,
        );

        await this.trackProgress(userId, 'family-info', 'saved');

        this.logger.log(
            `Family info updated for user: ${userId}`,
            'ProfilesService',
        );

        return updatedProfile;
    }

    async getFamilyInfo(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return {
            father_name: profile.father_name,
            father_occupation: profile.father_occupation,
            mother_name: profile.mother_name,
            mother_occupation: profile.mother_occupation,
            brothers_count: profile.brothers_count,
            brothers_married: profile.brothers_married,
            sisters_count: profile.sisters_count,
            sisters_married: profile.sisters_married,
            family_type: profile.family_type,
            family_status: profile.family_status,
            family_values: profile.family_values,
            family_location: profile.family_location,
        };
    }

    // Lifestyle Info
    async updateLifestyleInfo(userId: string, data: LifestyleInfoDto) {
        let profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            profile = await this.profileRepository.createProfile(userId);
        }

        const updatedProfile = await this.profileRepository.updateLifestyleInfo(
            userId,
            data,
        );

        await this.trackProgress(userId, 'lifestyle-info', 'saved');

        this.logger.log(
            `Lifestyle info updated for user: ${userId}`,
            'ProfilesService',
        );

        return updatedProfile;
    }

    async getLifestyleInfo(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return {
            diet: profile.diet,
            drinking: profile.drinking,
            smoking: profile.smoking,
            hobbies: profile.hobbies,
            interests: profile.interests,
            languages_known: profile.languages_known,
            special_cases: profile.special_cases,
        };
    }

    // Partner Preferences
    async updatePartnerPreferences(userId: string, data: PartnerPreferencesDto) {
        const preferences = await this.partnerPreferencesRepository.createOrUpdate(
            userId,
            data,
        );

        await this.trackProgress(userId, 'partner-preferences', 'saved');

        this.logger.log(
            `Partner preferences updated for user: ${userId}`,
            'ProfilesService',
        );

        return preferences;
    }

    async getPartnerPreferences(userId: string) {
        return await this.partnerPreferencesRepository.findByUserId(userId);
    }

    // Complete Profile
    async getCompleteProfile(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);
        const preferences =
            await this.partnerPreferencesRepository.findByUserId(userId);
        const photos = await this.profilePhotoRepository.findByUserId(userId);

        return {
            profile,
            preferences,
            photos,
        };
    }

    // Progress Calculation
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    private calculateSectionCompletion(
        section: string,
        profile: Profile | null,
        preferences: PartnerPreferences | null,
        hasPhotos: boolean,
    ): number {
        switch (section) {
            case 'basic-info': {
                if (!profile) return 0;
                const basicFields = [
                    'first_name',
                    'last_name',
                    'date_of_birth',
                    'gender',
                    'height_cm',
                    'marital_status',
                ];
                const basicFilled = basicFields.filter(
                    (f) => (profile as any)[f] != null,
                ).length;
                return Math.round((basicFilled / basicFields.length) * 100);
            }

            case 'community-info': {
                if (!profile) return 0;
                const communityFields = ['religion', 'caste', 'mother_tongue'];
                const communityFilled = communityFields.filter(
                    (f) => (profile as any)[f] != null,
                ).length;
                return Math.round((communityFilled / communityFields.length) * 100);
            }

            case 'location-info': {
                if (!profile) return 0;
                const locationFields = ['country', 'state', 'city'];
                const locationFilled = locationFields.filter(
                    (f) => (profile as any)[f] != null,
                ).length;
                return Math.round((locationFilled / locationFields.length) * 100);
            }

            case 'education-info': {
                if (!profile) return 0;
                const educationFields = ['highest_education', 'occupation'];
                const educationFilled = educationFields.filter(
                    (f) => (profile as any)[f] != null,
                ).length;
                return Math.round((educationFilled / educationFields.length) * 100);
            }

            case 'family-info': {
                if (!profile) return 0;
                const familyFields = ['father_name', 'mother_name', 'family_type'];
                const familyFilled = familyFields.filter(
                    (f) => (profile as any)[f] != null,
                ).length;
                return Math.round((familyFilled / familyFields.length) * 100);
            }

            case 'lifestyle-info': {
                if (!profile) return 0;
                return (profile as any).diet ? 100 : 0;
            }

            case 'partner-preferences': {
                if (!preferences) return 0;
                const prefFields = [
                    'age_min',
                    'age_max',
                    'height_min_cm',
                    'height_max_cm',
                ];
                const prefFilled = prefFields.filter(
                    (f) => (preferences as any)[f] != null,
                ).length;
                return Math.round((prefFilled / prefFields.length) * 100);
            }

            case 'photos': {
                return hasPhotos ? 100 : 0;
            }

            default: {
                return 0;
            }
        }
    }

    async calculateProfileCompletion(userId: string): Promise<number> {
        const profile = await this.profileRepository.findByUserId(userId);
        const preferences =
            await this.partnerPreferencesRepository.findByUserId(userId);
        const hasPhotos =
            await this.profilePhotoRepository.hasApprovedPhoto(userId);

        let totalCompletion = 0;

        for (const section of this.SECTION_ORDER) {
            const sectionCompletion = this.calculateSectionCompletion(
                section,
                profile,
                preferences,
                hasPhotos,
            );
            const weight = this.SECTION_WEIGHTS[section];
            totalCompletion += (sectionCompletion / 100) * weight;
        }

        return Math.round(totalCompletion);
    }

    // Resume Journey
    async getResumeJourney(userId: string) {
        const profile = await this.profileRepository.findByUserId(userId);
        const preferences =
            await this.partnerPreferencesRepository.findByUserId(userId);
        const hasPhotos =
            await this.profilePhotoRepository.hasApprovedPhoto(userId);
        const user = await this.userRepository.findById(userId);

        const progress = {};
        let lastCompletedSection: string | null = null;
        const currentSection = user.last_active_section || 'basic-info';
        let currentStep = user.onboarding_step || 1;

        for (let i = 0; i < this.SECTION_ORDER.length; i++) {
            const section = this.SECTION_ORDER[i];
            const completion = this.calculateSectionCompletion(
                section,
                profile,
                preferences,
                hasPhotos,
            );
            const isCompleted = completion === 100;

            progress[section] = {
                completed: isCompleted,
                percentage: completion,
            };

            if (isCompleted) {
                lastCompletedSection = section;
                currentStep = i + 2; // Next step
            }
        }

        const nextIndex =
            this.SECTION_ORDER.indexOf(lastCompletedSection || 'basic-info') + 1;
        const nextRecommendedSection =
            nextIndex < this.SECTION_ORDER.length
                ? this.SECTION_ORDER[nextIndex]
                : null;

        const completionPercentage = await this.calculateProfileCompletion(userId);

        return {
            currentStep,
            currentSection,
            lastCompletedSection,
            nextRecommendedSection,
            completionPercentage,
            progress,
            lastActivity: user.last_onboarding_activity,
        };
    }

    // Track Progress
    private async trackProgress(
        userId: string,
        sectionName: string,
        action: string,
    ) {
        const completionPercentage = await this.calculateProfileCompletion(userId);

        // Update user's progress fields
        await this.userRepository.update(userId, {
            last_active_section: sectionName,
            last_onboarding_activity: new Date(),
            onboarding_step: this.SECTION_ORDER.indexOf(sectionName) + 1,
            profile_completion_percentage: completionPercentage,
        });

        // Log progress
        await this.progressLogRepository.logProgress(
            userId,
            sectionName,
            action,
            completionPercentage,
        );
    }

    // Complete Onboarding
    async completeOnboarding(userId: string) {
        const completionPercentage = await this.calculateProfileCompletion(userId);

        if (completionPercentage < 100) {
            throw new BadRequestException(
                `Profile is only ${completionPercentage}% complete. Please complete all sections.`,
            );
        }

        await this.userRepository.update(userId, {
            onboarding_completed: true,
        });

        await this.progressLogRepository.logProgress(
            userId,
            'onboarding',
            'completed',
            100,
        );

        this.logger.log(
            `Onboarding completed for user: ${userId}`,
            'ProfilesService',
        );

        return { message: 'Onboarding completed successfully' };
    }
}
