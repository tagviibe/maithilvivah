import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendLoginOtpDto {
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
}
