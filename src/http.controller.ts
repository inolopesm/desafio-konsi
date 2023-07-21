import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Controller()
export class HttpController {
  constructor(@Inject("RMQ_SERVICE") private client: ClientProxy) {}

  @Post("send")
  send(@Body() { message }: any) {
    this.client.emit("message", { message, createdAt: Date.now() });
  }
}
