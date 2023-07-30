import { IsNotEmpty, IsString, Matches } from "class-validator";

/** Find Número do Benefício (NBs) DTO */
export class FindNBDto {
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "cpf must be a CPF" })
  @IsString()
  readonly cpf!: string;

  @IsNotEmpty()
  @IsString()
  readonly user!: string;

  @IsNotEmpty()
  @IsString()
  readonly pass!: string;
}
