import { Injectable } from '@nestjs/common';
import { NUMEROLOGY_MEANINGS, NumerologyMeaning } from '../data/numbers.data';
import {
  MASTER_NUMBERS,
  isMasterNumber,
  MasterNumberMeaning,
} from '../data/master-numbers.data';
import { DestinyInterpretation } from '../dto/numerology-result.dto';

@Injectable()
export class DestinyService {
  /**
   * Tabela Pitagórica - Sistema clássico de correspondência letra-número
   * A-I = 1-9, J-R = 1-9, S-Z = 1-8
   */
  private readonly letterValues: Record<string, number> = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    O: 6,
    P: 7,
    Q: 8,
    R: 9,
    S: 1,
    T: 2,
    U: 3,
    V: 4,
    W: 5,
    X: 6,
    Y: 7,
    Z: 8,
  };

  /**
   * Calcula o Número do Destino (também chamado de Número de Expressão)
   * a partir do nome completo usando o sistema Pitagórico
   *
   * O Número do Destino revela seus talentos naturais e o caminho
   * que você está destinado a percorrer nesta vida
   */
  calculateDestinyNumber(fullName: string): number {
    const normalizedName = this.normalizeName(fullName);
    const totalValue = this.calculateNameValue(normalizedName);
    return this.reduceToSingleDigitOrMaster(totalValue);
  }

  /**
   * Normaliza o nome removendo acentos e convertendo para maiúsculas
   */
  private normalizeName(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toUpperCase()
      .replace(/[^A-Z]/g, ''); // Remove caracteres não-alfabéticos
  }

  /**
   * Calcula o valor numérico total de um nome
   */
  private calculateNameValue(name: string): number {
    return name.split('').reduce((sum, letter) => {
      return sum + (this.letterValues[letter] || 0);
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
   * Gera a interpretação completa do Número do Destino
   */
  getDestinyInterpretation(number: number): DestinyInterpretation {
    const isMaster = isMasterNumber(number);
    const meaning: NumerologyMeaning | MasterNumberMeaning = isMaster
      ? MASTER_NUMBERS[number]
      : NUMEROLOGY_MEANINGS[number];

    if (!meaning) {
      throw new Error(`Número do Destino inválido: ${number}`);
    }

    return {
      type: 'destiny',
      number,
      isMasterNumber: isMaster,
      meaning,
      personalMessage: this.generatePersonalMessage(number, isMaster),
      description: this.generateDescription(number, meaning),
      careerGuidance: this.generateCareerGuidance(number, meaning),
    };
  }

  /**
   * Gera uma mensagem pessoal mística para o Número do Destino
   */
  private generatePersonalMessage(number: number, isMaster: boolean): string {
    const messages: Record<number, string> = {
      1: 'Seu nome vibra com a energia do pioneiro. Você veio para liderar, inovar e mostrar ao mundo caminhos nunca antes trilhados. A originalidade é sua assinatura cósmica.',
      2: 'O som do seu nome carrega a melodia da paz. Você é o harmonizador natural, aquele que tece conexões invisíveis entre corações. Seu destino é unir.',
      3: 'Seu nome dança nas frequências da criação. Você é o artista divino, o comunicador das verdades superiores. Sua voz carrega o poder de transformar mundos.',
      4: 'A solidez do universo ressoa em seu nome. Você é o arquiteto cósmico, destinado a construir pontes entre o sonho e a realidade. Sua palavra é seu alicerce.',
      5: 'Seu nome vibra com os ventos da mudança. Você é o mensageiro entre mundos, o explorador de todas as dimensões. A liberdade é sua essência.',
      6: 'O amor incondicional está codificado em seu nome. Você é o guardião dos corações, destinado a criar santuários de paz onde quer que vá.',
      7: 'Mistérios ancestrais sussurram através do seu nome. Você é o buscador da verdade última, o místico que desvela os segredos do cosmos.',
      8: 'O poder da manifestação pulsa em cada letra do seu nome. Você é destinado a comandar recursos e transformar visões em impérios de luz.',
      9: 'Seu nome carrega a sabedoria de mil vidas. Você é a alma antiga, o curador universal que transcende fronteiras para servir a humanidade.',
      11: 'A luz divina está inscrita em seu nome. Você é o iluminador, o canal através do qual verdades superiores descem para o plano terreno.',
      22: 'O poder de construir mundos está codificado em seu nome. Você é o Mestre Construtor, destinado a materializar o impossível.',
      33: 'O amor crístico vibra em cada sílaba do seu nome. Você é o mestre do amor incondicional, aqui para elevar a consciência da humanidade.',
    };

    return messages[number] || 'Seu destino é único e especial.';
  }

  /**
   * Gera uma descrição detalhada do Número do Destino
   */
  private generateDescription(
    number: number,
    meaning: NumerologyMeaning | MasterNumberMeaning,
  ): string {
    const intro = `O Número do Destino ${number} - "${meaning.name}" - revela quem você está destinado a se tornar. Este número, derivado do seu nome completo de nascimento, representa seus talentos naturais, suas habilidades inatas e o papel que você veio desempenhar no grande teatro cósmico.`;

    const talents = `\n\nTalentos Inatos: ${meaning.strengths.join(', ')}.`;
    const keywords = `\n\nEnergias-Chave: ${meaning.keywords.join(', ')}.`;
    const purpose = `\n\nPropósito Manifestado: ${meaning.lifePurpose}`;

    return intro + talents + keywords + purpose;
  }

  /**
   * Gera orientação de carreira baseada no Número do Destino
   */
  private generateCareerGuidance(
    number: number,
    meaning: NumerologyMeaning | MasterNumberMeaning,
  ): string {
    const careerIntro = `As vibrações do seu Número do Destino ${number} indicam forte afinidade com as seguintes áreas profissionais: ${meaning.careers.join(', ')}.`;

    const guidance: Record<number, string> = {
      1: '\n\nSua alma prospera em posições de liderança. Evite funções subordinadas por muito tempo - você nasceu para comandar. Empreender pode ser seu caminho mais natural para a realização.',
      2: '\n\nAmbientes colaborativos fazem sua alma cantar. Você brilha em parcerias, mediações e trabalhos que envolvam pessoas. A diplomacia é seu superpoder secreto.',
      3: '\n\nCarreiras criativas e comunicativas são seu habitat natural. Você precisa de espaço para expressar-se. Evite trabalhos monótonos que aprisionem sua centelha criativa.',
      4: '\n\nVocê prospera onde há ordem, estrutura e projetos de longo prazo. Sua capacidade de construir sistematicamente é rara. Busque carreiras que valorizem planejamento e execução meticulosa.',
      5: '\n\nVariedade é essencial para sua alma inquieta. Carreiras com viagens, mudanças constantes e novos desafios mantêm seu espírito vivo. Evite rotinas rígidas.',
      6: '\n\nProfissões de cuidado e serviço atraem sua alma naturalmente. Você brilha quando pode nutrir e ajudar outros. Considere carreiras em saúde, educação ou design.',
      7: '\n\nPesquisa, análise e busca por conhecimento são seu combustível. Você precisa de tempo para reflexão. Carreiras que combinam profundidade intelectual com busca espiritual são ideais.',
      8: '\n\nO mundo dos negócios e finanças é seu território natural. Você tem dom para multiplicar recursos. Posições de autoridade e gestão permitem que seu potencial floresça.',
      9: '\n\nCarreiras humanitárias e artísticas chamam sua alma. Você precisa sentir que está contribuindo para algo maior. Evite trabalhos puramente materialistas.',
      11: '\n\nProfissões que envolvam inspiração, ensino espiritual ou cura são seu chamado. Você é um canal - escolha carreiras que honrem esse dom sagrado.',
      22: '\n\nProjetos de grande escala e impacto global são seu território. Você pode realizar o que outros consideram impossível. Busque posições onde possa construir legados.',
      33: '\n\nO ensino espiritual e a cura são suas vocações mais elevadas. Você transforma vidas por sua simples presença. Escolha caminhos que permitam servir à humanidade.',
    };

    return careerIntro + (guidance[number] || '');
  }
}
