import { Injectable, Logger } from '@nestjs/common';
import {
  ZodiacSign,
  ZODIAC_SIGNS,
  DailyHoroscope,
  ZODIAC_SIGN_DATA,
  ELEMENT_SIGNS,
} from '../types/zodiac.types';
import { ZODIAC_SIGNS as ZODIAC_DATA } from '../data/zodiac.data';

// Import shared types
import {
  WeeklyHoroscope,
  MonthlyHoroscope,
} from '../types/astrology.types';

/**
 * DailyHoroscopeService
 *
 * Generates mystical, engaging horoscope content for daily, weekly,
 * and monthly periods. Uses template-based generation with dynamic
 * content that varies based on date, planetary influences, and sign.
 */
@Injectable()
export class DailyHoroscopeService {
  private readonly logger = new Logger(DailyHoroscopeService.name);

  /**
   * Templates for general daily horoscopes
   */
  private readonly generalTemplates: Record<string, string[]> = {
    fire: [
      'O universo acende uma chama de inspiracao em voce hoje, {sign}. Sua energia radiante atrai oportunidades inesperadas.',
      'Marte sopra ventos de coragem em sua direcao. E hora de dar o proximo passo naquele projeto que voce tem adiado.',
      'As estrelas conspiram a seu favor, {sign}. Sua paixao natural sera o combustivel para grandes conquistas hoje.',
      'O fogo interior arde com intensidade especial. Use essa energia para transformar obstaculos em trampolins.',
      'Hoje o cosmos celebra sua natureza {sign}. Deixe sua luz interior brilhar sem medo do julgamento.',
      'Uma onda de criatividade invade seu dia. Ideias inovadoras surgirao quando voce menos esperar.',
    ],
    earth: [
      'Venus estabiliza suas energias hoje, {sign}. E um dia excelente para construir bases solidas.',
      'O universo recompensa sua paciencia e dedicacao. Resultados concretos comecam a se manifestar.',
      'Saturno abencoa seus esforcos praticos. Cada pequeno passo de hoje contribui para um grande legado.',
      'A Terra nutre seus sonhos mais realistas. Confie no processo e continue construindo tijolo por tijolo.',
      'Hoje, sua natureza pratica e sua maior aliada. Decisoes sensiveis trarão resultados duradouros.',
      'As estrelas favorecem investimentos e planejamento. Sua visao de longo prazo esta especialmente aguçada.',
    ],
    air: [
      'Mercurio ativa seu brilhantismo mental hoje, {sign}. Comunicacao e conexoes fluem com leveza.',
      'O vento cosmico traz novas ideias e perspectivas. Mantenha sua mente aberta para mensagens inesperadas.',
      'Hoje sua palavra tem poder especial. Use-a com sabedoria para inspirar e conectar.',
      'O universo convida voce a explorar novos horizontes intelectuais. Curiosidade e sua bussola hoje.',
      'Conexoes sociais brilham sob a luz das estrelas. Uma conversa casual pode abrir portas importantes.',
      'Sua mente agil danÇa entre possibilidades. Confie nas suas intuicoes mentais hoje.',
    ],
    water: [
      'A Lua sussurra segredos ao seu coracao hoje, {sign}. Sua intuicao e seu guia mais confiavel.',
      'Ondas de emocao profunda trazem clareza espiritual. Honre seus sentimentos sem julgamento.',
      'Netuno abre portais para sonhos reveladores. Preste atencao nas mensagens do seu subconsciente.',
      'Hoje, sua sensibilidade e um superpoder. Voce percebe o que outros nao conseguem ver.',
      'O oceano cosmico acalma suas aguas internas. E um dia para nutrir sua alma e curar antigas feridas.',
      'Sua empatia esta em alta. Use esse dom para criar conexoes genuinas e transformadoras.',
    ],
  };

