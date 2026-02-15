import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest, InterestStatus } from '../entities/interest.entity';

@Injectable()
export class InterestRepository {
  constructor(
    @InjectRepository(Interest)
    private repository: Repository<Interest>,
  ) { }

  async findBySenderAndReceiver(senderId: string, receiverId: string): Promise<Interest | null> {
    return this.repository.findOne({
      where: { sender_id: senderId, receiver_id: receiverId },
    });
  }

  async findSentByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<Interest[]> {
    return this.repository.find({
      where: { sender_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findReceivedByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<Interest[]> {
    return this.repository.find({
      where: { receiver_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findReceivedByStatus(userId: string, status: InterestStatus, limit: number = 20, offset: number = 0): Promise<Interest[]> {
    return this.repository.find({
      where: { receiver_id: userId, status },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async countSentToday(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.repository
      .createQueryBuilder('interest')
      .where('interest.sender_id = :userId', { userId })
      .andWhere('interest.created_at >= :today', { today })
      .getCount();
  }

  async countReceivedPending(userId: string): Promise<number> {
    return this.repository.count({
      where: { receiver_id: userId, status: InterestStatus.PENDING },
    });
  }

  async createInterest(senderId: string, receiverId: string, message?: string): Promise<Interest> {
    const interest = this.repository.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message || undefined,
      status: InterestStatus.PENDING,
    } as Partial<Interest>);
    return this.repository.save(interest);
  }

  async updateStatus(interestId: string, status: InterestStatus): Promise<void> {
    await this.repository.update(interestId, {
      status,
      responded_at: new Date(),
    });
  }

  async getMutualInterestUserIds(userId: string): Promise<string[]> {
    // Find users where both sides have accepted
    const accepted = await this.repository
      .createQueryBuilder('i')
      .select('CASE WHEN i.sender_id = :userId THEN i.receiver_id ELSE i.sender_id END', 'other_user_id')
      .where('(i.sender_id = :userId OR i.receiver_id = :userId)', { userId })
      .andWhere('i.status = :status', { status: InterestStatus.ACCEPTED })
      .getRawMany();

    const otherUserIds = accepted.map(r => r.other_user_id);

    // Filter to only mutual (both directions accepted)
    const mutual: string[] = [];
    for (const otherId of otherUserIds) {
      const reverse = await this.findBySenderAndReceiver(otherId, userId);
      if (reverse && reverse.status === InterestStatus.ACCEPTED) {
        mutual.push(otherId);
      }
    }
    return mutual;
  }

  async getConnectedUserIds(userId: string): Promise<string[]> {
    // Connected = any accepted interest involving this user (either direction)
    const results = await this.repository
      .createQueryBuilder('i')
      .select('CASE WHEN i.sender_id = :userId THEN i.receiver_id ELSE i.sender_id END', 'other_user_id')
      .where('(i.sender_id = :userId OR i.receiver_id = :userId)', { userId })
      .andWhere('i.status = :status', { status: InterestStatus.ACCEPTED })
      .getRawMany();

    // Deduplicate
    return [...new Set(results.map(r => r.other_user_id))];
  }

  async findById(id: string): Promise<Interest | null> {
    return this.repository.findOne({ where: { id } });
  }

  async deleteInterest(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async countSentByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { sender_id: userId } });
  }

  async countReceivedByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { receiver_id: userId } });
  }

  async getInteractedUserIds(userId: string): Promise<string[]> {
    const sent = await this.repository.find({
      where: { sender_id: userId },
      select: ['receiver_id'],
    });
    const received = await this.repository.find({
      where: { receiver_id: userId },
      select: ['sender_id'],
    });
    const ids = new Set<string>();
    sent.forEach(i => ids.add(i.receiver_id));
    received.forEach(i => ids.add(i.sender_id));
    return Array.from(ids);
  }
}
