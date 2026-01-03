import { Injectable } from '@nestjs/common';
import { NUMEROLOGY_MEANINGS, NumerologyMeaning } from '../data/numbers.data';
import {
  MASTER_NUMBERS,
  isMasterNumber,
  MasterNumberMeaning,
} from '../data/master-numbers.data';
import { PersonalityInterpretation } from '../dto/numerology-result.dto';

@Injectable()
export class PersonalityService {
  /**
   * Tabela Pitagórica para consoantes
   * O Número da Personalidade usa apenas as consoantes do nome
   */
  private readonly consonantValues: Record<string, number> = {
    B: 2,
    C: 3,
    D: 4,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    Q: 8,
    R: 9,
    S: 1,
    T: 2,
    V: 4,
    W: 5,
    X: 6,
    Y: 7,
    Z: 8,
  };

  /**
   * Lista de vogais para exclusão
   */
  private readonly vowels = new Set(['A', 'E', 'I', 'O', 'U']);

  /**
   * Calcula o Número da Personalidade usando apenas as consoantes
   * do nome completo
   *
   * O Número da Personalidade revela como os outros nos veem,
   * a máscara que usamos para o mundo, nossa primeira impressão
   */
  calculatePersonalityNumber(fullName: string): number {
    const normalizedName = this.normalizeName(fullName);
    const consonantsOnly = this.extractConsonants(normalizedName);
    const totalValue = this.calculateConsonantsValue(consonantsOnly);
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
   * Extrai apenas as consoantes do nome
   */
  private extractConsonants(name: string): string {
    return name
      .split('')
      .filter((letter) => !this.vowels.has(letter))
      .join('');
  }

  /**
   * Calcula o valor numérico total das consoantes
   */
  private calculateConsonantsValue(consonants: string): number {
    return consonants.split('').reduce((sum, consonant) => {
      return sum + (this.consonantValues[consonant] || 0);
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
   * Gera a interpretação completa do Número da Personalidade
   */
  getPersonalityInterpretation(number: number): PersonalityInterpretation {
    const isMaster = isMasterNumber(number);
    const meaning: NumerologyMeaning | MasterNumberMeaning = isMaster
      ? MASTER_NUMBERS[number]
      : NUMEROLOGY_MEANINGS[number];

    if (!meaning) {
      throw new Error(`Número da Personalidade inválido: ${number}`);
    }

    return {
      type: 'personality',
      number,
      isMasterNumber: isMaster,
      meaning,
      personalMessage: this.generatePersonalMessage(number, isMaster),
      description: this.generateDescription(number, meaning),
      firstImpression: this.generateFirstImpression(number),
    };
  }

  /**
   * Gera uma mensagem pessoal mística para o Número da Personalidade
   */
  private generatePersonalMessage(number: number, isMaster: boolean): string {
    const messages: Record<number, string> = {
      1: 'O mundo vê em você um líder nato, alguém que exala confiança e independência. Sua aura projeta força e originalidade, fazendo com que outros naturalmente olhem para você em busca de direção.',
      2: 'Você transmite uma energia suave e acolhedora. As pessoas sentem sua natureza gentil e diplomática, sendo atraídas por sua capacidade de criar harmonia. Você é visto como um porto seguro.',
      3: 'Carisma radiante define sua presença. O mundo vê em você criatividade, alegria e uma centelha magnética que ilumina qualquer ambiente. Sua expressão cativa e encanta.',
      4: 'Confiabilidade e solidez são sua marca registrada aos olhos do mundo. As pessoas veem em você alguém em quem podem confiar, um pilar de estabilidade em tempos turbulentos.',
      5: 'Você projeta uma energia vibrante e aventureira. O mundo vê em você alguém fascinante, versátil e cheio de vida. Sua presença promete emoção e mudança.',
      6: 'Amor e cuidado irradiam de você. As pessoas veem alguém caloroso, responsável e devotado. Você transmite a sensação de lar e proteção onde quer que vá.',
      7: 'Mistério e profundidade envolvem sua presença. O mundo vê em você alguém sábio, contemplativo e fascinantemente reservado. Sua aura convida à reflexão.',
      8: 'Autoridade e sucesso emanam de você. As pessoas percebem sua força interior, sua capacidade de conquistar e comandar. Você projeta poder e abundância.',
      9: 'Compaixão e sabedoria universal definem como o mundo o vê. Você transmite uma maturidade espiritual que inspira respeito e admiração. Sua presença parece transcender o comum.',
      11: 'Uma luz especial envolve você aos olhos do mundo. As pessoas sentem sua natureza espiritual elevada, sua intuição aguçada. Você é visto como alguém conectado a algo maior.',
      22: 'Visão grandiosa e capacidade de realização são o que o mundo percebe em você. Sua presença transmite a sensação de que você pode mover montanhas.',
      33: 'Amor incondicional e sabedoria divina irradiam de você. O mundo vê um mestre espiritual, alguém cuja presença traz cura e elevação.',
    };

    return messages[number] || 'Sua personalidade é única e marcante.';
  }

  /**
   * Gera uma descrição detalhada do Número da Personalidade
   */
  private generateDescription(
    number: number,
    meaning: NumerologyMeaning | MasterNumberMeaning,
  ): string {
    const intro = `O Número da Personalidade ${number} - "${meaning.name}" - revela a máscara que você apresenta ao mundo. Este é o "você" que as pessoas conhecem antes de conhecerem seu verdadeiro eu. É a primeira impressão que você causa e como é percebido em interações sociais.`;

    const exterior = `\n\nSua Imagem Externa: As consoantes do seu nome vibram na frequência do ${number}, criando uma persona que projeta ${meaning.keywords.join(', ')}.`;

    const perception = `\n\nComo os Outros o Veem: As pessoas percebem em você as qualidades de ${meaning.strengths.join(', ')}. Esta é sua armadura social, sua interface com o mundo exterior.`;

    return intro + exterior + perception;
  }

  /**
   * Gera descrição da primeira impressão
   */
  private generateFirstImpression(number: number): string {
    const impressions: Record<number, string> = {
      1: 'Ao conhecê-lo, as pessoas imediatamente percebem sua autoconfiança e independência. Você entra em um ambiente e naturalmente atrai olhares. Há algo em você que diz "eu sei quem sou e para onde vou". Alguns podem achá-lo um pouco intimidante inicialmente, mas isso é apenas sua força natural brilhando.',
      2: 'Sua primeira impressão é de alguém gentil e acessível. As pessoas se sentem confortáveis em sua presença quase imediatamente. Você transmite uma sensação de paz e receptividade que convida à aproximação. Sua natureza diplomática é perceptível desde o primeiro momento.',
      3: 'Você ilumina qualquer sala que entra. Sua primeira impressão é de alguém vibrante, divertido e magnético. As pessoas são atraídas por sua energia positiva e expressividade. Seu carisma é evidente desde o primeiro sorriso.',
      4: 'Seriedade e confiabilidade definem sua primeira impressão. As pessoas imediatamente sentem que você é alguém sólido, em quem podem confiar. Você transmite competência e estabilidade, fazendo os outros se sentirem seguros.',
      5: 'Energia e vivacidade marcam seu primeiro impacto. As pessoas percebem imediatamente que você é alguém interessante, com histórias para contar. Você transmite uma promessa de aventura e excitação.',
      6: 'Calor humano define sua primeira impressão. As pessoas sentem imediatamente sua natureza cuidadora e acolhedora. Você transmite uma energia maternal/paternal que faz os outros se sentirem protegidos.',
      7: 'Há um ar de mistério em você que intriga desde o primeiro momento. As pessoas percebem sua natureza contemplativa e inteligente. Você transmite profundidade, fazendo os outros quererem conhecê-lo melhor.',
      8: 'Sucesso e autoridade emanam de você desde o primeiro segundo. As pessoas percebem imediatamente sua força e determinação. Você transmite a impressão de alguém que alcança o que deseja.',
      9: 'Sabedoria e compaixão definem sua primeira impressão. As pessoas sentem que você é alguém especial, com uma perspectiva elevada da vida. Você transmite uma maturidade que inspira respeito.',
      11: 'Há algo etéreo em você que as pessoas percebem imediatamente. Sua primeira impressão é de alguém especial, quase como se você carregasse uma luz própria. Você intriga e inspira desde o primeiro encontro.',
      22: 'Poder e visão são perceptíveis desde o primeiro momento. As pessoas sentem que você é capaz de grandes realizações. Sua presença transmite a força de quem pode transformar sonhos em realidade.',
      33: 'Amor puro irradia de você desde o primeiro instante. As pessoas sentem uma paz inexplicável em sua presença. Você transmite uma bondade que transcende palavras.',
    };

    return (
      impressions[number] || 'Sua primeira impressão é única e memorável.'
    );
  }
}
