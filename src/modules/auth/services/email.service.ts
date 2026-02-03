import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { LoggerService } from '../../../common/services/logger.service';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) {
        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
        if (apiKey) {
            sgMail.setApiKey(apiKey);
        }
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

        const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@maithilvivah.com';
        const fromName = this.configService.get<string>('SENDGRID_FROM_NAME') || 'Maithil Vivah';

        try {
            const msg = {
                to: email,
                from: {
                    email: fromEmail,
                    name: fromName,
                },
                subject: 'Verify Your Email - Maithil Vivah',
                html: `
                    <h1>Welcome to Maithil Vivah!</h1>
                    <p>Please verify your email by clicking the link below:</p>
                    <a href="${verificationLink}">Verify Email</a>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                `,
            };

            await sgMail.send(msg);

            this.logger.log(
                `Verification email sent to: ${email}`,
                'EmailService',
            );
        } catch (error) {
            this.logger.error(
                `Failed to send verification email to ${email}`,
                error,
                'EmailService',
            );
            throw error;
        }
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@maithilvivah.com';
        const fromName = this.configService.get<string>('SENDGRID_FROM_NAME') || 'Maithil Vivah';

        try {
            const msg = {
                to: email,
                from: {
                    email: fromEmail,
                    name: fromName,
                },
                subject: 'Reset Your Password - Maithil Vivah',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>You requested to reset your password. Click the link below:</p>
                    <p><a href="${resetLink}">Reset Password</a></p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            };

            await sgMail.send(msg);

            this.logger.log(
                `Password reset email sent to: ${email}`,
                'EmailService',
            );
        } catch (error) {
            this.logger.error(
                `Failed to send password reset email to ${email}`,
                error,
                'EmailService',
            );
            throw error;
        }
    }
}
