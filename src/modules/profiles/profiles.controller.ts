import { Controller, Get, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { BasicInfoDto } from '@/modules/profiles/dto/basic-info.dto';
import { CommunityInfoDto } from '@/modules/profiles/dto/community-info.dto';
import { LocationInfoDto } from '@/modules/profiles/dto/location-info.dto';
import { EducationInfoDto } from '@/modules/profiles/dto/education-info.dto';
import { FamilyInfoDto } from '@/modules/profiles/dto/family-info.dto';
import { LifestyleInfoDto } from '@/modules/profiles/dto/lifestyle-info.dto';
import { PartnerPreferencesDto } from '@/modules/profiles/dto/partner-preferences.dto';
import { API_ROUTES } from '@/common/constants/api-routes.constant';
import { SUCCESS_MESSAGES } from '@/common/constants/messages.constant';

@ApiTags('Profiles')
@Controller(API_ROUTES.PROFILES.BASE)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    // ==================== BASIC INFO ====================
    @Get(API_ROUTES.PROFILES.BASIC_INFO)
    @ApiOperation({ summary: 'Get basic information' })
    @ApiResponse({ status: 200, description: 'Basic info retrieved successfully' })
    async getBasicInfo(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getBasicInfo(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.BASIC_INFO)
    @ApiOperation({ summary: 'Update basic information' })
    @ApiResponse({ status: 200, description: 'Basic info updated successfully' })
    async updateBasicInfo(@Req() req: any, @Body() dto: BasicInfoDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updateBasicInfo(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.BASIC_INFO_UPDATED,
            data,
        };
    }

    // ==================== COMMUNITY INFO ====================
    @Get(API_ROUTES.PROFILES.COMMUNITY_INFO)
    @ApiOperation({ summary: 'Get community information' })
    @ApiResponse({ status: 200, description: 'Community info retrieved successfully' })
    async getCommunityInfo(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getCommunityInfo(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.COMMUNITY_INFO)
    @ApiOperation({ summary: 'Update community information' })
    @ApiResponse({ status: 200, description: 'Community info updated successfully' })
    async updateCommunityInfo(@Req() req: any, @Body() dto: CommunityInfoDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updateCommunityInfo(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.COMMUNITY_INFO_UPDATED,
            data,
        };
    }

    // ==================== LOCATION INFO ====================
    @Get(API_ROUTES.PROFILES.LOCATION_INFO)
    @ApiOperation({ summary: 'Get location information' })
    @ApiResponse({ status: 200, description: 'Location info retrieved successfully' })
    async getLocationInfo(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getLocationInfo(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.LOCATION_INFO)
    @ApiOperation({ summary: 'Update location information' })
    @ApiResponse({ status: 200, description: 'Location info updated successfully' })
    async updateLocationInfo(@Req() req: any, @Body() dto: LocationInfoDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updateLocationInfo(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.LOCATION_INFO_UPDATED,
            data,
        };
    }

    // ==================== EDUCATION INFO ====================
    @Get(API_ROUTES.PROFILES.EDUCATION_INFO)
    @ApiOperation({ summary: 'Get education and career information' })
    @ApiResponse({ status: 200, description: 'Education info retrieved successfully' })
    async getEducationInfo(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getEducationInfo(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.EDUCATION_INFO)
    @ApiOperation({ summary: 'Update education and career information' })
    @ApiResponse({ status: 200, description: 'Education info updated successfully' })
    async updateEducationInfo(@Req() req: any, @Body() dto: EducationInfoDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updateEducationInfo(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.EDUCATION_INFO_UPDATED,
            data,
        };
    }

    // ==================== FAMILY INFO ====================
    @Get(API_ROUTES.PROFILES.FAMILY_INFO)
    @ApiOperation({ summary: 'Get family information' })
    @ApiResponse({ status: 200, description: 'Family info retrieved successfully' })
    async getFamilyInfo(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getFamilyInfo(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.FAMILY_INFO)
    @ApiOperation({ summary: 'Update family information' })
    @ApiResponse({ status: 200, description: 'Family info updated successfully' })
    async updateFamilyInfo(@Req() req: any, @Body() dto: FamilyInfoDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updateFamilyInfo(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.FAMILY_INFO_UPDATED,
            data,
        };
    }

    // ==================== LIFESTYLE INFO ====================
    @Get(API_ROUTES.PROFILES.LIFESTYLE_INFO)
    @ApiOperation({ summary: 'Get lifestyle information' })
    @ApiResponse({ status: 200, description: 'Lifestyle info retrieved successfully' })
    async getLifestyleInfo(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getLifestyleInfo(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.LIFESTYLE_INFO)
    @ApiOperation({ summary: 'Update lifestyle information' })
    @ApiResponse({ status: 200, description: 'Lifestyle info updated successfully' })
    async updateLifestyleInfo(@Req() req: any, @Body() dto: LifestyleInfoDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updateLifestyleInfo(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.LIFESTYLE_INFO_UPDATED,
            data,
        };
    }

    // ==================== PARTNER PREFERENCES ====================
    @Get(API_ROUTES.PROFILES.PARTNER_PREFERENCES)
    @ApiOperation({ summary: 'Get partner preferences' })
    @ApiResponse({ status: 200, description: 'Partner preferences retrieved successfully' })
    async getPartnerPreferences(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getPartnerPreferences(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.PARTNER_PREFERENCES)
    @ApiOperation({ summary: 'Update partner preferences' })
    @ApiResponse({ status: 200, description: 'Partner preferences updated successfully' })
    async updatePartnerPreferences(@Req() req: any, @Body() dto: PartnerPreferencesDto) {
        const userId = req.user.userId;
        const data = await this.profilesService.updatePartnerPreferences(userId, dto);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.PARTNER_PREFERENCES_UPDATED,
            data,
        };
    }

    // ==================== PROFILE COMPLETION ====================
    @Get(API_ROUTES.PROFILES.COMPLETION)
    @ApiOperation({ summary: 'Get profile completion status' })
    @ApiResponse({ status: 200, description: 'Profile completion status retrieved' })
    async getProfileCompletion(@Req() req: any) {
        const userId = req.user.userId;
        const completionPercentage = await this.profilesService.calculateProfileCompletion(userId);
        return {
            success: true,
            data: {
                completionPercentage,
            },
        };
    }

    @Get(API_ROUTES.PROFILES.ME)
    @ApiOperation({ summary: 'Get complete profile' })
    @ApiResponse({ status: 200, description: 'Complete profile retrieved successfully' })
    async getCompleteProfile(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getCompleteProfile(userId);
        return {
            success: true,
            data,
        };
    }

    @Patch(API_ROUTES.PROFILES.COMPLETE)
    @ApiOperation({ summary: 'Mark onboarding as complete' })
    @ApiResponse({ status: 200, description: 'Onboarding completed successfully' })
    async completeOnboarding(@Req() req: any) {
        const userId = req.user.userId;
        const result = await this.profilesService.completeOnboarding(userId);
        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE.ONBOARDING_COMPLETED,
            data: result,
        };
    }

    // ==================== RESUME JOURNEY ====================
    @Get(API_ROUTES.PROFILES.RESUME_JOURNEY)
    @ApiOperation({ summary: 'Get onboarding progress and resume journey' })
    @ApiResponse({ status: 200, description: 'Resume journey data retrieved successfully' })
    async getResumeJourney(@Req() req: any) {
        const userId = req.user.userId;
        const data = await this.profilesService.getResumeJourney(userId);
        return {
            success: true,
            data,
        };
    }
}
