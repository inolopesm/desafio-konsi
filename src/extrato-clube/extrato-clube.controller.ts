import { randomUUID } from "node:crypto";
import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { firstValueFrom } from "rxjs";

import {
  MessagePattern,
  type ClientProxy,
  Payload,
} from "@nestjs/microservices";

import { RMQ_SERVICE } from "../rabbitmq";
import { RedisService } from "../redis";
import { ExtratoClubeService, FindNBsResult } from "./extrato-clube.service";
import { FindNBsDto } from "./find-nbs.dto";
import { FindNBDto } from "./find-nb.dto";

type WithId<T> = T & { id: string };

@Controller()
export class ExtratoClubeController {
  private readonly logger = new Logger(ExtratoClubeController.name);

  constructor(
    @Inject(RMQ_SERVICE) private readonly rabbitMQ: ClientProxy,
    private readonly elasticSearch: ElasticsearchService,
    private readonly redis: RedisService,
    private readonly service: ExtratoClubeService
  ) {}

  /** [SENDER] Find Números de Benefícios (NBs) */
  @Post("api/extrato-clube/v2")
  async findNBsSender(@Body() findNBsDto: FindNBsDto) {
    const id = randomUUID();
    const source = this.rabbitMQ.emit("find-nbs", { id, ...findNBsDto });
    await firstValueFrom(source);
    this.logger.log(`[${id}] SEND(find-nbs): ${JSON.stringify(findNBsDto)}`);
  }

  /**
   * [SENDER] Find Número de Benefício (NB)
   * @deprecated
   */
  @Post("api/extrato-clube/v1")
  async findNBSender(@Body() findNBDto: FindNBDto) {
    const id = randomUUID();
    const source = this.rabbitMQ.emit("find-nb", { id, ...findNBDto });
    await firstValueFrom(source);
    this.logger.log(`[${id}] SEND(find-nb): ${JSON.stringify(findNBDto)}`);
  }

  /** [RECEIVER] Find Números de Benefícios (NBs) */
  @MessagePattern("find-nbs")
  async findNBsReceiver(@Payload() payload: WithId<FindNBsDto>) {
    const { id, ...dto } = payload;
    const { cpf, login, senha } = dto;

    this.logger.log(`[${id}] RECEIVED(find-nbs): ${JSON.stringify(dto)}`);

    const cacheKey = JSON.stringify({ queue: "find-nbs", payload: dto });
    const cacheValue = await this.redis.get<FindNBsResult>(cacheKey);

    if (cacheValue) {
      this.logger.log(`[${id}] RESULT(cache): ${JSON.stringify(cacheValue)}`);
      return;
    }

    try {
      const loginResult = await this.service.login({ login, senha });

      if (loginResult instanceof Error) {
        const error = loginResult;
        this.logger.error(`[${id}] ${String(error)}`);
        return;
      }

      const { authorization } = loginResult;

      const findResult = await this.service.findNBs({ authorization, cpf });

      if (findResult instanceof Error) {
        const error = findResult;
        this.logger.warn(`[${id}] ${String(error)}`);
        return;
      }

      const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
      await this.redis.set<FindNBsResult>(cacheKey, findResult, ONE_DAY_IN_MS);

      await this.elasticSearch.index({
        index: "konsi",
        document: { cpf, nbs: findResult.nbs, createdAt: Date.now() },
      });

      this.logger.log(`[${id}] RESULT: ${JSON.stringify(findResult.nbs)}`);
    } catch (error) {
      this.logger.error(`[${id}] ${String(error)}`);
    }
  }

  /**
   * [RECEIVER] Find Número de Benefício (NB)
   * @deprecated
   */
  @MessagePattern("find-nb")
  async findNBReceiver(@Payload() payload: WithId<FindNBDto>) {
    const { id, ...dto } = payload;
    const { user, pass, cpf } = dto;
    this.logger.log(`[${id}] RECEIVED(find-nb): ${JSON.stringify(dto)}`);

    const cacheKey = JSON.stringify({ queue: "find-nb", payload: dto });
    const cacheValue = await this.redis.get<{ nb: string }>(cacheKey);

    if (cacheValue) {
      this.logger.log(`[${id}] RESULT(cache): ${JSON.stringify(cacheValue)}`);
      return;
    }

    try {
      const result = await this.service.findNB(user, pass, cpf);

      if (result instanceof Error) {
        const error = result;
        this.logger.warn(`[${id}] ${String(error)}`);
        return;
      }

      const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
      await this.redis.set<{ nb: string }>(cacheKey, result, ONE_DAY_IN_MS);

      await this.elasticSearch.index({
        index: "konsi",
        document: { cpf, nbs: [result.nb], createdAt: Date.now() },
      });

      this.logger.log(`[${id}] RESULT: ${JSON.stringify(result.nb)}`);
    } catch (error) {
      this.logger.error(`[${id}] ${String(error)}`);
    }
  }
}
