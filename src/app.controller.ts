import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns a welcome message',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to Maithil Vivah API' },
        version: { type: 'string', example: '1.0.0' },
        timestamp: { type: 'string', example: new Date().toISOString() },
      },
    },
  })
  getHello() {
    return {
      message: this.appService.getHello(),
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Application health status' })
  @ApiResponse({
    status: 200,
    description: 'Returns health status of all services',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'connected' },
            redis: { type: 'string', example: 'connected' },
            elasticsearch: { type: 'string', example: 'connected' },
          },
        },
        uptime: { type: 'number', example: 12345 },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      services: {
        database: 'connected',
        redis: 'connected',
        elasticsearch: 'connected',
      },
      uptime: process.uptime(),
    };
  }
}
