import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RMQ_SERVICE } from "./tokens";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: RMQ_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost"],
          queue: "default_queue",
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
