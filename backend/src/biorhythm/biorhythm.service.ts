import { Injectable } from '@nestjs/common';
import {
  BIORHYTHM_CYCLES,
  getAdviceForValues,
} from './data/cycles.data';
import {
  BiorhythmDay,
  BiorhythmPeriodResponse,
  BiorhythmPeriodSummary,
  CriticalDayInfo,
  CriticalDaysResponse,
  BiorhythmCompatibilityResponse,
  CompatibilityAnalysis,
} from './dto/biorhythm.dto';

@Injectable()
export class BiorhythmService {
  /**
   * Calcula o valor do biorritmo usando a formula senoidal
   * valor = sin(2 * PI * diasDesdeNascimento / periodoDoCiclo) * 100
   */
  private calculateCycleValue(daysSinceBirth: number, period: number): number {
    const value = Math.sin((2 * Math.PI * daysSinceBirth) / period) * 100;
    return Math.round(value * 100) / 100; // Arredonda para 2 casas decimais
  }

  /**
   * Calcula o numero de dias desde o nascimento ate uma data especifica
   */
  private getDaysSinceBirth(birthDate: Date, targetDate: Date): number {
    const diffTime = targetDate.getTime() - birthDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se um ciclo esta em dia critico (proximo de zero)
   */
  private isCritical(value: number, threshold: number = 5): boolean {
    return Math.abs(value) < threshold;
  }

  /**
   * Identifica quais ciclos estao criticos
   */
  private getCriticalCycles(
    physical: number,
    emotional: number,
    intellectual: number,
  ): string[] {
    const critical: string[] = [];
    if (this.isCritical(physical)) critical.push('fisico');
    if (this.isCritical(emotional)) critical.push('emocional');
    if (this.isCritical(intellectual)) critical.push('intelectual');
    return critical;
  }

  /**
   * Calcula o biorritmo para um dia especifico
   */
  calculateBiorhythmForDay(birthDate: Date, targetDate: Date): BiorhythmDay {
    const daysSinceBirth = this.getDaysSinceBirth(birthDate, targetDate);

    const physical = this.calculateCycleValue(
      daysSinceBirth,
      BIORHYTHM_CYCLES.physical.period,
    );
    const emotional = this.calculateCycleValue(
      daysSinceBirth,
      BIORHYTHM_CYCLES.emotional.period,
    );
    const intellectual = this.calculateCycleValue(
      daysSinceBirth,
      BIORHYTHM_CYCLES.intellectual.period,
    );

    const average = Math.round(((physical + emotional + intellectual) / 3) * 100) / 100;
    const criticalCycles = this.getCriticalCycles(physical, emotional, intellectual);
    const criticalDay = criticalCycles.length > 0;

    return {
      date: targetDate.toISOString().split('T')[0],
      physical,
      emotional,
      intellectual,
      average,
      criticalDay,
      advice: getAdviceForValues(physical, emotional, intellectual),
    };
  }

  /**
   * GET /biorhythm/today - Biorritmos de hoje
   */
  getTodayBiorhythm(birthDateStr: string): BiorhythmDay {
    const birthDate = this.parseDate(birthDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.calculateBiorhythmForDay(birthDate, today);
  }

  /**
   * GET /biorhythm/week - Proximos 7 dias
   */
  getWeekBiorhythm(birthDateStr: string): BiorhythmPeriodResponse {
    return this.getPeriodBiorhythm(birthDateStr, 7, 'semana');
  }

  /**
   * GET /biorhythm/month - Proximos 30 dias
   */
  getMonthBiorhythm(birthDateStr: string): BiorhythmPeriodResponse {
    return this.getPeriodBiorhythm(birthDateStr, 30, 'mes');
  }

  /**
   * Calcula biorritmo para um periodo de dias
   */
  private getPeriodBiorhythm(
    birthDateStr: string,
    numberOfDays: number,
    periodName: string,
  ): BiorhythmPeriodResponse {
    const birthDate = this.parseDate(birthDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: BiorhythmDay[] = [];

    for (let i = 0; i < numberOfDays; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      days.push(this.calculateBiorhythmForDay(birthDate, targetDate));
    }

    return {
      birthDate: birthDateStr,
      period: periodName,
      days,
      summary: this.calculatePeriodSummary(days),
    };
  }

  /**
   * Calcula o resumo de um periodo
   */
  private calculatePeriodSummary(days: BiorhythmDay[]): BiorhythmPeriodSummary {
    let bestPhysicalDay = days[0];
    let bestEmotionalDay = days[0];
    let bestIntellectualDay = days[0];
    let bestOverallDay = days[0];
    let criticalDaysCount = 0;
    let totalPhysical = 0;
    let totalEmotional = 0;
    let totalIntellectual = 0;

    for (const day of days) {
      if (day.physical > bestPhysicalDay.physical) bestPhysicalDay = day;
      if (day.emotional > bestEmotionalDay.emotional) bestEmotionalDay = day;
      if (day.intellectual > bestIntellectualDay.intellectual) bestIntellectualDay = day;
      if (day.average > bestOverallDay.average) bestOverallDay = day;
      if (day.criticalDay) criticalDaysCount++;

      totalPhysical += day.physical;
      totalEmotional += day.emotional;
      totalIntellectual += day.intellectual;
    }

    return {
      bestPhysicalDay: bestPhysicalDay.date,
      bestEmotionalDay: bestEmotionalDay.date,
      bestIntellectualDay: bestIntellectualDay.date,
      bestOverallDay: bestOverallDay.date,
      criticalDaysCount,
      averagePhysical: Math.round((totalPhysical / days.length) * 100) / 100,
      averageEmotional: Math.round((totalEmotional / days.length) * 100) / 100,
      averageIntellectual: Math.round((totalIntellectual / days.length) * 100) / 100,
    };
  }

  /**
   * GET /biorhythm/critical-days - Dias criticos nos proximos 30 dias
   */
  getCriticalDays(birthDateStr: string): CriticalDaysResponse {
    const birthDate = this.parseDate(birthDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const criticalDays: CriticalDayInfo[] = [];
    const daysToCheck = 30;

    for (let i = 0; i < daysToCheck; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      const daysSinceBirth = this.getDaysSinceBirth(birthDate, targetDate);

      const physical = this.calculateCycleValue(
        daysSinceBirth,
        BIORHYTHM_CYCLES.physical.period,
      );
      const emotional = this.calculateCycleValue(
        daysSinceBirth,
        BIORHYTHM_CYCLES.emotional.period,
      );
      const intellectual = this.calculateCycleValue(
        daysSinceBirth,
        BIORHYTHM_CYCLES.intellectual.period,
      );

      const criticalCycles = this.getCriticalCycles(physical, emotional, intellectual);

      if (criticalCycles.length > 0) {
        const warningLevel = this.getWarningLevel(criticalCycles.length);

        criticalDays.push({
          date: targetDate.toISOString().split('T')[0],
          criticalCycles,
          physical,
          emotional,
          intellectual,
          warningLevel,
          advice: this.getCriticalDayAdvice(criticalCycles),
        });
      }
    }

    return {
      birthDate: birthDateStr,
      period: 'proximos 30 dias',
      criticalDays,
      totalCriticalDays: criticalDays.length,
      nextCriticalDay: criticalDays.length > 0 ? criticalDays[0] : null,
    };
  }

  /**
   * Determina o nivel de alerta baseado no numero de ciclos criticos
   */
  private getWarningLevel(criticalCount: number): 'low' | 'medium' | 'high' {
    if (criticalCount >= 3) return 'high';
    if (criticalCount >= 2) return 'medium';
    return 'low';
  }

  /**
   * Gera conselho para dias criticos
   */
  private getCriticalDayAdvice(criticalCycles: string[]): string {
    if (criticalCycles.length === 3) {
      return 'Dia triplo critico! Extrema cautela em todas as atividades. Evite decisoes importantes, esforcos fisicos e discussoes emocionais.';
    }

    if (criticalCycles.length === 2) {
      return `Dia duplo critico (${criticalCycles.join(' e ')}). Tenha cuidado redobrado nas areas afetadas.`;
    }

    const cycle = criticalCycles[0];
    return BIORHYTHM_CYCLES[cycle === 'fisico' ? 'physical' : cycle === 'emocional' ? 'emotional' : 'intellectual'].criticalPhaseAdvice;
  }

  /**
   * GET /biorhythm/compatibility - Compatibilidade entre duas pessoas
   */
  getCompatibility(birthDate1Str: string, birthDate2Str: string): BiorhythmCompatibilityResponse {
    const birthDate1 = this.parseDate(birthDate1Str);
    const birthDate2 = this.parseDate(birthDate2Str);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const person1 = this.calculateBiorhythmForDay(birthDate1, today);
    const person2 = this.calculateBiorhythmForDay(birthDate2, today);

    // Calcula a compatibilidade como similaridade (100 - diferenca absoluta / 2)
    const physicalCompatibility = 100 - Math.abs(person1.physical - person2.physical) / 2;
    const emotionalCompatibility = 100 - Math.abs(person1.emotional - person2.emotional) / 2;
    const intellectualCompatibility = 100 - Math.abs(person1.intellectual - person2.intellectual) / 2;
    const overallCompatibility = (physicalCompatibility + emotionalCompatibility + intellectualCompatibility) / 3;

    return {
      person1BirthDate: birthDate1Str,
      person2BirthDate: birthDate2Str,
      date: today.toISOString().split('T')[0],
      compatibility: {
        physical: Math.round(physicalCompatibility * 100) / 100,
        emotional: Math.round(emotionalCompatibility * 100) / 100,
        intellectual: Math.round(intellectualCompatibility * 100) / 100,
        overall: Math.round(overallCompatibility * 100) / 100,
      },
      person1: {
        physical: person1.physical,
        emotional: person1.emotional,
        intellectual: person1.intellectual,
      },
      person2: {
        physical: person2.physical,
        emotional: person2.emotional,
        intellectual: person2.intellectual,
      },
      analysis: this.analyzeCompatibility(
        physicalCompatibility,
        emotionalCompatibility,
        intellectualCompatibility,
        overallCompatibility,
      ),
    };
  }

  /**
   * Analisa a compatibilidade e gera insights
   */
  private analyzeCompatibility(
    physical: number,
    emotional: number,
    intellectual: number,
    overall: number,
  ): CompatibilityAnalysis {
    let overallRating: 'excelente' | 'boa' | 'moderada' | 'desafiadora';
    if (overall >= 80) overallRating = 'excelente';
    else if (overall >= 60) overallRating = 'boa';
    else if (overall >= 40) overallRating = 'moderada';
    else overallRating = 'desafiadora';

    const physicalSynergy = this.getSynergyDescription(physical, 'fisica');
    const emotionalSynergy = this.getSynergyDescription(emotional, 'emocional');
    const intellectualSynergy = this.getSynergyDescription(intellectual, 'intelectual');

    const bestActivities = this.getBestActivities(physical, emotional, intellectual);

    let advice: string;
    if (overallRating === 'excelente') {
      advice = 'Hoje e um dia excepcional para atividades em conjunto! Seus ciclos estao muito sincronizados.';
    } else if (overallRating === 'boa') {
      advice = 'Boa compatibilidade hoje. Aproveitem para atividades que combinem com os ciclos em harmonia.';
    } else if (overallRating === 'moderada') {
      advice = 'Compatibilidade moderada. Respeitem as diferencas de energia e adaptem as atividades.';
    } else {
      advice = 'Dia com energias diferentes. Pode ser um bom momento para atividades individuais ou para praticar paciencia mutua.';
    }

    return {
      overallRating,
      physicalSynergy,
      emotionalSynergy,
      intellectualSynergy,
      advice,
      bestActivities,
    };
  }

  /**
   * Gera descricao de sinergia para um tipo de ciclo
   */
  private getSynergyDescription(compatibility: number, type: string): string {
    if (compatibility >= 80) {
      return `Alta sinergia ${type}. Voces estao muito alinhados nesta energia.`;
    } else if (compatibility >= 60) {
      return `Boa sinergia ${type}. Ha harmonia razoavel nesta area.`;
    } else if (compatibility >= 40) {
      return `Sinergia ${type} moderada. Podem haver algumas diferencas de ritmo.`;
    } else {
      return `Sinergia ${type} baixa. Suas energias estao em fases diferentes neste ciclo.`;
    }
  }

  /**
   * Sugere melhores atividades baseado na compatibilidade
   */
  private getBestActivities(
    physical: number,
    emotional: number,
    intellectual: number,
  ): string[] {
    const activities: string[] = [];

    if (physical >= 70) {
      activities.push('Esportes em dupla', 'Caminhadas', 'Dancas', 'Atividades ao ar livre');
    }

    if (emotional >= 70) {
      activities.push('Conversas profundas', 'Jantar romantico', 'Atividades artisticas juntos', 'Filmes emocionantes');
    }

    if (intellectual >= 70) {
      activities.push('Jogos de tabuleiro', 'Debates interessantes', 'Cursos ou palestras', 'Resolucao de problemas juntos');
    }

    if (activities.length === 0) {
      activities.push('Atividades relaxantes', 'Tempo de qualidade tranquilo', 'Meditacao em dupla');
    }

    return activities.slice(0, 4);
  }

  /**
   * Converte string de data para objeto Date
   */
  private parseDate(dateStr: string): Date {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
