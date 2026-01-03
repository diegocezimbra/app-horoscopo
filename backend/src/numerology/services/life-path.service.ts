import { Injectable } from '@nestjs/common';
import { NUMEROLOGY_MEANINGS, NumerologyMeaning } from '../data/numbers.data';
import {
  MASTER_NUMBERS,
  isMasterNumber,
  MasterNumberMeaning,
} from '../data/master-numbers.data';
import { LifePathInterpretation } from '../dto/numerology-result.dto';

@Injectable()
export class LifePathService {
  /**
   * Calcula o Número do Caminho de Vida a partir da data de nascimento
   * O Caminho de Vida é o número mais importante da numerologia pessoal
   *
   * Método: Soma todos os dígitos da data e reduz a um único dígito
   * (ou número mestre: 11, 22, 33)
   *
   * Exemplo: 15/03/1990 = 1+5+0+3+1+9+9+0 = 28 = 2+8 = 10 = 1+0 = 1
   */
  calculateLifePath(birthDate: Date): number {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();

    // Reduz cada componente separadamente (método tradicional)
    const reducedDay = this.reduceToSingleDigit(day);
    const reducedMonth = this.reduceToSingleDigit(month);
    const reducedYear = this.reduceToSingleDigit(year);

    // Soma os componentes reduzidos
    const total = reducedDay + reducedMonth + reducedYear;

    // Reduz o total, preservando números mestres
    return this.reduceToSingleDigitOrMaster(total);
  }

  /**
   * Reduz um número a um único dígito (sem preservar números mestres)
   */
  private reduceToSingleDigit(num: number): number {
    while (num > 9) {
      num = this.sumDigits(num);
    }
    return num;
  }

