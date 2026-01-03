/**
 * Lunar Phases Data
 *
 * Complete data for all 8 lunar phases with their mystical meanings,
 * rituals, crystals, colors, and guidance for each phase.
 * Used throughout the lunar module for calculations and interpretations.
 */

/**
 * Interface for lunar phase data
 */
export interface LunarPhaseData {
  /** Unique identifier */
  id: string;
  /** English name */
  name: string;
  /** Portuguese name */
  namePt: string;
  /** Icon emoji representing the phase */
  iconEmoji: string;
  /** Illumination percentage range */
  illumination: { min: number; max: number };
  /** Keywords associated with this phase */
  keywords: string[];
  /** Energy description */
  energy: string;
  /** Suggested rituals */
  rituals: string[];
  /** Recommended crystals */
  crystals: string[];
  /** Associated colors */
  colors: string[];
  /** Daily advice/guidance */
  advice: string;
  /** Approximate duration in days */
  durationDays: number;
  /** Phase order in the lunar cycle (0-7) */
  order: number;
}

/**
 * Complete lunar phases database with all 8 phases
 */
export const LUNAR_PHASES: Record<string, LunarPhaseData> = {
  'new-moon': {
    id: 'new-moon',
    name: 'New Moon',
    namePt: 'Lua Nova',
    iconEmoji: '\u{1F311}',
    illumination: { min: 0, max: 1 },
    keywords: ['novos comecos', 'intencoes', 'renovacao', 'plantio', 'potencial'],
    energy: 'Esta e uma fase de silencio e introspeccao. A escuridao da Lua Nova convida voce a olhar para dentro, plantar sementes de intencao e sonhar com novos comecos. E o momento perfeito para definir metas e visualizar o que deseja manifestar.',
    rituals: [
      'Escreva suas intencoes em um papel e guarde em local sagrado',
      'Faca uma meditacao de visualizacao para seus objetivos',
      'Crie um vision board com seus sonhos',
      'Acenda uma vela branca e faca um pedido',
      'Pratique journaling sobre o que deseja iniciar',
    ],
    crystals: ['obsidiana', 'labradorita', 'pedra da lua', 'onix negro', 'turmalina negra'],
    colors: ['preto', 'prata', 'branco', 'cinza escuro'],
    advice: 'Reserve tempo para o silencio interior. Plante as sementes de seus sonhos com clareza de intencao. Este nao e o momento de agir, mas de planejar e sonhar.',
    durationDays: 1,
    order: 0,
  },

  'waxing-crescent': {
    id: 'waxing-crescent',
    name: 'Waxing Crescent',
    namePt: 'Crescente Crescente',
    iconEmoji: '\u{1F312}',
    illumination: { min: 1, max: 49 },
    keywords: ['planejamento', 'esperanca', 'fe', 'primeiros passos', 'construcao'],
    energy: 'A Lua comeca a crescer, trazendo energia de esperanca e possibilidade. E hora de dar os primeiros passos em direcao aos seus objetivos. A fe e sua aliada neste momento.',
    rituals: [
      'Crie um plano de acao para suas intencoes',
      'Faca uma lista de pequenos passos para seus objetivos',
      'Pratique afirmacoes positivas pela manha',
      'Comece um novo projeto ou habito',
      'Visualize seu sucesso antes de dormir',
    ],
    crystals: ['citrino', 'aventurina', 'jade', 'amazonita', 'fluorita'],
    colors: ['verde claro', 'amarelo palido', 'prata', 'branco'],
    advice: 'Mantenha a fe em seus sonhos e de os primeiros passos. Nao tenha pressa - cada pequena acao conta. Confie no processo de crescimento.',
    durationDays: 6,
    order: 1,
  },

  'first-quarter': {
    id: 'first-quarter',
    name: 'First Quarter',
    namePt: 'Quarto Crescente',
    iconEmoji: '\u{1F313}',
    illumination: { min: 49, max: 51 },
    keywords: ['acao', 'decisoes', 'coragem', 'desafios', 'compromisso'],
    energy: 'Metade da Lua esta iluminada, simbolizando um ponto de decisao. Obstaculos podem surgir para testar sua determinacao. E hora de agir com coragem e tomar decisoes importantes.',
    rituals: [
      'Tome uma decisao importante que estava adiando',
      'Enfrente um medo ou obstaculo de frente',
      'Faca uma lista de pros e contras para clareza',
      'Pratique uma atividade que exija coragem',
      'Reafirme seu compromisso com seus objetivos',
    ],
    crystals: ['cornalina', 'olho de tigre', 'jaspe vermelho', 'granada', 'hematita'],
    colors: ['vermelho', 'laranja', 'dourado', 'amarelo'],
    advice: 'Enfrente os desafios com determinacao. Este e o momento de agir, nao de hesitar. Sua coragem sera recompensada. Tome as decisoes necessarias.',
    durationDays: 1,
    order: 2,
  },

  'waxing-gibbous': {
    id: 'waxing-gibbous',
    name: 'Waxing Gibbous',
    namePt: 'Gibosa Crescente',
    iconEmoji: '\u{1F314}',
    illumination: { min: 51, max: 99 },
    keywords: ['refinamento', 'ajustes', 'paciencia', 'desenvolvimento', 'aperfeicoamento'],
    energy: 'A Lua quase cheia ilumina o que precisa ser ajustado. E uma fase de refinamento e paciencia. Ajuste seus planos, aprimore suas acoes e prepare-se para a culminacao.',
    rituals: [
      'Revise e ajuste seus planos conforme necessario',
      'Pratique a paciencia e a perseveranca',
      'Faca pequenas melhorias em seus projetos',
      'Busque feedback e esteja aberto a mudancas',
      'Cuide dos detalhes que fazem a diferenca',
    ],
    crystals: ['sodalita', 'lapis lazuli', 'agua-marinha', 'celestita', 'angelita'],
    colors: ['azul', 'roxo claro', 'prata', 'lavanda'],
    advice: 'Refine seus esforcos com atencao aos detalhes. A paciencia e essencial agora. Faca os ajustes necessarios e confie que a culminacao esta proxima.',
    durationDays: 6,
    order: 3,
  },

  'full-moon': {
    id: 'full-moon',
    name: 'Full Moon',
    namePt: 'Lua Cheia',
    iconEmoji: '\u{1F315}',
    illumination: { min: 99, max: 100 },
    keywords: ['culminacao', 'celebracao', 'liberacao', 'manifestacao', 'revelacao'],
    energy: 'A Lua brilha em sua plenitude maxima! E o momento de maior energia, quando intencoes se manifestam e verdades sao reveladas. Celebre suas conquistas e libere o que nao serve mais.',
    rituals: [
      'Faca um ritual de lua cheia ao ar livre',
      'Carregue seus cristais sob a luz da lua',
      'Escreva o que deseja liberar e queime o papel',
      'Celebre suas conquistas com gratidao',
      'Tome um banho de ervas para limpeza energetica',
    ],
    crystals: ['selenita', 'pedra da lua', 'quartzo transparente', 'opala', 'labradorita'],
    colors: ['branco', 'prata', 'dourado', 'azul celeste'],
    advice: 'Celebre suas conquistas e honre sua jornada. Libere o que nao lhe serve mais com amor e gratidao. A luz da Lua Cheia ilumina tudo - aproveite essa clareza.',
    durationDays: 1,
    order: 4,
  },

  'waning-gibbous': {
    id: 'waning-gibbous',
    name: 'Waning Gibbous',
    namePt: 'Gibosa Minguante',
    iconEmoji: '\u{1F316}',
    illumination: { min: 51, max: 99 },
    keywords: ['gratidao', 'compartilhar', 'ensinar', 'generosidade', 'integracao'],
    energy: 'A Lua comeca a diminuir apos sua plenitude. E tempo de gratidao e de compartilhar sua sabedoria. Integre as licoes aprendidas e seja generoso com os outros.',
    rituals: [
      'Escreva uma lista de gratidao diaria',
      'Compartilhe seus conhecimentos com alguem',
      'Pratique atos de generosidade',
      'Reflita sobre as licoes do ultimo ciclo',
      'Ensine algo que voce domina a outra pessoa',
    ],
    crystals: ['ametista', 'sugilita', 'lepidolita', 'kunzita', 'rodocrosita'],
    colors: ['roxo', 'rosa', 'magenta', 'violeta'],
    advice: 'Pratique a gratidao profunda por tudo que recebeu. Compartilhe generosamente sua sabedoria e recursos. A integracao das experiencias traz crescimento duradouro.',
    durationDays: 6,
    order: 5,
  },

  'last-quarter': {
    id: 'last-quarter',
    name: 'Last Quarter',
    namePt: 'Quarto Minguante',
    iconEmoji: '\u{1F317}',
    illumination: { min: 49, max: 51 },
    keywords: ['soltar', 'perdoar', 'liberacao', 'limpeza', 'desapego'],
    energy: 'Metade da Lua esta iluminada novamente, mas agora diminuindo. E hora de soltar, perdoar e liberar. Deixe ir o que pesa em seu coracao e sua mente.',
    rituals: [
      'Pratique o perdao - a si mesmo e aos outros',
      'Faca uma limpeza fisica em seu espaco',
      'Escreva uma carta de perdao e depois queime',
      'Doe objetos que nao usa mais',
      'Libere relacionamentos ou habitos toxicos',
    ],
    crystals: ['quartzo fumaca', 'obsidiana apache', 'turmalina negra', 'jet', 'shungita'],
    colors: ['cinza', 'marrom', 'preto', 'azul escuro'],
    advice: 'Deixe ir com amor e sem resistencia. O perdao e um presente que voce da a si mesmo. Limpe seu espaco fisico e emocional para receber o novo.',
    durationDays: 1,
    order: 6,
  },

  'waning-crescent': {
    id: 'waning-crescent',
    name: 'Waning Crescent',
    namePt: 'Balsamica',
    iconEmoji: '\u{1F318}',
    illumination: { min: 1, max: 49 },
    keywords: ['descanso', 'reflexao', 'cura', 'entrega', 'renovacao interior'],
    energy: 'A Lua quase desaparece, convidando ao descanso profundo. E uma fase de cura, reflexao e preparacao para o novo ciclo. Entregue-se ao repouso e a renovacao interior.',
    rituals: [
      'Durma mais e descanse profundamente',
      'Pratique meditacao de cura',
      'Tome banhos relaxantes com sais',
      'Faca um retiro de silencio, mesmo que breve',
      'Reflita sobre todo o ciclo lunar passado',
    ],
    crystals: ['ametista', 'howlita', 'lepidolita', 'quartzo rosa', 'moonstone'],
    colors: ['azul marinho', 'indigo', 'preto', 'prata escuro'],
    advice: 'Descanse profundamente e confie no processo de renovacao. Este e o momento de entrega e cura. Prepare-se em silencio para o novo ciclo que se aproxima.',
    durationDays: 6,
    order: 7,
  },
};

