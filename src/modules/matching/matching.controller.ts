import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { API_ROUTES } from '@/common/constants/api-routes.constant';
import * as requestType from '@/common/types/request.type';
import { MatchingEngineService } from './services/matching-engine.service';
import { MatchRepository } from './repositories/match.repository';
import { InterestRepository } from './repositories/interest.repository';
import { ShortlistRepository } from './repositories/shortlist.repository';
import { MatchStatus } from './entities/match.entity';
import { InterestStatus } from './entities/interest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';

@ApiTags('Matching')
@Controller(API_ROUTES.MATCHING.BASE)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchingController {
  constructor(
    private readonly matchingEngine: MatchingEngineService,
    private readonly matchRepository: MatchRepository,
    private readonly interestRepository: InterestRepository,
    private readonly shortlistRepository: ShortlistRepository,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  private readonly profileSelect = [
    'user_id', 'first_name', 'last_name', 'date_of_birth', 'gender',
    'height_cm', 'religion', 'caste', 'mother_tongue', 'highest_education',
    'occupation', 'annual_income', 'country', 'state', 'city', 'about_me',
    'diet', 'manglik',
  ] as (keyof Profile)[];

  private async enrichWithProfiles(userIds: string[]): Promise<Map<string, Partial<Profile>>> {
    if (!userIds.length) return new Map();
    const profiles = await this.profileRepository.find({
      where: { user_id: In(userIds) },
      select: this.profileSelect,
    });
    const map = new Map<string, Partial<Profile>>();
    profiles.forEach(p => map.set(p.user_id, p));
    return map;
  }

  // ==================== RECOMMENDATIONS ====================
  @Get(API_ROUTES.MATCHING.RECOMMENDATIONS)
  @ApiOperation({ summary: 'Get recommended matches for the user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecommendations(
    @Req() req: requestType.AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;
    const p = parseInt(page || '1', 10);
    const l = Math.min(parseInt(limit || '10', 10), 50);

    const data = await this.matchingEngine.getRecommendations(userId, p, l);

    // Enrich with shortlist and interest status
    const shortlistedIds = await this.shortlistRepository.getShortlistedUserIds(userId);
    const enriched = await Promise.all(
      data.matches.map(async (match) => {
        const interest = await this.interestRepository.findBySenderAndReceiver(userId, match.userId);
        const receivedInterest = await this.interestRepository.findBySenderAndReceiver(match.userId, userId);
        return {
          ...match,
          isShortlisted: shortlistedIds.includes(match.userId),
          interestStatus: interest?.status || null,
          receivedInterest: receivedInterest?.status || null,
        };
      }),
    );

    return {
      success: true,
      data: {
        ...data,
        matches: enriched,
      },
    };
  }

  // ==================== INTERESTS ====================
  @Post('interests/send')
  @ApiOperation({ summary: 'Send interest to a profile' })
  async sendInterest(
    @Req() req: requestType.AuthenticatedRequest,
    @Body() body: { receiverId: string; message?: string },
  ) {
    const userId = req.user.userId;
    if (!body.receiverId) {
      throw new BadRequestException('receiverId is required');
    }
    if (body.receiverId === userId) {
      throw new BadRequestException('Cannot send interest to yourself');
    }

    // Check if already sent
    const existing = await this.interestRepository.findBySenderAndReceiver(userId, body.receiverId);
    if (existing) {
      throw new ConflictException('Interest already sent to this user');
    }

    // Check daily limit (free tier: 10/day)
    const todayCount = await this.interestRepository.countSentToday(userId);
    if (todayCount >= 10) {
      throw new BadRequestException('Daily interest limit reached. Upgrade to premium for unlimited interests.');
    }

    const interest = await this.interestRepository.createInterest(userId, body.receiverId, body.message);

    // Check if the other person already sent interest → auto mutual
    const reverse = await this.interestRepository.findBySenderAndReceiver(body.receiverId, userId);
    if (reverse && reverse.status === InterestStatus.PENDING) {
      await this.interestRepository.updateStatus(reverse.id, InterestStatus.ACCEPTED);
      await this.interestRepository.updateStatus(interest.id, InterestStatus.ACCEPTED);
      return {
        success: true,
        message: 'Mutual interest! You both are interested in each other.',
        data: { ...interest, status: InterestStatus.ACCEPTED, isMutual: true },
      };
    }

    return {
      success: true,
      message: 'Interest sent successfully',
      data: interest,
    };
  }

  @Patch('interests/:interestId/accept')
  @ApiOperation({ summary: 'Accept a received interest' })
  async acceptInterest(
    @Req() req: requestType.AuthenticatedRequest,
    @Param('interestId') interestId: string,
  ) {
    const userId = req.user.userId;
    // Verify this interest was sent TO the current user
    const interests = await this.interestRepository.findReceivedByStatus(userId, InterestStatus.PENDING, 100, 0);
    const interest = interests.find(i => i.id === interestId);
    if (!interest) {
      throw new NotFoundException('Interest not found or already responded');
    }

    await this.interestRepository.updateStatus(interestId, InterestStatus.ACCEPTED);

    return {
      success: true,
      message: 'Interest accepted',
    };
  }

  @Patch('interests/:interestId/decline')
  @ApiOperation({ summary: 'Decline a received interest' })
  async declineInterest(
    @Req() req: requestType.AuthenticatedRequest,
    @Param('interestId') interestId: string,
  ) {
    const userId = req.user.userId;
    const interests = await this.interestRepository.findReceivedByStatus(userId, InterestStatus.PENDING, 100, 0);
    const interest = interests.find(i => i.id === interestId);
    if (!interest) {
      throw new NotFoundException('Interest not found or already responded');
    }

    await this.interestRepository.updateStatus(interestId, InterestStatus.DECLINED);

    return {
      success: true,
      message: 'Interest declined',
    };
  }

  @Delete('interests/:interestId/cancel')
  @ApiOperation({ summary: 'Cancel/revert a sent interest (only if still pending)' })
  async cancelInterest(
    @Req() req: requestType.AuthenticatedRequest,
    @Param('interestId') interestId: string,
  ) {
    const userId = req.user.userId;
    const interest = await this.interestRepository.findById(interestId);
    if (!interest) {
      throw new NotFoundException('Interest not found');
    }
    if (interest.sender_id !== userId) {
      throw new BadRequestException('You can only cancel your own interests');
    }
    if (interest.status !== InterestStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending interests');
    }
    await this.interestRepository.deleteInterest(interestId);
    return {
      success: true,
      message: 'Interest cancelled successfully',
    };
  }

  @Get('interests/sent')
  @ApiOperation({ summary: 'Get sent interests with profile data' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getSentInterests(
    @Req() req: requestType.AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;
    const p = parseInt(page || '1', 10);
    const l = Math.min(parseInt(limit || '20', 10), 50);
    const offset = (p - 1) * l;

    const interests = await this.interestRepository.findSentByUserId(userId, l, offset);
    const total = await this.interestRepository.countSentByUserId(userId);
    const receiverIds = interests.map(i => i.receiver_id);
    const profileMap = await this.enrichWithProfiles(receiverIds);

    const items = interests.map(i => ({
      ...i,
      profile: profileMap.get(i.receiver_id) || null,
    }));

    return {
      success: true,
      data: { items, total, page: p, totalPages: Math.ceil(total / l) },
    };
  }

  @Get('interests/received')
  @ApiOperation({ summary: 'Get received interests with profile data' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getReceivedInterests(
    @Req() req: requestType.AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;
    const p = parseInt(page || '1', 10);
    const l = Math.min(parseInt(limit || '20', 10), 50);
    const offset = (p - 1) * l;

    const interests = await this.interestRepository.findReceivedByUserId(userId, l, offset);
    const total = await this.interestRepository.countReceivedByUserId(userId);
    const senderIds = interests.map(i => i.sender_id);
    const profileMap = await this.enrichWithProfiles(senderIds);

    const items = interests.map(i => ({
      ...i,
      profile: profileMap.get(i.sender_id) || null,
    }));

    return {
      success: true,
      data: { items, total, page: p, totalPages: Math.ceil(total / l) },
    };
  }

  // ==================== SHORTLIST ====================
  @Post('shortlist/:targetUserId')
  @ApiOperation({ summary: 'Add a profile to shortlist' })
  async addToShortlist(
    @Req() req: requestType.AuthenticatedRequest,
    @Param('targetUserId') targetUserId: string,
  ) {
    const userId = req.user.userId;
    if (targetUserId === userId) {
      throw new BadRequestException('Cannot shortlist yourself');
    }

    const shortlist = await this.shortlistRepository.add(userId, targetUserId);
    return {
      success: true,
      message: 'Profile added to shortlist',
      data: shortlist,
    };
  }

  @Delete('shortlist/:targetUserId')
  @ApiOperation({ summary: 'Remove a profile from shortlist' })
  async removeFromShortlist(
    @Req() req: requestType.AuthenticatedRequest,
    @Param('targetUserId') targetUserId: string,
  ) {
    const userId = req.user.userId;
    await this.shortlistRepository.remove(userId, targetUserId);
    return {
      success: true,
      message: 'Profile removed from shortlist',
    };
  }

  @Get('shortlist')
  @ApiOperation({ summary: 'Get shortlisted profiles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getShortlist(
    @Req() req: requestType.AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;
    const p = parseInt(page || '1', 10);
    const l = Math.min(parseInt(limit || '20', 10), 50);
    const offset = (p - 1) * l;

    const shortlist = await this.shortlistRepository.findByUserId(userId, l, offset);
    const total = await this.shortlistRepository.countByUserId(userId);
    const targetIds = shortlist.map(s => s.shortlisted_user_id);
    const profileMap = await this.enrichWithProfiles(targetIds);

    const items = shortlist.map(s => ({
      ...s,
      profile: profileMap.get(s.shortlisted_user_id) || null,
    }));

    return {
      success: true,
      data: {
        items,
        total,
        page: p,
        totalPages: Math.ceil(total / l),
      },
    };
  }

  // ==================== CONNECTED USERS ====================
  @Get('connected')
  @ApiOperation({ summary: 'Get users connected via accepted interests' })
  async getConnectedUsers(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const connectedIds = await this.interestRepository.getConnectedUserIds(userId);
    const profileMap = await this.enrichWithProfiles(connectedIds);

    const users = connectedIds.map(id => ({
      userId: id,
      profile: profileMap.get(id) || null,
    }));

    return { success: true, data: users };
  }

  // ==================== ADMIN: RUN MATCHING ====================
  @Post('run')
  @ApiOperation({ summary: 'Trigger Gale-Shapley matching (admin)' })
  async runMatching(@Req() req: requestType.AuthenticatedRequest) {
    const result = await this.matchingEngine.runGaleShapleyMatching();
    return {
      success: true,
      message: `Matching complete: ${result.totalPairs} stable pairs found`,
      data: result,
    };
  }

  // ==================== REFRESH USER MATCHES ====================
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh matches for current user' })
  async refreshMatches(@Req() req: requestType.AuthenticatedRequest) {
    const userId = req.user.userId;
    const count = await this.matchingEngine.generateMatchesForUser(userId);
    return {
      success: true,
      message: `Generated ${count} matches`,
      data: { matchCount: count },
    };
  }
}
