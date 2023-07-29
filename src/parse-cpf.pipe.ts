import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseCPFPipe implements PipeTransform<string> {
  async transform(value: unknown): Promise<string> {
    if (typeof value !== "string") {
      throw new BadRequestException("The value passed as CPF is not a string");
    }

    const isCpf = (value: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);

    if (!isCpf(value)) {
      throw new BadRequestException("Validation failed (cpf is expected)");
    }

    return value;
  }
}
