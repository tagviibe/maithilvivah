import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('temp_registrations')
export class TempRegistration {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'varchar', length: 6, nullable: true })
    email_otp: string;

    @Column({ type: 'varchar', length: 6, nullable: true })
    phone_otp: string;

    @Column({ type: 'boolean', default: false })
    email_verified: boolean;

    @Column({ type: 'boolean', default: false })
    phone_verified: boolean;

    @Column({ type: 'timestamp', nullable: true })
    otp_expires_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp' })
    expires_at: Date;
}
