import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './infrastructure/redis/redis.module';
import { SearchModule } from './infrastructure/search/search.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { LoggerModule } from './common/services/logger.module';
import { ProfilesModule } from './modules/profiles/profiles.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM module with PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNC') === 'true',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Logger service (global)
    LoggerModule,

    // Redis for caching and sessions
    RedisModule,

    // Elasticsearch for search
    SearchModule,

    // BullMQ for background jobs
    QueueModule,

    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


