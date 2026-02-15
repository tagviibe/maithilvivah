import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Match } from './entities/match.entity';
import { Interest } from './entities/interest.entity';
import { Shortlist } from './entities/shortlist.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { PartnerPreferences } from '../profiles/entities/partner-preferences.entity';

// Repositories
import { MatchRepository } from './repositories/match.repository';
import { InterestRepository } from './repositories/interest.repository';
import { ShortlistRepository } from './repositories/shortlist.repository';

// Services
import { CompatibilityService } from './services/compatibility.service';
import { MatchingEngineService } from './services/matching-engine.service';

// Controller
import { MatchingController } from './matching.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Interest,
      Shortlist,
      Profile,
      PartnerPreferences,
    ]),
  ],
  controllers: [MatchingController],
  providers: [
    CompatibilityService,
    MatchingEngineService,
    MatchRepository,
    InterestRepository,
    ShortlistRepository,
  ],
  exports: [MatchingEngineService, CompatibilityService],
})
export class MatchingModule {}
