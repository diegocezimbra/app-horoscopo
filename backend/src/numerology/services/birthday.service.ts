import { Injectable } from '@nestjs/common';
import { NUMEROLOGY_MEANINGS, NumerologyMeaning } from '../data/numbers.data';
import {
  MASTER_NUMBERS,
  isMasterNumber,
  MasterNumberMeaning,
} from '../data/master-numbers.data';
import { BirthdayInterpretation } from '../dto/numerology-result.dto';

@Injectable()
export class BirthdayService {
  /**
   * Calcula o Número do Aniversário a partir do dia de nascimento
   *
   * O Número do Aniversário é único porque usa apenas o dia,
   * sem redução se for menor que 10. Este número revela
   * talentos especiais e habilidades específicas que você
   * trouxe para esta vida.
   */
  calculateBirthdayNumber(birthDate: Date): number {
    const day = birthDate.getDate();

    // Dias 1-9 permanecem como estão
    // Dias 10-31 são reduzidos, preservando números mestres
    if (day <= 9) {
      return day;
    }

    return this.reduceToSingleDigitOrMaster(day);
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
   * Gera a interpretação completa do Número do Aniversário
   */
  getBirthdayInterpretation(number: number): BirthdayInterpretation {
    const isMaster = isMasterNumber(number);
    const meaning: NumerologyMeaning | MasterNumberMeaning = isMaster
      ? MASTER_NUMBERS[number]
      : NUMEROLOGY_MEANINGS[number];

    if (!meaning) {
      throw new Error(`Número do Aniversário inválido: ${number}`);
    }

    return {
      type: 'birthday',
      number,
      isMasterNumber: isMaster,
      meaning,
      personalMessage: this.generatePersonalMessage(number, isMaster),
      description: this.generateDescription(number, meaning),
      specialTalent: this.generateSpecialTalent(number),
    };
  }

  /**
   * Gera uma mensagem pessoal mística para o Número do Aniversário
   */
  private generatePersonalMessage(number: number, isMaster: boolean): string {
    const messages: Record<number, string> = {
      1: 'Você nasceu sob a estrela do pioneiro. O dia do seu nascimento carrega a energia do início, da originalidade e da liderança. Você possui um talento natural para ser o primeiro.',
      2: 'O dia do seu nascimento vibra com a energia da cooperação. Você trouxe consigo o dom da diplomacia e a capacidade de harmonizar opostos. A paz é sua marca.',
      3: 'Criatividade foi inscrita no dia do seu nascimento. Você veio a este mundo com o dom da expressão, da comunicação e da alegria. Sua voz carrega magia.',
      4: 'Solidez e determinação marcam o dia em que você chegou ao mundo. Você nasceu construtor, com a habilidade natural de criar estruturas que duram.',
      5: 'Liberdade e aventura são as marcas do seu dia de nascimento. Você trouxe consigo a capacidade de adaptar-se a qualquer situação e prosperar na mudança.',
      6: 'Amor e cuidado são os presentes do dia em que você nasceu. Você veio com o dom de nutrir, harmonizar e embelezar o mundo ao seu redor.',
      7: 'Sabedoria e intuição foram plantadas no dia do seu nascimento. Você trouxe consigo a capacidade de ver além do véu e compreender mistérios profundos.',
      8: 'Poder de manifestação foi seu presente de nascimento. Você veio equipado com a habilidade de transformar ideias em realidade e atrair abundância.',
      9: 'Compaixão universal marca o dia em que você nasceu. Você trouxe consigo uma sabedoria madura e a capacidade de amar a humanidade inteira.',
      11: 'Iluminação foi inscrita no seu dia de nascimento. Você veio como um canal especial, com dons psíquicos e espirituais extraordinários.',
      22: 'O poder do Mestre Construtor marca seu nascimento. Você trouxe consigo a capacidade rara de materializar visões grandiosas.',
      33: 'O amor crístico foi seu presente de nascimento. Você veio como um mestre curador, com dons extraordinários de compaixão e cura.',
    };

    return (
      messages[number] ||
      'Seu dia de nascimento carrega uma energia especial e única.'
    );
  }

  /**
   * Gera uma descrição detalhada do Número do Aniversário
   */
  private generateDescription(
    number: number,
    meaning: NumerologyMeaning | MasterNumberMeaning,
  ): string {
    const intro = `O Número do Aniversário ${number} - "${meaning.name}" - revela os talentos específicos que você trouxe para esta encarnação. Este número é como um presente cósmico, um kit de ferramentas especiais que estava à sua espera no momento exato do seu nascimento.`;

    const gift = `\n\nSeu Dom de Nascimento: O universo lhe concedeu as qualidades de ${meaning.keywords.join(', ')}. Estas são habilidades naturais que você pode acessar facilmente.`;

    const usage = `\n\nComo Usar Este Dom: ${meaning.lifePurpose}`;

    return intro + gift + usage;
  }

  /**
   * Gera descrição do talento especial
   */
  private generateSpecialTalent(number: number): string {
    const talents: Record<number, string> = {
      1: 'Seu talento especial é a capacidade de iniciar. Enquanto outros hesitam, você age. Você possui uma habilidade natural para ser pioneiro, para dar o primeiro passo onde ninguém ousou. Use este dom para abrir caminhos e inspirar outros a seguir.',
      2: 'Seu talento especial é a sensibilidade às necessidades dos outros. Você percebe nuances emocionais que passam despercebidas para a maioria. Esta habilidade de sentir e harmonizar é rara e preciosa. Use-a para construir pontes e curar relacionamentos.',
      3: 'Seu talento especial é a comunicação criativa. Você tem a capacidade natural de expressar ideias de formas cativantes. As palavras fluem através de você como magia. Use este dom para inspirar, entreter e elevar.',
      4: 'Seu talento especial é a organização e execução. Você transforma caos em ordem naturalmente. Enquanto outros sonham, você planeja e executa. Use esta habilidade para construir fundações duradouras em qualquer área da vida.',
      5: 'Seu talento especial é a adaptabilidade. Você prospera na mudança enquanto outros temem. Esta flexibilidade é um superpoder raro. Use-a para explorar novos territórios e trazer inovação onde quer que vá.',
      6: 'Seu talento especial é criar harmonia e beleza. Você transforma ambientes e situações com sua presença amorosa. Esta capacidade de nutrir e embelezar é um dom divino. Use-a para criar santuários de paz.',
      7: 'Seu talento especial é a análise profunda e intuição. Você vê conexões ocultas e verdades que escapam aos outros. Esta combinação de mente analítica e percepção intuitiva é rara. Use-a para desvendar mistérios e compartilhar sabedoria.',
      8: 'Seu talento especial é a manifestação material. Você tem uma habilidade natural para atrair recursos e transformar visões em realidade concreta. Este poder de materialização é um dom poderoso. Use-o para criar abundância que beneficie muitos.',
      9: 'Seu talento especial é a perspectiva global e compaixão. Você vê o quadro completo e sente a dor e alegria de todos. Esta capacidade de transcender o pessoal é um dom de alma antiga. Use-a para servir causas maiores.',
      11: 'Seu talento especial é a canalização espiritual. Você é um receptor natural de inspiração divina e insights superiores. Este dom psíquico é extraordinário. Use-o para iluminar e inspirar outros em seu caminho espiritual.',
      22: 'Seu talento especial é transformar o impossível em possível. Você tem a capacidade rara de pegar visões grandiosas e materializá-las no mundo físico. Este dom de construção magistral pode mudar o mundo. Use-o sabiamente.',
      33: 'Seu talento especial é a cura através do amor. Sua simples presença eleva e transforma. Você carrega uma vibração de amor incondicional que é profundamente curativa. Este dom sagrado deve ser usado para o serviço à humanidade.',
    };

    return talents[number] || 'Você possui talentos únicos e especiais.';
  }
}
