import {
  IsInt,
  IsEnum,
  IsArray,
  IsOptional,
  IsString,
  Min,
  Max,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import {
  MaritalStatus,
  Religion,
  EducationLevel,
  Diet,
  DrinkingHabit,
  SmokingHabit,
  ManglikStatus,
} from '../enums/profile.enums';

export class PartnerPreferencesDto {
  @IsInt()
  @Min(18)
  @Max(100)
  age_min: number;

  @IsInt()
  @Min(18)
  @Max(100)
  age_max: number;

  @IsInt()
  @Min(120)
  @Max(250)
  height_min_cm: number;

  @IsInt()
  @Min(120)
  @Max(250)
  height_max_cm: number;

  @IsOptional()
  @IsArray()
  @IsEnum(MaritalStatus, { each: true })
  @ArrayMaxSize(10)
  marital_status?: MaritalStatus[];

  @IsOptional()
  @IsArray()
  @IsEnum(Religion, { each: true })
  @ArrayMaxSize(10)
  religion?: Religion[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  caste?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  mother_tongue?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  country?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  state?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(EducationLevel, { each: true })
  @ArrayMaxSize(10)
  education?: EducationLevel[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  occupation?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(50)
  income_min?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  income_max?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Diet, { each: true })
  @ArrayMaxSize(10)
  diet?: Diet[];

  @IsOptional()
  @IsArray()
  @IsEnum(SmokingHabit, { each: true })
  @ArrayMaxSize(10)
  smoking?: SmokingHabit[];

  @IsOptional()
  @IsArray()
  @IsEnum(DrinkingHabit, { each: true })
  @ArrayMaxSize(10)
  drinking?: DrinkingHabit[];

  @IsOptional()
  @IsEnum(ManglikStatus)
  manglik?: ManglikStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  special_requirements?: string;
}
