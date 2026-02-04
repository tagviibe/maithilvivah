import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { PhotoApprovalStatus } from '../enums/profile.enums';

@Entity('profile_photos')
@Index(['user_id'])
@Index(['approval_status'])
@Index(['is_primary'])
export class ProfilePhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  photo_url: string;

  @Column({ type: 'varchar', length: 255 })
  photo_key: string;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;

  @Column({
    type: 'enum',
    enum: PhotoApprovalStatus,
    default: PhotoApprovalStatus.PENDING,
  })
  approval_status: PhotoApprovalStatus;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
