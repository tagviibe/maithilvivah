import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { InterestRepository } from '@/modules/matching/repositories/interest.repository';

@Injectable()
export class ChatService {
    constructor(
        private readonly conversationRepository: ConversationRepository,
        private readonly messageRepository: MessageRepository,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        private readonly interestRepository: InterestRepository,
    ) { }

    // ─── Conversations ───

    async getOrCreateConversation(user1Id: string, user2Id: string): Promise<Conversation> {
        // Check if users are connected (accepted interest)
        const connectedIds = await this.interestRepository.getConnectedUserIds(user1Id);
        if (!connectedIds.includes(user2Id)) {
            throw new ForbiddenException('You can only chat with connected users (accepted interests)');
        }

        let conv = await this.conversationRepository.findByUsers(user1Id, user2Id);
        if (!conv) {
            conv = await this.conversationRepository.createConversation(user1Id, user2Id);
        }
        return conv;
    }

    async getConversations(userId: string): Promise<any[]> {
        const conversations = await this.conversationRepository.findByUserId(userId);

        if (conversations.length === 0) return [];

        // Collect other user IDs
        const otherUserIds = conversations.map(c =>
            c.user1_id === userId ? c.user2_id : c.user1_id,
        );

        // Fetch profiles
        const profiles = await this.profileRepository.find({
            where: { user_id: In(otherUserIds) },
        });
        const profileMap = new Map(profiles.map(p => [p.user_id, p]));

        return conversations.map(conv => {
            const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;
            const profile = profileMap.get(otherUserId);
            const unreadCount = conv.user1_id === userId
                ? conv.unread_count_user1
                : conv.unread_count_user2;

            return {
                id: conv.id,
                otherUserId,
                otherUser: profile ? {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    gender: profile.gender,
                } : null,
                lastMessage: conv.last_message,
                lastMessageBy: conv.last_message_by,
                lastMessageAt: conv.last_message_at,
                unreadCount,
                createdAt: conv.created_at,
            };
        });
    }

    // ─── Messages ───

    async getMessages(conversationId: string, userId: string, page: number = 1, limit: number = 50) {
        // Verify user is part of conversation
        const conv = await this.conversationRepository.findOne({ where: { id: conversationId } });
        if (!conv || (conv.user1_id !== userId && conv.user2_id !== userId)) {
            return { messages: [], total: 0 };
        }

        return this.messageRepository.findByConversation(conversationId, page, limit);
    }

    async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message | null> {
        const conv = await this.conversationRepository.findOne({ where: { id: conversationId } });
        if (!conv || (conv.user1_id !== senderId && conv.user2_id !== senderId)) {
            return null;
        }

        const receiverId = conv.user1_id === senderId ? conv.user2_id : conv.user1_id;

        const message = await this.messageRepository.createMessage({
            conversation_id: conversationId,
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            message_type: 'text',
        });

        // Update conversation
        const unreadField = conv.user1_id === receiverId ? 'unread_count_user1' : 'unread_count_user2';
        await this.conversationRepository.update(conv.id, {
            last_message: content.length > 100 ? content.substring(0, 100) + '...' : content,
            last_message_by: senderId,
            last_message_at: new Date(),
            [unreadField]: () => `${unreadField} + 1`,
        });

        return message;
    }

    async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
        await this.messageRepository.markAsRead(conversationId, userId);

        // Reset unread count
        const conv = await this.conversationRepository.findOne({ where: { id: conversationId } });
        if (conv) {
            const unreadField = conv.user1_id === userId ? 'unread_count_user1' : 'unread_count_user2';
            await this.conversationRepository.update(conv.id, { [unreadField]: 0 });
        }
    }

    async getTotalUnread(userId: string): Promise<number> {
        return this.messageRepository.countUnread(userId);
    }

    async deleteConversation(conversationId: string, userId: string): Promise<void> {
        const conv = await this.conversationRepository.findOne({ where: { id: conversationId } });
        if (!conv) return;
        if (conv.user1_id !== userId && conv.user2_id !== userId) {
            throw new ForbiddenException('You are not part of this conversation');
        }
        // Delete all messages first, then the conversation
        await this.messageRepository.deleteByConversationId(conversationId);
        await this.conversationRepository.delete(conversationId);
    }
}
