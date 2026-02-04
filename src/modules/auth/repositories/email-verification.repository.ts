import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { EmailVerification } from '../entities/email-verification.entity';

@Injectable()
export class EmailVerificationRepository extends BaseRepository<EmailVerification> {
  protected entityName = 'EmailVerification';

  constructor(
    @InjectRepository(EmailVerification)
    protected repository: Repository<EmailVerification>,
  ) {
    super();
  }

  async findByToken(token: string): Promise<EmailVerification | null> {
    const startTime = Date.now();
    const verification = await this.repository.findOne({
      where: {
        token,
        verified_at: IsNull(),
      },
      relations: ['user'],
    });

    this.logger.logDatabaseQuery(
      `SELECT * FROM email_verifications WHERE token = $1 AND verified_at IS NULL`,
      [token],
      Date.now() - startTime,
    );

    return verification;
  }

  async markAsVerified(id: string): Promise<void> {
    const startTime = Date.now();
    await this.repository.update(id, { verified_at: new Date() });

    this.logger.logDatabaseQuery(
      `UPDATE email_verifications SET verified_at = NOW() WHERE id = $1`,
      [id],
      Date.now() - startTime,
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    const startTime = Date.now();
    await this.repository.delete({
      expires_at: LessThan(new Date()),
      verified_at: IsNull(),
    });

    this.logger.logDatabaseQuery(
      `DELETE FROM email_verifications WHERE expires_at < NOW() AND verified_at IS NULL`,
      [],
      Date.now() - startTime,
    );
  }
}
