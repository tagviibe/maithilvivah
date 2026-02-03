import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('onboarding_progress_logs')
@Index(['user_id'])
@Index(['section_name'])
@Index(['created_at'])
export class OnboardingProgressLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 50 })
    section_name: string;

    @Column({ type: 'varchar', length: 20 })
    action: string; // 'started', 'saved', 'completed'

    @Column({ type: 'int', nullable: true })
    completion_percentage: number;

    @CreateDateColumn()
    created_at: Date;
}
