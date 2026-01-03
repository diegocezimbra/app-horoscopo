/**
 * Astrological Houses Data
 *
 * The 12 houses represent different areas of life in the birth chart.
 * Each house governs specific themes and life experiences.
 */

import { ZodiacSign } from '../types/astrology.types';

/**
 * Interface for house data
 */
export interface HouseData {
  /** House number (1-12) */
  number: number;
  /** Traditional name */
  name: string;
  /** Latin name */
  latinName: string;
  /** Core themes governed by this house */
  themes: string[];
  /** Natural ruling sign */
  naturalSign: ZodiacSign;
  /** Natural ruling planet */
  naturalPlanet: string;
  /** Keywords associated with this house */
  keywords: string[];
  /** Detailed description */
  description: string;
  /** Body parts associated */
  bodyParts: string[];
  /** House type (angular, succedent, cadent) */
  type: 'angular' | 'succedent' | 'cadent';
  /** Element affinity */
  element: 'fire' | 'earth' | 'air' | 'water';
  /** Questions this house answers */
  questionsAnswered: string[];
}

/**
 * Complete data for all 12 astrological houses
 */
export const HOUSES: Record<number, HouseData> = {
  1: {
    number: 1,
    name: 'Casa da Identidade',
    latinName: 'Vita',
    themes: ['identidade', 'aparencia', 'personalidade', 'comeco', 'corpo fisico'],
    naturalSign: 'aries',
    naturalPlanet: 'Marte',
    keywords: ['eu', 'corpo', 'imagem', 'iniciativa', 'nascimento', 'mascara social', 'primeiro impacto'],
    description: 'A Primeira Casa, tambem conhecida como Ascendente, representa quem voce e ao mundo. E a mascara que voce usa, sua aparencia fisica, e como voce inicia novos projetos. E o nascer do sol no seu mapa natal.',
    bodyParts: ['cabeca', 'rosto', 'cerebro'],
    type: 'angular',
    element: 'fire',
    questionsAnswered: [
      'Como me apresento ao mundo?',
      'Qual e minha primeira impressao?',
      'Como inicio novos projetos?',
      'Qual e minha aparencia fisica natural?',
    ],
  },

  2: {
    number: 2,
    name: 'Casa dos Valores',
    latinName: 'Lucrum',
    themes: ['dinheiro', 'posses', 'autoestima', 'valores', 'recursos'],
    naturalSign: 'taurus',
    naturalPlanet: 'Venus',
    keywords: ['dinheiro', 'posses', 'talentos', 'seguranca', 'autoestima', 'alimentacao', 'conforto material'],
    description: 'A Segunda Casa governa recursos materiais, dinheiro que voce ganha, posses e seu senso de valor proprio. Mostra como voce lida com seguranca material e o que voce considera valioso.',
    bodyParts: ['pescoco', 'garganta', 'ouvidos'],
    type: 'succedent',
    element: 'earth',
    questionsAnswered: [
      'Como ganho dinheiro?',
      'O que eu valorizo?',
      'Qual e minha relacao com posses?',
      'Como construo seguranca material?',
    ],
  },

  3: {
    number: 3,
    name: 'Casa da Comunicacao',
    latinName: 'Fratres',
    themes: ['comunicacao', 'aprendizado', 'irmaos', 'vizinhanca', 'viagens curtas'],
    naturalSign: 'gemini',
    naturalPlanet: 'Mercurio',
    keywords: ['comunicacao', 'mente', 'irmaos', 'vizinhos', 'escola', 'escrita', 'transporte local'],
    description: 'A Terceira Casa rege a comunicacao diaria, pensamento logico, educacao basica e relacoes com irmaos e vizinhos. Mostra como voce processa e compartilha informacoes.',
    bodyParts: ['bracos', 'maos', 'pulmoes', 'ombros'],
    type: 'cadent',
    element: 'air',
    questionsAnswered: [
      'Como me comunico?',
      'Qual e minha relacao com irmaos?',
      'Como aprendo coisas novas?',
      'Como e meu ambiente imediato?',
    ],
  },

  4: {
    number: 4,
    name: 'Casa do Lar',
    latinName: 'Genitor',
    themes: ['lar', 'familia', 'raizes', 'ancestrais', 'emocoes profundas'],
    naturalSign: 'cancer',
    naturalPlanet: 'Lua',
    keywords: ['lar', 'familia', 'mae', 'raizes', 'ancestrais', 'propriedade', 'seguranca emocional', 'velhice'],
    description: 'A Quarta Casa, o Fundo do Ceu (IC), representa seu lar, familia de origem, raizes ancestrais e fundacao emocional. E seu santuario interno e final da vida.',
    bodyParts: ['peito', 'estomago', 'seios'],
    type: 'angular',
    element: 'water',
    questionsAnswered: [
      'Como e minha vida domestica?',
      'Qual e minha heranca emocional?',
      'Como sera minha velhice?',
      'O que me faz sentir em casa?',
    ],
  },

  5: {
    number: 5,
    name: 'Casa da Criatividade',
    latinName: 'Nati',
    themes: ['criatividade', 'romance', 'filhos', 'diversao', 'autoexpressao'],
    naturalSign: 'leo',
    naturalPlanet: 'Sol',
    keywords: ['criatividade', 'romance', 'filhos', 'jogos', 'prazer', 'arte', 'especulacao', 'hobbies'],
    description: 'A Quinta Casa governa a expressao criativa, casos amorosos, filhos, diversao e especulacao. E onde voce brilha, se diverte e expressa sua alegria de viver.',
    bodyParts: ['coracao', 'costas superiores', 'coluna'],
    type: 'succedent',
    element: 'fire',
    questionsAnswered: [
      'Como expresso minha criatividade?',
      'Como e minha vida romantica?',
      'Como e minha relacao com filhos?',
      'O que me traz alegria?',
    ],
  },

  6: {
    number: 6,
    name: 'Casa da Saude',
    latinName: 'Valetudo',
    themes: ['saude', 'trabalho diario', 'rotina', 'servico', 'animais de estimacao'],
    naturalSign: 'virgo',
    naturalPlanet: 'Mercurio',
    keywords: ['saude', 'trabalho', 'rotina', 'servico', 'empregados', 'dieta', 'habitos', 'organizacao'],
    description: 'A Sexta Casa rege a saude fisica, trabalho diario, rotinas, servico aos outros e cuidado com detalhes. Mostra como voce cuida de si e serve ao proximo.',
    bodyParts: ['intestinos', 'sistema digestivo', 'abdomen'],
    type: 'cadent',
    element: 'earth',
    questionsAnswered: [
      'Como e minha saude?',
      'Qual e minha rotina diaria?',
      'Como sirvo aos outros?',
      'Como e meu ambiente de trabalho?',
    ],
  },

  7: {
    number: 7,
    name: 'Casa das Parcerias',
    latinName: 'Uxor',
    themes: ['casamento', 'parcerias', 'contratos', 'relacionamentos', 'inimigos abertos'],
    naturalSign: 'libra',
    naturalPlanet: 'Venus',
    keywords: ['parceiro', 'casamento', 'contratos', 'socios', 'justica', 'equilibrio', 'o outro'],
    description: 'A Setima Casa, o Descendente, representa parcerias significativas, casamento e como voce se relaciona intimamente com outros. E o espelho de si mesmo.',
    bodyParts: ['rins', 'regiao lombar', 'pele'],
    type: 'angular',
    element: 'air',
    questionsAnswered: [
      'Quem e meu parceiro ideal?',
      'Como me comporto em relacionamentos?',
      'O que busco em parcerias?',
      'Quais sao meus padroes de relacionamento?',
    ],
  },

  8: {
    number: 8,
    name: 'Casa da Transformacao',
    latinName: 'Mors',
    themes: ['transformacao', 'morte', 'sexo', 'recursos compartilhados', 'oculto'],
    naturalSign: 'scorpio',
    naturalPlanet: 'Plutao',
    keywords: ['transformacao', 'morte', 'heranca', 'sexualidade', 'poder', 'oculto', 'psicologia', 'regeneracao'],
    description: 'A Oitava Casa governa transformacao profunda, morte e renascimento, intimidade sexual, recursos compartilhados e misterios ocultos. E a casa do poder.',
    bodyParts: ['orgaos reprodutivos', 'orgaos excretores', 'nariz'],
    type: 'succedent',
    element: 'water',
    questionsAnswered: [
      'Como lido com transformacoes?',
      'Qual e minha relacao com poder?',
      'Como e minha intimidade sexual?',
      'O que preciso deixar morrer em mim?',
    ],
  },

  9: {
    number: 9,
    name: 'Casa da Filosofia',
    latinName: 'Iter',
    themes: ['filosofia', 'viagens longas', 'educacao superior', 'religiao', 'lei'],
    naturalSign: 'sagittarius',
    naturalPlanet: 'Jupiter',
    keywords: ['viagens', 'filosofia', 'religiao', 'universidade', 'publicacao', 'estrangeiros', 'expansao mental'],
    description: 'A Nona Casa rege a busca por significado, viagens internacionais, estudos superiores, filosofia e espiritualidade. E a expansao da mente alem do conhecido.',
    bodyParts: ['quadris', 'coxas', 'figado'],
    type: 'cadent',
    element: 'fire',
    questionsAnswered: [
      'Qual e minha filosofia de vida?',
      'Como expando meus horizontes?',
      'Qual e minha relacao com espiritualidade?',
      'O que significa sabedoria para mim?',
    ],
  },

  10: {
    number: 10,
    name: 'Casa da Carreira',
    latinName: 'Regnum',
    themes: ['carreira', 'reputacao', 'status', 'autoridade', 'realizacao'],
    naturalSign: 'capricorn',
    naturalPlanet: 'Saturno',
    keywords: ['carreira', 'reputacao', 'pai', 'autoridade', 'ambicao', 'legado', 'reconhecimento publico'],
    description: 'A Decima Casa, o Meio do Ceu (MC), representa sua carreira, reputacao publica, ambicao e legado. E o ponto mais alto do seu mapa - suas maiores realizacoes.',
    bodyParts: ['joelhos', 'ossos', 'dentes', 'pele'],
    type: 'angular',
    element: 'earth',
    questionsAnswered: [
      'Qual e minha vocacao?',
      'Como sou visto publicamente?',
      'Qual sera meu legado?',
      'O que significa sucesso para mim?',
    ],
  },

  11: {
    number: 11,
    name: 'Casa das Amizades',
    latinName: 'Benefacta',
    themes: ['amizades', 'grupos', 'esperancas', 'sonhos', 'causas sociais'],
    naturalSign: 'aquarius',
    naturalPlanet: 'Urano',
    keywords: ['amigos', 'grupos', 'esperancas', 'sonhos', 'humanitarismo', 'tecnologia', 'futuro', 'networking'],
    description: 'A Decima Primeira Casa governa amizades, grupos, esperancas para o futuro e causas humanitarias. E onde voce se conecta com a humanidade e persegue sonhos maiores.',
    bodyParts: ['tornozelos', 'canelas', 'sistema circulatorio'],
    type: 'succedent',
    element: 'air',
    questionsAnswered: [
      'Que tipo de amigos atraio?',
      'Quais sao meus sonhos para o futuro?',
      'Como contribuo para causas maiores?',
      'Qual e meu papel em grupos?',
    ],
  },

  12: {
    number: 12,
    name: 'Casa do Subconsciente',
    latinName: 'Carcer',
    themes: ['subconsciente', 'espiritualidade', 'karma', 'isolamento', 'cura'],
    naturalSign: 'pisces',
    naturalPlanet: 'Netuno',
    keywords: ['subconsciente', 'karma', 'solidao', 'sacrificio', 'misticismo', 'sonhos', 'instituicoes', 'cura'],
    description: 'A Decima Segunda Casa rege o subconsciente, espiritualidade transcendente, karma, isolamento e cura. E o portal entre o mundo visivel e o invisivel.',
    bodyParts: ['pes', 'sistema linfatico', 'glandula pineal'],
    type: 'cadent',
    element: 'water',
    questionsAnswered: [
      'Quais sao meus padroes karmicos?',
      'O que preciso curar?',
      'Como me conecto com o divino?',
      'O que esta oculto em meu subconsciente?',
    ],
  },
};

