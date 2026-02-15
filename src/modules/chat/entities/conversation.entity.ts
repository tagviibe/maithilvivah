import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('conversations')
@Index(['user1_id', 'user2_id'], { unique: true })
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    user1_id: string;

    @Column('uuid')
    @Index()
    user2_id: string;

    @Column({ type: 'text', nullable: true })
    last_message: string;

    @Column({ type: 'uuid', nullable: true })
    last_message_by: string;

    @Column({ type: 'timestamp', nullable: true })
    last_message_at: Date;

    @Column({ type: 'int', default: 0 })
    unread_count_user1: number;

    @Column({ type: 'int', default: 0 })
    unread_count_user2: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
