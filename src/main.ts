import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

const env = {
  get(key: string) {
    return process.env[key];
  },

  getOrThrow(key: string) {
    const value = process.env[key];

    if (value === undefined) {
      throw new TypeError(`Configuration key "${key}" does not exist`);
    }

    return value;
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [env.getOrThrow("RMQ_URL")],
      queue: env.getOrThrow("RMQ_QUEUE"),
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(env.get("PORT") ?? 3000, env.get("HOST") ?? "0.0.0.0");
}

bootstrap();
