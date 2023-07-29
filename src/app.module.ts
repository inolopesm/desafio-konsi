import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ElasticSearchModule } from "./elasticsearch";
import { ExtratoClubeModule } from "./extrato-clube";
import { RabbitMQModule } from "./rabbitmq";
import { RedisModule } from "./redis";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule,
    ElasticSearchModule,
    RedisModule,
    ExtratoClubeModule,
  ],
})
export class AppModule {}
0;
