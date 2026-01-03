import { Injectable } from '@nestjs/common';
import { NUMEROLOGY_MEANINGS, NumerologyMeaning } from '../data/numbers.data';
import {
  MASTER_NUMBERS,
  isMasterNumber,
  MasterNumberMeaning,
} from '../data/master-numbers.data';
import { SoulUrgeInterpretation } from '../dto/numerology-result.dto';

@Injectable()
export class SoulService {
  /**
   * Tabela Pitagórica para vogais
   * O Número da Alma (Soul Urge) usa apenas as vogais do nome
   */
  private readonly vowelValues: Record<string, number> = {
    A: 1,
    E: 5,
    I: 9,
    O: 6,
    U: 3,
  };

  /**
   * Lista de vogais para verificação
   */
  private readonly vowels = new Set(['A', 'E', 'I', 'O', 'U']);

  /**
   * Calcula o Número da Alma (Soul Urge / Desejo do Coração)
   * usando apenas as vogais do nome completo
   *
   * O Número da Alma revela seus desejos mais profundos,
   * suas motivações internas e o que sua alma verdadeiramente busca
   */
  calculateSoulUrge(fullName: string): number {
    const normalizedName = this.normalizeName(fullName);
    const vowelsOnly = this.extractVowels(normalizedName);
    const totalValue = this.calculateVowelsValue(vowelsOnly);
    return this.reduceToSingleDigitOrMaster(totalValue);
  }

