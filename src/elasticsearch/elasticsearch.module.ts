import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ELASTICSEARCH_MODULE_OPTIONS } from "@nestjs/elasticsearch/dist/elasticsearch.constants";

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: ELASTICSEARCH_MODULE_OPTIONS,
      useFactory: (configService: ConfigService) => ({
        node: configService.getOrThrow("ELASTICSEARCH_URL"),
      }),
    },
    ElasticsearchService,
  ],
  exports: [ElasticsearchService],
})
export class ElasticSearchModule {}
