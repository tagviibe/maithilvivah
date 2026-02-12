import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number with country code',
    example: '+919876543210',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format (e.g., +919876543210)',
  })
  phone?: string;

  @ApiProperty({
    example: 'SecurePass@123',
    description: 'User password',
  })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
