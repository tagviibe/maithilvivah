import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPhoneDto {
    @ApiProperty({
        description: 'Phone number with country code',
        example: '+919876543210',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: 'Phone number must be in E.164 format (e.g., +919876543210)',
    })
    phone: string;

    @ApiProperty({
        description: 'OTP code (6 digits)',
        example: '123456',
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
    @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
    otp: string;
}
