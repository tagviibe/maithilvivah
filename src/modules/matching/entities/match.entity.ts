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

export enum MatchStatus {
  PENDING = 'pending',
  VIEWED = 'viewed',
  INTERESTED = 'interested',
  DECLINED = 'declined',
  MUTUAL = 'mutual',
}

@Entity('matches')
@Index(['user_id', 'matched_user_id'], { unique: true })
@Index(['user_id', 'status'])
@Index(['user_id', 'compatibility_score'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  matched_user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'matched_user_id' })
  matched_user: User;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  compatibility_score: number;

  // Score breakdown stored as JSON
  @Column({ type: 'jsonb', nullable: true })
  score_breakdown: {
    religion: number;
    caste: number;
    age: number;
    height: number;
    education: number;
    location: number;
    diet: number;
    manglik: number;
    income: number;
    mother_tongue: number;
  };

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.PENDING })
  status: MatchStatus;

  @Column({ type: 'int', default: 0 })
  rank: number;

  @Column({ type: 'timestamp', nullable: true })
  viewed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
