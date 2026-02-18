import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { ProfileView } from '../entities/profile-view.entity';

@Injectable()
export class ProfileViewRepository extends BaseRepository<ProfileView> {
  protected entityName = 'ProfileView';

  constructor(
    @InjectRepository(ProfileView)
    protected repository: Repository<ProfileView>,
  ) {
    super();
  }

  /**
   * Record a profile view. Only records one view per viewer→viewed pair per day.
   */
  async recordView(viewerId: string, viewedId: string): Promise<ProfileView | null> {
    // Check if already viewed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.repository
      .createQueryBuilder('pv')
      .where('pv.viewer_id = :viewerId', { viewerId })
      .andWhere('pv.viewed_id = :viewedId', { viewedId })
      .andWhere('pv.created_at >= :today', { today })
      .getOne();

    if (existing) return null; // Already viewed today

    const view = this.repository.create({
      viewer_id: viewerId,
      viewed_id: viewedId,
    });
    return this.repository.save(view);
  }

  /**
   * Get users who viewed my profile (who viewed me), ordered by most recent
   */
  async getViewersOfProfile(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{ viewerId: string; lastViewedAt: Date }[]> {
    const results = await this.repository
      .createQueryBuilder('pv')
      .select('pv.viewer_id', 'viewerId')
      .addSelect('MAX(pv.created_at)', 'lastViewedAt')
      .where('pv.viewed_id = :userId', { userId })
      .andWhere('pv.viewer_id != :userId', { userId })
      .groupBy('pv.viewer_id')
      .orderBy('"lastViewedAt"', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany();

    return results;
  }

  /**
   * Count unique viewers of a profile
   */
  async countUniqueViewers(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.viewer_id)', 'count')
      .where('pv.viewed_id = :userId', { userId })
      .andWhere('pv.viewer_id != :userId', { userId })
      .getRawOne();

    return parseInt(result?.count || '0', 10);
  }

  /**
   * Get profiles I have viewed, ordered by most recent
   */
  async getViewedByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{ viewedId: string; lastViewedAt: Date }[]> {
    const results = await this.repository
      .createQueryBuilder('pv')
      .select('pv.viewed_id', 'viewedId')
      .addSelect('MAX(pv.created_at)', 'lastViewedAt')
      .where('pv.viewer_id = :userId', { userId })
      .andWhere('pv.viewed_id != :userId', { userId })
      .groupBy('pv.viewed_id')
      .orderBy('"lastViewedAt"', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany();

    return results;
  }

  /**
   * Count unique profiles viewed by a user
   */
  async countViewedByUser(userId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.viewed_id)', 'count')
      .where('pv.viewer_id = :userId', { userId })
      .andWhere('pv.viewed_id != :userId', { userId })
      .getRawOne();

    return parseInt(result?.count || '0', 10);
  }

  /**
   * Get total view count for a profile (all views, not unique)
   */
  async getTotalViewCount(userId: string): Promise<number> {
    return this.repository.count({
      where: { viewed_id: userId },
    });
  }
}
