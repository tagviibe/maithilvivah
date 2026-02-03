import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Ip,
    Headers,
    UseGuards,
    Get,
    Delete,
    Param,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendPhoneOtpDto } from './dto/send-phone-otp.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { MESSAGES, API_ROUTES } from '../../common/constants';

@ApiTags('Authentication')
@Controller(API_ROUTES.AUTH.BASE)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post(API_ROUTES.AUTH.REGISTER)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user account' })
    @SwaggerResponse({
        status: 201,
        description: 'User registered successfully',
    })
    @SwaggerResponse({
        status: 409,
        description: 'Email or phone already exists',
    })
    async register(@Body() registerDto: RegisterDto) {
        const result = await this.authService.register(registerDto);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.REGISTRATION_SUCCESS,
            data: result,
        };
    }

    @Post(API_ROUTES.AUTH.VERIFY_EMAIL)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify email with token' })
    @SwaggerResponse({
        status: 200,
        description: 'Email verified successfully',
    })
    @SwaggerResponse({
        status: 400,
        description: 'Invalid or expired token',
    })
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        await this.authService.verifyEmail(verifyEmailDto.token);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.EMAIL_VERIFIED,
        };
    }

    @Post(API_ROUTES.AUTH.LOGIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @SwaggerResponse({
        status: 200,
        description: 'Login successful',
    })
    @SwaggerResponse({
        status: 401,
        description: 'Invalid credentials or account locked',
    })
    async login(
        @Body() loginDto: LoginDto,
        @Ip() ipAddress: string,
        @Headers('user-agent') userAgent: string,
    ) {
        const result = await this.authService.login(loginDto, ipAddress, userAgent);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.LOGIN_SUCCESS,
            data: result,
        };
    }

    @Post(API_ROUTES.AUTH.REFRESH)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @SwaggerResponse({
        status: 200,
        description: 'Token refreshed successfully',
    })
    @SwaggerResponse({
        status: 401,
        description: 'Invalid or expired refresh token',
    })
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Ip() ipAddress: string,
        @Headers('user-agent') userAgent: string,
    ) {
        const result = await this.authService.refreshToken(
            refreshTokenDto.refreshToken,
            ipAddress,
            userAgent,
        );
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.TOKEN_REFRESHED,
            data: result,
        };
    }

    @Post(API_ROUTES.AUTH.FORGOT_PASSWORD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset' })
    @SwaggerResponse({
        status: 200,
        description: 'Password reset email sent if account exists',
    })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.PASSWORD_RESET_SENT,
        };
    }

    @Post(API_ROUTES.AUTH.RESET_PASSWORD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password with token' })
    @SwaggerResponse({
        status: 200,
        description: 'Password reset successfully',
    })
    @SwaggerResponse({
        status: 400,
        description: 'Invalid or expired token',
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
        );
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.PASSWORD_RESET_SUCCESS,
        };
    }

    @Post(API_ROUTES.AUTH.LOGOUT)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate session' })
    @SwaggerResponse({
        status: 200,
        description: 'Logged out successfully',
    })
    async logout(@CurrentUser() user: { userId: string }) {
        await this.authService.logout(user.userId);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.LOGOUT_SUCCESS,
        };
    }

    @Get(API_ROUTES.AUTH.ME)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile' })
    @SwaggerResponse({
        status: 200,
        description: 'User profile retrieved',
    })
    async getCurrentUser(@CurrentUser() user: { userId: string; email: string }) {
        const userData = await this.authService.validateUser(user.userId);
        return {
            success: true,
            message: MESSAGES.SUCCESS.COMMON,
            data: {
                id: userData.id,
                email: userData.email,
                emailVerified: userData.email_verified,
                phoneVerified: userData.phone_verified,
                onboardingCompleted: userData.onboarding_completed,
                profileCompletionPercentage: userData.profile_completion_percentage,
                accountStatus: userData.account_status,
            },
        };
    }

    @Post(API_ROUTES.AUTH.SEND_PHONE_OTP)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send OTP to phone number' })
    @SwaggerResponse({
        status: 200,
        description: 'OTP sent successfully',
    })
    async sendPhoneOtp(@Body() sendPhoneOtpDto: SendPhoneOtpDto) {
        await this.authService.sendPhoneOTP(sendPhoneOtpDto.phone);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.OTP_SENT,
        };
    }

    @Post(API_ROUTES.AUTH.VERIFY_PHONE)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify phone with OTP' })
    @SwaggerResponse({
        status: 200,
        description: 'Phone verified successfully',
    })
    @SwaggerResponse({
        status: 400,
        description: 'Invalid or expired OTP',
    })
    async verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto) {
        await this.authService.verifyPhone(verifyPhoneDto.phone, verifyPhoneDto.otp);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.PHONE_VERIFIED,
        };
    }

    @Post(API_ROUTES.AUTH.RESEND_VERIFICATION)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resend email verification' })
    @SwaggerResponse({
        status: 200,
        description: 'Verification email sent',
    })
    async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
        await this.authService.resendEmailVerification(resendVerificationDto.email);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.VERIFICATION_EMAIL_SENT,
        };
    }

    @Post(API_ROUTES.AUTH.CHANGE_PASSWORD)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change password (authenticated)' })
    @SwaggerResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @SwaggerResponse({
        status: 400,
        description: 'Current password is incorrect',
    })
    async changePassword(
        @CurrentUser() user: { userId: string },
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        await this.authService.changePassword(
            user.userId,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        );
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.PASSWORD_CHANGED,
        };
    }

    @Post(API_ROUTES.AUTH.CHANGE_EMAIL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change email address (authenticated)' })
    @SwaggerResponse({
        status: 200,
        description: 'Email changed successfully',
    })
    @SwaggerResponse({
        status: 400,
        description: 'Password is incorrect',
    })
    @SwaggerResponse({
        status: 409,
        description: 'Email already exists',
    })
    async changeEmail(
        @CurrentUser() user: { userId: string },
        @Body() changeEmailDto: ChangeEmailDto,
    ) {
        await this.authService.changeEmail(
            user.userId,
            changeEmailDto.newEmail,
            changeEmailDto.password,
        );
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.EMAIL_CHANGED,
        };
    }

    @Get(API_ROUTES.AUTH.SESSIONS)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all active sessions' })
    @SwaggerResponse({
        status: 200,
        description: 'Sessions retrieved successfully',
    })
    async getSessions(@CurrentUser() user: { userId: string }) {
        const sessions = await this.authService.getAllSessions(user.userId);
        return {
            success: true,
            message: MESSAGES.SUCCESS.COMMON,
            data: sessions.map(session => ({
                id: session.id,
                ipAddress: session.ip_address,
                userAgent: session.user_agent,
                createdAt: session.created_at,
                expiresAt: session.expires_at,
            })),
        };
    }

    @Delete(`${API_ROUTES.AUTH.SESSIONS}/:sessionId`)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Revoke a specific session' })
    @SwaggerResponse({
        status: 200,
        description: 'Session revoked successfully',
    })
    @SwaggerResponse({
        status: 404,
        description: 'Session not found',
    })
    async revokeSession(
        @CurrentUser() user: { userId: string },
        @Param('sessionId') sessionId: string,
    ) {
        await this.authService.revokeSession(user.userId, sessionId);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.SESSION_REVOKED,
        };
    }

    @Post(API_ROUTES.AUTH.LOGOUT_ALL)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout from all devices' })
    @SwaggerResponse({
        status: 200,
        description: 'Logged out from all devices',
    })
    async logoutAll(@CurrentUser() user: { userId: string }) {
        await this.authService.logoutAllDevices(user.userId);
        return {
            success: true,
            message: MESSAGES.SUCCESS.AUTH.ALL_SESSIONS_LOGGED_OUT,
        };
    }
}
