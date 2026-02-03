import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
    @ApiProperty({
        example: 'abc123def456ghi789',
        description: 'Email verification token',
    })
    @IsString()
    @IsNotEmpty({ message: 'Token is required' })
    token: string;
}
