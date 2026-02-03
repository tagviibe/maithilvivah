import { IsEnum, IsArray, IsOptional, IsString, ArrayMaxSize, MaxLength } from 'class-validator';
import { Diet, DrinkingHabit, SmokingHabit } from '../enums/profile.enums';

export class LifestyleInfoDto {
    @IsEnum(Diet)
    diet: Diet;

    @IsOptional()
    @IsEnum(DrinkingHabit)
    drinking?: DrinkingHabit;

    @IsOptional()
    @IsEnum(SmokingHabit)
    smoking?: SmokingHabit;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(10)
    hobbies?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(10)
    interests?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(10)
    languages_known?: string[];

    @IsOptional()
    @IsString()
    @MaxLength(500)
    special_cases?: string;
}