/**
 * House cusps and their special names
 */
export const ANGULAR_HOUSES = {
  1: { name: 'Ascendente', abbreviation: 'ASC', description: 'O ponto de nascimento, sua mascara social' },
  4: { name: 'Fundo do Ceu', abbreviation: 'IC', description: 'Raizes, lar, fundacao emocional' },
  7: { name: 'Descendente', abbreviation: 'DSC', description: 'Parcerias, o outro, relacionamentos' },
  10: { name: 'Meio do Ceu', abbreviation: 'MC', description: 'Carreira, reputacao, proposito publico' },
};

/**
 * Quadrants of the chart
 */
export const QUADRANTS = {
  first: {
    houses: [1, 2, 3],
    theme: 'Identidade Pessoal',
    description: 'Foco no desenvolvimento do eu, recursos pessoais e comunicacao',
  },
  second: {
    houses: [4, 5, 6],
    theme: 'Expressao Pessoal',
    description: 'Foco no lar, criatividade e servico',
  },
  third: {
    houses: [7, 8, 9],
    theme: 'Consciencia Social',
    description: 'Foco em parcerias, transformacao e expansao',
  },
  fourth: {
    houses: [10, 11, 12],
    theme: 'Integracao Transpessoal',
    description: 'Foco em carreira, comunidade e espiritualidade',
  },
};

