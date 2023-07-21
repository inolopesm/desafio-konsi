import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { HttpController } from "./http.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "RMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost"],
          queue: "default_queue",
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [HttpController],
})
export class HttpModule {}
