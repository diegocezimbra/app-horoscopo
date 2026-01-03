import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BiorhythmService } from './biorhythm.service';
import {
  BiorhythmDay,
  BiorhythmPeriodResponse,
  CriticalDaysResponse,
  BiorhythmCompatibilityResponse,
} from './dto/biorhythm.dto';

@Controller('biorhythm')
export class BiorhythmController {
  constructor(private readonly biorhythmService: BiorhythmService) {}

  /**
   * GET /biorhythm/today?birthDate=YYYY-MM-DD
   * Retorna os biorritmos do dia atual
   */
  @Get('today')
  getTodayBiorhythm(@Query('birthDate') birthDate: string): BiorhythmDay {
    this.validateBirthDate(birthDate);
    return this.biorhythmService.getTodayBiorhythm(birthDate);
  }

  /**
   * GET /biorhythm/week?birthDate=YYYY-MM-DD
   * Retorna os biorritmos dos proximos 7 dias
   */
  @Get('week')
  getWeekBiorhythm(@Query('birthDate') birthDate: string): BiorhythmPeriodResponse {
    this.validateBirthDate(birthDate);
    return this.biorhythmService.getWeekBiorhythm(birthDate);
  }

  /**
   * GET /biorhythm/month?birthDate=YYYY-MM-DD
   * Retorna os biorritmos dos proximos 30 dias
   */
  @Get('month')
  getMonthBiorhythm(@Query('birthDate') birthDate: string): BiorhythmPeriodResponse {
    this.validateBirthDate(birthDate);
    return this.biorhythmService.getMonthBiorhythm(birthDate);
  }

  /**
   * GET /biorhythm/critical-days?birthDate=YYYY-MM-DD
   * Retorna os dias criticos nos proximos 30 dias
   */
  @Get('critical-days')
  getCriticalDays(@Query('birthDate') birthDate: string): CriticalDaysResponse {
    this.validateBirthDate(birthDate);
    return this.biorhythmService.getCriticalDays(birthDate);
  }

  /**
   * GET /biorhythm/compatibility?birthDate1=YYYY-MM-DD&birthDate2=YYYY-MM-DD
   * Retorna a compatibilidade de biorritmos entre duas pessoas
   */
  @Get('compatibility')
  getCompatibility(
    @Query('birthDate1') birthDate1: string,
    @Query('birthDate2') birthDate2: string,
  ): BiorhythmCompatibilityResponse {
    this.validateBirthDate(birthDate1, 'birthDate1');
    this.validateBirthDate(birthDate2, 'birthDate2');
    return this.biorhythmService.getCompatibility(birthDate1, birthDate2);
  }

  /**
   * Valida o formato e a validade da data de nascimento
   */
  private validateBirthDate(dateStr: string, fieldName: string = 'birthDate'): void {
    if (!dateStr) {
      throw new BadRequestException(
        `O parametro ${fieldName} e obrigatorio. Use o formato YYYY-MM-DD.`,
      );
    }

    // Verifica o formato YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      throw new BadRequestException(
        `Formato de data invalido para ${fieldName}. Use YYYY-MM-DD.`,
      );
    }

    const date = new Date(dateStr);

    // Verifica se a data e valida
    if (isNaN(date.getTime())) {
      throw new BadRequestException(
        `Data invalida para ${fieldName}. Verifique se o dia e mes estao corretos.`,
      );
    }

    const now = new Date();
    const minDate = new Date('1900-01-01');

    // Verifica se a data esta no intervalo valido
    if (date > now) {
      throw new BadRequestException(
        `A data de nascimento (${fieldName}) nao pode ser no futuro.`,
      );
    }

    if (date < minDate) {
      throw new BadRequestException(
        `A data de nascimento (${fieldName}) deve ser posterior a 1900-01-01.`,
      );
    }
  }
}
