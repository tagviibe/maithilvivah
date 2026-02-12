import { IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRegistrationDto {
    @ApiProperty({
        description: 'Temporary registration ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    tempUserId: string;

    @ApiProperty({
        description: 'Email OTP (6 digits)',
        example: '123456',
    })
    @IsString()
    @Length(6, 6)
    emailOtp: string;
}
