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

@Entity('profile_views')
@Index(['viewer_id', 'viewed_id'])
@Index(['viewed_id', 'created_at'])
@Index(['viewer_id', 'created_at'])
export class ProfileView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  viewer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'viewer_id' })
  viewer: User;

  @Column({ type: 'uuid' })
  viewed_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'viewed_id' })
  viewed: User;

  @CreateDateColumn()
  created_at: Date;
}
