import { Injectable } from '@nestjs/common';
import { LifePathService } from './services/life-path.service';
import { DestinyService } from './services/destiny.service';
import { SoulService } from './services/soul.service';
import { PersonalityService } from './services/personality.service';
import { BirthdayService } from './services/birthday.service';
import {
  NumerologyProfile,
  DailyNumerologyReading,
} from './dto/numerology-result.dto';
import { isMasterNumber } from './data/master-numbers.data';

@Injectable()
export class NumerologyService {
  constructor(
    private readonly lifePathService: LifePathService,
    private readonly destinyService: DestinyService,
    private readonly soulService: SoulService,
    private readonly personalityService: PersonalityService,
    private readonly birthdayService: BirthdayService,
  ) {}

  /**
   * Gera um perfil numerológico completo
   */
  generateCompleteNumerologyProfile(
    name: string,
    birthDate: Date,
  ): NumerologyProfile {
    // Calcula todos os números centrais
    const lifePathNumber = this.lifePathService.calculateLifePath(birthDate);
    const destinyNumber = this.destinyService.calculateDestinyNumber(name);
    const soulUrgeNumber = this.soulService.calculateSoulUrge(name);
    const personalityNumber =
      this.personalityService.calculatePersonalityNumber(name);
    const birthdayNumber =
      this.birthdayService.calculateBirthdayNumber(birthDate);

    // Gera as interpretações
    const lifePath =
      this.lifePathService.getLifePathInterpretation(lifePathNumber);
    const destiny =
      this.destinyService.getDestinyInterpretation(destinyNumber);
    const soulUrge = this.soulService.getSoulUrgeInterpretation(soulUrgeNumber);
    const personality =
      this.personalityService.getPersonalityInterpretation(personalityNumber);
    const birthday =
      this.birthdayService.getBirthdayInterpretation(birthdayNumber);

    // Calcula o Ano Pessoal
    const personalYear = this.calculatePersonalYear(birthDate);

    return {
      name,
      birthDate: birthDate.toISOString().split('T')[0],
      lifePath,
      destiny,
      soulUrge,
      personality,
      birthday,
      coreNumbersSummary: this.generateCoreNumbersSummary(
        lifePathNumber,
        destinyNumber,
        soulUrgeNumber,
        personalityNumber,
        birthdayNumber,
      ),
      compatibilityInsights: this.generateCompatibilityInsights(
        lifePathNumber,
        destinyNumber,
        soulUrgeNumber,
      ),
      personalYearNumber: personalYear,
      personalYearMessage: this.generatePersonalYearMessage(personalYear),
      spiritualGuidance: this.generateSpiritualGuidance(
        lifePathNumber,
        destinyNumber,
        soulUrgeNumber,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calcula o Ano Pessoal
   * Ano Pessoal = dia de nascimento + mês de nascimento + ano atual
   */
  private calculatePersonalYear(birthDate: Date): number {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const sum = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(currentYear);
    return this.reduceToSingleDigitOrMaster(sum);
  }

  /**
   * Gera leitura numerológica diária
   */
  generateDailyReading(personalNumber: number): DailyNumerologyReading {
    const today = new Date();
    const universalDayNumber = this.calculateUniversalDay(today);
    const combinedEnergy = this.reduceToSingleDigitOrMaster(
      personalNumber + universalDayNumber,
    );

    return {
      personalNumber,
      universalDayNumber,
      combinedEnergy,
      dailyTheme: this.getDailyTheme(combinedEnergy),
      guidance: this.getDailyGuidance(combinedEnergy, personalNumber),
      luckyHours: this.getLuckyHours(combinedEnergy),
      colorOfTheDay: this.getColorOfTheDay(combinedEnergy),
      affirmation: this.getDailyAffirmation(combinedEnergy),
      warning: this.getDailyWarning(combinedEnergy),
      opportunities: this.getDailyOpportunities(combinedEnergy),
    };
  }

  /**
   * Calcula o Dia Universal
   */
  private calculateUniversalDay(date: Date): number {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const sum = this.sumDigits(day) + this.sumDigits(month) + this.sumDigits(year);
    return this.reduceToSingleDigitOrMaster(sum);
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
   * Reduz a um único dígito preservando números mestres
   */
  private reduceToSingleDigitOrMaster(num: number): number {
    while (num > 9 && !isMasterNumber(num)) {
      num = this.sumDigits(num);
    }
    return num;
  }

  /**
   * Gera resumo dos números centrais
   */
  private generateCoreNumbersSummary(
    lifePath: number,
    destiny: number,
    soulUrge: number,
    personality: number,
    birthday: number,
  ): string {
    const hasMasterNumbers = [
      lifePath,
      destiny,
      soulUrge,
      personality,
      birthday,
    ].some((n) => isMasterNumber(n));

    let summary = `Sua carta numerológica revela uma combinação única e poderosa de energias. `;

    if (hasMasterNumbers) {
      summary += `Você carrega a vibração de números mestres, indicando uma missão espiritual elevada nesta vida. `;
    }

    // Análise de harmonia entre números
    if (lifePath === destiny) {
      summary += `Há uma harmonia perfeita entre seu Caminho de Vida e Destino - você está naturalmente alinhado com seu propósito. `;
    }

    if (soulUrge === personality) {
      summary += `Seu desejo interno corresponde à sua expressão externa - você é autêntico em sua apresentação ao mundo. `;
    }

    // Análise de elementos predominantes
    const numbers = [lifePath, destiny, soulUrge, personality, birthday];
    const oddCount = numbers.filter((n) => n % 2 !== 0).length;

    if (oddCount >= 4) {
      summary += `A predominância de números ímpares indica uma natureza ativa, pioneira e independente.`;
    } else if (oddCount <= 1) {
      summary += `A predominância de números pares indica uma natureza receptiva, diplomática e orientada a parcerias.`;
    } else {
      summary += `O equilíbrio entre números pares e ímpares sugere versatilidade e capacidade de adaptação.`;
    }

    return summary;
  }

  /**
   * Gera insights de compatibilidade
   */
  private generateCompatibilityInsights(
    lifePath: number,
    destiny: number,
    soulUrge: number,
  ): string {
    const compatibleNumbers = this.getCompatibleNumbers(lifePath);

    let insights = `Baseado no seu Caminho de Vida ${lifePath}, você tem maior afinidade natural com pessoas dos números ${compatibleNumbers.join(', ')}. `;

    insights += `\n\nEm relacionamentos românticos: Seu Número da Alma ${soulUrge} busca parceiros que possam satisfazer seus desejos mais profundos. `;

    if (soulUrge === 2 || soulUrge === 6) {
      insights += `Você anseia por conexão profunda e comprometimento.`;
    } else if (soulUrge === 1 || soulUrge === 5) {
      insights += `Você precisa de espaço e independência mesmo em relacionamentos próximos.`;
    } else {
      insights += `Busque parceiros que respeitem suas necessidades únicas.`;
    }

    insights += `\n\nEm parcerias profissionais: Seu Destino ${destiny} indica que você trabalha melhor com pessoas que complementam suas habilidades naturais.`;

    return insights;
  }

  /**
   * Retorna números compatíveis para um Caminho de Vida
   */
  private getCompatibleNumbers(lifePath: number): number[] {
    const compatibility: Record<number, number[]> = {
      1: [1, 5, 7],
      2: [2, 4, 8],
      3: [3, 6, 9],
      4: [2, 4, 8],
      5: [1, 5, 7],
      6: [3, 6, 9],
      7: [1, 5, 7],
      8: [2, 4, 8],
      9: [3, 6, 9],
      11: [2, 11, 22],
      22: [4, 22, 33],
      33: [6, 33, 11],
    };
    return compatibility[lifePath] || [1, 2, 3];
  }

  /**
   * Gera orientação espiritual
   */
  private generateSpiritualGuidance(
    lifePath: number,
    destiny: number,
    soulUrge: number,
  ): string {
    let guidance = `Querida alma, sua jornada numerológica revela um propósito sagrado. `;

    guidance += `\n\nSeu Caminho de Vida ${lifePath} é o fio condutor desta encarnação - honre-o mesmo quando parecer difícil. `;
    guidance += `Seu Destino ${destiny} mostra os talentos que você trouxe de outras vidas - use-os com gratidão. `;
    guidance += `Seu Desejo da Alma ${soulUrge} é a voz do seu eu superior - escute-a nos momentos de silêncio.`;

    guidance += `\n\nConselhos para seu crescimento espiritual:`;
    guidance += `\n• Medite diariamente conectando-se com a energia do número ${lifePath}`;
    guidance += `\n• Em momentos de dúvida, lembre-se do propósito inscrito no número ${destiny}`;
    guidance += `\n• Honre os desejos do seu número ${soulUrge} - eles são mensagens divinas`;

    if (isMasterNumber(lifePath) || isMasterNumber(destiny)) {
      guidance += `\n\nComo portador de números mestres, você tem uma responsabilidade especial. A luz que você carrega pode iluminar muitos. Não se esconda - o mundo precisa do seu brilho único.`;
    }

    return guidance;
  }

  /**
   * Gera mensagem do Ano Pessoal
   */
  private generatePersonalYearMessage(personalYear: number): string {
    const messages: Record<number, string> = {
      1: 'Este é um Ano Pessoal 1 - um ano de novos começos! O universo limpa o quadro para que você possa criar algo totalmente novo. É tempo de plantar sementes, iniciar projetos e afirmar sua independência. Sua energia é pioneira.',
      2: 'Este é um Ano Pessoal 2 - um ano de paciência e cooperação. Após os novos começos do ano anterior, agora é tempo de nutrir, aguardar e construir parcerias. A diplomacia é sua melhor aliada.',
      3: 'Este é um Ano Pessoal 3 - um ano de expressão e criatividade! A energia flui livremente para projetos criativos, comunicação e alegria. Expresse-se, socialize e deixe sua luz brilhar.',
      4: 'Este é um Ano Pessoal 4 - um ano de trabalho e construção. É tempo de colocar ordem na casa, construir fundações sólidas e trabalhar com dedicação. A disciplina traz grandes recompensas.',
      5: 'Este é um Ano Pessoal 5 - um ano de mudança e liberdade! Espere o inesperado e abrace a transformação. Viagens, novas experiências e liberdade definem este ciclo vibrante.',
      6: 'Este é um Ano Pessoal 6 - um ano focado em amor, família e responsabilidade. O lar e os relacionamentos próximos pedem atenção. É tempo de cuidar e ser cuidado.',
      7: 'Este é um Ano Pessoal 7 - um ano de introspecção e crescimento espiritual. O universo convida você a ir para dentro, refletir e buscar sabedoria. Menos ação externa, mais profundidade interna.',
      8: 'Este é um Ano Pessoal 8 - um ano de poder e abundância! Colheita material e reconhecimento estão favorecidos. É tempo de assumir autoridade e manifestar seus objetivos.',
      9: 'Este é um Ano Pessoal 9 - um ano de conclusões e liberação. Ciclos se completam, relacionamentos e situações do passado pedem fechamento. Libere o antigo para abrir espaço ao novo.',
      11: 'Este é um Ano Pessoal 11 - um ano de iluminação espiritual elevada! Sua intuição está em seu pico. Preste atenção aos sinais, sonhos e sincronicidades. Você é um canal de luz.',
      22: 'Este é um Ano Pessoal 22 - um ano de manifestação magistral! Grandes sonhos podem se tornar realidade. Sua capacidade de construir está amplificada. Pense grande.',
      33: 'Este é um Ano Pessoal 33 - um ano de serviço amoroso e cura. Você é chamado a elevar outros através do amor incondicional. Sua compaixão transforma vidas.',
    };

    return messages[personalYear] || 'Este é um ano de oportunidades únicas para seu crescimento.';
  }

  /**
   * Retorna o tema do dia
   */
  private getDailyTheme(energy: number): string {
    const themes: Record<number, string> = {
      1: 'Iniciativa e Liderança',
      2: 'Cooperação e Harmonia',
      3: 'Criatividade e Expressão',
      4: 'Trabalho e Organização',
      5: 'Mudança e Aventura',
      6: 'Amor e Responsabilidade',
      7: 'Reflexão e Sabedoria',
      8: 'Poder e Abundância',
      9: 'Compaixão e Completude',
      11: 'Iluminação Espiritual',
      22: 'Manifestação Magistral',
      33: 'Amor Universal',
    };
    return themes[energy] || 'Energia Única';
  }

  /**
   * Gera orientação diária
   */
  private getDailyGuidance(combinedEnergy: number, personalNumber: number): string {
    const guidance: Record<number, string> = {
      1: 'Hoje é um dia para tomar iniciativa. Não espere pelos outros - lidere o caminho. Sua energia pioneira está amplificada. Comece aquele projeto, tome aquela decisão, seja o primeiro.',
      2: 'A cooperação é sua força hoje. Busque harmonia em seus relacionamentos, seja um mediador. Sua sensibilidade está aguçada - use-a para entender os outros.',
      3: 'Expresse-se! Hoje sua criatividade flui livremente. Comunique suas ideias, crie algo belo, espalhe alegria. Sua energia artística está em alta.',
      4: 'Foque no trabalho estruturado hoje. Organize, planeje, execute. Este é um dia para construir fundações sólidas. A disciplina traz resultados.',
      5: 'Abrace a mudança e a liberdade hoje! Esteja aberto ao inesperado. Viagens curtas, novas experiências e flexibilidade são favorecidas.',
      6: 'O amor e a família pedem atenção hoje. Cuide dos seus, embeleze seu ambiente. Responsabilidades do lar são gratificantes agora.',
      7: 'Hoje é um dia para reflexão profunda. Medite, estude, busque sabedoria. Sua intuição está especialmente aguçada. Ouça seu eu interior.',
      8: 'Assuntos materiais e de poder estão em destaque. Negocie, manifeste abundância, assuma autoridade. Sua capacidade de realização está forte.',
      9: 'Compaixão e altruísmo guiam seu dia. Ajude os outros, encerre ciclos, pratique o perdão. É um dia para servir ao bem maior.',
      11: 'Iluminação espiritual está disponível para você hoje. Sua intuição é cristalina. Preste atenção aos sinais e inspirações divinas.',
      22: 'Sua capacidade de manifestar está no máximo. Grandes ideias podem ser materializadas. Pense em projetos de longo alcance.',
      33: 'O amor incondicional flui através de você hoje. Cure com sua presença, ensine pelo exemplo. Você é um canal de luz.',
    };

    return guidance[combinedEnergy] || 'Siga sua intuição e confie no universo.';
  }

  /**
   * Retorna as horas favoráveis do dia
   */
  private getLuckyHours(energy: number): string[] {
    const baseHour = energy % 12 || 12;
    return [
      `${baseHour}:00 - ${baseHour}:59`,
      `${(baseHour + 6) % 12 || 12}:00 - ${(baseHour + 6) % 12 || 12}:59`,
      `${(baseHour + 9) % 12 || 12}:00 - ${(baseHour + 9) % 12 || 12}:59`,
    ];
  }

  /**
   * Retorna a cor do dia
   */
  private getColorOfTheDay(energy: number): string {
    const colors: Record<number, string> = {
      1: 'Vermelho - cor do poder e iniciativa',
      2: 'Laranja - cor da cooperação e harmonia',
      3: 'Amarelo - cor da criatividade e alegria',
      4: 'Verde - cor da estabilidade e crescimento',
      5: 'Azul turquesa - cor da liberdade e mudança',
      6: 'Azul índigo - cor do amor e devoção',
      7: 'Violeta - cor da espiritualidade e sabedoria',
      8: 'Dourado - cor da abundância e poder',
      9: 'Branco iridescente - cor da compaixão universal',
      11: 'Prata luminosa - cor da iluminação',
      22: 'Dourado real - cor da manifestação magistral',
      33: 'Rosa celestial - cor do amor crístico',
    };
    return colors[energy] || 'Cristalino - cor da pureza';
  }

  /**
   * Retorna a afirmação diária
   */
  private getDailyAffirmation(energy: number): string {
    const affirmations: Record<number, string> = {
      1: 'Eu sou um líder. Eu inicio com coragem e confiança. O universo apoia meus novos começos.',
      2: 'Eu sou harmonia em movimento. Minhas conexões são sagradas e cheias de amor.',
      3: 'Minha criatividade é infinita. Eu expresso minha verdade com alegria e liberdade.',
      4: 'Eu construo meu futuro com dedicação. Cada passo sólido me aproxima dos meus sonhos.',
      5: 'Eu abraço a mudança com entusiasmo. A liberdade é meu direito divino.',
      6: 'Eu amo incondicionalmente. Meu lar é um santuário de paz e beleza.',
      7: 'A sabedoria do universo flui através de mim. Eu confio em minha intuição.',
      8: 'A abundância é meu estado natural. Eu manifesto prosperidade em todas as áreas.',
      9: 'Minha compaixão cura o mundo. Eu sirvo ao bem maior com amor.',
      11: 'Eu sou um canal de luz divina. Minha intuição me guia perfeitamente.',
      22: 'Eu transformo sonhos em realidade. Minha visão beneficia toda a humanidade.',
      33: 'Eu sou amor em forma humana. Minha presença cura e eleva.',
    };
    return affirmations[energy] || 'Eu estou alinhado com meu propósito divino.';
  }

  /**
   * Retorna o aviso do dia
   */
  private getDailyWarning(energy: number): string {
    const warnings: Record<number, string> = {
      1: 'Cuidado com a teimosia e o egoísmo. Liderar não é dominar. Ouça os outros também.',
      2: 'Evite a indecisão e a dependência emocional. Sua sensibilidade é força, não fraqueza.',
      3: 'Não se disperse em muitos projetos. Foque sua energia criativa para colher resultados.',
      4: 'Cuidado com a rigidez e o excesso de trabalho. Flexibilidade também é força.',
      5: 'Evite a impulsividade e a inquietação excessiva. Liberdade com responsabilidade.',
      6: 'Não se sacrifique pelos outros. Cuidar de si é tão importante quanto cuidar dos demais.',
      7: 'Cuidado com o isolamento excessivo. A sabedoria deve ser compartilhada.',
      8: 'Evite o materialismo e o autoritarismo. O poder deve servir, não dominar.',
      9: 'Cuidado com o idealismo excessivo. Mantenha os pés no chão enquanto serve.',
      11: 'Evite a ansiedade e a tensão nervosa. Ancore sua energia espiritual.',
      22: 'Não se perca em projetos grandiosos demais. Divida em etapas realizáveis.',
      33: 'Cuidado com o martírio. Você não precisa carregar o mundo sozinho.',
    };
    return warnings[energy] || 'Mantenha o equilíbrio em todas as coisas.';
  }

  /**
   * Retorna as oportunidades do dia
   */
  private getDailyOpportunities(energy: number): string[] {
    const opportunities: Record<number, string[]> = {
      1: ['Iniciar um novo projeto', 'Assumir liderança', 'Fazer networking'],
      2: ['Fortalecer parcerias', 'Mediar conflitos', 'Cultivar relacionamentos'],
      3: ['Expressar criatividade', 'Comunicar ideias', 'Participar de eventos sociais'],
      4: ['Organizar finanças', 'Planejar o futuro', 'Trabalhar em projetos estruturados'],
      5: ['Explorar novas possibilidades', 'Fazer mudanças', 'Viajar ou aprender algo novo'],
      6: ['Cuidar da família', 'Decorar seu espaço', 'Resolver assuntos do lar'],
      7: ['Estudar e pesquisar', 'Meditar e refletir', 'Desenvolver habilidades analíticas'],
      8: ['Negociar contratos', 'Investir', 'Assumir posição de autoridade'],
      9: ['Ajudar os outros', 'Participar de causas humanitárias', 'Concluir projetos pendentes'],
      11: ['Desenvolver intuição', 'Ensinar ou inspirar', 'Conectar-se espiritualmente'],
      22: ['Planejar projetos de grande escala', 'Construir legados', 'Materializar visões'],
      33: ['Curar e aconselhar', 'Servir ao próximo', 'Espalhar amor incondicional'],
    };
    return opportunities[energy] || ['Seguir sua intuição', 'Manter mente aberta', 'Confiar no processo'];
  }
}
