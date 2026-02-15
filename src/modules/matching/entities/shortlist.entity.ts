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

@Entity('shortlists')
@Index(['user_id', 'shortlisted_user_id'], { unique: true })
@Index(['user_id'])
export class Shortlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  shortlisted_user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'shortlisted_user_id' })
  shortlisted_user: User;

  @CreateDateColumn()
  created_at: Date;
}
