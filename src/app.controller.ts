import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { RMQ_SERVICE } from "./tokens";
import { CreateQueryDto } from "./create-query.dto";

@Controller()
export class AppController {
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  @Post("query")
  send(@Body() createQueryDto: CreateQueryDto) {
    this.client.emit("create-query", createQueryDto);
  }

  @MessagePattern("create-query")
  handleMessage(@Payload() createQueryDto: CreateQueryDto) {
    console.log("received", createQueryDto);
  }
}
