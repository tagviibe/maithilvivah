import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                node: configService.get('ELASTICSEARCH_NODE'),
                maxRetries: 10,
                requestTimeout: 60000,
                pingTimeout: 60000,
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [ElasticsearchModule],
})
export class SearchModule { }