/**
 * Array of lunar phases in order
 */
export const LUNAR_PHASES_ORDER: string[] = [
  'new-moon',
  'waxing-crescent',
  'first-quarter',
  'waxing-gibbous',
  'full-moon',
  'waning-gibbous',
  'last-quarter',
  'waning-crescent',
];

/**
 * Synodic month duration in days (average lunar cycle)
 */
export const SYNODIC_MONTH_DAYS = 29.53058867;

/**
 * Reference new moon date (known new moon for calculations)
 * January 11, 2024 at 11:57 UTC was a New Moon
 */
export const REFERENCE_NEW_MOON = new Date('2024-01-11T11:57:00.000Z');

/**
 * Get lunar phase from age (days since new moon)
 * @param lunarAge - Days since the last new moon (0 to 29.53)
 * @returns The lunar phase ID
 */
export function getLunarPhaseFromAge(lunarAge: number): string {
  // Normalize lunar age to 0-29.53 range
  const normalizedAge = ((lunarAge % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;

  // Each phase spans approximately:
  // New Moon: 0 - 1.85 days
  // Waxing Crescent: 1.85 - 7.38 days
  // First Quarter: 7.38 - 11.07 days
  // Waxing Gibbous: 11.07 - 14.76 days
  // Full Moon: 14.76 - 16.61 days
  // Waning Gibbous: 16.61 - 22.14 days
  // Last Quarter: 22.14 - 25.83 days
  // Waning Crescent: 25.83 - 29.53 days

  const phaseDuration = SYNODIC_MONTH_DAYS / 8;

  if (normalizedAge < phaseDuration * 0.5) {
    return 'new-moon';
  } else if (normalizedAge < phaseDuration * 3.5) {
    return 'waxing-crescent';
  } else if (normalizedAge < phaseDuration * 4.5) {
    return 'first-quarter';
  } else if (normalizedAge < phaseDuration * 7.5) {
    return 'waxing-gibbous';
  } else if (normalizedAge < phaseDuration * 8.5) {
    return 'full-moon';
  } else if (normalizedAge < phaseDuration * 11.5) {
    return 'waning-gibbous';
  } else if (normalizedAge < phaseDuration * 12.5) {
    return 'last-quarter';
  } else {
    return 'waning-crescent';
  }
}

/**
 * Calculate illumination percentage from lunar age
 * @param lunarAge - Days since the last new moon
 * @returns Illumination percentage (0-100)
 */
export function calculateIllumination(lunarAge: number): number {
  const normalizedAge = ((lunarAge % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  // Using a simple cosine approximation for illumination
  // At new moon (0 days): 0% illumination
  // At full moon (14.76 days): 100% illumination
  const illumination = (1 - Math.cos((2 * Math.PI * normalizedAge) / SYNODIC_MONTH_DAYS)) / 2;
  return Math.round(illumination * 100);
}

/**
 * Get phase data by ID
 * @param phaseId - The phase identifier
 * @returns The lunar phase data or undefined
 */
export function getLunarPhaseById(phaseId: string): LunarPhaseData | undefined {
  return LUNAR_PHASES[phaseId];
}

/**
 * Get all lunar phases as an array
 * @returns Array of all lunar phase data in order
 */
export function getAllLunarPhases(): LunarPhaseData[] {
  return LUNAR_PHASES_ORDER.map((id) => LUNAR_PHASES[id]);
}
