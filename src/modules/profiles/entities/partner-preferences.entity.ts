import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import {
  MaritalStatus,
  Religion,
  EducationLevel,
  Diet,
  DrinkingHabit,
  SmokingHabit,
  ManglikStatus,
} from '../enums/profile.enums';

@Entity('partner_preferences')
@Index(['user_id'], { unique: true })
export class PartnerPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Age preferences
  @Column({ type: 'int', nullable: true })
  age_min: number;

  @Column({ type: 'int', nullable: true })
  age_max: number;

  // Height preferences
  @Column({ type: 'int', nullable: true })
  height_min_cm: number;

  @Column({ type: 'int', nullable: true })
  height_max_cm: number;

  // Marital status preferences
  @Column({ type: 'enum', enum: MaritalStatus, array: true, nullable: true })
  marital_status: MaritalStatus[];

  // Community preferences
  @Column({ type: 'enum', enum: Religion, array: true, nullable: true })
  religion: Religion[];

  @Column({ type: 'text', array: true, nullable: true })
  caste: string[];

  @Column({ type: 'text', array: true, nullable: true })
  mother_tongue: string[];

  // Location preferences
  @Column({ type: 'text', array: true, nullable: true })
  country: string[];

  @Column({ type: 'text', array: true, nullable: true })
  state: string[];

  // Education & Career preferences
  @Column({ type: 'enum', enum: EducationLevel, array: true, nullable: true })
  education: EducationLevel[];

  @Column({ type: 'text', array: true, nullable: true })
  occupation: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  income_min: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  income_max: string;

  // Lifestyle preferences
  @Column({ type: 'enum', enum: Diet, array: true, nullable: true })
  diet: Diet[];

  @Column({ type: 'enum', enum: SmokingHabit, array: true, nullable: true })
  smoking: SmokingHabit[];

  @Column({ type: 'enum', enum: DrinkingHabit, array: true, nullable: true })
  drinking: DrinkingHabit[];

  @Column({ type: 'enum', enum: ManglikStatus, nullable: true })
  manglik: ManglikStatus;

  // Additional requirements
  @Column({ type: 'text', nullable: true })
  special_requirements: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