  /**
   * Templates for love horoscopes
   */
  private readonly loveTemplates: Record<string, string[]> = {
    fire: [
      'Paixao inflama o ar ao seu redor. Se estiver em um relacionamento, reacenda a chama com gestos espontaneos.',
      'Venus e Marte danÇam em seu favor. Atracoes magneticas podem surgir em lugares inesperados.',
      'Seu carisma natural esta irresistivel hoje. Use essa energia para expressar seus sentimentos com coragem.',
      'O amor pede autenticidade. Seja voce mesmo(a) e atraia quem valoriza sua verdadeira essencia.',
      'Aventuras romanticas estao no horizonte. Esteja aberto(a) para experiencias que tirem voce da zona de conforto.',
    ],
    earth: [
      'Gestos praticos de amor falam mais alto que palavras. Demonstre afeto atraves de acoes concretas.',
      'Estabilidade emocional fortalece lacos existentes. E um bom dia para conversas serias sobre o futuro.',
      'Venus abencoa compromissos duradouros. Se busca um relacionamento serio, as estrelas estao alinhadas.',
      'Sensualidade e prazer estao em alta. Permita-se desfrutar dos prazeres simples do amor.',
      'Lealdade e valorizada hoje. Reconheça quem esta ao seu lado nas alegrias e dificuldades.',
    ],
    air: [
      'Comunicacao e a chave para o coracao hoje. Conversas profundas criam intimidade verdadeira.',
      'Flerte intelectual esta favorecido. Mentes que se encontram podem criar conexoes duradouras.',
      'Novas conexoes sociais podem se transformar em algo mais. Mantenha a mente e o coracao abertos.',
      'Leveza e humor sao seus aliados romanticos hoje. Nao leve o amor tao a serio.',
      'Amizades podem evoluir para romance. Observe aqueles que ja estao em sua vida com novos olhos.',
    ],
    water: [
      'Conexoes emocionais profundas sao favorecidas. Vulnerabilidade e coragem no amor hoje.',
      'Sua intuicao romantica esta aguÇada. Confie nos sinais que o universo envia sobre seus relacionamentos.',
      'Cura emocional acontece atraves do amor. Permita-se ser cuidado(a) por quem te ama.',
      'Sonhos romanticos podem trazer mensagens importantes. Preste atencao no que seu subconsciente revela.',
      'Amor incondicional flui naturalmente de voce. Esse magnetismo atrai almas compatíveis.',
    ],
  };

  /**
   * Templates for career horoscopes
   */
  private readonly careerTemplates: Record<string, string[]> = {
    fire: [
      'Lideranca natural se destaca no trabalho. Tome a iniciativa em projetos que te inspiram.',
      'Sua energia contagia colegas. Use esse carisma para motivar a equipe em direcao a metas comuns.',
      'Oportunidades surgem para quem ousa. Nao tenha medo de propor ideias inovadoras.',
      'Competicao saudavel impulsiona seu melhor desempenho. Canalize essa energia produtivamente.',
      'Reconhecimento profissional esta proximo. Seus esforços passados comecam a dar frutos.',
    ],
    earth: [
      'Trabalho metodico traz resultados hoje. Continue construindo seu sucesso passo a passo.',
      'Financas profissionais estao favorecidas. E um bom momento para negociacoes e contratos.',
      'Sua confiabilidade e notada pelos superiores. Essa reputacao abre portas importantes.',
      'Planejamento de longo prazo e essencial agora. Pense onde quer estar profissionalmente em 5 anos.',
      'Paciencia com processos burocraticos sera recompensada. Mantenha o foco nos detalhes.',
    ],
    air: [
      'Networking e crucial para seu crescimento profissional hoje. Conecte-se com pessoas inspiradoras.',
      'Ideias inovadoras fluem facilmente. Compartilhe suas visões com quem pode ajuda-las a florescer.',
      'Comunicacao clara resolve mal-entendidos no trabalho. Use suas palavras com precisao.',
      'Colaboracao traz melhores resultados que esforço solo. Busque parcerias estrategicas.',
      'Aprendizado e desenvolvimento estao favorecidos. Invista em cursos ou novas habilidades.',
    ],
    water: [
      'Intuicao guia decisões profissionais importantes. Confie nos seus instintos sobre colegas e projetos.',
      'Trabalho criativo flui naturalmente. Projetos artisticos ou de cura recebem impulso cosmico.',
      'Empatia com clientes ou colegas abre novas oportunidades. Seu lado humano e seu diferencial.',
      'Ambiente de trabalho harmonioso e essencial hoje. Cuide da energia ao seu redor.',
      'Profissoes de ajuda e servico estao especialmente favorecidas. Seu proposito se alinha com sua carreira.',
    ],
  };

