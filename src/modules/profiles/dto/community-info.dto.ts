import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { Religion, ManglikStatus } from '../enums/profile.enums';

export class CommunityInfoDto {
  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  caste?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sub_caste?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  gotra?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  mother_tongue?: string;

  @IsOptional()
  @IsEnum(ManglikStatus)
  manglik?: ManglikStatus;
}
