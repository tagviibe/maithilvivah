import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { Religion, ManglikStatus } from '../enums/profile.enums';

export class CommunityInfoDto {
    @IsEnum(Religion)
    religion: Religion;

    @IsString()
    @MaxLength(100)
    caste: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    sub_caste?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    gotra?: string;

    @IsString()
    @MaxLength(50)
    mother_tongue: string;

    @IsOptional()
    @IsEnum(ManglikStatus)
    manglik?: ManglikStatus;
}
