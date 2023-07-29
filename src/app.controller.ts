import { randomUUID } from "node:crypto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from "@nestjs/common";

import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { Cache } from "cache-manager";

import { CreateQueryDto } from "./create-query.dto";
import { HttpClient } from "./http.client";
import { ParseCPFPipe } from "./parse-cpf.pipe";
import { RMQ_SERVICE } from "./tokens";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject(RMQ_SERVICE) private readonly client: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  @Post("api/beneficios")
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
      this.logger.log(`${id} Números dos benefícios: ${cacheValue}`);
      return;
    }

    const { cpf, login, senha } = createQueryDto;

    try {
      const baseUrl =
        "http://extratoblubeapp-env.eba-mvegshhd.sa-east-1.elasticbeanstalk.com";

      const { headers } = await HttpClient.request(`${baseUrl}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      const authorization = headers.get("Authorization");
      if (!authorization) throw new Error("Authorization not found");

      const { data } = await HttpClient.request<{
        beneficios: Array<{ nb: string }>;
      }>(`${baseUrl}/offline/listagem/${cpf}`, { headers: { authorization } });

      const beneficios = new Array<string>();

      for (const beneficio of data.beneficios) {
        if (beneficio.nb === "Matrícula não encontrada!") {
          this.logger.log(`${id} Benefícios not found in external api`);
          break;
        }

        beneficios.push(beneficio.nb);
      }

      await this.cacheManager.set(cacheKey, beneficios, 1000 * 60 * 60 * 24);

      if (beneficios.length) {
        await this.elasticsearchService.index({
          index: "konsi",
          document: { cpf, beneficios, createdAt: Date.now() },
        });
      }

      this.logger.log(`${id} Números dos benefícios: ${beneficios}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Get("/api/beneficios/:cpf")
  async read(@Param("cpf", ParseCPFPipe) cpf: string) {
    const result = await this.elasticsearchService.search({
      index: "konsi",
      query: { match: { cpf } },
    });

    return result.hits.hits;
  }
}
