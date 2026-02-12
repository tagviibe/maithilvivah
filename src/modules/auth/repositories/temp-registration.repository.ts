import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TempRegistration } from '../entities/temp-registration.entity';

@Injectable()
export class TempRegistrationRepository extends Repository<TempRegistration> {
    constructor(private dataSource: DataSource) {
        super(TempRegistration, dataSource.createEntityManager());
    }

    async findById(id: string): Promise<TempRegistration | null> {
        return this.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<TempRegistration | null> {
        return this.findOne({ where: { email } });
    }

    async findByPhone(phone: string): Promise<TempRegistration | null> {
        return this.findOne({ where: { phone } });
    }

    async createTempRegistration(data: {
        email: string;
        phone: string;
        email_otp: string;
        phone_otp: string;
        otp_expires_at: Date;
        expires_at: Date;
    }): Promise<TempRegistration> {
        const tempReg = this.create(data);
        return this.save(tempReg);
    }

    async markEmailVerified(id: string): Promise<void> {
        await this.update(id, { email_verified: true });
    }

    async markPhoneVerified(id: string): Promise<void> {
        await this.update(id, { phone_verified: true });
    }

    async deleteById(id: string): Promise<void> {
        await this.delete(id);
    }

    async cleanupExpired(): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .where('expires_at < :now', { now: new Date() })
            .execute();
    }
}
