import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Match, MatchStatus } from '../entities/match.entity';

@Injectable()
export class MatchRepository {
  constructor(
    @InjectRepository(Match)
    private repository: Repository<Match>,
  ) { }

  async findByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<Match[]> {
    return this.repository.find({
      where: { user_id: userId },
      order: { compatibility_score: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findByUserIdAndStatus(userId: string, status: MatchStatus, limit: number = 20, offset: number = 0): Promise<Match[]> {
    return this.repository.find({
      where: { user_id: userId, status },
      order: { compatibility_score: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findMatch(userId: string, matchedUserId: string): Promise<Match | null> {
    return this.repository.findOne({
      where: { user_id: userId, matched_user_id: matchedUserId },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { user_id: userId } });
  }

  async upsertMatch(data: Partial<Match>): Promise<Match> {
    if (!data.user_id || !data.matched_user_id) {
      throw new Error('user_id and matched_user_id are required');
    }
    const existing = await this.findMatch(data.user_id, data.matched_user_id);
    if (existing) {
      await this.repository.update(existing.id, {
        compatibility_score: data.compatibility_score,
        score_breakdown: data.score_breakdown,
        rank: data.rank,
      });
      const updated = await this.repository.findOne({ where: { id: existing.id } });
      if (!updated) throw new Error('Match not found after update');
      return updated;
    }
    const match = this.repository.create(data);
    return this.repository.save(match);
  }

  async bulkUpsert(matches: Partial<Match>[]): Promise<void> {
    for (const match of matches) {
      await this.upsertMatch(match);
    }
  }

  async updateStatus(matchId: string, status: MatchStatus): Promise<void> {
    const updateData: any = { status };
    if (status === MatchStatus.VIEWED) {
      updateData.viewed_at = new Date();
    }
    await this.repository.update(matchId, updateData);
  }

  async getMatchedUserIds(userId: string): Promise<string[]> {
    const matches = await this.repository.find({
      where: { user_id: userId },
      select: ['matched_user_id'],
    });
    return matches.map(m => m.matched_user_id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ user_id: userId });
  }
}
