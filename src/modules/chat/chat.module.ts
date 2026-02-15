import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { Interest } from '@/modules/matching/entities/interest.entity';
import { InterestRepository } from '@/modules/matching/repositories/interest.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation, Message, Profile, Interest]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'default-jwt-secret',
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [ChatController],
    providers: [
        ChatService,
        ChatGateway,
        ConversationRepository,
        MessageRepository,
        InterestRepository,
    ],
    exports: [ChatService],
})
export class ChatModule { }
