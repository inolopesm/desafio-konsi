import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class MicroserviceController {
  @MessagePattern("message")
  handleMessage(@Payload() data: string) {
    console.log("received", data);
  }
}
