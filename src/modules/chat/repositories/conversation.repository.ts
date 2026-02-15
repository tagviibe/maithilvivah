import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationRepository extends Repository<Conversation> {
    constructor(private dataSource: DataSource) {
        super(Conversation, dataSource.createEntityManager());
    }

    async findByUsers(user1Id: string, user2Id: string): Promise<Conversation | null> {
        return this.findOne({
            where: [
                { user1_id: user1Id, user2_id: user2Id },
                { user1_id: user2Id, user2_id: user1Id },
            ],
        });
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        return this.find({
            where: [
                { user1_id: userId },
                { user2_id: userId },
            ],
            order: { last_message_at: 'DESC' },
        });
    }

    async createConversation(user1Id: string, user2Id: string): Promise<Conversation> {
        const conv = this.create({
            user1_id: user1Id,
            user2_id: user2Id,
        });
        return this.save(conv);
    }
}
