import { IsString, IsDateString, IsNotEmpty, MinLength } from 'class-validator';

export class CalculateNumerologyDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  fullName: string;

  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  birthDate: string;
}

export class LifePathInputDto {
  @IsDateString({}, { message: 'A data deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data é obrigatória' })
  date: string;
}
