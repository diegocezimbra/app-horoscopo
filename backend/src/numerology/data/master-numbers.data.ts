import { NumerologyMeaning } from './numbers.data';

export interface MasterNumberMeaning extends NumerologyMeaning {
  higherVibration: string;
  shadowSide: string;
  spiritualMission: string;
  activationTips: string[];
}

export const MASTER_NUMBERS: Record<number, MasterNumberMeaning> = {
  11: {
    name: 'O Iluminador',
    keywords: ['iluminação', 'inspiração', 'intuição', 'visão espiritual'],
    strengths: [
      'Intuição extraordinária',
      'Canal espiritual',
      'Inspiração divina',
      'Sensibilidade psíquica',
      'Capacidade de iluminar outros',
    ],
    challenges: [
      'Ansiedade intensa',
      'Hipersensibilidade',
      'Dificuldade de ancoramento',
      'Tensão nervosa',
    ],
    careers: [
      'Mestre espiritual',
      'Psíquico',
      'Artista visionário',
      'Inventor revolucionário',
      'Líder inspiracional',
      'Curador energético',
    ],
    lifePurpose:
      'Servir como canal de luz divina, iluminando o caminho da humanidade através da inspiração e visão espiritual.',
    spiritualLesson:
      'Manter os pés na terra enquanto alcança as estrelas, aprendendo a canalizar a alta vibração sem se fragmentar.',
    dailyAffirmation:
      'Eu sou um canal de luz divina. Minha intuição me guia com clareza e propósito sagrado.',
    higherVibration:
      'Quando vibra no mais alto, o 11 se torna um farol de luz que ilumina consciências e inspira transformações profundas na coletividade.',
    shadowSide:
      'Se não trabalhar sua energia, pode manifestar ansiedade paralisante, medos irracionais e dificuldade de materializar sua visão no mundo físico.',
    spiritualMission:
      'Trazer revelações espirituais ao plano terreno, servindo como ponte entre dimensões superiores e a humanidade.',
    activationTips: [
      'Medite diariamente para fortalecer sua conexão espiritual',
      'Pratique exercícios de ancoragem regularmente',
      'Escreva suas visões e insights em um diário',
      'Confie em sua intuição mesmo quando a razão questiona',
      'Cerque-se de pessoas que apoiam seu caminho espiritual',
    ],
  },
  22: {
    name: 'O Mestre Construtor',
    keywords: [
      'construção magistral',
      'visão global',
      'poder de manifestação',
      'legado',
    ],
    strengths: [
      'Capacidade de construir impérios',
      'Visão de longo alcance',
      'Poder de manifestação excepcional',
      'Liderança transformadora',
      'Praticidade visionária',
    ],
    challenges: [
      'Pressão extrema',
      'Medo de fracasso',
      'Tendência a assumir demais',
      'Dificuldade de delegar',
    ],
    careers: [
      'Arquiteto de grandes projetos',
      'Líder mundial',
      'Fundador de movimentos',
      'CEO de corporações globais',
      'Urbanista visionário',
      'Construtor de legados',
    ],
    lifePurpose:
      'Construir estruturas que transformam o mundo, deixando um legado que beneficia gerações futuras.',
    spiritualLesson:
      'Equilibrar a grandiosidade da visão com a humildade do serviço, lembrando que toda grande obra começa com um único passo.',
    dailyAffirmation:
      'Eu sou um mestre construtor. Transformo visões em realidade para o benefício de toda a humanidade.',
    higherVibration:
      'No ápice de sua expressão, o 22 manifesta obras que parecem impossíveis, transformando sonhos coletivos em realidades tangíveis.',
    shadowSide:
      'Quando desequilibrado, pode se perder em projetos grandiosos demais, sentindo-se esmagado pela magnitude de sua própria visão.',
    spiritualMission:
      'Materializar o espiritual no mundo físico, construindo pontes entre a visão divina e a realização terrena.',
    activationTips: [
      'Divida grandes projetos em etapas realizáveis',
      'Forme equipes de apoio para suas visões',
      'Mantenha-se conectado com seu propósito maior',
      'Celebre cada pequena vitória no caminho',
      'Equilibre trabalho intenso com descanso restaurador',
    ],
  },
  33: {
    name: 'O Mestre Professor',
    keywords: ['amor universal', 'cura', 'ensino espiritual', 'serviço'],
    strengths: [
      'Amor incondicional radiante',
      'Dom de cura excepcional',
      'Capacidade de ensinar pelo exemplo',
      'Compaixão infinita',
      'Sabedoria cristalina',
    ],
    challenges: [
      'Auto-sacrifício extremo',
      'Dificuldade de aceitar ajuda',
      'Peso da responsabilidade',
      'Perfeccionismo espiritual',
    ],
    careers: [
      'Mestre espiritual',
      'Curador de almas',
      'Líder humanitário',
      'Professor de mestres',
      'Guia iluminado',
      'Avatar do amor',
    ],
    lifePurpose:
      'Elevar a consciência da humanidade através do amor incondicional e do ensino espiritual mais elevado.',
    spiritualLesson:
      'Aprender a receber amor na mesma medida que o oferece, entendendo que o mestre também é eterno estudante.',
    dailyAffirmation:
      'Eu sou amor em forma humana. Minha presença cura e meu exemplo ensina.',
    higherVibration:
      'No mais alto, o 33 encarna o amor crístico, tornando-se uma presença que cura e transforma apenas por existir.',
    shadowSide:
      'Pode se perder no papel de salvador, negligenciando suas próprias necessidades e carregando fardos que não lhe pertencem.',
    spiritualMission:
      'Ser um avatar do amor divino na Terra, ensinando pelo exemplo e curando pela presença amorosa.',
    activationTips: [
      'Pratique o auto-amor como disciplina espiritual',
      'Estabeleça limites saudáveis em seu serviço',
      'Permita-se receber cuidado e amor de outros',
      'Reconheça que você também está em evolução',
      'Use sua sensibilidade como dom, não como fardo',
    ],
  },
};

export const isMasterNumber = (num: number): boolean => {
  return num === 11 || num === 22 || num === 33;
};
