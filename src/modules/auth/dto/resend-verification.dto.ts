import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationDto {
    @ApiProperty({
        description: 'Email address to resend verification',
        example: 'user@example.com',
    })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
}