  /**
   * Normaliza o nome removendo acentos e convertendo para maiúsculas
   */
  private normalizeName(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '');
  }

  /**
   * Extrai apenas as vogais do nome
   */
  private extractVowels(name: string): string {
    return name
      .split('')
      .filter((letter) => this.vowels.has(letter))
      .join('');
  }

  /**
   * Calcula o valor numérico total das vogais
   */
  private calculateVowelsValue(vowels: string): number {
    return vowels.split('').reduce((sum, vowel) => {
      return sum + (this.vowelValues[vowel] || 0);
    }, 0);
  }

  /**
   * Reduz um número a um único dígito, preservando números mestres
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
   * Gera a interpretação completa do Número da Alma
   */
  getSoulUrgeInterpretation(number: number): SoulUrgeInterpretation {
    const isMaster = isMasterNumber(number);
    const meaning: NumerologyMeaning | MasterNumberMeaning = isMaster
      ? MASTER_NUMBERS[number]
      : NUMEROLOGY_MEANINGS[number];

    if (!meaning) {
      throw new Error(`Número da Alma inválido: ${number}`);
    }

    return {
      type: 'soulUrge',
      number,
      isMasterNumber: isMaster,
      meaning,
      personalMessage: this.generatePersonalMessage(number, isMaster),
      description: this.generateDescription(number, meaning),
      innerDesires: this.generateInnerDesires(number),
    };
  }

  /**
   * Gera uma mensagem pessoal mística para o Número da Alma
   */
  private generatePersonalMessage(number: number, isMaster: boolean): string {
    const messages: Record<number, string> = {
      1: 'No silêncio mais profundo do seu ser, sua alma clama por independência e originalidade. Você deseja ser reconhecido como único, ser o primeiro, abrir novos caminhos. Este anseio é sagrado.',
      2: 'Sua alma sussurra por amor, conexão e harmonia. No centro do seu ser, você busca pertencer, ser compreendido e criar laços que transcendem o tempo. A união é sua busca secreta.',
      3: 'A alegria criativa pulsa no centro da sua alma. Você anseia por expressão, por liberar a beleza que carrega dentro de si. Seu coração dança quando pode criar e inspirar.',
      4: 'Estabilidade e segurança são os clamores secretos da sua alma. Você deseja construir algo duradouro, deixar um legado tangível. A ordem traz paz ao seu espírito.',
      5: 'Liberdade! É o grito da sua alma. Você anseia por experiências, aventuras e a sensação do vento da mudança. Seu espírito não pode ser aprisionado.',
      6: 'Amor, família e harmonia doméstica são os desejos mais profundos da sua alma. Você busca nutrir, cuidar e criar beleza em seu ambiente. Seu coração é um lar.',
      7: 'Verdade e compreensão são as buscas secretas da sua alma. Você anseia por conhecimento profundo, por desvendar os mistérios do universo. A solidão meditativa é seu santuário.',
      8: 'Poder, abundância e reconhecimento são os chamados da sua alma. Você deseja conquistar, manifestar e liderar. Seu espírito é o de um rei ancestral.',
      9: 'Servir à humanidade é o anseio secreto da sua alma. Você busca transcender o ego e se fundir com o amor universal. Seu coração abraça toda a humanidade.',
      11: 'Iluminação espiritual é o chamado mais profundo da sua alma. Você anseia por conectar-se com dimensões superiores e ser um canal de luz divina.',
      22: 'Construir obras que transformem o mundo é o desejo secreto da sua alma. Você anseia por deixar uma marca indelével na história da humanidade.',
      33: 'Amor incondicional e cura universal são os clamores da sua alma. Você deseja ser um avatar de compaixão, curando o mundo com sua presença.',
    };

    return messages[number] || 'Sua alma guarda desejos únicos e sagrados.';
  }

  /**
   * Gera uma descrição detalhada do Número da Alma
   */
  private generateDescription(
    number: number,
    meaning: NumerologyMeaning | MasterNumberMeaning,
  ): string {
    const intro = `O Número da Alma ${number} - "${meaning.name}" - revela os desejos mais íntimos do seu coração. Este é o número que você pode não mostrar ao mundo, mas que guia secretamente suas escolhas e motivações mais profundas.`;

    const essence = `\n\nEssência da Alma: Suas vogais vibram na frequência do número ${number}, indicando que no núcleo do seu ser, você busca ${meaning.keywords.join(', ')}.`;

    const hidden = `\n\nDesejos Ocultos: Mesmo quando sua mente consciente segue outros caminhos, sua alma silenciosamente busca: ${meaning.lifePurpose}`;

    return intro + essence + hidden;
  }

  /**
   * Gera descrição dos desejos internos
   */
  private generateInnerDesires(number: number): string {
    const desires: Record<number, string> = {
      1: 'Você secretamente deseja ser o número um, o líder, o original. Sua alma se sente plena quando pode trilhar seu próprio caminho sem depender de ninguém. A independência é seu oxigênio espiritual.',
      2: 'Seu coração anseia por uma conexão profunda com outra alma. Você deseja ser o porto seguro de alguém, a paz em meio à tempestade. Parcerias significativas são a chave da sua felicidade.',
      3: 'Expressar-se criativamente é uma necessidade vital da sua alma. Você deseja ser visto, ouvido e celebrado pela sua originalidade. A alegria de criar é seu elixir de vida.',
      4: 'Segurança e estabilidade são seus desejos mais profundos. Você anseia por fundações sólidas, por saber que construiu algo que permanecerá. Ordem e estrutura trazem paz à sua alma.',
      5: 'Experiências variadas e liberdade total são o que sua alma realmente busca. Você deseja provar todos os sabores da vida, viajar por todos os caminhos. A rotina é a morte do seu espírito.',
      6: 'Criar um lar harmonioso e cuidar daqueles que ama são seus anseios mais profundos. Você deseja ser necessário, ser o pilar de amor da sua família.',
      7: 'Compreender os mistérios da existência é o que sua alma verdadeiramente busca. Você deseja sabedoria, não apenas conhecimento. A verdade última é seu graal sagrado.',
      8: 'Abundância e poder para criar impacto são seus desejos secretos. Você anseia por recursos não por ganância, mas para materializar visões grandiosas.',
      9: 'Transcender as limitações do ego e servir a algo maior é o que sua alma busca. Você deseja fazer diferença na vida de muitos, deixar o mundo melhor do que encontrou.',
      11: 'Conectar-se com a fonte divina e canalizar inspiração para outros é seu anseio mais profundo. Você deseja ser um farol de luz em um mundo que às vezes parece escuro.',
      22: 'Materializar sonhos impossíveis e construir estruturas que beneficiem toda a humanidade é o que sua alma ardentemente busca.',
      33: 'Amor puro e incondicional, cura das feridas da humanidade - esses são os chamados mais profundos da sua alma. Você deseja ser o amor em ação.',
    };

    return desires[number] || 'Seus desejos internos são únicos e sagrados.';
  }
}
