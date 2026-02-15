import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    conversation_id: string;

    @Column('uuid')
    @Index()
    sender_id: string;

    @Column('uuid')
    receiver_id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', default: 'text' })
    message_type: string; // text, image, system

    @Column({ type: 'boolean', default: false })
    is_read: boolean;

    @Column({ type: 'timestamp', nullable: true })
    read_at: Date;

    @CreateDateColumn()
    created_at: Date;
}
