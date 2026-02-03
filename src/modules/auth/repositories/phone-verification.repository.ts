import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PhoneVerification } from '../entities/phone-verification.entity';

@Injectable()
export class PhoneVerificationRepository extends BaseRepository<PhoneVerification> {
    protected entityName = 'PhoneVerification';

    constructor(
        @InjectRepository(PhoneVerification)
        protected repository: Repository<PhoneVerification>,
    ) {
        super();
    }

    async findByPhone(phone: string): Promise<PhoneVerification | null> {
        const startTime = Date.now();
        const verification = await this.repository.findOne({
            where: {
                phone,
                verified_at: IsNull(),
            },
            relations: ['user'],
            order: {
                created_at: 'DESC',
            },
        });

        this.logger.logDatabaseQuery(
            `SELECT * FROM phone_verifications WHERE phone = $1 AND verified_at IS NULL ORDER BY created_at DESC LIMIT 1`,
            [phone],
            Date.now() - startTime,
        );

        return verification;
    }

    async findByUserIdAndPhone(userId: string, phone: string): Promise<PhoneVerification | null> {
        const startTime = Date.now();
        const verification = await this.repository.findOne({
            where: {
                user_id: userId,
                phone,
                verified_at: IsNull(),
            },
            order: {
                created_at: 'DESC',
            },
        });

        this.logger.logDatabaseQuery(
            `SELECT * FROM phone_verifications WHERE user_id = $1 AND phone = $2 AND verified_at IS NULL ORDER BY created_at DESC LIMIT 1`,
            [userId, phone],
            Date.now() - startTime,
        );

        return verification;
    }

    async markAsVerified(id: string): Promise<void> {
        const startTime = Date.now();
        await this.repository.update(id, { verified_at: new Date() });

        this.logger.logDatabaseQuery(
            `UPDATE phone_verifications SET verified_at = NOW() WHERE id = $1`,
            [id],
            Date.now() - startTime,
        );
    }

    async deleteExpiredOTPs(): Promise<void> {
        const startTime = Date.now();
        await this.repository.delete({
            expires_at: LessThan(new Date()),
            verified_at: IsNull(),
        });

        this.logger.logDatabaseQuery(
            `DELETE FROM phone_verifications WHERE expires_at < NOW() AND verified_at IS NULL`,
            [],
            Date.now() - startTime,
        );
    }
}
