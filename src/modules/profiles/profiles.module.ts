import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

// Entities
import { Profile } from './entities/profile.entity';
import { PartnerPreferences } from './entities/partner-preferences.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { OnboardingProgressLog } from './entities/onboarding-progress-log.entity';

// Repositories
import { ProfileRepository } from './repositories/profile.repository';
import { PartnerPreferencesRepository } from './repositories/partner-preferences.repository';
import { ProfilePhotoRepository } from './repositories/profile-photo.repository';
import { OnboardingProgressLogRepository } from './repositories/onboarding-progress-log.repository';

// Import UserRepository from auth module
import { UserRepository } from '../auth/repositories/user.repository';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      PartnerPreferences,
      ProfilePhoto,
      OnboardingProgressLog,
      User, // Needed for UserRepository
    ]),
  ],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    ProfileRepository,
    PartnerPreferencesRepository,
    ProfilePhotoRepository,
    OnboardingProgressLogRepository,
    UserRepository,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
