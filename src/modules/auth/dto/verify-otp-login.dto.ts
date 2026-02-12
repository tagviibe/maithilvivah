import { IsString, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpLoginDto {
    @ApiProperty({
        description: 'Email address',
        example: 'user@example.com',
        required: false,
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'Phone number in E.164 format',
        example: '+919876543210',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: 'OTP code',
        example: '123456',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    otp: string;
}
