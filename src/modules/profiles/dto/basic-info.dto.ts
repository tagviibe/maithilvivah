import { IsString, IsDate, IsEnum, IsInt, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, MaritalStatus, BodyType, Complexion } from '../enums/profile.enums';

export class BasicInfoDto {
    @IsString()
    @MaxLength(100)
    first_name: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    middle_name?: string;

    @IsString()
    @MaxLength(100)
    last_name: string;

    @IsDate()
    @Type(() => Date)
    date_of_birth: Date;

    @IsEnum(Gender)
    gender: Gender;

    @IsInt()
    @Min(120)
    @Max(250)
    height_cm: number;

    @IsOptional()
    @IsInt()
    @Min(30)
    @Max(200)
    weight_kg?: number;

    @IsEnum(MaritalStatus)
    marital_status: MaritalStatus;

    @IsOptional()
    @IsEnum(BodyType)
    body_type?: BodyType;

    @IsOptional()
    @IsEnum(Complexion)
    complexion?: Complexion;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    disability?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    about_me?: string;
}
