import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Transport } from "@nestjs/microservices";
import { HttpModule } from "./http.module";
import { MicroserviceModule } from "./microservice.module";

async function bootstrap() {
  const http = await NestFactory.create(HttpModule, new FastifyAdapter());
  await http.listen(process.env.PORT ?? 3000, process.env.HOST ?? "0.0.0.0");

  const microservice = await NestFactory.createMicroservice(
    MicroserviceModule,
    {
      name: "RMQ_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost"],
        queue: "default_queue",
        queueOptions: { durable: false },
      },
    }
  );

  await microservice.listen();
}

bootstrap();
