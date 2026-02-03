import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
    protected entityName = 'User';

    constructor(
        @InjectRepository(User)
        protected repository: Repository<User>,
    ) {
        super();
    }

    async findByEmail(email: string): Promise<User | null> {
        const startTime = Date.now();
        const user = await this.repository.findOne({ where: { email } });

        this.logger.logDatabaseQuery(
            `SELECT * FROM users WHERE email = $1`,
            [email],
            Date.now() - startTime,
        );

        return user;
    }

    async findByPhone(phone: string): Promise<User | null> {
        const startTime = Date.now();
        const user = await this.repository.findOne({ where: { phone } });

        this.logger.logDatabaseQuery(
            `SELECT * FROM users WHERE phone = $1`,
            [phone],
            Date.now() - startTime,
        );

        return user;
    }

    async incrementFailedLoginAttempts(userId: string): Promise<void> {
        const startTime = Date.now();
        await this.repository.increment({ id: userId } as any, 'failed_login_attempts', 1);

        this.logger.logDatabaseQuery(
            `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1`,
            [userId],
            Date.now() - startTime,
        );
    }

    async resetFailedLoginAttempts(userId: string): Promise<void> {
        const startTime = Date.now();
        await this.repository.update(userId, { failed_login_attempts: 0 });

        this.logger.logDatabaseQuery(
            `UPDATE users SET failed_login_attempts = 0 WHERE id = $1`,
            [userId],
            Date.now() - startTime,
        );
    }

    async lockAccount(userId: string, lockUntil: Date): Promise<void> {
        const startTime = Date.now();
        await this.repository.update(userId, { locked_until: lockUntil });

        this.logger.logDatabaseQuery(
            `UPDATE users SET locked_until = $2 WHERE id = $1`,
            [userId, lockUntil],
            Date.now() - startTime,
        );
    }

    async updateLastLogin(userId: string, ipAddress: string): Promise<void> {
        const startTime = Date.now();
        await this.repository.update(userId, {
            last_login_at: new Date(),
            last_login_ip: ipAddress,
        });

        this.logger.logDatabaseQuery(
            `UPDATE users SET last_login_at = NOW(), last_login_ip = $2 WHERE id = $1`,
            [userId, ipAddress],
            Date.now() - startTime,
        );
    }
}
