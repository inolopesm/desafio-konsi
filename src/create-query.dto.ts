import { IsString } from "class-validator";

export class CreateQueryDto {
  @IsString()
  readonly cpf!: string;

  @IsString()
  readonly username!: string;

  @IsString()
  readonly password!: string;
}
