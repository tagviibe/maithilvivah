import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
    namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // userId -> Set<socketId>
    private userSockets = new Map<string, Set<string>>();

    constructor(
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // ─── Auth on connect ───
    async handleConnection(client: Socket) {
        try {
            const token =
                client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');

            if (!token) {
                client.disconnect();
                return;
            }

            const secret = this.configService.get<string>('JWT_SECRET') || 'default-jwt-secret';
            const payload = this.jwtService.verify(token, { secret });
            const userId = payload.sub;

            if (!userId) {
                client.disconnect();
                return;
            }

            // Store mapping
            (client as any).userId = userId;
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)!.add(client.id);

            // Join personal room
            client.join(`user:${userId}`);

            // Send unread count on connect
            const unread = await this.chatService.getTotalUnread(userId);
            client.emit('unread_count', { count: unread });

            console.log(`[Chat] User ${userId} connected (socket: ${client.id})`);
        } catch (err) {
            console.error('[Chat] Auth failed:', err.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = (client as any).userId;
        if (userId && this.userSockets.has(userId)) {
            this.userSockets.get(userId)!.delete(client.id);
            if (this.userSockets.get(userId)!.size === 0) {
                this.userSockets.delete(userId);
            }
        }
        console.log(`[Chat] Socket ${client.id} disconnected`);
    }

    // ─── Join conversation room ───
    @SubscribeMessage('join_conversation')
    async handleJoinConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string },
    ) {
        const userId = (client as any).userId;
        if (!userId) return;

        client.join(`conv:${data.conversationId}`);

        // Mark messages as read
        await this.chatService.markMessagesAsRead(data.conversationId, userId);

        // Notify sender that messages were read
        this.server.to(`conv:${data.conversationId}`).emit('messages_read', {
            conversationId: data.conversationId,
            readBy: userId,
        });
    }

    // ─── Leave conversation room ───
    @SubscribeMessage('leave_conversation')
    handleLeaveConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string },
    ) {
        client.leave(`conv:${data.conversationId}`);
    }

    // ─── Send message ───
    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string; content: string },
    ) {
        const userId = (client as any).userId;
        if (!userId || !data.content?.trim()) return;

        const message = await this.chatService.sendMessage(
            data.conversationId,
            userId,
            data.content.trim(),
        );

        if (message) {
            // Emit to all in the conversation room
            this.server.to(`conv:${data.conversationId}`).emit('new_message', {
                id: message.id,
                conversationId: message.conversation_id,
                senderId: message.sender_id,
                receiverId: message.receiver_id,
                content: message.content,
                messageType: message.message_type,
                isRead: message.is_read,
                createdAt: message.created_at,
            });

            // Also notify receiver's personal room (for conversation list update)
            this.server.to(`user:${message.receiver_id}`).emit('conversation_updated', {
                conversationId: message.conversation_id,
                lastMessage: message.content,
                lastMessageBy: message.sender_id,
                lastMessageAt: message.created_at,
            });

            // Update unread count for receiver
            const unread = await this.chatService.getTotalUnread(message.receiver_id);
            this.server.to(`user:${message.receiver_id}`).emit('unread_count', { count: unread });
        }
    }

    // ─── Broadcast from REST API (no DB save, just emit) ───
    async broadcastMessage(message: any) {
        const payload = {
            id: message.id,
            conversationId: message.conversation_id,
            senderId: message.sender_id,
            receiverId: message.receiver_id,
            content: message.content,
            messageType: message.message_type,
            isRead: message.is_read,
            createdAt: message.created_at,
        };

        // Emit to conversation room
        this.server.to(`conv:${message.conversation_id}`).emit('new_message', payload);

        // Notify receiver's personal room
        this.server.to(`user:${message.receiver_id}`).emit('conversation_updated', {
            conversationId: message.conversation_id,
            lastMessage: message.content,
            lastMessageBy: message.sender_id,
            lastMessageAt: message.created_at,
        });

        // Update unread count for receiver
        const unread = await this.chatService.getTotalUnread(message.receiver_id);
        this.server.to(`user:${message.receiver_id}`).emit('unread_count', { count: unread });
    }

    // ─── Typing indicator ───
    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string; isTyping: boolean },
    ) {
        const userId = (client as any).userId;
        if (!userId) return;

        client.to(`conv:${data.conversationId}`).emit('user_typing', {
            conversationId: data.conversationId,
            userId,
            isTyping: data.isTyping,
        });
    }

    // ─── Mark as read ───
    @SubscribeMessage('mark_read')
    async handleMarkRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string },
    ) {
        const userId = (client as any).userId;
        if (!userId) return;

        await this.chatService.markMessagesAsRead(data.conversationId, userId);

        this.server.to(`conv:${data.conversationId}`).emit('messages_read', {
            conversationId: data.conversationId,
            readBy: userId,
        });

        const unread = await this.chatService.getTotalUnread(userId);
        client.emit('unread_count', { count: unread });
    }
}
