import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
    constructor(private dataSource: DataSource) {
        super(Message, dataSource.createEntityManager());
    }

    async findByConversation(conversationId: string, page: number = 1, limit: number = 50): Promise<{ messages: Message[]; total: number }> {
        const [messages, total] = await this.findAndCount({
            where: { conversation_id: conversationId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { messages: messages.reverse(), total };
    }

    async createMessage(data: Partial<Message>): Promise<Message> {
        const msg = this.create(data);
        return this.save(msg);
    }

    async markAsRead(conversationId: string, receiverId: string): Promise<void> {
        await this.update(
            { conversation_id: conversationId, receiver_id: receiverId, is_read: false },
            { is_read: true, read_at: new Date() },
        );
    }

    async countUnread(userId: string): Promise<number> {
        return this.count({
            where: { receiver_id: userId, is_read: false },
        });
    }

    async deleteByConversationId(conversationId: string): Promise<void> {
        await this.delete({ conversation_id: conversationId });
    }
}