  /**
   * Reduz um número a um único dígito, preservando números mestres (11, 22, 33)
   */
  private reduceToSingleDigitOrMaster(num: number): number {
    while (num > 9 && !isMasterNumber(num)) {
      num = this.sumDigits(num);
    }
    return num;
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
   * Gera a interpretação completa do Caminho de Vida
   */
  getLifePathInterpretation(number: number): LifePathInterpretation {
    const isMaster = isMasterNumber(number);
    const meaning: NumerologyMeaning | MasterNumberMeaning = isMaster
      ? MASTER_NUMBERS[number]
      : NUMEROLOGY_MEANINGS[number];

    if (!meaning) {
      throw new Error(`Número de Caminho de Vida inválido: ${number}`);
    }

    const currentYear = new Date().getFullYear();

    return {
      type: 'lifePath',
      number,
      isMasterNumber: isMaster,
      meaning,
      personalMessage: this.generatePersonalMessage(number, isMaster),
      description: this.generateDescription(number, meaning),
      yearlyInfluence: this.calculateYearlyInfluence(number, currentYear),
    };
  }

  /**
   * Gera uma mensagem pessoal mística baseada no número
   */
  private generatePersonalMessage(number: number, isMaster: boolean): string {
    const messages: Record<number, string> = {
      1: 'As estrelas conspiram a seu favor, alma pioneira. Você veio a este mundo para abrir caminhos que outros não ousam trilhar. Sua independência é sua coroa, e sua determinação, seu cetro.',
      2: 'Doce alma diplomática, você é o tecido que une corações. Os céus lhe concederam o dom da harmonia, e através de sua sensibilidade, você tece pontes onde outros veem abismos.',
      3: 'Criador de mundos com suas palavras, você é a centelha divina da expressão. O universo canta através de você, e sua alegria é o farol que guia almas perdidas para a luz.',
      4: 'Arquiteto do destino, você é a fundação sobre a qual impérios se erguem. Com paciência de pedra e coração de ouro, você constrói legados que desafiam o tempo.',
      5: 'Alma livre como o vento, você é o eterno aventureiro dos reinos terrenos. Cada mudança é uma porta, cada experiência uma joia para sua coroa de sabedoria.',
      6: 'Guardião dos corações, você é o amor encarnado neste plano. Sua presença é um bálsamo, e seu lar, um santuário onde almas encontram paz.',
      7: 'Místico buscador da verdade, você é o ponte entre mundos. Os véus do mistério se abrem ante seus olhos, revelando segredos que o universo reserva apenas para poucos.',
      8: 'Manifestador de abundância, você carrega o poder dos antigos reis. O universo material responde ao seu comando, e sua missão é transformar riqueza em benção.',
      9: 'Alma antiga e sábia, você é o humanitário que transcende fronteiras. Seu coração abarca toda a humanidade, e seu amor é a chama que nunca se apaga.',
      11: 'Iluminado entre os iluminados, você é um canal direto para a luz divina. Sua intuição transcende o véu, e você veio para despertar consciências adormecidas.',
      22: 'Mestre Construtor dos sonhos impossíveis, você carrega o poder de materializar visões que transformam o mundo. Seu legado será escrito nas estrelas.',
      33: 'Avatar do amor crístico, você é a encarnação da compaixão suprema. Sua simples presença cura, e seu caminho é o mais elevado serviço à humanidade.',
    };

    return messages[number] || 'Sua jornada numerológica é única e especial.';
  }

  /**
   * Gera uma descrição detalhada do Caminho de Vida
   */
  private generateDescription(
    number: number,
    meaning: NumerologyMeaning | MasterNumberMeaning,
  ): string {
    const intro = `O Caminho de Vida ${number} - "${meaning.name}" - é o número mais significativo em sua carta numerológica. Ele revela o propósito central de sua existência, os desafios kármicos que você veio resolver e os dons que trouxe de outras vidas.`;

    const purpose = `\n\nSeu Propósito de Vida: ${meaning.lifePurpose}`;
    const lesson = `\n\nLição Espiritual: ${meaning.spiritualLesson}`;

    const strengths = `\n\nSeus Dons Naturais: ${meaning.strengths.join(', ')}.`;
    const challenges = `\n\nDesafios a Superar: ${meaning.challenges.join(', ')}.`;

    return intro + purpose + lesson + strengths + challenges;
  }

  /**
   * Calcula a influência do ano atual no Caminho de Vida
   */
  private calculateYearlyInfluence(
    lifePathNumber: number,
    currentYear: number,
  ): string {
    const universalYear = this.reduceToSingleDigitOrMaster(
      this.sumDigits(currentYear),
    );

    const combinedEnergy = this.reduceToSingleDigitOrMaster(
      lifePathNumber + universalYear,
    );

    const influences: Record<number, string> = {
      1: 'Este ano traz energia de novos começos para seu caminho. É momento de iniciar projetos e afirmar sua independência.',
      2: 'Um ano de parcerias e cooperação se revela. A paciência será sua maior aliada nas conquistas.',
      3: 'A criatividade floresce intensamente. Express-se, comunique-se e deixe sua alegria contagiar o mundo.',
      4: 'Ano de construção sólida. Trabalho dedicado agora criará fundações para décadas de prosperidade.',
      5: 'Mudanças transformadoras chegam. Abrace a liberdade e permita-se explorar novos horizontes.',
      6: 'Família e amor dominam o cenário. Cuide de quem ama e permita ser cuidado.',
      7: 'Introspecção profunda é favorecida. Mergulhe nos mistérios e encontre respostas dentro de si.',
      8: 'Abundância material se manifesta. Use seu poder para criar impacto positivo no mundo.',
      9: 'Conclusões e fechamentos de ciclo. Deixe ir o que não serve mais para abrir espaço ao novo.',
      11: 'Iluminação espiritual intensificada. Sua intuição está em seu ápice - confie nela.',
      22: 'Capacidade de manifestação ampliada. Sonhos grandes podem se tornar realidade tangível.',
      33: 'Serviço amoroso ao próximo é o caminho. Sua presença cura mais do que palavras podem expressar.',
    };

    return `Ano Universal ${universalYear} + Caminho de Vida ${lifePathNumber} = Energia ${combinedEnergy}. ${influences[combinedEnergy] || influences[this.reduceToSingleDigit(combinedEnergy)]}`;
  }
}