  /**
   * Templates for health horoscopes
   */
  private readonly healthTemplates: Record<string, string[]> = {
    fire: [
      'Energia fisica em alta. Aproveite para exercícios intensos e atividades ao ar livre.',
      'Cuidado com excesso de calor interno. Equilibre atividade com momentos de descanso.',
      'Esportes competitivos canalizam bem sua energia hoje. Mova-se com intensidade.',
      'Atencao a cabeca e sistema nervoso. Evite situacoes muito estressantes.',
      'Vitalidade renovada surge apos atividade fisica. Seu corpo pede movimento.',
    ],
    earth: [
      'Rotinas de autocuidado trazem equilibrio. Mantenha seus rituais de saude com consistencia.',
      'Alimentacao nutritiva e essencial hoje. Escolha alimentos que nutrem corpo e mente.',
      'Relaxamento muscular beneficia todo seu sistema. Considere uma massagem ou alongamento.',
      'Saude financeira afeta bem-estar geral. Equilibre gastos para reduzir estresse.',
      'Conexao com a natureza restaura sua energia. Caminhadas em áreas verdes sao recomendadas.',
    ],
    air: [
      'Respiracao consciente acalma a mente agitada. Pratique tecnicas de respiracao ao longo do dia.',
      'Sistema nervoso precisa de atencao. Evite excesso de estimulos e informacoes.',
      'Interacoes sociais elevam seu animo. Converse com pessoas que te fazem bem.',
      'Atividades mentais relaxantes beneficiam a saude. Leitura ou jogos mentais leves sao indicados.',
      'Atencao aos pulmoes e vias respiratorias. Ar fresco e fundamental hoje.',
    ],
    water: [
      'Hidratacao e equilibrio emocional caminham juntos hoje. Beba bastante agua.',
      'Terapias aquaticas beneficiam corpo e alma. Banhos longos ou natacao sao recomendados.',
      'Saude emocional precisa de atencao. Permita-se sentir sem julgamento.',
      'Intuicao guia escolhas de saude. Seu corpo sabe do que precisa - ouça-o.',
      'Descanso e essencial para recarregar. Honre seus ciclos de energia e recuperação.',
    ],
  };

  /**
   * Mood descriptions for each element
   */
  private readonly moods: Record<string, string[]> = {
    fire: ['energico', 'apaixonado', 'inspirado', 'determinado', 'entusiasmado', 'confiante', 'dinamico'],
    earth: ['estavel', 'centrado', 'pratico', 'produtivo', 'sereno', 'resiliente', 'focado'],
    air: ['curioso', 'comunicativo', 'leve', 'sociavel', 'criativo', 'versatil', 'inspirado'],
    water: ['intuitivo', 'sensivel', 'reflexivo', 'empático', 'sonhador', 'profundo', 'conectado'],
  };

  /**
   * Lucky times of day
   */
  private readonly luckyTimes: string[] = [
    '06:00', '08:30', '10:00', '11:11', '12:00', '14:00', '15:30',
    '16:00', '17:17', '18:00', '19:30', '20:00', '21:00', '22:22',
  ];

