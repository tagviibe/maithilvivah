import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shortlist } from '../entities/shortlist.entity';

@Injectable()
export class ShortlistRepository {
  constructor(
    @InjectRepository(Shortlist)
    private repository: Repository<Shortlist>,
  ) {}

  async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<Shortlist[]> {
    return this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findOne(userId: string, shortlistedUserId: string): Promise<Shortlist | null> {
    return this.repository.findOne({
      where: { user_id: userId, shortlisted_user_id: shortlistedUserId },
    });
  }

  async add(userId: string, shortlistedUserId: string): Promise<Shortlist> {
    const existing = await this.findOne(userId, shortlistedUserId);
    if (existing) return existing;

    const shortlist = this.repository.create({
      user_id: userId,
      shortlisted_user_id: shortlistedUserId,
    } as Partial<Shortlist>);
    return this.repository.save(shortlist);
  }

  async remove(userId: string, shortlistedUserId: string): Promise<void> {
    await this.repository.delete({
      user_id: userId,
      shortlisted_user_id: shortlistedUserId,
    });
  }

  async isShortlisted(userId: string, shortlistedUserId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { user_id: userId, shortlisted_user_id: shortlistedUserId },
    });
    return count > 0;
  }

  async getShortlistedUserIds(userId: string): Promise<string[]> {
    const items = await this.repository.find({
      where: { user_id: userId },
      select: ['shortlisted_user_id'],
    });
    return items.map(i => i.shortlisted_user_id);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { user_id: userId } });
  }
}
