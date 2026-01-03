import { IsDateString, IsNotEmpty } from 'class-validator';

/**
 * DTO para consulta de biorritmo com data de nascimento
 */
export class BiorhythmQueryDto {
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data valida no formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'A data de nascimento e obrigatoria' })
  birthDate: string;
}

/**
 * DTO para consulta de compatibilidade entre duas pessoas
 */
export class BiorhythmCompatibilityDto {
  @IsDateString({}, { message: 'A primeira data de nascimento deve ser valida no formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'A primeira data de nascimento e obrigatoria' })
  birthDate1: string;

  @IsDateString({}, { message: 'A segunda data de nascimento deve ser valida no formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'A segunda data de nascimento e obrigatoria' })
  birthDate2: string;
}

/**
 * Interface para um unico dia de biorritmo
 */
export interface BiorhythmDay {
  date: string;
  physical: number;
  emotional: number;
  intellectual: number;
  average: number;
  criticalDay: boolean;
  advice: string;
}

/**
 * Interface para resposta de biorritmo de um periodo
 */
export interface BiorhythmPeriodResponse {
  birthDate: string;
  period: string;
  days: BiorhythmDay[];
  summary: BiorhythmPeriodSummary;
}

/**
 * Interface para resumo do periodo
 */
export interface BiorhythmPeriodSummary {
  bestPhysicalDay: string;
  bestEmotionalDay: string;
  bestIntellectualDay: string;
  bestOverallDay: string;
  criticalDaysCount: number;
  averagePhysical: number;
  averageEmotional: number;
  averageIntellectual: number;
}

/**
 * Interface para dias criticos
 */
export interface CriticalDayInfo {
  date: string;
  criticalCycles: string[];
  physical: number;
  emotional: number;
  intellectual: number;
  warningLevel: 'low' | 'medium' | 'high';
  advice: string;
}

/**
 * Interface para resposta de dias criticos
 */
export interface CriticalDaysResponse {
  birthDate: string;
  period: string;
  criticalDays: CriticalDayInfo[];
  totalCriticalDays: number;
  nextCriticalDay: CriticalDayInfo | null;
}

/**
 * Interface para compatibilidade de biorritmos
 */
export interface BiorhythmCompatibilityResponse {
  person1BirthDate: string;
  person2BirthDate: string;
  date: string;
  compatibility: {
    physical: number;
    emotional: number;
    intellectual: number;
    overall: number;
  };
  person1: {
    physical: number;
    emotional: number;
    intellectual: number;
  };
  person2: {
    physical: number;
    emotional: number;
    intellectual: number;
  };
  analysis: CompatibilityAnalysis;
}

/**
 * Interface para analise de compatibilidade
 */
export interface CompatibilityAnalysis {
  overallRating: 'excelente' | 'boa' | 'moderada' | 'desafiadora';
  physicalSynergy: string;
  emotionalSynergy: string;
  intellectualSynergy: string;
  advice: string;
  bestActivities: string[];
}
