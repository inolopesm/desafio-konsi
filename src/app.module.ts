import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { RMQ_SERVICE } from "./tokens";
import { BeneficiosModule } from "./beneficios/beneficios.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BeneficiosModule],
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
