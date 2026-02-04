import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PasswordReset } from '../entities/password-reset.entity';

@Injectable()
export class PasswordResetRepository extends BaseRepository<PasswordReset> {
  protected entityName = 'PasswordReset';

  constructor(
    @InjectRepository(PasswordReset)
    protected repository: Repository<PasswordReset>,
  ) {
    super();
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    const startTime = Date.now();
    const reset = await this.repository.findOne({
      where: {
        token,
        used_at: IsNull(),
      },
      relations: ['user'],
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM password_resets WHERE token = $1 AND used_at IS NULL`,
      [token],
      Date.now() - startTime,
    );

    return reset;
  }

  async markAsUsed(id: string): Promise<void> {
    const startTime = Date.now();
    await this.repository.update(id, { used_at: new Date() });

    this.logger.logDatabaseQuery(
      `UPDATE password_resets SET used_at = NOW() WHERE id = $1`,
      [id],
      Date.now() - startTime,
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    const startTime = Date.now();
    await this.repository.delete({
      expires_at: LessThan(new Date()),
      used_at: IsNull(),
    });

    this.logger.logDatabaseQuery(
      `DELETE FROM password_resets WHERE expires_at < NOW() AND used_at IS NULL`,
      [],
      Date.now() - startTime,
    );
  }
}
