import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { FamilyType, FamilyStatus, FamilyValues } from '../enums/profile.enums';

export class FamilyInfoDto {
  @IsString()
  @MaxLength(100)
  father_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  father_occupation?: string;

  @IsString()
  @MaxLength(100)
  mother_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mother_occupation?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  brothers_count?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  brothers_married?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  sisters_count?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  sisters_married?: number;

  @IsEnum(FamilyType)
  family_type: FamilyType;

  @IsOptional()
  @IsEnum(FamilyStatus)
  family_status?: FamilyStatus;

  @IsOptional()
  @IsEnum(FamilyValues)
  family_values?: FamilyValues;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  family_location?: string;
}
