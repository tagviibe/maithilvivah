import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoggerService } from '../../../common/services/logger.service';
import { MESSAGES } from '../../../common/constants';
import { UserRepository } from '../repositories/user.repository';
import { UserSessionRepository } from '../repositories/user-session.repository';
import { EmailVerificationRepository } from '../repositories/email-verification.repository';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { PhoneVerificationRepository } from '../repositories/phone-verification.repository';
import { TempRegistrationRepository } from '../repositories/temp-registration.repository';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../entities/user.entity';
import { UserSession } from '../entities/user-session.entity';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MINUTES = 30;
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly UAT_OTP = '123456';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: UserSessionRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly phoneVerificationRepository: PhoneVerificationRepository,
    private readonly tempRegistrationRepository: TempRegistrationRepository,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) { }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ userId: string; email: string }> {
    const { email, phone, password, profileFor, createdBy } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn(
        `Registration attempt with existing email: ${email}`,
        'AuthService',
      );
      throw new ConflictException(MESSAGES.ERROR.USER.EMAIL_EXISTS);
    }

    if (phone) {
      const existingPhone = await this.userRepository.findByPhone(phone);
      if (existingPhone) {
        this.logger.warn(
          `Registration attempt with existing phone: ${phone}`,
          'AuthService',
        );
        throw new ConflictException(MESSAGES.ERROR.USER.PHONE_EXISTS);
      }
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = await this.userRepository.create({
      email,
      phone,
      password_hash: passwordHash,
      profile_for: profileFor,
      created_by: createdBy,
    });

    const verificationToken = this.generateToken();
    const expiryHours = parseInt(
      (
        this.configService.get<string>('EMAIL_VERIFICATION_EXPIRY') || '24h'
      ).replace('h', ''),
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    await this.emailVerificationRepository.create({
      user_id: user.id,
      token: verificationToken,
      expires_at: expiresAt,
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);

    this.logger.log(`User registered successfully: ${email}`, 'AuthService');

    return {
      userId: user.id,
      email: user.email,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const verification =
      await this.emailVerificationRepository.findByToken(token);

    if (!verification) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_TOKEN);
    }

    if (new Date() > verification.expires_at) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.TOKEN_EXPIRED);
    }

    await this.userRepository.update(verification.user_id, {
      email_verified: true,
    });

    await this.emailVerificationRepository.markAsVerified(verification.id);

    this.logger.log(
      `Email verified for user: ${verification.user.email}`,
      'AuthService',
    );
  }

  async login(
    loginDto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    const { email, phone, password } = loginDto;

    if (!email && !phone) {
      throw new BadRequestException('Email or phone number is required');
    }

    let user: User | null;
    if (email) {
      user = await this.userRepository.findByEmail(email);
    } else {
      user = await this.userRepository.findByPhone(phone!);
    }

    if (!user) {
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
    }

    if (user.locked_until && new Date() < user.locked_until) {
      const minutesLeft = Math.ceil(
        (user.locked_until.getTime() - new Date().getTime()) / 60000,
      );
      throw new UnauthorizedException(
        `Account is locked. Try again in ${minutesLeft} minutes.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      await this.userRepository.incrementFailedLoginAttempts(user.id);

      if (user.failed_login_attempts + 1 >= this.MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date();
        lockUntil.setMinutes(
          lockUntil.getMinutes() + this.LOCK_DURATION_MINUTES,
        );
        await this.userRepository.lockAccount(user.id, lockUntil);

        this.logger.warn(
          `Account locked due to failed attempts: ${email}`,
          'AuthService',
        );
        throw new UnauthorizedException(
          `Too many failed attempts. Account locked for ${this.LOCK_DURATION_MINUTES} minutes.`,
        );
      }

      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.email_verified) {
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.EMAIL_NOT_VERIFIED);
    }

    if (user.account_status !== 'active') {
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.ACCOUNT_SUSPENDED);
    }

    await this.userRepository.resetFailedLoginAttempts(user.id);
    await this.userRepository.updateLastLogin(user.id, ipAddress);

    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    this.logger.log(`User logged in successfully: ${email || phone}`, 'AuthService');

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        email_verified: user.email_verified,
        onboarding_completed: user.onboarding_completed,
        profile_completion_percentage: user.profile_completion_percentage,
      },
    };
  }

  async refreshToken(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const session =
      await this.sessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.INVALID_TOKEN);
    }

    if (new Date() > session.expires_at) {
      await this.sessionRepository.delete(session.id);
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.TOKEN_EXPIRED);
    }

    await this.sessionRepository.delete(session.id);

    const tokens = await this.generateTokens(
      session.user,
      ipAddress,
      userAgent,
    );

    this.logger.log(
      `Token refreshed for user: ${session.user.email}`,
      'AuthService',
    );

    return tokens;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    const resetToken = this.generateToken();
    const expiryHours = parseInt(
      (this.configService.get<string>('PASSWORD_RESET_EXPIRY') || '1h').replace(
        'h',
        '',
      ),
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    await this.passwordResetRepository.create({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt,
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);

    this.logger.log(`Password reset requested for: ${email}`, 'AuthService');
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const reset = await this.passwordResetRepository.findByToken(token);

    if (!reset) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_TOKEN);
    }

    if (new Date() > reset.expires_at) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.TOKEN_EXPIRED);
    }

    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.userRepository.update(reset.user_id, {
      password_hash: passwordHash,
      failed_login_attempts: 0,
      locked_until: undefined,
    });

    await this.passwordResetRepository.markAsUsed(reset.id);

    await this.sessionRepository.deleteByUserId(reset.user_id);

    this.logger.log(
      `Password reset for user: ${reset.user.email}`,
      'AuthService',
    );
  }

  async logout(userId: string): Promise<void> {
    await this.sessionRepository.deleteByUserId(userId);
    this.logger.log(`User logged out: ${userId}`, 'AuthService');
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user || user.account_status !== 'active') {
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.UNAUTHORIZED);
    }

    return user;
  }

  private async generateTokens(
    user: User,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret',
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRATION') ||
        '30d') as any,
    });

    const expiryDays = parseInt(
      (
        this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '30d'
      ).replace('d', ''),
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    await this.sessionRepository.create({
      user_id: user.id,
      refresh_token: refreshToken,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: expiresAt,
    });

    return { accessToken, refreshToken };
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Phone Verification Methods
  async sendPhoneOTP(phone: string, userId?: string): Promise<void> {
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    // Generate OTP (hardcoded for demo)
    const otp = this.UAT_OTP;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    // If userId is provided, create verification for that user
    // Otherwise, find user by phone or create a pending verification
    let targetUserId = userId;
    if (!targetUserId) {
      const user = await this.userRepository.findByPhone(phone);
      if (user) {
        targetUserId = user.id;
      } else if (nodeEnv !== 'production') {
        // In dev mode, just log and return - OTP is hardcoded anyway
        this.logger.log(
          `[DEV MODE] Phone OTP requested for non-existent user: ${phone} - Use OTP: 123456`,
          'AuthService',
        );
        return;
      } else {
        throw new BadRequestException('User not found with this phone number');
      }
    }

    await this.phoneVerificationRepository.create({
      user_id: targetUserId,
      phone,
      otp,
      expires_at: expiresAt,
    });

    await this.smsService.sendOTP(phone, otp);

    this.logger.log(
      `OTP sent to ${phone}${nodeEnv !== 'production' ? ' [DEV MODE - OTP: 123456]' : ''}`,
      'AuthService',
    );
  }

  async verifyPhone(phone: string, otp: string): Promise<void> {
    const verification =
      await this.phoneVerificationRepository.findByPhone(phone);

    if (!verification) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_OTP);
    }

    if (new Date() > verification.expires_at) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.OTP_EXPIRED);
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const validOtp = this.UAT_OTP;

    if (otp !== validOtp) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_OTP);
    }

    await this.userRepository.update(verification.user_id, {
      phone_verified: true,
    });

    await this.phoneVerificationRepository.markAsVerified(verification.id);

    this.logger.log(
      `Phone verified for user: ${verification.user_id}`,
      'AuthService',
    );
  }

  // Email Verification Methods
  async resendEmailVerification(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    if (user.email_verified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = this.generateToken();
    const expiryHours = parseInt(
      (
        this.configService.get<string>('EMAIL_VERIFICATION_EXPIRY') || '24h'
      ).replace('h', ''),
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    await this.emailVerificationRepository.create({
      user_id: user.id,
      token: verificationToken,
      expires_at: expiresAt,
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);

    this.logger.log(`Verification email resent to: ${email}`, 'AuthService');
  }

  // Password Management
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(MESSAGES.ERROR.AUTH.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.INCORRECT_PASSWORD);
    }

    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    await this.userRepository.update(userId, {
      password_hash: passwordHash,
    });

    // Invalidate all sessions except current one would require session ID
    // For now, we'll log the user out from all devices
    await this.sessionRepository.deleteByUserId(userId);

    this.logger.log(`Password changed for user: ${userId}`, 'AuthService');
  }

  // Email Management
  async changeEmail(
    userId: string,
    newEmail: string,
    password: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(MESSAGES.ERROR.AUTH.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new BadRequestException(MESSAGES.ERROR.AUTH.INCORRECT_PASSWORD);
    }

    const existingUser = await this.userRepository.findByEmail(newEmail);
    if (existingUser) {
      throw new ConflictException(MESSAGES.ERROR.USER.EMAIL_EXISTS);
    }

    await this.userRepository.update(userId, {
      email: newEmail,
      email_verified: false,
    });

    // Send verification email to new address
    const verificationToken = this.generateToken();
    const expiryHours = parseInt(
      (
        this.configService.get<string>('EMAIL_VERIFICATION_EXPIRY') || '24h'
      ).replace('h', ''),
    );
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    await this.emailVerificationRepository.create({
      user_id: userId,
      token: verificationToken,
      expires_at: expiresAt,
    });

    await this.emailService.sendVerificationEmail(newEmail, verificationToken);

    this.logger.log(`Email changed for user: ${userId}`, 'AuthService');
  }

  // Session Management
  async getAllSessions(userId: string): Promise<UserSession[]> {
    const sessions = await this.sessionRepository.findByUserId(userId);
    return sessions;
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session || session.user_id !== userId) {
      throw new NotFoundException(MESSAGES.ERROR.AUTH.SESSION_NOT_FOUND);
    }

    await this.sessionRepository.delete(sessionId);

    this.logger.log(
      `Session ${sessionId} revoked for user: ${userId}`,
      'AuthService',
    );
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await this.sessionRepository.deleteByUserId(userId);
    this.logger.log(
      `All sessions logged out for user: ${userId}`,
      'AuthService',
    );
  }

  // OTP-based Login Methods
  async sendLoginOTP(email?: string, phone?: string): Promise<void> {
    if (!email && !phone) {
      throw new BadRequestException('Email or phone number is required');
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');

    let user: User | null;
    if (email) {
      user = await this.userRepository.findByEmail(email);
    } else {
      user = await this.userRepository.findByPhone(phone!);
    }

    if (!user) {
      // In non-production mode, just log and return success
      // OTP is hardcoded to 123456 anyway, no DB record needed
      if (nodeEnv !== 'production') {
        this.logger.log(
          `[DEV MODE] Login OTP requested for non-existent user: ${email || phone} - Use OTP: 123456`,
          'AuthService',
        );
        return;
      }
      throw new NotFoundException('User not found with this email or phone');
    }

    const otp = this.UAT_OTP;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    if (phone) {
      await this.phoneVerificationRepository.create({
        user_id: user.id,
        phone,
        otp,
        expires_at: expiresAt,
      });

      await this.smsService.sendOTP(phone, otp);
      this.logger.log(
        `Login OTP sent to ${phone}${nodeEnv !== 'production' ? ' [TEST MODE - OTP: 123456]' : ''}`,
        'AuthService',
      );
    } else if (email) {
      this.logger.log(
        `Login OTP for email not implemented yet: ${email}`,
        'AuthService',
      );
      throw new BadRequestException('Email OTP login not yet supported. Please use phone number.');
    }
  }

  async verifyOTPAndLogin(
    email: string | undefined,
    phone: string | undefined,
    otp: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    if (!email && !phone) {
      throw new BadRequestException('Email or phone number is required');
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');

    let user: User | null;
    if (email) {
      user = await this.userRepository.findByEmail(email);
    } else {
      user = await this.userRepository.findByPhone(phone!);
    }

    // In non-production mode, if user doesn't exist, auto-create them
    if (!user && nodeEnv !== 'production') {
      if (otp !== this.UAT_OTP) {
        throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_OTP);
      }

      const dummyPassword = await bcrypt.hash('Temp@1234', this.SALT_ROUNDS);
      user = await this.userRepository.create({
        email: email || `${phone!.replace(/\+/g, '')}@dev.maithilvivah.com`,
        phone: phone || undefined,
        password_hash: dummyPassword,
        email_verified: true,
        phone_verified: true,
        profile_for: 'self',
        created_by: 'self',
      });

      this.logger.log(
        `[DEV MODE] Auto-created user for OTP login: ${email || phone} (ID: ${user.id})`,
        'AuthService',
      );
    } else if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.account_status !== 'active') {
      throw new UnauthorizedException(MESSAGES.ERROR.AUTH.ACCOUNT_SUSPENDED);
    }

    // Verify OTP
    if (phone) {
      if (nodeEnv !== 'production') {
        // In dev mode, just check against hardcoded OTP
        if (otp !== this.UAT_OTP) {
          throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_OTP);
        }
      } else {
        const verification =
          await this.phoneVerificationRepository.findByPhone(phone);

        if (!verification) {
          throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_OTP);
        }

        if (new Date() > verification.expires_at) {
          throw new BadRequestException(MESSAGES.ERROR.AUTH.OTP_EXPIRED);
        }

        if (otp !== verification.otp) {
          throw new BadRequestException(MESSAGES.ERROR.AUTH.INVALID_OTP);
        }

        await this.phoneVerificationRepository.markAsVerified(verification.id);
      }
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id, ipAddress);

    // Generate tokens
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    this.logger.log(
      `User logged in via OTP: ${email || phone}`,
      'AuthService',
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified,
        onboarding_completed: user.onboarding_completed,
        profile_completion_percentage: user.profile_completion_percentage,
      },
    };
  }

  // Multi-Step Registration Methods
  async registerInit(email: string, phone: string): Promise<{ tempUserId: string }> {
    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const existingUserByPhone = await this.userRepository.findByPhone(formattedPhone);
    if (existingUserByPhone) {
      throw new ConflictException('Phone number already registered');
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const emailOtp = this.UAT_OTP;
    const phoneOtp = this.UAT_OTP;

    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Temp registration expires in 1 hour

    // Create temp registration
    const tempReg = await this.tempRegistrationRepository.createTempRegistration({
      email,
      phone: formattedPhone,
      email_otp: emailOtp,
      phone_otp: phoneOtp,
      otp_expires_at: otpExpiresAt,
      expires_at: expiresAt,
    });

    // Send OTPs
    await this.emailService.sendVerificationEmail(email, emailOtp);
    await this.smsService.sendOTP(formattedPhone, phoneOtp);

    this.logger.log(
      `Registration initiated for ${email}${nodeEnv !== 'production' ? ' [TEST MODE - OTP: 123456]' : ''}`,
      'AuthService',
    );

    return { tempUserId: tempReg.id };
  }

  async verifyEmailRegistration(tempUserId: string, emailOtp: string): Promise<void> {
    const tempReg = await this.tempRegistrationRepository.findById(tempUserId);

    if (!tempReg) {
      throw new NotFoundException('Registration session not found');
    }

    if (new Date() > tempReg.expires_at) {
      await this.tempRegistrationRepository.deleteById(tempUserId);
      throw new BadRequestException('Registration session expired. Please start again.');
    }

    if (new Date() > tempReg.otp_expires_at) {
      throw new BadRequestException('OTP expired. Please request a new one.');
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const validOtp = this.UAT_OTP;

    if (emailOtp !== validOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.tempRegistrationRepository.markEmailVerified(tempUserId);

    this.logger.log(`Email verified for temp registration: ${tempUserId}`, 'AuthService');
  }

  async verifyPhoneRegistration(tempUserId: string, phoneOtp: string): Promise<void> {
    const tempReg = await this.tempRegistrationRepository.findById(tempUserId);

    if (!tempReg) {
      throw new NotFoundException('Registration session not found');
    }

    if (!tempReg.email_verified) {
      throw new BadRequestException('Please verify email first');
    }

    if (new Date() > tempReg.expires_at) {
      await this.tempRegistrationRepository.deleteById(tempUserId);
      throw new BadRequestException('Registration session expired. Please start again.');
    }

    if (new Date() > tempReg.otp_expires_at) {
      throw new BadRequestException('OTP expired. Please request a new one.');
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const validOtp = this.UAT_OTP;

    if (phoneOtp !== validOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.tempRegistrationRepository.markPhoneVerified(tempUserId);

    this.logger.log(`Phone verified for temp registration: ${tempUserId}`, 'AuthService');
  }

  async completeRegistration(
    tempUserId: string,
    password: string,
    profileFor: string,
    createdBy: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    const tempReg = await this.tempRegistrationRepository.findById(tempUserId);

    if (!tempReg) {
      throw new NotFoundException('Registration session not found');
    }

    if (!tempReg.email_verified || !tempReg.phone_verified) {
      throw new BadRequestException('Please complete email and phone verification first');
    }

    if (new Date() > tempReg.expires_at) {
      await this.tempRegistrationRepository.deleteById(tempUserId);
      throw new BadRequestException('Registration session expired. Please start again.');
    }

    // Create user account
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = await this.userRepository.create({
      email: tempReg.email,
      phone: tempReg.phone,
      password_hash: hashedPassword,
      email_verified: true,
      phone_verified: true,
      profile_for: profileFor,
      created_by: createdBy,
    });

    // Delete temp registration
    await this.tempRegistrationRepository.deleteById(tempUserId);

    // Generate tokens and create session
    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    this.logger.log(`Registration completed for user: ${user.email}`, 'AuthService');

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified,
        onboarding_completed: user.onboarding_completed,
        profile_completion_percentage: user.profile_completion_percentage,
      },
    };
  }
}