/**
 * Hemispheres of the chart
 */
export const HEMISPHERES = {
  eastern: {
    houses: [10, 11, 12, 1, 2, 3],
    theme: 'Independencia',
    description: 'Enfase em acao pessoal e iniciativa propria',
  },
  western: {
    houses: [4, 5, 6, 7, 8, 9],
    theme: 'Interdependencia',
    description: 'Enfase em relacionamentos e colaboracao',
  },
  northern: {
    houses: [1, 2, 3, 4, 5, 6],
    theme: 'Introversao',
    description: 'Enfase no mundo interior e vida privada',
  },
  southern: {
    houses: [7, 8, 9, 10, 11, 12],
    theme: 'Extroversao',
    description: 'Enfase no mundo exterior e vida publica',
  },
};

/**
 * House types and their characteristics
 */
export const HOUSE_TYPES = {
  angular: {
    houses: [1, 4, 7, 10],
    strength: 'Muito forte',
    theme: 'Acao e iniciativa',
    description: 'Casas mais poderosas. Planetas aqui tem forte expressao externa.',
  },
  succedent: {
    houses: [2, 5, 8, 11],
    strength: 'Moderada',
    theme: 'Estabilidade e recursos',
    description: 'Casas de consolidacao. Planetas aqui dao resultados estaveis.',
  },
  cadent: {
    houses: [3, 6, 9, 12],
    strength: 'Sutil',
    theme: 'Aprendizado e adaptacao',
    description: 'Casas de transicao. Planetas aqui trabalham internamente.',
  },
};

