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
  Gender,
  MaritalStatus,
  BodyType,
  Complexion,
  Religion,
  ManglikStatus,
  EducationLevel,
  FamilyType,
  FamilyStatus,
  FamilyValues,
  Diet,
  DrinkingHabit,
  SmokingHabit,
} from '../enums/profile.enums';

@Entity('profiles')
@Index(['user_id'], { unique: true })
@Index(['gender', 'marital_status'])
@Index(['country', 'state', 'city'])
@Index(['religion', 'caste'])
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Basic Info
  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'int', nullable: true })
  height_cm: number;

  @Column({ type: 'int', nullable: true })
  weight_kg: number;

  @Column({ type: 'enum', enum: MaritalStatus, nullable: true })
  marital_status: MaritalStatus;

  @Column({ type: 'enum', enum: BodyType, nullable: true })
  body_type: BodyType;

  @Column({ type: 'enum', enum: Complexion, nullable: true })
  complexion: Complexion;

  @Column({ type: 'varchar', length: 255, nullable: true })
  disability: string;

  @Column({ type: 'text', nullable: true })
  about_me: string;

  // Community Info
  @Column({ type: 'enum', enum: Religion, nullable: true })
  religion: Religion;

  @Column({ type: 'varchar', length: 100, nullable: true })
  caste: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sub_caste: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gotra: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mother_tongue: string;

  @Column({ type: 'enum', enum: ManglikStatus, nullable: true })
  manglik: ManglikStatus;

  // Location Info
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zip_code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  citizenship: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  residing_country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  residing_city: string;

  // Education & Career
  @Column({ type: 'enum', enum: EducationLevel, nullable: true })
  highest_education: EducationLevel;

  @Column({ type: 'text', nullable: true })
  education_details: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  college_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occupation: string;

  @Column({ type: 'text', nullable: true })
  occupation_details: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  annual_income: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  employer_name: string;

  // Family Info
  @Column({ type: 'varchar', length: 100, nullable: true })
  father_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  father_occupation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mother_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mother_occupation: string;

  @Column({ type: 'int', default: 0 })
  brothers_count: number;

  @Column({ type: 'int', default: 0 })
  brothers_married: number;

  @Column({ type: 'int', default: 0 })
  sisters_count: number;

  @Column({ type: 'int', default: 0 })
  sisters_married: number;

  @Column({ type: 'enum', enum: FamilyType, nullable: true })
  family_type: FamilyType;

  @Column({ type: 'enum', enum: FamilyStatus, nullable: true })
  family_status: FamilyStatus;

  @Column({ type: 'enum', enum: FamilyValues, nullable: true })
  family_values: FamilyValues;

  @Column({ type: 'varchar', length: 255, nullable: true })
  family_location: string;

  // Lifestyle
  @Column({ type: 'enum', enum: Diet, nullable: true })
  diet: Diet;

  @Column({ type: 'enum', enum: DrinkingHabit, nullable: true })
  drinking: DrinkingHabit;

  @Column({ type: 'enum', enum: SmokingHabit, nullable: true })
  smoking: SmokingHabit;

  @Column({ type: 'text', array: true, nullable: true })
  hobbies: string[];

  @Column({ type: 'text', array: true, nullable: true })
  interests: string[];

  @Column({ type: 'text', array: true, nullable: true })
  languages_known: string[];

  @Column({ type: 'text', nullable: true })
  special_cases: string;

  // Metadata
  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
