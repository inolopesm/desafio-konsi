import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQ_SERVICE } from "./rabbitmq.constants";

@Global()
@Module({
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
  exports: [RMQ_SERVICE],
})
export class RabbitMQModule {}