/**
 * House rulership by derivative houses
 */
export const DERIVATIVE_HOUSES = {
  1: { turnedFrom: null, meaning: 'O proprio nativo' },
  2: { turnedFrom: null, meaning: 'Recursos do nativo' },
  3: { turnedFrom: null, meaning: 'Irmaos do nativo' },
  4: { turnedFrom: null, meaning: 'Pai/Mae do nativo' },
  5: { turnedFrom: null, meaning: 'Filhos do nativo' },
  6: { turnedFrom: null, meaning: 'Saude/Empregados' },
  7: { turnedFrom: null, meaning: 'Parceiro/Conjuge' },
  8: { turnedFrom: 2, meaning: 'Recursos do parceiro (casa 2 do 7)' },
  9: { turnedFrom: 3, meaning: 'Irmaos do parceiro (casa 3 do 7)' },
  10: { turnedFrom: 4, meaning: 'Pai do parceiro (casa 4 do 7)' },
  11: { turnedFrom: 5, meaning: 'Filhos do parceiro (casa 5 do 7)' },
  12: { turnedFrom: 6, meaning: 'Saude do parceiro (casa 6 do 7)' },
};

/**
 * Get house by number
 */
export function getHouse(number: number): HouseData {
  if (number < 1 || number > 12) {
    throw new Error('House number must be between 1 and 12');
  }
  return HOUSES[number];
}

