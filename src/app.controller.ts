import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { RMQ_SERVICE } from "./tokens";

@Controller()
export class AppController {
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  @Post("send")
  send(@Body() { message }: any) {
    this.client.emit("message", { message, createdAt: Date.now() });
  }

  @MessagePattern("message")
  handleMessage(@Payload() data: string) {
    console.log("received", data);
  }
}
