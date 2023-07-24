import { randomUUID } from "node:crypto";
import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { BeneficiosProvider } from "./beneficios";
import { CreateQueryDto } from "./create-query.dto";
import { RMQ_SERVICE } from "./tokens";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject(RMQ_SERVICE) private readonly client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly beneficiosProvider: BeneficiosProvider
  ) {}

  @Post("query")
  send(@Body() createQueryDto: CreateQueryDto) {
    const id = randomUUID();
    const data = { ...createQueryDto, id };
    this.client.emit("create-query", data);

    this.logger.log(
      `${id} Sended to create-query queue the data ${JSON.stringify(data)}`
    );
  }

  @MessagePattern("create-query")
  async handleMessage(@Payload() payload: CreateQueryDto & { id: string }) {
    const { id, ...createQueryDto } = payload;

    this.logger.log(
      `${id} Received on create-query queue the data ${JSON.stringify(payload)}`
    );

    const cacheKey = `create-query ${JSON.stringify(createQueryDto)}`;
    const cacheValue = await this.cacheManager.get(cacheKey);

    if (cacheValue) {
      this.logger.log(`${id} Result found in cache`);
      this.logger.log(`${id} Nº do benefício: ${cacheValue}`);
      return;
    }

    try {
      const result = await this.beneficiosProvider.findOne(createQueryDto);

      if (result instanceof Error) {
        const error = result;
        this.logger.error(`${id} ${error}`);
        return;
      }

      const { beneficio } = result;

      await this.cacheManager.set(cacheKey, beneficio, 1000 * 60 * 60 * 24);

      this.logger.log(`${id} Nº do benefício: ${beneficio}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
