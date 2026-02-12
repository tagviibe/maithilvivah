import { IsString, IsUUID, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteRegistrationDto {
    @ApiProperty({
        description: 'Temporary registration ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    tempUserId: string;

    @ApiProperty({
        description: 'Password (min 8 characters)',
        example: 'SecurePass123!',
    })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({
        description: 'Profile created for',
        example: 'self',
        enum: ['self', 'son', 'daughter', 'brother', 'sister', 'friend', 'relative'],
    })
    @IsEnum(['self', 'son', 'daughter', 'brother', 'sister', 'friend', 'relative'])
    profileFor: string;

    @ApiProperty({
        description: 'Profile created by',
        example: 'self',
    })
    @IsString()
    createdBy: string;
}
