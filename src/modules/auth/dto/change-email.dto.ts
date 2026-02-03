import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
    @ApiProperty({
        description: 'New email address',
        example: 'newemail@example.com',
    })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    newEmail: string;

    @ApiProperty({
        description: 'Current password for confirmation',
        example: 'MyPassword123!',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