  /**
   * Mystical advice templates
   */
  private readonly adviceTemplates: string[] = [
    'O universo te convida a confiar no processo. O que parece caos e apenas reorganizacao para algo melhor.',
    'Sua luz interior e seu maior guia. Quando em duvida, volte para dentro e ouça sua sabedoria.',
    'Gratidao amplifica bencaos. Reconheça o que ja tem e mais abundancia fluira para voce.',
    'Nada e permanente - nem alegrias, nem tristezas. Abrace o momento presente com aceitacao.',
    'Seus pensamentos criam sua realidade. Escolha conscientemente o que deseja manifestar.',
    'Sincronia nao e coincidencia. Preste atencao nos padroes e mensagens ao seu redor.',
    'A paciencia e uma forma de fe. Confie que o timing do universo e perfeito.',
    'Libere o que nao te serve mais para abrir espaco para novas bencaos.',
    'Vulnerabilidade e forca, nao fraqueza. Permita-se ser visto em sua autenticidade.',
    'O amor que voce busca esta dentro de voce. Relacionamentos refletem seu amor proprio.',
    'Cada final e um novo começo disfarçado. Abrace as transicoes com coragem.',
    'Sua intuicao e uma bussola confiável. Ela ja sabe o caminho.',
  ];

  /**
   * Generate a daily horoscope for a specific sign and date
   *
   * @param sign - Zodiac sign
   * @param date - Date for the horoscope (defaults to today)
   * @returns Complete daily horoscope
   */
  generateDailyHoroscope(sign: ZodiacSign, date: Date = new Date()): DailyHoroscope {
    this.logger.log(`Generating daily horoscope for ${sign} on ${date.toISOString().split('T')[0]}`);

    const signData = ZODIAC_DATA[sign];
    const element = signData.element;

    // Use date as seed for consistent but varied content
    const seed = this.getDateSeed(date, sign);

    // Generate all sections
    const general = this.selectTemplate(this.generalTemplates[element], seed, sign);
    const love = this.selectTemplate(this.loveTemplates[element], seed + 1, sign);
    const career = this.selectTemplate(this.careerTemplates[element], seed + 2, sign);
    const health = this.selectTemplate(this.healthTemplates[element], seed + 3, sign);
    const mood = this.selectFromArray(this.moods[element], seed + 4);
    const advice = this.selectFromArray(this.adviceTemplates, seed + 5);

    // Generate lucky elements
    const luckyNumber = this.generateLuckyNumber(seed, signData.luckyNumbers);
    const luckyColor = this.selectFromArray(signData.luckyColors, seed + 6);
    const luckyTime = this.selectFromArray(this.luckyTimes, seed + 7);

    // Find compatible signs for today
    const compatibleSigns = this.findDailyCompatibleSigns(sign, seed);

    return {
      sign,
      date,
      general,
      love,
      career,
      health,
      luckyNumber,
      luckyColor,
      mood,
      compatibility: compatibleSigns[0],
    };
  }

  /**
   * Generate a weekly horoscope
   *
   * @param sign - Zodiac sign
   * @param weekStart - Start of the week (defaults to current week's Monday)
   * @returns Complete weekly horoscope
   */
  generateWeeklyHoroscope(sign: ZodiacSign, weekStart: Date = this.getMonday(new Date())): WeeklyHoroscope {
    this.logger.log(`Generating weekly horoscope for ${sign}`);

    const signData = ZODIAC_DATA[sign];
    const element = signData.element;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const seed = this.getDateSeed(weekStart, sign);

    // Weekly themes
    const weeklyThemes = [
      'Transformacao e Renascimento',
      'Novas Oportunidades',
      'Equilibrio e Harmonia',
      'Crescimento Interior',
      'Conexoes Significativas',
      'Realizacao de Sonhos',
      'Cura e Renovacao',
      'Abundancia e Prosperidade',
    ];

    const theme = this.selectFromArray(weeklyThemes, seed);
    const overview = this.generateWeeklyOverview(sign, element, seed);
    const love = this.generateWeeklyLove(sign, element, seed);
    const career = this.generateWeeklyCareer(sign, element, seed);
    const health = this.generateWeeklyHealth(sign, element, seed);

    // Generate daily highlights
    const dailyHighlights = this.generateDailyHighlights(sign, weekStart, seed);

    // Determine best and challenging days
    const bestDays = this.determineBestDays(seed);
    const challengingDays = this.determineChallengingDays(seed);

    // Weekly affirmation
    const affirmations = [
      `Eu sou um(a) ${signData.name} poderoso(a) e o universo conspira a meu favor.`,
      `Cada dia me aproximo mais do meu eu mais elevado.`,
      `Abracoo as energias de ${signData.name} e brilho com minha luz autentica.`,
      `Confio no timing divino e sei que tudo acontece para meu maior bem.`,
      `Sou digno(a) de amor, sucesso e felicidade abundante.`,
    ];
    const affirmation = this.selectFromArray(affirmations, seed + 10);

    return {
      sign,
      weekStart,
      weekEnd,
      theme,
      overview,
      love,
      career,
      health,
      dailyHighlights,
      bestDays,
      challengingDays,
      affirmation,
    };
  }

