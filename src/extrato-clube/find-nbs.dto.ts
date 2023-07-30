import { IsNotEmpty, IsString, Matches } from "class-validator";

/** Find Números dos Benefícios (NBs) DTO */
export class FindNBsDto {
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "cpf must be a CPF" })
  @IsString()
  readonly cpf!: string;

  @IsNotEmpty()
  @IsString()
  readonly login!: string;

  @IsNotEmpty()
  @IsString()
  readonly senha!: string;
}
