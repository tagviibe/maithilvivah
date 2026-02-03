import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { OnboardingProgressLog } from '../entities/onboarding-progress-log.entity';

@Injectable()
export class OnboardingProgressLogRepository extends BaseRepository<OnboardingProgressLog> {
    protected entityName = 'OnboardingProgressLog';

    constructor(
        @InjectRepository(OnboardingProgressLog)
        protected repository: Repository<OnboardingProgressLog>,
    ) {
        super();
    }

    async logProgress(
        userId: string,
        sectionName: string,
        action: string,
        completionPercentage: number,
    ): Promise<void> {
        const startTime = Date.now();

        const log = this.repository.create({
            user_id: userId,
            section_name: sectionName,
            action,
            completion_percentage: completionPercentage,
        });

        await this.repository.save(log);

        this.logger.logDatabaseQuery(
            `INSERT INTO onboarding_progress_logs (user_id, section_name, action, completion_percentage) VALUES ($1, $2, $3, $4)`,
            [userId, sectionName, action, completionPercentage],
            Date.now() - startTime,
        );
    }

    async getProgressHistory(userId: string): Promise<OnboardingProgressLog[]> {
        const startTime = Date.now();
        const logs = await this.repository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: 50,
        });

        this.logger.logDatabaseQuery(
            `SELECT * FROM onboarding_progress_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
            [userId],
            Date.now() - startTime,
        );

        return logs;
    }
}