  /**
   * Generate a monthly horoscope
   *
   * @param sign - Zodiac sign
   * @param month - Month (1-12)
   * @param year - Year
   * @returns Complete monthly horoscope
   */
  generateMonthlyHoroscope(
    sign: ZodiacSign,
    month: number = new Date().getMonth() + 1,
    year: number = new Date().getFullYear(),
  ): MonthlyHoroscope {
    this.logger.log(`Generating monthly horoscope for ${sign} - ${month}/${year}`);

    const signData = ZODIAC_DATA[sign];
    const element = signData.element;

    const seed = month * 100 + year + ZODIAC_SIGNS.indexOf(sign);

    // Monthly themes based on month and sign
    const monthlyThemes = this.getMonthlyThemes();
    const theme = this.selectFromArray(monthlyThemes, seed);

    const overview = this.generateMonthlyOverview(sign, month, year, seed);
    const love = this.generateMonthlyLove(sign, element, seed);
    const career = this.generateMonthlyCareer(sign, element, seed);
    const health = this.generateMonthlyHealth(sign, element, seed);
    const growth = this.generateMonthlyGrowth(sign, seed);

    // Key dates for the month
    const keyDates = this.generateKeyDates(sign, month, year, seed);

    // Planetary influences
    const planetaryInfluences = this.generatePlanetaryInfluences(sign, month, seed);

    // Monthly mantra
    const mantras = [
      `Eu sou a expressao mais elevada de ${signData.name}.`,
      `Cada dia deste mes traz novas oportunidades de crescimento.`,
      `Confio na jornada e abracoo minha evolucao.`,
      `O universo guia meus passos com amor e sabedoria.`,
      `Manifesto abundancia em todas as áreas da minha vida.`,
    ];
    const mantra = this.selectFromArray(mantras, seed + 20);

    // Weekly focus for each week of the month
    const weeklyFocus = this.generateWeeklyFocus(sign, seed);

    return {
      sign,
      month,
      year,
      theme,
      overview,
      love,
      career,
      health,
      growth,
      keyDates,
      planetaryInfluences,
      mantra,
      weeklyFocus,
    };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Generate a seed number from date and sign for consistent randomization
   */
  private getDateSeed(date: Date, sign: ZodiacSign): number {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
    );
    return dayOfYear + date.getFullYear() + ZODIAC_SIGNS.indexOf(sign) * 100;
  }

  /**
   * Select a template and replace placeholders
   */
  private selectTemplate(templates: string[], seed: number, sign: ZodiacSign): string {
    const index = seed % templates.length;
    const signData = ZODIAC_DATA[sign];
    return templates[index]
      .replace(/{sign}/g, signData.name)
      .replace(/{element}/g, signData.element);
  }

  /**
   * Select from an array using seed
   */
  private selectFromArray<T>(arr: T[], seed: number): T {
    return arr[seed % arr.length];
  }

  /**
   * Generate a lucky number based on sign's lucky numbers
   */
  private generateLuckyNumber(seed: number, luckyNumbers: number[]): number {
    // Combine sign's lucky numbers with date-based variation
    const baseNumber = luckyNumbers[seed % luckyNumbers.length];
    const variation = (seed % 10);
    return baseNumber + variation;
  }

  /**
   * Find compatible signs for today
   */
  private findDailyCompatibleSigns(sign: ZodiacSign, seed: number): ZodiacSign[] {
    const signData = ZODIAC_DATA[sign];
    const compatible = [...signData.compatibility];

    // Rotate based on seed for daily variation
    const rotation = seed % compatible.length;
    return [...compatible.slice(rotation), ...compatible.slice(0, rotation)];
  }

