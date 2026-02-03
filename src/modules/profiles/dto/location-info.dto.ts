import { IsString, IsOptional, MaxLength } from 'class-validator';

export class LocationInfoDto {
    @IsString()
    @MaxLength(100)
    country: string;

    @IsString()
    @MaxLength(100)
    state: string;

    @IsString()
    @MaxLength(100)
    city: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    zip_code?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    citizenship?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    residing_country?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    residing_city?: string;
}
