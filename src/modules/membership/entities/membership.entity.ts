import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum MembershipPlan {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
}

export enum MembershipStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
}

@Entity('user_memberships')
@Index(['user_id'], { unique: true })
export class UserMembership {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @Column({ type: 'varchar', length: 20, default: MembershipPlan.FREE })
    plan: MembershipPlan;

    @Column({ type: 'varchar', length: 20, default: MembershipStatus.ACTIVE })
    status: MembershipStatus;

    @Column({ type: 'int', nullable: true })
    duration_months: number; // 1 or 3

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount_paid: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    original_price: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    discount_percent: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    payment_id: string; // For future Razorpay integration

    @Column({ type: 'varchar', length: 50, nullable: true })
    payment_method: string;

    @Column({ type: 'timestamp', nullable: true })
    starts_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    // Usage counters
    @Column({ type: 'int', default: 0 })
    profiles_viewed: number;

    @Column({ type: 'int', default: 0 })
    interests_sent: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