  /**
   * Get Monday of the current week
   */
  private getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  /**
   * Generate weekly overview
   */
  private generateWeeklyOverview(sign: ZodiacSign, element: string, seed: number): string {
    const signData = ZODIAC_DATA[sign];
    const overviews = [
      `Esta semana, ${signData.name}, o cosmos convida voce a uma jornada de autodescoberta. As energias de ${element} fluem com intensidade especial, trazendo clareza sobre seus desejos mais profundos e o caminho para realiza-los.`,
      `Uma semana de transformacoes sutis mas poderosas se desenha para voce, ${signData.name}. O universo trabalha nos bastidores para alinhar circunstâncias a seu favor. Mantenha a fe e continue agindo com intencao.`,
      `As estrelas danÇam em celebração a sua jornada, ${signData.name}. Esta semana traz oportunidades para brilhar em suas qualidades naturais de ${signData.traits.slice(0, 2).join(' e ')}.`,
    ];
    return this.selectFromArray(overviews, seed);
  }

  /**
   * Generate weekly love section
   */
  private generateWeeklyLove(sign: ZodiacSign, element: string, seed: number): string {
    const loveTexts = [
      'O amor pede autenticidade esta semana. Relacionamentos que honram sua verdade florescerao. Se solteiro(a), conexoes genuínas surgirao quando voce estiver sendo completamente voce mesmo(a).',
      'Venus abençoa sua vida amorosa. E um momento para aprofundar intimidade existente ou atrair novo romance baseado em valores compartilhados.',
      'Comunicacao amorosa esta em destaque. Conversas do coracao podem transformar relacionamentos. Nao tenha medo de expressar seus sentimentos mais profundos.',
    ];
    return this.selectFromArray(loveTexts, seed);
  }

  /**
   * Generate weekly career section
   */
  private generateWeeklyCareer(sign: ZodiacSign, element: string, seed: number): string {
    const careerTexts = [
      'Sua capacidade profissional esta em alta visibilidade. Use esta semana para demonstrar lideranca e propor ideias inovadoras. Reconhecimento esta proximo.',
      'Trabalho em equipe traz melhores resultados do que esforço individual. Busque colaborações estratégicas e valorize as contribuições dos outros.',
      'E um bom momento para planejamento de longo prazo na carreira. Onde voce quer estar profissionalmente em um ano? Comece a pavimentar esse caminho agora.',
    ];
    return this.selectFromArray(careerTexts, seed + 1);
  }

  /**
   * Generate weekly health section
   */
  private generateWeeklyHealth(sign: ZodiacSign, element: string, seed: number): string {
    const healthTexts = [
      'Equilibrio entre atividade e descanso e crucial esta semana. Ouça os sinais do seu corpo e respeite seus limites enquanto mantém movimento.',
      'Nutricao do corpo e da mente andam juntas. Escolhas alimentares conscientes combinadas com práticas de mindfulness trazem bem-estar holístico.',
      'Conexao com a natureza restaura suas energias. Reserve tempo para atividades ao ar livre e deixe os elementos naturais te recarregar.',
    ];
    return this.selectFromArray(healthTexts, seed + 2);
  }

  /**
   * Generate daily highlights for the week
   */
  private generateDailyHighlights(sign: ZodiacSign, weekStart: Date, seed: number): { day: string; highlight: string }[] {
    const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const highlights = [
      'Energia renovada para novos começos.',
      'Comunicação fluida traz soluções.',
      'Meio de semana traz clareza.',
      'Expansão e oportunidades surgem.',
      'Finalize projetos pendentes.',
      'Conexões sociais nutrem a alma.',
      'Reflexão e planejamento para a próxima semana.',
    ];

    return days.map((day, index) => ({
      day,
      highlight: highlights[(seed + index) % highlights.length],
    }));
  }

  /**
   * Determine best days of the week
   */
  private determineBestDays(seed: number): string[] {
    const allDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const index1 = seed % 7;
    const index2 = (seed + 3) % 7;
    return [allDays[index1], allDays[index2]];
  }

