import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { VALIDATION_RULES, REGEX_PATTERNS } from '../../../common/constants';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        example: '+919876543210',
        description: 'User phone number with country code',
        required: false,
    })
    @IsOptional()
    @Matches(REGEX_PATTERNS.PHONE, { message: 'Invalid phone number format' })
    phone?: string;

    @ApiProperty({
        example: 'SecurePass@123',
        description: 'Password (min 8 chars, must include uppercase, lowercase, number, special char)',
    })
    @IsString()
    @MinLength(VALIDATION_RULES.PASSWORD.MIN_LENGTH)
    @MaxLength(VALIDATION_RULES.PASSWORD.MAX_LENGTH)
    @Matches(REGEX_PATTERNS.PASSWORD, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;

    @ApiProperty({
        example: 'self',
        description: 'Profile is being created for',
        enum: ['self', 'son', 'daughter', 'brother', 'sister', 'friend', 'relative'],
    })
    @IsEnum(['self', 'son', 'daughter', 'brother', 'sister', 'friend', 'relative'])
    profileFor: string;

    @ApiProperty({
        example: 'self',
        description: 'Profile is being created by',
        enum: ['self', 'parent', 'sibling', 'friend', 'relative'],
    })
    @IsEnum(['self', 'parent', 'sibling', 'friend', 'relative'])
    createdBy: string;
}
