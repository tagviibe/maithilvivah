import { IsEmail, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterInitDto {
    @ApiProperty({
        description: 'Email address',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Phone number (10 digits)',
        example: '9876543210',
    })
    @IsString()
    phone: string;
}