  /**
   * Determine challenging days
   */
  private determineChallengingDays(seed: number): string[] {
    const allDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const index = (seed + 5) % 7;
    return [allDays[index]];
  }

  /**
   * Get monthly themes
   */
  private getMonthlyThemes(): string[] {
    return [
      'O Mes da Manifestacao',
      'Renovacao Interior',
      'Expansao de Horizontes',
      'Construindo Fundacoes',
      'Florescimento Pessoal',
      'Harmonia e Equilibrio',
      'Transformacao Profunda',
      'Colheita de Bencaos',
      'Novos Comecos',
      'Integracao e Sabedoria',
      'Preparacao para o Futuro',
      'Celebracao e Gratidao',
    ];
  }

  /**
   * Generate monthly overview
   */
  private generateMonthlyOverview(sign: ZodiacSign, month: number, year: number, seed: number): string {
    const signData = ZODIAC_DATA[sign];
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    return `${monthNames[month - 1]} de ${year} traz para ${signData.name} um período de ${
      seed % 2 === 0 ? 'intenso crescimento e novas oportunidades' : 'profunda reflexao e consolidacao'
    }. As energias cosmicas deste mes favorecem ${
      signData.element === 'fire' ? 'iniciativas ousadas e lideranca' :
      signData.element === 'earth' ? 'construcao de bases solidas e prosperidade' :
      signData.element === 'air' ? 'conexoes significativas e aprendizado' :
      'intuicao aguçada e cura emocional'
    }. Suas qualidades naturais de ${signData.traits.slice(0, 2).join(' e ')} serao seus maiores trunfos. ` +
    `Confie no processo e permita que o universo guie seus passos ao longo deste mes transformador.`;
  }

  /**
   * Generate monthly love section
   */
  private generateMonthlyLove(sign: ZodiacSign, element: string, seed: number): string {
    const texts = [
      'Este mes ilumina sua vida amorosa com possibilidades encantadoras. Para os comprometidos, e hora de renovar votos e aprofundar a intimidade. Para os solteiros, Venus favorece encontros que podem se transformar em algo significativo. O amor pede que voce seja vulnerável e autêntico(a).',
      'As estrelas danÇam a favor do romance este mes. Conexoes do passado podem ressurgir trazendo novas perspectivas, enquanto novas paixoes podem nascer de amizades existentes. Mantenha seu coracao aberto e confie nos sinais que o universo envia.',
      'Um mes para curar padroes amorosos do passado e criar espaco para relacionamentos mais saudaveis. Se em um relacionamento, conversas profundas fortalecem lacos. Se solteiro(a), trabalhe em si mesmo(a) para atrair o amor que merece.',
    ];
    return this.selectFromArray(texts, seed);
  }

  /**
   * Generate monthly career section
   */
  private generateMonthlyCareer(sign: ZodiacSign, element: string, seed: number): string {
    const texts = [
      'Profissionalmente, este mes traz oportunidades de crescimento significativas. Seu trabalho duro esta prestes a ser reconhecido. Mantenha o foco em seus objetivos de longo prazo e nao se deixe distrair por pequenas turbulencias. Networking estrategico abre portas importantes.',
      'As energias cosmicas favorecem empreendedorismo e iniciativas ousadas. Se tem um projeto engavetado, este e o momento de tira-lo do papel. Para funcionarios, e hora de pedir aquele aumento ou promocao - as estrelas apoiam sua assertividade.',
      'Um mes para consolidar conquistas e planejar proximos passos. Financas pedem atencao especial - bons investimentos feitos agora renderao frutos no futuro. Colaboracoes profissionais frutiferas estao favorecidas.',
    ];
    return this.selectFromArray(texts, seed + 1);
  }

