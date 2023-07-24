import { randomUUID } from "node:crypto";
import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { BeneficiosProvider } from "./beneficios";
import { CreateQueryDto } from "./create-query.dto";
import { RMQ_SERVICE } from "./tokens";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject(RMQ_SERVICE) private readonly client: ClientProxy,
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

    try {
      const result = await this.beneficiosProvider.findOne(createQueryDto);

      if (result instanceof Error) {
        const error = result;
        this.logger.error(`${id} ${error}`);
        return;
      }

      const { beneficio } = result;
      this.logger.log(`${id} Nº do benefício: ${beneficio}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
