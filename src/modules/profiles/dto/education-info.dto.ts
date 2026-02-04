import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { EducationLevel } from '../enums/profile.enums';

export class EducationInfoDto {
  @IsEnum(EducationLevel)
  highest_education: EducationLevel;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  education_details?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  college_name?: string;

  @IsString()
  @MaxLength(100)
  occupation: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  occupation_details?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  annual_income?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  employer_name?: string;
}
