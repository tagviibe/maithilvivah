import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
@Index(['account_status', 'email_verified'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    password_hash: string;

    @Column({ type: 'varchar', length: 50 })
    profile_for: string;

    @Column({ type: 'varchar', length: 50 })
    created_by: string;

    @Column({ type: 'boolean', default: false })
    email_verified: boolean;

    @Column({ type: 'boolean', default: false })
    phone_verified: boolean;

    @Column({ type: 'varchar', length: 20, default: 'active' })
    account_status: string;

    @Column({ type: 'timestamp', nullable: true })
    last_login_at: Date;

    @Column({ type: 'varchar', length: 45, nullable: true })
    last_login_ip: string;

    @Column({ type: 'int', default: 0 })
    failed_login_attempts: number;

    @Column({ type: 'timestamp', nullable: true })
    locked_until: Date;

    @Column({ type: 'boolean', default: false })
    onboarding_completed: boolean;

    @Column({ type: 'int', default: 0 })
    profile_completion_percentage: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    last_active_section: string;

    @Column({ type: 'timestamp', nullable: true })
    last_onboarding_activity: Date;

    @Column({ type: 'int', default: 0 })
    onboarding_step: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