/**
 * Get houses by type
 */
export function getHousesByType(type: 'angular' | 'succedent' | 'cadent'): HouseData[] {
  return Object.values(HOUSES).filter((house) => house.type === type);
}

/**
 * Get houses by element
 */
export function getHousesByElement(element: 'fire' | 'earth' | 'air' | 'water'): HouseData[] {
  return Object.values(HOUSES).filter((house) => house.element === element);
}

/**
 * Get opposite house
 */
export function getOppositeHouse(number: number): number {
  if (number < 1 || number > 12) {
    throw new Error('House number must be between 1 and 12');
  }
  return number <= 6 ? number + 6 : number - 6;
}

/**
 * Check if a house is angular (powerful position)
 */
export function isAngularHouse(number: number): boolean {
  return [1, 4, 7, 10].includes(number);
}

/**
 * Get the natural house for a zodiac sign
 */
export function getNaturalHouse(sign: ZodiacSign): number {
  const signToHouse: Record<ZodiacSign, number> = {
    aries: 1,
    taurus: 2,
    gemini: 3,
    cancer: 4,
    leo: 5,
    virgo: 6,
    libra: 7,
    scorpio: 8,
    sagittarius: 9,
    capricorn: 10,
    aquarius: 11,
    pisces: 12,
  };
  return signToHouse[sign];
}

/**
 * Get interpretation when a planet is in a specific house
 */
export function getPlanetInHouseInterpretation(planet: string, houseNumber: number): string {
  const house = HOUSES[houseNumber];
  const baseInterpretations: Record<number, (planet: string) => string> = {
    1: (p) => `${p} na Casa 1 marca fortemente a personalidade e aparencia. Esta energia e central para sua identidade.`,
    2: (p) => `${p} na Casa 2 influencia sua relacao com dinheiro, posses e autoestima.`,
    3: (p) => `${p} na Casa 3 colore sua comunicacao, pensamento e relacao com irmaos.`,
    4: (p) => `${p} na Casa 4 afeta profundamente seu lar, familia e raizes emocionais.`,
    5: (p) => `${p} na Casa 5 energiza sua criatividade, romances e relacao com filhos.`,
    6: (p) => `${p} na Casa 6 influencia saude, trabalho diario e habitos de servico.`,
    7: (p) => `${p} na Casa 7 molda seus relacionamentos e parcerias significativas.`,
    8: (p) => `${p} na Casa 8 intensifica transformacoes, intimidade e recursos compartilhados.`,
    9: (p) => `${p} na Casa 9 expande sua filosofia, viagens e busca por significado.`,
    10: (p) => `${p} na Casa 10 marca sua carreira, reputacao e ambicoes publicas.`,
    11: (p) => `${p} na Casa 11 afeta amizades, grupos e esperancas para o futuro.`,
    12: (p) => `${p} na Casa 12 trabalha no subconsciente, espiritualidade e cura karmica.`,
  };

  return baseInterpretations[houseNumber](planet);
}
