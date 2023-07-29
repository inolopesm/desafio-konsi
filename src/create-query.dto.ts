import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateQueryDto {
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  @IsString()
  readonly cpf!: string;

  @IsNotEmpty()
  @IsString()
  readonly login!: string;

  @IsNotEmpty()
  @IsString()
  readonly senha!: string;
}
