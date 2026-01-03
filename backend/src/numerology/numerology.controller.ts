import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { NumerologyService } from './numerology.service';
import { LifePathService } from './services/life-path.service';
import { CalculateNumerologyDto } from './dto/numerology-input.dto';
import {
  NumerologyProfile,
  DailyNumerologyReading,
  LifePathInterpretation,
} from './dto/numerology-result.dto';

@Controller('numerology')
export class NumerologyController {
  constructor(
    private readonly numerologyService: NumerologyService,
    private readonly lifePathService: LifePathService,
  ) {}

  /**
   * POST /numerology/calculate
   * Calcula o perfil numerológico completo baseado no nome e data de nascimento
   */
  @Post('calculate')
  calculateFullProfile(
    @Body() dto: CalculateNumerologyDto,
  ): NumerologyProfile {
    const birthDate = this.parseDate(dto.birthDate);

    if (!this.isValidBirthDate(birthDate)) {
      throw new BadRequestException(
        'Data de nascimento inválida. Use o formato YYYY-MM-DD.',
      );
    }

    return this.numerologyService.generateCompleteNumerologyProfile(
      dto.fullName,
      birthDate,
    );
  }

  /**
   * GET /numerology/life-path/:date
   * Calcula rapidamente apenas o Caminho de Vida para uma data
   * Formato da data: YYYY-MM-DD
   */
  @Get('life-path/:date')
  getLifePath(@Param('date') dateStr: string): LifePathInterpretation {
    const birthDate = this.parseDate(dateStr);

    if (!this.isValidBirthDate(birthDate)) {
      throw new BadRequestException(
        'Data inválida. Use o formato YYYY-MM-DD.',
      );
    }

    const lifePathNumber = this.lifePathService.calculateLifePath(birthDate);
    return this.lifePathService.getLifePathInterpretation(lifePathNumber);
  }

  /**
   * GET /numerology/daily/:number
   * Retorna a leitura numerológica diária para um número pessoal (1-9, 11, 22, 33)
   */
  @Get('daily/:number')
  getDailyReading(@Param('number') numberStr: string): DailyNumerologyReading {
    const personalNumber = parseInt(numberStr, 10);

    if (!this.isValidPersonalNumber(personalNumber)) {
      throw new BadRequestException(
        'Número pessoal inválido. Use um número de 1 a 9, ou números mestres 11, 22, 33.',
      );
    }

    return this.numerologyService.generateDailyReading(personalNumber);
  }

  /**
   * GET /numerology/today
   * Retorna informações sobre a energia numerológica do dia atual (Universal Day)
   */
  @Get('today')
  getTodayEnergy(): { date: string; universalDay: number; theme: string; guidance: string } {
    const today = new Date();
    const universalDay = this.calculateUniversalDay(today);

    return {
      date: today.toISOString().split('T')[0],
      universalDay,
      theme: this.getThemeForNumber(universalDay),
      guidance: this.getGuidanceForNumber(universalDay),
    };
  }

  /**
   * Converte string de data para objeto Date
   */
  private parseDate(dateStr: string): Date {
    const date = new Date(dateStr);
    // Ajusta para timezone local
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  /**
   * Valida se a data de nascimento é válida
   */
  private isValidBirthDate(date: Date): boolean {
    if (isNaN(date.getTime())) {
      return false;
    }

    const now = new Date();
    const minDate = new Date('1900-01-01');

    return date >= minDate && date <= now;
  }

  /**
   * Valida se o número pessoal é válido
   */
  private isValidPersonalNumber(num: number): boolean {
    if (isNaN(num)) {
      return false;
    }

    const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
    return validNumbers.includes(num);
  }

  /**
   * Calcula o Dia Universal
   */
  private calculateUniversalDay(date: Date): number {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let sum = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(year);

    // Reduz preservando números mestres
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = this.sumDigits(sum);
    }

    return sum;
  }

  /**
   * Soma os dígitos de um número
   */
  private sumDigits(num: number): number {
    return num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }

  /**
   * Retorna o tema para um número
   */
  private getThemeForNumber(num: number): string {
    const themes: Record<number, string> = {
      1: 'Iniciativa e Novos Começos',
      2: 'Cooperação e Equilíbrio',
      3: 'Criatividade e Expressão',
      4: 'Trabalho e Fundamentos',
      5: 'Mudança e Liberdade',
      6: 'Amor e Responsabilidade',
      7: 'Reflexão e Espiritualidade',
      8: 'Poder e Abundância',
      9: 'Humanitarismo e Conclusões',
      11: 'Iluminação e Intuição',
      22: 'Construção Magistral',
      33: 'Amor Universal e Cura',
    };
    return themes[num] || 'Energia Especial';
  }

  /**
   * Retorna a orientação para um número
   */
  private getGuidanceForNumber(num: number): string {
    const guidance: Record<number, string> = {
      1: 'Hoje é um dia excelente para iniciar projetos, tomar decisões importantes e liderar. A energia favorece a independência e a originalidade.',
      2: 'A energia do dia favorece parcerias, negociações e resolução pacífica de conflitos. Seja diplomático e paciente.',
      3: 'Expresse sua criatividade! Comunicação, artes e atividades sociais estão favorecidas. Deixe sua alegria fluir.',
      4: 'Dia propício para organização, planejamento e trabalho focado. Construa bases sólidas para seus objetivos.',
      5: 'Mudanças e aventuras estão no ar! Seja flexível e esteja aberto a novas experiências. Evite rotinas rígidas.',
      6: 'Família, lar e relacionamentos próximos pedem atenção. É um dia para cuidar e nutrir aqueles que você ama.',
      7: 'Reflexão e introspecção são favorecidas. Medite, estude e busque sabedoria interior. Evite decisões precipitadas.',
      8: 'Assuntos financeiros e de poder estão em destaque. Negocie, invista e assuma autoridade com responsabilidade.',
      9: 'Compaixão e altruísmo guiam o dia. Ajude os outros, finalize projetos pendentes e pratique o desapego.',
      11: 'A intuição está aguçada. Preste atenção aos sinais e insights espirituais. Você é um canal de inspiração.',
      22: 'Grandes realizações são possíveis. Pense em projetos de longo alcance que beneficiem muitos.',
      33: 'O amor incondicional é a chave do dia. Cure, ensine e eleve outros com sua presença amorosa.',
    };
    return guidance[num] || 'Siga sua intuição e confie no fluxo universal.';
  }
}
