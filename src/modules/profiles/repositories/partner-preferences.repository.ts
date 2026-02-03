import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PartnerPreferences } from '../entities/partner-preferences.entity';
import { PartnerPreferencesDto } from '../dto/partner-preferences.dto';

@Injectable()
export class PartnerPreferencesRepository extends BaseRepository<PartnerPreferences> {
    protected entityName = 'PartnerPreferences';

    constructor(
        @InjectRepository(PartnerPreferences)
        protected repository: Repository<PartnerPreferences>,
    ) {
        super();
    }

    async findByUserId(userId: string): Promise<PartnerPreferences | null> {
        const startTime = Date.now();
        const preferences = await this.repository.findOne({
            where: { user_id: userId },
        });

        this.logger.logDatabaseQuery(
            `SELECT * FROM partner_preferences WHERE user_id = $1`,
            [userId],
            Date.now() - startTime,
        );

        return preferences;
    }

    async createOrUpdate(userId: string, data: PartnerPreferencesDto): Promise<PartnerPreferences> {
        const startTime = Date.now();

        const existing = await this.findByUserId(userId);

        if (existing) {
            await this.repository.update({ user_id: userId }, data);
        } else {
            const preferences = this.repository.create({ user_id: userId, ...data });
            await this.repository.save(preferences);
        }

        const result = await this.findByUserId(userId);

        this.logger.logDatabaseQuery(
            `INSERT/UPDATE partner_preferences WHERE user_id = $1`,
            [userId],
            Date.now() - startTime,
        );

        if (!result) {
            throw new Error('Partner preferences not found after update');
        }

        return result;
    }
}
