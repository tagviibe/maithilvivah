import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: {
            getBasicInfo: jest.fn(),
            updateBasicInfo: jest.fn(),
            getCommunityInfo: jest.fn(),
            updateCommunityInfo: jest.fn(),
            getLocationInfo: jest.fn(),
            updateLocationInfo: jest.fn(),
            getEducationInfo: jest.fn(),
            updateEducationInfo: jest.fn(),
            getFamilyInfo: jest.fn(),
            updateFamilyInfo: jest.fn(),
            getLifestyleInfo: jest.fn(),
            updateLifestyleInfo: jest.fn(),
            getPartnerPreferences: jest.fn(),
            updatePartnerPreferences: jest.fn(),
            calculateProfileCompletion: jest.fn(),
            getCompleteProfile: jest.fn(),
            completeOnboarding: jest.fn(),
            getResumeJourney: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
