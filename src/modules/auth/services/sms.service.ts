import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { LoggerService } from '../../../common/services/logger.service';

@Injectable()
export class SmsService {
    private twilioClient: Twilio;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
    ) {
        const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

        if (
            accountSid &&
            authToken &&
            accountSid !== 'your-twilio-account-sid'
        ) {
            this.twilioClient = new Twilio(accountSid, authToken);
        }
    }

    async sendOTP(phone: string, otp: string): Promise<void> {
        const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
        const nodeEnv = this.configService.get<string>('NODE_ENV');

        // In UAT environment, skip actual SMS sending
        if (nodeEnv === 'uat') {
            this.logger.log(
                `[UAT MODE] OTP for ${phone}: ${otp} (Hardcoded OTP: 123456 will work for testing)`,
                'SmsService',
            );
            return;
        }

        const message = `Your Maithil Vivah verification code is: ${otp}. Valid for 10 minutes.`;

        try {
            if (!this.twilioClient) {
                this.logger.warn(
                    'Twilio client not configured. Skipping SMS send.',
                    'SmsService',
                );
                return;
            }

            await this.twilioClient.messages.create({
                body: message,
                from: fromNumber,
                to: phone,
            });

            this.logger.log(`OTP sent to ${phone}`, 'SmsService');
        } catch (error) {
            this.logger.error(
                `Failed to send OTP to ${phone}`,
                error.stack,
                'SmsService',
            );
            throw error;
        }
    }
}
