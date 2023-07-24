import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { BeneficiosModule } from "./beneficios";
import { AppController } from "./app.controller";
import { RMQ_SERVICE } from "./tokens";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisCacheStore } from "./redis.cache-store";

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
