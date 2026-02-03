import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { EmailVerification } from './entities/email-verification.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { PhoneVerification } from './entities/phone-verification.entity';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { UserSessionRepository } from './repositories/user-session.repository';
import { EmailVerificationRepository } from './repositories/email-verification.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { PhoneVerificationRepository } from './repositories/phone-verification.repository';

// Services
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';

// Strategies & Guards
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Controller
import { AuthController } from './auth.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserSession,
            EmailVerification,
            PasswordReset,
            PhoneVerification,
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): JwtModuleOptions => ({
                secret: configService.get<string>('JWT_SECRET') || 'default-jwt-secret',
                signOptions: {
                    expiresIn: (configService.get<string>('JWT_EXPIRATION') || '1h') as any,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        EmailService,
        SmsService,
        JwtStrategy,
        JwtAuthGuard,
        UserRepository,
        UserSessionRepository,
        EmailVerificationRepository,
        PasswordResetRepository,
        PhoneVerificationRepository,
    ],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule { }
