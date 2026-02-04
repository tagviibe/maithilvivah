import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { VALIDATION_RULES, REGEX_PATTERNS } from '../../../common/constants';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'abc123def456ghi789',
    description: 'Password reset token',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({
    example: 'NewSecurePass@123',
    description:
      'New password (min 8 chars, must include uppercase, lowercase, number, special char)',
  })
  @IsString()
  @MinLength(VALIDATION_RULES.PASSWORD.MIN_LENGTH)
  @MaxLength(VALIDATION_RULES.PASSWORD.MAX_LENGTH)
  @Matches(REGEX_PATTERNS.PASSWORD, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;
}
