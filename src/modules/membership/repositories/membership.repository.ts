import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserMembership, MembershipPlan, MembershipStatus } from '../entities/membership.entity';

@Injectable()
export class MembershipRepository extends Repository<UserMembership> {
    constructor(private dataSource: DataSource) {
        super(UserMembership, dataSource.createEntityManager());
    }

    async findByUserId(userId: string): Promise<UserMembership | null> {
        return this.findOne({ where: { user_id: userId } });
    }

    async createOrUpdate(userId: string, data: Partial<UserMembership>): Promise<UserMembership> {
        let membership = await this.findByUserId(userId);
        if (membership) {
            Object.assign(membership, data);
            return this.save(membership);
        }
        membership = this.create({ user_id: userId, ...data });
        return this.save(membership);
    }

    async incrementProfileViews(userId: string): Promise<void> {
        await this.createQueryBuilder()
            .update(UserMembership)
            .set({ profiles_viewed: () => 'profiles_viewed + 1' })
            .where('user_id = :userId', { userId })
            .execute();
    }

    async incrementInterestsSent(userId: string): Promise<void> {
        await this.createQueryBuilder()
            .update(UserMembership)
            .set({ interests_sent: () => 'interests_sent + 1' })
            .where('user_id = :userId', { userId })
            .execute();
    }

    async getExpiredMemberships(): Promise<UserMembership[]> {
        return this.createQueryBuilder('m')
            .where('m.status = :status', { status: MembershipStatus.ACTIVE })
            .andWhere('m.plan != :free', { free: MembershipPlan.FREE })
            .andWhere('m.expires_at < NOW()')
            .getMany();
    }
}
