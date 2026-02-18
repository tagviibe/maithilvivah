import { Controller, Get, Post, Patch, Body, UseGuards, Req, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { StorageService } from '@/common/services/storage.service';
import { BasicInfoDto } from '@/modules/profiles/dto/basic-info.dto';
import { CommunityInfoDto } from '@/modules/profiles/dto/community-info.dto';
import { LocationInfoDto } from '@/modules/profiles/dto/location-info.dto';
import { EducationInfoDto } from '@/modules/profiles/dto/education-info.dto';
import { FamilyInfoDto } from '@/modules/profiles/dto/family-info.dto';
import { LifestyleInfoDto } from '@/modules/profiles/dto/lifestyle-info.dto';
import { PartnerPreferencesDto } from '@/modules/profiles/dto/partner-preferences.dto';
import { API_ROUTES } from '@/common/constants/api-routes.constant';
import { SUCCESS_MESSAGES } from '@/common/constants/messages.constant';
import * as requestType from '@/common/types/request.type';

@ApiTags('Profiles')
@Controller(API_ROUTES.PROFILES.BASE)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly storageService: StorageService,
  ) { }

  // ==================== PROFILE FOR ====================
  @Patch(API_ROUTES.PROFILES.PROFILE_FOR)
  @ApiOperation({ summary: 'Update profile-for selection' })
  @ApiResponse({ status: 200, description: 'Profile-for updated successfully' })
  async updateProfileFor(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() body: { profileFor: string; onboardingStep?: number },
  ) {
    const userId = req.user.userId;
    const data = await this.profilesService.updateProfileFor(userId, body.profileFor, body.onboardingStep);
    return {
      success: true,
      message: 'Profile-for updated successfully',
      data,
    };
  }

  // ==================== BASIC INFO ====================
  @Get(API_ROUTES.PROFILES.BASIC_INFO)
  @ApiOperation({ summary: 'Get basic information' })
  @ApiResponse({
    status: 200,
    description: 'Basic info retrieved successfully',
  })
  async getBasicInfo(@Req() req: requestType.AuthenticatedRequest) {
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
  async updateBasicInfo(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: BasicInfoDto,
  ) {
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
  @ApiResponse({
    status: 200,
    description: 'Community info retrieved successfully',
  })
  async getCommunityInfo(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getCommunityInfo(userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(API_ROUTES.PROFILES.COMMUNITY_INFO)
  @ApiOperation({ summary: 'Update community information' })
  @ApiResponse({
    status: 200,
    description: 'Community info updated successfully',
  })
  async updateCommunityInfo(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: CommunityInfoDto,
  ) {
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
  @ApiResponse({
    status: 200,
    description: 'Location info retrieved successfully',
  })
  async getLocationInfo(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getLocationInfo(userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(API_ROUTES.PROFILES.LOCATION_INFO)
  @ApiOperation({ summary: 'Update location information' })
  @ApiResponse({
    status: 200,
    description: 'Location info updated successfully',
  })
  async updateLocationInfo(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: LocationInfoDto,
  ) {
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
  @ApiResponse({
    status: 200,
    description: 'Education info retrieved successfully',
  })
  async getEducationInfo(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getEducationInfo(userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(API_ROUTES.PROFILES.EDUCATION_INFO)
  @ApiOperation({ summary: 'Update education and career information' })
  @ApiResponse({
    status: 200,
    description: 'Education info updated successfully',
  })
  async updateEducationInfo(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: EducationInfoDto,
  ) {
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
  @ApiResponse({
    status: 200,
    description: 'Family info retrieved successfully',
  })
  async getFamilyInfo(@Req() req: requestType.AuthenticatedRequest) {
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
  async updateFamilyInfo(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: FamilyInfoDto,
  ) {
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
  @ApiResponse({
    status: 200,
    description: 'Lifestyle info retrieved successfully',
  })
  async getLifestyleInfo(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getLifestyleInfo(userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(API_ROUTES.PROFILES.LIFESTYLE_INFO)
  @ApiOperation({ summary: 'Update lifestyle information' })
  @ApiResponse({
    status: 200,
    description: 'Lifestyle info updated successfully',
  })
  async updateLifestyleInfo(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: LifestyleInfoDto,
  ) {
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
  @ApiResponse({
    status: 200,
    description: 'Partner preferences retrieved successfully',
  })
  async getPartnerPreferences(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getPartnerPreferences(userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(API_ROUTES.PROFILES.PARTNER_PREFERENCES)
  @ApiOperation({ summary: 'Update partner preferences' })
  @ApiResponse({
    status: 200,
    description: 'Partner preferences updated successfully',
  })
  async updatePartnerPreferences(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() dto: PartnerPreferencesDto,
  ) {
    const userId = req.user.userId;
    const data = await this.profilesService.updatePartnerPreferences(
      userId,
      dto,
    );
    return {
      success: true,
      message: SUCCESS_MESSAGES.PROFILE.PARTNER_PREFERENCES_UPDATED,
      data,
    };
  }

  // ==================== PROFILE COMPLETION ====================
  @Get(API_ROUTES.PROFILES.COMPLETION)
  @ApiOperation({ summary: 'Get profile completion status' })
  @ApiResponse({
    status: 200,
    description: 'Profile completion status retrieved',
  })
  async getProfileCompletion(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const completionPercentage =
      await this.profilesService.calculateProfileCompletion(userId);
    return {
      success: true,
      data: {
        completionPercentage,
      },
    };
  }

  @Get(API_ROUTES.PROFILES.ME)
  @ApiOperation({ summary: 'Get complete profile' })
  @ApiResponse({
    status: 200,
    description: 'Complete profile retrieved successfully',
  })
  async getCompleteProfile(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getCompleteProfile(userId);
    return {
      success: true,
      data,
    };
  }

  @Patch(API_ROUTES.PROFILES.COMPLETE)
  @ApiOperation({ summary: 'Mark onboarding as complete' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed successfully',
  })
  async completeOnboarding(@Req() req: requestType.AuthenticatedRequest) {
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
  @ApiResponse({
    status: 200,
    description: 'Resume journey data retrieved successfully',
  })
  async getResumeJourney(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getResumeJourney(userId);
    return {
      success: true,
      data,
    };
  }

  // ==================== HOROSCOPE DOCUMENT ====================
  @Post('documents/horoscope')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload horoscope PDF to Cloudflare R2' })
  @ApiResponse({
    status: 200,
    description: 'Horoscope uploaded successfully',
  })
  async uploadHoroscope(
    @Req() req: requestType.AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.userId;

    // Validate file
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded',
      };
    }

    if (file.mimetype !== 'application/pdf') {
      return {
        success: false,
        message: 'Only PDF files are allowed',
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size should be less than 5MB',
      };
    }

    // Get profile to use profileId for folder structure
    const profile = await this.profilesService.getHoroscope(userId);
    const profileId = profile.horoscope_url ? profile.horoscope_url.split('/')[0] : userId;

    // Upload to Cloudflare R2 with folder structure: profileId/docs/
    const fileUrl = await this.storageService.uploadFile(
      file.buffer,
      profileId,
      'docs',
      file.originalname,
    );

    await this.profilesService.updateHoroscope(userId, fileUrl);

    return {
      success: true,
      message: 'Horoscope uploaded successfully to R2',
      data: {
        url: fileUrl,
        filename: file.originalname,
        size: file.size,
      },
    };
  }

  @Get('documents/horoscope')
  @ApiOperation({ summary: 'Get horoscope PDF URL' })
  @ApiResponse({
    status: 200,
    description: 'Horoscope URL retrieved successfully',
  })
  async getHoroscope(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const data = await this.profilesService.getHoroscope(userId);

    if (!data.horoscope_url) {
      return {
        success: false,
        message: 'No horoscope uploaded',
        data: null,
      };
    }

    return {
      success: true,
      data: {
        url: data.horoscope_url,
      },
    };
  }

  @Delete('documents/horoscope')
  @ApiOperation({ summary: 'Delete horoscope PDF from R2' })
  @ApiResponse({
    status: 200,
    description: 'Horoscope deleted successfully',
  })
  async deleteHoroscope(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;

    // Get current horoscope URL
    const profile = await this.profilesService.getHoroscope(userId);

    if (profile.horoscope_url) {
      // Delete from Cloudflare R2
      await this.storageService.deleteFile(profile.horoscope_url);
    }

    await this.profilesService.updateHoroscope(userId, null);

    return {
      success: true,
      message: 'Horoscope deleted successfully from R2',
    };
  }

  // ==================== PROFILE PHOTOS ====================
  @Post('photos/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile photo to Cloudflare R2' })
  @ApiResponse({
    status: 200,
    description: 'Photo uploaded successfully',
  })
  async uploadPhoto(
    @Req() req: requestType.AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user.userId;

    // Validate file
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded',
      };
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        success: false,
        message: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size should be less than 10MB',
      };
    }

    // Get profile to use profileId for folder structure
    const profile = await this.profilesService.getCompleteProfile(userId);
    const profileId = profile.profile?.id || userId;

    // Upload to Cloudflare R2 with folder structure: profileId/images/
    const photoUrl = await this.storageService.uploadFile(
      file.buffer,
      profileId,
      'images',
      file.originalname,
    );

    return {
      success: true,
      message: 'Photo uploaded successfully to R2',
      data: {
        url: photoUrl,
        filename: file.originalname,
        size: file.size,
      },
    };
  }

  @Delete('photos/:photoUrl')
  @ApiOperation({ summary: 'Delete profile photo from R2' })
  @ApiResponse({
    status: 200,
    description: 'Photo deleted successfully',
  })
  async deletePhoto(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() body: { photoUrl: string },
  ) {
    const userId = req.user.userId;

    if (!body.photoUrl) {
      return {
        success: false,
        message: 'Photo URL is required',
      };
    }

    // Delete from Cloudflare R2
    await this.storageService.deleteFile(body.photoUrl);

    return {
      success: true,
      message: 'Photo deleted successfully from R2',
    };
  }
}
