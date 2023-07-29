import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { BeneficiosModule } from "./beneficios";
import { RedisCacheStore } from "./redis.cache-store";
import { RMQ_SERVICE } from "./app.constants";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const url = configService.getOrThrow("REDIS_URL");
        const redisCacheStore = new RedisCacheStore();
        await redisCacheStore.connect(url);
        return { store: redisCacheStore };
      },
    }),
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.getOrThrow("ELASTICSEARCH_URL"),
      }),
    }),
    BeneficiosModule,
  ],
  providers: [
    {
      provide: RMQ_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow("RMQ_URL")],
            queue: configService.getOrThrow("RMQ_QUEUE"),
            queueOptions: { durable: false },
          },
        });
      },
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
