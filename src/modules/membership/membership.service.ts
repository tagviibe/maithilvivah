import { Injectable } from '@nestjs/common';
import { MembershipRepository } from './repositories/membership.repository';
import { UserMembership, MembershipPlan, MembershipStatus } from './entities/membership.entity';

// Plan limits configuration (will be admin-configurable later)
export const PLAN_LIMITS = {
    [MembershipPlan.FREE]: {
        maxProfileViews: 5,
        maxInterestsSent: 3,
        maxActiveInterests: 3,
        canSeeWhoViewed: false,
        canSeeContactDetails: false,
        canSeeLastActive: false,
        canSeeReadReceipts: false,
    },
    [MembershipPlan.BASIC]: {
        maxProfileViews: 50,
        maxInterestsSent: 10,
        maxActiveInterests: 20,
        canSeeWhoViewed: true,
        canSeeContactDetails: false,
        canSeeLastActive: true,
        canSeeReadReceipts: true,
    },
    [MembershipPlan.PREMIUM]: {
        maxProfileViews: Infinity,
        maxInterestsSent: Infinity,
        maxActiveInterests: Infinity,
        canSeeWhoViewed: true,
        canSeeContactDetails: true,
        canSeeLastActive: true,
        canSeeReadReceipts: true,
    },
};

// Pricing configuration
export const PLAN_PRICING = {
    [MembershipPlan.BASIC]: {
        '1': { price: 999, originalPrice: 1499, discount: 33 },
        '3': { price: 2499, originalPrice: 4497, discount: 44 },
    },
    [MembershipPlan.PREMIUM]: {
        '1': { price: 1999, originalPrice: 2999, discount: 33 },
        '3': { price: 4999, originalPrice: 8997, discount: 44 },
    },
};

@Injectable()
export class MembershipService {
    constructor(
        private readonly membershipRepository: MembershipRepository,
    ) { }

    async getMembership(userId: string): Promise<UserMembership> {
        let membership = await this.membershipRepository.findByUserId(userId);
        if (!membership) {
            // Create default free membership
            membership = await this.membershipRepository.createOrUpdate(userId, {
                plan: MembershipPlan.FREE,
                status: MembershipStatus.ACTIVE,
            });
        }

        // Check if expired
        if (
            membership.plan !== MembershipPlan.FREE &&
            membership.expires_at &&
            new Date(membership.expires_at) < new Date()
        ) {
            membership.status = MembershipStatus.EXPIRED;
            membership.plan = MembershipPlan.FREE;
            membership.profiles_viewed = 0;
            membership.interests_sent = 0;
            await this.membershipRepository.save(membership);
        }

        return membership;
    }

    async getMembershipStatus(userId: string): Promise<{
        plan: MembershipPlan;
        status: MembershipStatus;
        limits: typeof PLAN_LIMITS[MembershipPlan.FREE];
        usage: { profilesViewed: number; interestsSent: number };
        expiresAt: Date | null;
        durationMonths: number | null;
    }> {
        const membership = await this.getMembership(userId);
        const limits = PLAN_LIMITS[membership.plan];

        return {
            plan: membership.plan,
            status: membership.status,
            limits,
            usage: {
                profilesViewed: membership.profiles_viewed,
                interestsSent: membership.interests_sent,
            },
            expiresAt: membership.expires_at,
            durationMonths: membership.duration_months,
        };
    }

    async getPlans(): Promise<any> {
        return {
            plans: [
                {
                    id: MembershipPlan.FREE,
                    name: 'Free',
                    features: [
                        'View up to 5 profiles',
                        'Send up to 3 interests',
                        'Basic search filters',
                    ],
                    limitations: [
                        'Cannot see who viewed your profile',
                        'Cannot see contact details',
                        'Cannot see last active time',
                        'No read receipts',
                    ],
                    pricing: null,
                },
                {
                    id: MembershipPlan.BASIC,
                    name: 'Basic',
                    features: [
                        'View up to 50 profiles',
                        'Send up to 10 interests',
                        'Up to 20 active interests',
                        'See who viewed your profile',
                        'See last active time',
                        'Read receipts in chat',
                        'Advanced search filters',
                    ],
                    limitations: [
                        'Cannot see contact details',
                    ],
                    pricing: PLAN_PRICING[MembershipPlan.BASIC],
                },
                {
                    id: MembershipPlan.PREMIUM,
                    name: 'Premium',
                    features: [
                        'Unlimited profile views',
                        'Unlimited interests',
                        'Unlimited active interests',
                        'See who viewed your profile',
                        'See contact details directly',
                        'See last active time',
                        'Read receipts in chat',
                        'Priority in search results',
                        'Premium badge on profile',
                    ],
                    limitations: [],
                    pricing: PLAN_PRICING[MembershipPlan.PREMIUM],
                },
            ],
        };
    }

    async purchasePlan(
        userId: string,
        plan: MembershipPlan,
        durationMonths: number,
        paymentId?: string,
    ): Promise<UserMembership> {
        if (plan === MembershipPlan.FREE) {
            throw new Error('Cannot purchase free plan');
        }

        const pricing = PLAN_PRICING[plan]?.[String(durationMonths)];
        if (!pricing) {
            throw new Error('Invalid plan or duration');
        }

        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

        return this.membershipRepository.createOrUpdate(userId, {
            plan,
            status: MembershipStatus.ACTIVE,
            duration_months: durationMonths,
            amount_paid: pricing.price,
            original_price: pricing.originalPrice,
            discount_percent: pricing.discount,
            payment_id: paymentId || `SIM_${Date.now()}`,
            payment_method: paymentId ? 'razorpay' : 'simulated',
            starts_at: now,
            expires_at: expiresAt,
            profiles_viewed: 0,
            interests_sent: 0,
        });
    }

    async checkCanViewProfile(userId: string): Promise<{ allowed: boolean; reason?: string }> {
        const membership = await this.getMembership(userId);
        const limits = PLAN_LIMITS[membership.plan];

        if (limits.maxProfileViews === Infinity) return { allowed: true };
        if (membership.profiles_viewed >= limits.maxProfileViews) {
            return {
                allowed: false,
                reason: `You've reached your limit of ${limits.maxProfileViews} profile views. Upgrade your plan to view more profiles.`,
            };
        }
        return { allowed: true };
    }

    async checkCanSendInterest(userId: string): Promise<{ allowed: boolean; reason?: string }> {
        const membership = await this.getMembership(userId);
        const limits = PLAN_LIMITS[membership.plan];

        if (limits.maxInterestsSent === Infinity) return { allowed: true };
        if (membership.interests_sent >= limits.maxInterestsSent) {
            return {
                allowed: false,
                reason: `You've reached your limit of ${limits.maxInterestsSent} interests. Upgrade your plan to send more.`,
            };
        }
        return { allowed: true };
    }

    async recordProfileView(userId: string): Promise<void> {
        await this.membershipRepository.incrementProfileViews(userId);
    }

    async recordInterestSent(userId: string): Promise<void> {
        await this.membershipRepository.incrementInterestsSent(userId);
    }
}
