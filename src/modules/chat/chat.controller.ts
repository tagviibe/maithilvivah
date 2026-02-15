import { Controller, Get, Post, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatGateway: ChatGateway,
    ) { }

    @Get('conversations')
    async getConversations(@Req() req: any) {
        const userId = req.user.userId;
        const conversations = await this.chatService.getConversations(userId);
        return { success: true, data: conversations };
    }

    @Post('conversations/:otherUserId')
    async getOrCreateConversation(
        @Req() req: any,
        @Param('otherUserId') otherUserId: string,
    ) {
        const userId = req.user.userId;
        const conversation = await this.chatService.getOrCreateConversation(userId, otherUserId);
        return { success: true, data: conversation };
    }

    @Get('conversations/:conversationId/messages')
    async getMessages(
        @Req() req: any,
        @Param('conversationId') conversationId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
    ) {
        const userId = req.user.userId;
        const result = await this.chatService.getMessages(
            conversationId,
            userId,
            parseInt(page) || 1,
            parseInt(limit) || 50,
        );
        return { success: true, data: result };
    }

    @Post('conversations/:conversationId/messages')
    async sendMessage(
        @Req() req: any,
        @Param('conversationId') conversationId: string,
        @Body() body: { content: string },
    ) {
        const userId = req.user.userId;
        const message = await this.chatService.sendMessage(conversationId, userId, body.content);

        // Broadcast via socket for real-time delivery to the other user
        if (message) {
            await this.chatGateway.broadcastMessage(message);
        }

        return { success: true, data: message };
    }

    @Delete('conversations/:conversationId')
    async deleteConversation(
        @Req() req: any,
        @Param('conversationId') conversationId: string,
    ) {
        const userId = req.user.userId;
        await this.chatService.deleteConversation(conversationId, userId);
        return { success: true, message: 'Conversation deleted' };
    }

    @Get('unread')
    async getUnreadCount(@Req() req: any) {
        const userId = req.user.userId;
        const count = await this.chatService.getTotalUnread(userId);
        return { success: true, data: { count } };
    }
}
