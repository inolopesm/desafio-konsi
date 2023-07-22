import { Module } from "@nestjs/common";
import { BeneficiosProvider } from "./beneficios.provider";

@Module({ providers: [BeneficiosProvider], exports: [BeneficiosProvider] })
export class BeneficiosModule {}
