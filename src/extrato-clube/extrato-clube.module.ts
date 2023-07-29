import { Module } from "@nestjs/common";
import { ExtratoClubeController } from "./extrato-clube.controller";
import { ExtratoClubeService } from "./extrato-clube.service";

@Module({
  controllers: [ExtratoClubeController],
  providers: [ExtratoClubeService],
})
export class ExtratoClubeModule {}
