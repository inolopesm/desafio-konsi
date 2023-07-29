import { BadRequestException } from "@nestjs/common";
import { ParseCPFPipe } from "./parse-cpf.pipe";

describe("ParseCPFPipe", () => {
  it("should throw an exception if value is not a string", async () => {
    const pipe = new ParseCPFPipe();
    const promise = pipe.transform(123);
    const exceptionMessage = "The value passed as CPF is not a string";
    const exception = new BadRequestException(exceptionMessage);
    await expect(promise).rejects.toThrow(exception);
  });

  it("should throw an exception if value is not a cpf", async () => {
    const pipe = new ParseCPFPipe();
    const promise = pipe.transform("value");
    const exceptionMessage = "Validation failed (cpf is expected)";
    const exception = new BadRequestException(exceptionMessage);
    await expect(promise).rejects.toThrow(exception);
  });

  it("should return the received value when success", async () => {
    const pipe = new ParseCPFPipe();
    const value = "000.000.000-00";
    const result = await pipe.transform(value);
    expect(result).toEqual(value);
  });
});