  /**
   * Generate monthly health section
   */
  private generateMonthlyHealth(sign: ZodiacSign, element: string, seed: number): string {
    const texts = [
      'Saude holística e o tema do mes. Cuide nao apenas do corpo, mas tambem da mente e espirito. Novas rotinas de exercicio ou alimentação encontram menos resistencia agora. Terapias alternativas podem trazer beneficios surpreendentes.',
      'Energia vital em alta, mas cuidado com excessos. Equilibre atividade com descanso adequado. O sistema nervoso pede atencao especial - práticas de relaxamento sao altamente recomendadas. Conexao com a natureza restaura.',
      'Este mes convida a uma revisao dos habitos de saude. O que esta funcionando? O que precisa mudar? Pequenos ajustes consistentes trazem grandes resultados ao longo do tempo. Hidratacao e sono de qualidade sao fundamentais.',
    ];
    return this.selectFromArray(texts, seed + 2);
  }

  /**
   * Generate monthly growth section
   */
  private generateMonthlyGrowth(sign: ZodiacSign, seed: number): string {
    const signData = ZODIAC_DATA[sign];
    const growthAreas = [
      `Este mes convida ${signData.name} a trabalhar em ${signData.weaknesses[0]}. Reconhecer essa area de crescimento e o primeiro passo para transforma-la em forca.`,
      `Desenvolvimento pessoal esta em destaque. Cursos, leituras ou mentorias que alinhem com seus valores de ${signData.name} trazem evolucao acelerada.`,
      `A jornada interior e o tema do mes. Meditacao, journaling ou terapia ajudam a integrar experiencias passadas e clarear o caminho futuro.`,
    ];
    return this.selectFromArray(growthAreas, seed);
  }

  /**
   * Generate key dates for the month
   */
  private generateKeyDates(sign: ZodiacSign, month: number, year: number, seed: number): { date: string; significance: string }[] {
    const significances = [
      'Lua Nova traz energia de novos começos',
      'Aspectos favoráveis para decisões importantes',
      'Lua Cheia ilumina questões emocionais',
      'Mercúrio favorece comunicações importantes',
      'Venus abençoa assuntos do coração',
      'Energia de manifestação em alta',
    ];

    const dates: { date: string; significance: string }[] = [];
    for (let i = 0; i < 4; i++) {
      const day = ((seed + i * 7) % 28) + 1;
      dates.push({
        date: `${day}`,
        significance: significances[(seed + i) % significances.length],
      });
    }

    return dates.sort((a, b) => parseInt(a.date) - parseInt(b.date));
  }

  /**
   * Generate planetary influences
   */
  private generatePlanetaryInfluences(sign: ZodiacSign, month: number, seed: number): string {
    const signData = ZODIAC_DATA[sign];
    const influences = [
      `${signData.rulingPlanet.charAt(0).toUpperCase() + signData.rulingPlanet.slice(1)} traz energia especial para ${signData.name} este mes.`,
      'Jupiter expande oportunidades em areas inesperadas.',
      'Saturno ensina licoes valiosas atraves de desafios.',
      'Venus doça os relacionamentos e atrai abundancia.',
      'Marte impulsiona acao e iniciativa.',
    ];

    return `Os transitos planetarios deste mes favorecem ${
      signData.element === 'fire' ? 'iniciativas audaciosas' :
      signData.element === 'earth' ? 'construcao pratica' :
      signData.element === 'air' ? 'conexoes e aprendizado' : 'intuicao e cura'
    }. ${this.selectFromArray(influences, seed)} ` +
    `As fases lunares trazem ritmo natural para suas atividades - siga o fluxo cosmico para melhores resultados.`;
  }

  /**
   * Generate weekly focus for each week of the month
   */
  private generateWeeklyFocus(sign: ZodiacSign, seed: number): string[] {
    const focuses = [
      'Primeira semana: Planejamento e organizacao',
      'Segunda semana: Acao e iniciativa',
      'Terceira semana: Ajustes e refinamentos',
      'Quarta semana: Finalizacao e celebracao',
    ];

    const variations = [
      ['Semear intenções', 'Cultivar ações', 'Nutrir crescimento', 'Colher resultados'],
      ['Introspecção', 'Conexões', 'Realizações', 'Gratidão'],
      ['Novos começos', 'Desenvolvimento', 'Aprofundamento', 'Integração'],
    ];

    const selected = variations[seed % variations.length];
    return selected.map((focus, i) => `Semana ${i + 1}: ${focus}`);
  }
}
