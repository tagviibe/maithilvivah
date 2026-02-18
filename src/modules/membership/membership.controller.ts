import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { MembershipService } from './membership.service';
import { MembershipPlan } from './entities/membership.entity';

@Controller('membership')
@UseGuards(JwtAuthGuard)
export class MembershipController {
    constructor(private readonly membershipService: MembershipService) { }

    @Get('status')
    async getStatus(@Req() req: any) {
        const userId = req.user.userId;
        const status = await this.membershipService.getMembershipStatus(userId);
        return { success: true, data: status };
    }

    @Get('plans')
    async getPlans() {
        const plans = await this.membershipService.getPlans();
        return { success: true, data: plans };
    }

    @Post('purchase')
    async purchase(
        @Req() req: any,
        @Body() body: { plan: string; durationMonths: number; paymentId?: string },
    ) {
        const userId = req.user.userId;

        if (!body.plan || !body.durationMonths) {
            throw new BadRequestException('Plan and duration are required');
        }

        if (![MembershipPlan.BASIC, MembershipPlan.PREMIUM].includes(body.plan as MembershipPlan)) {
            throw new BadRequestException('Invalid plan');
        }

        if (![1, 3].includes(body.durationMonths)) {
            throw new BadRequestException('Duration must be 1 or 3 months');
        }

        try {
            const membership = await this.membershipService.purchasePlan(
                userId,
                body.plan as MembershipPlan,
                body.durationMonths,
                body.paymentId,
            );
            return { success: true, data: membership };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    @Get('check/view-profile')
    async checkViewProfile(@Req() req: any) {
        const userId = req.user.userId;
        const result = await this.membershipService.checkCanViewProfile(userId);
        return { success: true, data: result };
    }

    @Get('check/send-interest')
    async checkSendInterest(@Req() req: any) {
        const userId = req.user.userId;
        const result = await this.membershipService.checkCanSendInterest(userId);
        return { success: true, data: result };
    }

    @Post('record/view')
    async recordView(@Req() req: any) {
        const userId = req.user.userId;
        await this.membershipService.recordProfileView(userId);
        return { success: true };
    }

    @Post('record/interest')
    async recordInterest(@Req() req: any) {
        const userId = req.user.userId;
        await this.membershipService.recordInterestSent(userId);
        return { success: true };
    }
}
