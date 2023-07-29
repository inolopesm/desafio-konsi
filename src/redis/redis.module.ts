import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  providers: [
    {
      provide: RedisService,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisService = new RedisService();
        const url = configService.getOrThrow("REDIS_URL");
        await redisService.connect(url);
        return redisService;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
