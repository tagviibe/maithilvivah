import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { UserSession } from '../entities/user-session.entity';

@Injectable()
export class UserSessionRepository extends BaseRepository<UserSession> {
  protected entityName = 'UserSession';

  constructor(
    @InjectRepository(UserSession)
    protected repository: Repository<UserSession>,
  ) {
    super();
  }

  async findByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    const startTime = Date.now();
    const session = await this.repository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM user_sessions WHERE refresh_token = $1`,
      [refreshToken],
      Date.now() - startTime,
    );

    return session;
  }

  async findByUserId(userId: string): Promise<UserSession[]> {
    const startTime = Date.now();
    const sessions = await this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM user_sessions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
      Date.now() - startTime,
    );

    return sessions;
  }

  async deleteByUserId(userId: string): Promise<void> {
    const startTime = Date.now();
    await this.repository.delete({ user_id: userId } as any);

    this.logger.logDatabaseQuery(
      `DELETE FROM user_sessions WHERE user_id = $1`,
      [userId],
      Date.now() - startTime,
    );
  }

  async deleteExpiredSessions(): Promise<void> {
    const startTime = Date.now();
    await this.repository.delete({
      expires_at: LessThan(new Date()),
    });

    this.logger.logDatabaseQuery(
      `DELETE FROM user_sessions WHERE expires_at < NOW()`,
      [],
      Date.now() - startTime,
    );
  }
}
