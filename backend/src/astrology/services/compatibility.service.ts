import { Injectable, Logger } from '@nestjs/common';
import {
  ZodiacSign,
  ZODIAC_SIGNS,
  NatalChart,
  CompatibilityResult,
  ELEMENT_SIGNS,
  MODALITY_SIGNS,
  Planet,
} from '../types/zodiac.types';
import {
  ZODIAC_SIGNS as ZODIAC_DATA,
  ELEMENT_COMPATIBILITY,
  MODALITY_COMPATIBILITY,
  getOppositeSign,
  getTrineSign,
  getSextileSigns,
  getSquareSigns,
} from '../data/zodiac.data';
import { PLANETS as PLANET_DATA } from '../data/planets.data';

// Import shared types
import { DetailedCompatibility } from '../types/astrology.types';

/**
 * Celebrity match result
 */
interface CelebrityMatch {
  name: string;
  sunSign: ZodiacSign;
  matchPercentage: number;
  commonalities: string[];
  funFact: string;
}

/**
 * CompatibilityService
 *
 * Provides comprehensive astrological compatibility analysis between
 * zodiac signs and natal charts. Calculates emotional, communication,
 * passion, and value compatibility scores with detailed interpretations.
 */
@Injectable()
export class CompatibilityService {
  private readonly logger = new Logger(CompatibilityService.name);

  /**
   * Famous couples by sign combinations for reference
   */
  private readonly famousCouples: Record<string, string[]> = {
    'aries-leo': ['Sarah Michelle Gellar & Freddie Prinze Jr.'],
    'aries-sagittarius': ['Reese Witherspoon & Jim Toth'],
    'taurus-cancer': ['George Lucas & Mellody Hobson'],
    'taurus-capricorn': ['David & Victoria Beckham'],
    'gemini-sagittarius': ['Brad Pitt & Angelina Jolie'],
    'gemini-aquarius': ['Ashton Kutcher & Mila Kunis'],
    'cancer-scorpio': ['Tom Hanks & Rita Wilson'],
    'leo-sagittarius': ['Ben Affleck & Jennifer Lopez'],
    'virgo-pisces': ['Kurt Cobain & Courtney Love'],
    'libra-aries': ['John Lennon & Yoko Ono'],
    'scorpio-pisces': ['Ryan Gosling & Eva Mendes'],
    'capricorn-taurus': ['Michelle Obama & Barack Obama'],
  };

  /**
   * Celebrity database for matching
   */
  private readonly celebrities: Array<{
    name: string;
    sunSign: ZodiacSign;
    category: string;
    trait: string;
  }> = [
    { name: 'Lady Gaga', sunSign: 'aries', category: 'Musica', trait: 'inovadora e ousada' },
    { name: 'Adele', sunSign: 'taurus', category: 'Musica', trait: 'poderosa e autentica' },
    { name: 'Angelina Jolie', sunSign: 'gemini', category: 'Cinema', trait: 'versatil e humanitaria' },
    { name: 'Elon Musk', sunSign: 'cancer', category: 'Tecnologia', trait: 'visionario e protetor' },
    { name: 'Barack Obama', sunSign: 'leo', category: 'Politica', trait: 'carismatico e inspirador' },
    { name: 'Beyonce', sunSign: 'virgo', category: 'Musica', trait: 'perfeccionista e talentosa' },
    { name: 'Will Smith', sunSign: 'libra', category: 'Cinema', trait: 'charmoso e diplomatico' },
    { name: 'Leonardo DiCaprio', sunSign: 'scorpio', category: 'Cinema', trait: 'intenso e dedicado' },
    { name: 'Taylor Swift', sunSign: 'sagittarius', category: 'Musica', trait: 'aventureira e honesta' },
    { name: 'Michelle Obama', sunSign: 'capricorn', category: 'Ativismo', trait: 'determinada e elegante' },
    { name: 'Oprah Winfrey', sunSign: 'aquarius', category: 'Midia', trait: 'humanitaria e visionaria' },
    { name: 'Rihanna', sunSign: 'pisces', category: 'Musica', trait: 'criativa e intuitiva' },
    { name: 'Robert Downey Jr.', sunSign: 'aries', category: 'Cinema', trait: 'carismático e resiliente' },
    { name: 'Dwayne Johnson', sunSign: 'taurus', category: 'Cinema', trait: 'determinado e leal' },
    { name: 'Kanye West', sunSign: 'gemini', category: 'Musica', trait: 'genial e multifacetado' },
    { name: 'Ariana Grande', sunSign: 'cancer', category: 'Musica', trait: 'emotiva e talentosa' },
    { name: 'Jennifer Lopez', sunSign: 'leo', category: 'Entretenimento', trait: 'estrela nata' },
    { name: 'Zendaya', sunSign: 'virgo', category: 'Cinema', trait: 'elegante e dedicada' },
    { name: 'Kim Kardashian', sunSign: 'libra', category: 'Entretenimento', trait: 'estrategica e influente' },
    { name: 'Katy Perry', sunSign: 'scorpio', category: 'Musica', trait: 'apaixonada e transformadora' },
    { name: 'Miley Cyrus', sunSign: 'sagittarius', category: 'Musica', trait: 'livre e autêntica' },
    { name: 'LeBron James', sunSign: 'capricorn', category: 'Esportes', trait: 'disciplinado e lider' },
    { name: 'Harry Styles', sunSign: 'aquarius', category: 'Musica', trait: 'unico e revolucionario' },
    { name: 'Justin Bieber', sunSign: 'pisces', category: 'Musica', trait: 'sensivel e artistico' },
  ];

  /**
   * Calculate compatibility between two zodiac signs
   *
   * @param sign1 - First zodiac sign
   * @param sign2 - Second zodiac sign
   * @returns Comprehensive compatibility result
   */
  calculateCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityResult {
    this.logger.log(`Calculating compatibility between ${sign1} and ${sign2}`);

    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    // Calculate base element compatibility
    const elementScore = ELEMENT_COMPATIBILITY[sign1Data.element][sign2Data.element];

    // Calculate modality compatibility
    const modalityScore = MODALITY_COMPATIBILITY[sign1Data.modality][sign2Data.modality];

    // Check aspect relationship
    const aspectBonus = this.calculateAspectBonus(sign1, sign2);

    // Check natural compatibility lists
    const naturalCompatibility = this.checkNaturalCompatibility(sign1, sign2);

    // Calculate individual scores
    const emotionalScore = this.calculateEmotionalScore(sign1, sign2, elementScore);
    const communicationScore = this.calculateCommunicationScore(sign1, sign2, modalityScore);
    const passionScore = this.calculatePassionScore(sign1, sign2, elementScore, aspectBonus);
    const valuesScore = this.calculateValuesScore(sign1, sign2);

    // Calculate overall score
    const overallScore = Math.round(
      (emotionalScore * 0.25 +
        communicationScore * 0.25 +
        passionScore * 0.25 +
        valuesScore * 0.25 +
        naturalCompatibility * 0.1 +
        aspectBonus * 0.1) / 1.2,
    );

    // Generate summary and analysis
    const summary = this.generateCompatibilitySummary(sign1, sign2, overallScore);
    const strengths = this.identifyStrengths(sign1, sign2);
    const challenges = this.identifyChallenges(sign1, sign2);
    const advice = this.generateRelationshipAdvice(sign1, sign2, challenges);

    // Find famous couples
    const famousCouples = this.findFamousCouples(sign1, sign2);

    return {
      sign1,
      sign2,
      overallScore,
      loveScore: passionScore,
      friendshipScore: Math.round((communicationScore + valuesScore) / 2),
      communicationScore,
      trustScore: valuesScore,
      sharedActivitiesScore: Math.round((elementScore + modalityScore) / 2),
      analysis: {
        strengths,
        challenges,
        advice,
      },
    };
  }

  /**
   * Calculate detailed compatibility using full natal charts
   *
   * @param chart1 - First person's natal chart
   * @param chart2 - Second person's natal chart
   * @returns Detailed compatibility with synastry analysis
   */
  calculateDetailedCompatibility(chart1: NatalChart, chart2: NatalChart): DetailedCompatibility {
    this.logger.log('Calculating detailed chart compatibility');

    // Get basic sign compatibility
    const basicResult = this.calculateCompatibility(chart1.sunSign, chart2.sunSign);

    // Analyze synastry aspects
    const synastryAspects = this.analyzeSynastryAspects(chart1, chart2);

    // Analyze Venus-Mars dynamics
    const venusMarsDynamics = this.analyzeVenusMarsDynamics(chart1, chart2);

    // Analyze Moon compatibility
    const moonCompatibility = this.analyzeMoonCompatibility(chart1.moonSign, chart2.moonSign);

    // Analyze communication (Mercury)
    const communicationStyles = this.analyzeCommunicationStyles(chart1, chart2);

    // Assess long-term potential
    const longTermPotential = this.assessLongTermPotential(chart1, chart2, basicResult.overallScore);

    // Identify growth areas
    const growthAreas = this.identifyGrowthAreas(chart1, chart2);

    // Recalculate scores based on full chart analysis
    const adjustedScores = this.adjustScoresForFullChart(basicResult, chart1, chart2);

    return {
      ...basicResult,
      ...adjustedScores,
      synastryAspects,
      venusMarsDynamics,
      moonCompatibility,
      communicationStyles,
      longTermPotential,
      growthAreas,
    };
  }

  /**
   * Find celebrity matches for a natal chart
   *
   * @param chart - User's natal chart
   * @returns Array of celebrity matches with compatibility info
   */
  findCelebrityMatches(chart: NatalChart): CelebrityMatch[] {
    this.logger.log(`Finding celebrity matches for ${chart.sunSign}`);

    const matches: CelebrityMatch[] = [];

    for (const celebrity of this.celebrities) {
      const compatibility = this.calculateCompatibility(chart.sunSign, celebrity.sunSign);

      // Find commonalities
      const commonalities = this.findCommonalities(chart, celebrity);

      // Generate fun fact
      const funFact = this.generateCelebrityFunFact(chart.sunSign, celebrity);

      matches.push({
        name: celebrity.name,
        sunSign: celebrity.sunSign,
        matchPercentage: compatibility.overallScore,
        commonalities,
        funFact,
      });
    }

    // Sort by match percentage and return top 5
    return matches
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
  }

  // ==================== CALCULATION METHODS ====================

  /**
   * Calculate aspect bonus based on zodiac wheel position
   */
  private calculateAspectBonus(sign1: ZodiacSign, sign2: ZodiacSign): number {
    // Same sign (conjunction)
    if (sign1 === sign2) return 85;

    // Trine (same element, 120 degrees apart)
    const trines = getTrineSign(sign1);
    if (trines.includes(sign2)) return 90;

    // Sextile (60 degrees apart)
    const sextiles = getSextileSigns(sign1);
    if (sextiles.includes(sign2)) return 80;

    // Opposition (180 degrees - challenging but magnetic)
    const opposite = getOppositeSign(sign1);
    if (opposite === sign2) return 70;

    // Square (90 degrees - most challenging)
    const squares = getSquareSigns(sign1);
    if (squares.includes(sign2)) return 55;

    // Semi-sextile or quincunx (other positions)
    return 65;
  }

  /**
   * Check natural compatibility from sign data
   */
  private checkNaturalCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): number {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    let score = 0;
    if (sign1Data.compatibility.includes(sign2)) score += 50;
    if (sign2Data.compatibility.includes(sign1)) score += 50;

    return score;
  }

  /**
   * Calculate emotional compatibility score
   */
  private calculateEmotionalScore(sign1: ZodiacSign, sign2: ZodiacSign, elementScore: number): number {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    let score = elementScore;

    // Water and Earth signs have deep emotional connection
    if (
      (sign1Data.element === 'water' && sign2Data.element === 'earth') ||
      (sign1Data.element === 'earth' && sign2Data.element === 'water')
    ) {
      score += 10;
    }

    // Water signs together = intense emotional bond
    if (sign1Data.element === 'water' && sign2Data.element === 'water') {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate communication compatibility score
   */
  private calculateCommunicationScore(sign1: ZodiacSign, sign2: ZodiacSign, modalityScore: number): number {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    let score = modalityScore;

    // Air signs are natural communicators
    if (sign1Data.element === 'air' || sign2Data.element === 'air') {
      score += 10;
    }

    // Same modality can create communication friction
    if (sign1Data.modality === sign2Data.modality) {
      score -= 5;
    }

    // Mutable signs adapt communication styles
    if (sign1Data.modality === 'mutable' || sign2Data.modality === 'mutable') {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate passion/physical compatibility score
   */
  private calculatePassionScore(
    sign1: ZodiacSign,
    sign2: ZodiacSign,
    elementScore: number,
    aspectBonus: number,
  ): number {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    let score = (elementScore + aspectBonus) / 2;

    // Fire signs bring passion
    if (sign1Data.element === 'fire' || sign2Data.element === 'fire') {
      score += 10;
    }

    // Fire + Air = explosive chemistry
    if (
      (sign1Data.element === 'fire' && sign2Data.element === 'air') ||
      (sign1Data.element === 'air' && sign2Data.element === 'fire')
    ) {
      score += 10;
    }

    // Scorpio adds intensity to any pairing
    if (sign1 === 'scorpio' || sign2 === 'scorpio') {
      score += 10;
    }

    // Opposition creates magnetic attraction
    if (getOppositeSign(sign1) === sign2) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate values compatibility score
   */
  private calculateValuesScore(sign1: ZodiacSign, sign2: ZodiacSign): number {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    let score = 70; // Base score

    // Same element = similar values
    if (sign1Data.element === sign2Data.element) {
      score += 20;
    }

    // Check shared traits
    const sharedTraits = sign1Data.traits.filter((t) =>
      sign2Data.traits.some((t2) => t.toLowerCase().includes(t2.toLowerCase().substring(0, 4))),
    );
    score += sharedTraits.length * 5;

    // Earth signs value stability, security
    if (sign1Data.element === 'earth' && sign2Data.element === 'earth') {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Generate compatibility summary
   */
  private generateCompatibilitySummary(sign1: ZodiacSign, sign2: ZodiacSign, score: number): string {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    if (score >= 85) {
      return `${sign1Data.name} e ${sign2Data.name} formam uma conexao celestial extraordinaria! ` +
        `As estrelas abençoam essa uniao com harmonia profunda e entendimento mutuo. ` +
        `Juntos, voces criam uma sinergia que potencializa o melhor de cada um.`;
    } else if (score >= 70) {
      return `${sign1Data.name} e ${sign2Data.name} compartilham uma conexao forte e promissora. ` +
        `Embora existam areas que requerem atencao, a base para um relacionamento significativo esta presente. ` +
        `Com esforço mutuo, voces podem construir algo duradouro.`;
    } else if (score >= 55) {
      return `${sign1Data.name} e ${sign2Data.name} formam uma combinacao interessante com desafios e recompensas. ` +
        `A atracao pode ser magnetica, mas requer trabalho para harmonizar diferencas. ` +
        `Paciencia e comunicacao sao chaves para o sucesso.`;
    } else {
      return `${sign1Data.name} e ${sign2Data.name} enfrentam desafios cosmicos significativos. ` +
        `No entanto, as uniao mais improváveis podem criar crescimento extraordinario. ` +
        `Requer dedicacao excepcional de ambos para superar obstaculos naturais.`;
    }
  }

  /**
   * Identify relationship strengths
   */
  private identifyStrengths(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];
    const strengths: string[] = [];

    // Element-based strengths
    if (sign1Data.element === sign2Data.element) {
      strengths.push(`Compartilham a mesma energia de ${sign1Data.element === 'fire' ? 'fogo' :
        sign1Data.element === 'earth' ? 'terra' :
        sign1Data.element === 'air' ? 'ar' : 'agua'}`);
    }

    // Complementary elements
    if (
      (sign1Data.element === 'fire' && sign2Data.element === 'air') ||
      (sign1Data.element === 'air' && sign2Data.element === 'fire')
    ) {
      strengths.push('Combinacao dinamica que alimenta e inspira');
    }

    if (
      (sign1Data.element === 'earth' && sign2Data.element === 'water') ||
      (sign1Data.element === 'water' && sign2Data.element === 'earth')
    ) {
      strengths.push('Uniao nutritiva e estabilizadora');
    }

    // Natural compatibility
    if (sign1Data.compatibility.includes(sign2)) {
      strengths.push(`${sign1Data.name} naturalmente se harmoniza com ${sign2Data.name}`);
    }

    // Trine relationship
    if (getTrineSign(sign1).includes(sign2)) {
      strengths.push('Fluxo harmonioso de energia entre os signos');
    }

    // Shared positive traits
    const sharedPositive = sign1Data.traits.filter((t) =>
      sign2Data.traits.includes(t) || sign2Data.traits.some((t2) => t.includes(t2.substring(0, 4))),
    );
    if (sharedPositive.length > 0) {
      strengths.push(`Compartilham qualidades de ${sharedPositive.slice(0, 2).join(' e ')}`);
    }

    return strengths.slice(0, 5);
  }

  /**
   * Identify relationship challenges
   */
  private identifyChallenges(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];
    const challenges: string[] = [];

    // Conflicting elements
    if (
      (sign1Data.element === 'fire' && sign2Data.element === 'water') ||
      (sign1Data.element === 'water' && sign2Data.element === 'fire')
    ) {
      challenges.push('Fogo e agua podem criar tensao - equilibrar paixao com sensibilidade');
    }

    if (
      (sign1Data.element === 'earth' && sign2Data.element === 'air') ||
      (sign1Data.element === 'air' && sign2Data.element === 'earth')
    ) {
      challenges.push('Praticidade vs. ideias - encontrar meio termo entre sonho e realidade');
    }

    // Same modality friction
    if (sign1Data.modality === sign2Data.modality) {
      if (sign1Data.modality === 'cardinal') {
        challenges.push('Dois líderes - definir quem lidera em diferentes areas');
      } else if (sign1Data.modality === 'fixed') {
        challenges.push('Duas naturezas teimosas - aprender a ceder');
      } else {
        challenges.push('Duas naturezas muláveis - manter foco e direcao');
      }
    }

    // Square aspect
    if (getSquareSigns(sign1).includes(sign2)) {
      challenges.push('Tensao quadratura - transformar fricÇao em crescimento');
    }

    // Opposition
    if (getOppositeSign(sign1) === sign2) {
      challenges.push('Energias opostas - aprender a se complementar ao inves de competir');
    }

    // Conflicting weaknesses
    if (sign1Data.weaknesses[0] === sign2Data.weaknesses[0]) {
      challenges.push(`Ambos podem ser ${sign1Data.weaknesses[0]} - trabalhar juntos nessa area`);
    }

    return challenges.slice(0, 4);
  }

  /**
   * Generate relationship advice
   */
  private generateRelationshipAdvice(sign1: ZodiacSign, sign2: ZodiacSign, challenges: string[]): string {
    const sign1Data = ZODIAC_DATA[sign1];
    const sign2Data = ZODIAC_DATA[sign2];

    const adviceBase = `Para ${sign1Data.name} e ${sign2Data.name} florescerem juntos: `;

    if (sign1Data.element === sign2Data.element) {
      return adviceBase + `Usem sua afinidade elemental como base, mas busquem experiencias que os tirem da zona de conforto juntos. ` +
        `Equilibrem a harmonia natural com crescimento individual.`;
    }

    if (
      (sign1Data.element === 'fire' && sign2Data.element === 'water') ||
      (sign1Data.element === 'water' && sign2Data.element === 'fire')
    ) {
      return adviceBase + `${sign1Data.element === 'fire' ? sign1Data.name : sign2Data.name} deve aprender a acolher as emocoes profundas, ` +
        `enquanto ${sign1Data.element === 'water' ? sign1Data.name : sign2Data.name} pode abracar mais espontaneidade. ` +
        `Juntos, criem um espaco seguro para ambas as naturezas.`;
    }

    return adviceBase + `Celebrem suas diferencas como complementares, nao conflitantes. ` +
      `Comunicacao honesta e respeito mutuo sao as chaves. ` +
      `Reservem tempo para entender o mundo do outro.`;
  }

  /**
   * Find famous couples with this sign combination
   */
  private findFamousCouples(sign1: ZodiacSign, sign2: ZodiacSign): string[] {
    const key1 = `${sign1}-${sign2}`;
    const key2 = `${sign2}-${sign1}`;

    return this.famousCouples[key1] || this.famousCouples[key2] || [];
  }

  // ==================== DETAILED COMPATIBILITY METHODS ====================

  /**
   * Analyze synastry aspects between two charts
   */
  private analyzeSynastryAspects(chart1: NatalChart, chart2: NatalChart): Array<{
    aspect: string;
    planets: string;
    interpretation: string;
    isHarmonious: boolean;
  }> {
    const synastryAspects: Array<{
      aspect: string;
      planets: string;
      interpretation: string;
      isHarmonious: boolean;
    }> = [];

    // Sun-Moon aspects
    const sunMoonElement1 = ZODIAC_DATA[chart1.sunSign].element;
    const moonElement2 = ZODIAC_DATA[chart2.moonSign].element;

    if (sunMoonElement1 === moonElement2 ||
        (sunMoonElement1 === 'fire' && moonElement2 === 'air') ||
        (sunMoonElement1 === 'air' && moonElement2 === 'fire') ||
        (sunMoonElement1 === 'earth' && moonElement2 === 'water') ||
        (sunMoonElement1 === 'water' && moonElement2 === 'earth')) {
      synastryAspects.push({
        aspect: 'Sol-Lua Harmonico',
        planets: `Sol de Pessoa 1 em ${ZODIAC_DATA[chart1.sunSign].name} com Lua de Pessoa 2 em ${ZODIAC_DATA[chart2.moonSign].name}`,
        interpretation: 'O ego de um parceiro nutre as necessidades emocionais do outro. Excelente para intimidade.',
        isHarmonious: true,
      });
    }

    // Venus aspects
    synastryAspects.push({
      aspect: 'Venus em Aspecto',
      planets: `Venus de ambos os mapas`,
      interpretation: 'A forma como cada um expressa e recebe amor pode criar harmonia ou tensao dependendo das posicões.',
      isHarmonious: ZODIAC_DATA[chart1.sunSign].element === ZODIAC_DATA[chart2.sunSign].element,
    });

    // Mars aspects
    synastryAspects.push({
      aspect: 'Marte em Aspecto',
      planets: `Marte de ambos os mapas`,
      interpretation: 'A energia de acao e desejo cria dinamicas de poder e paixao entre o casal.',
      isHarmonious: true,
    });

    // Ascendant connection
    const risingCompatible = ZODIAC_DATA[chart1.ascendant].compatibility.includes(chart2.sunSign);
    synastryAspects.push({
      aspect: 'Ascendente-Sol',
      planets: `Ascendente de Pessoa 1 em ${ZODIAC_DATA[chart1.ascendant].name} com Sol de Pessoa 2`,
      interpretation: risingCompatible
        ? 'A primeira impressao e positiva - ha atracao natural na forma como se apresentam.'
        : 'A primeira impressao pode requerer tempo para se ajustar.',
      isHarmonious: risingCompatible,
    });

    return synastryAspects;
  }

  /**
   * Analyze Venus-Mars dynamics
   */
  private analyzeVenusMarsDynamics(chart1: NatalChart, chart2: NatalChart): string {
    const element1 = ZODIAC_DATA[chart1.sunSign].element;
    const element2 = ZODIAC_DATA[chart2.sunSign].element;

    if (element1 === 'fire' && element2 === 'fire') {
      return 'Uma explosao de paixao! Venus e Marte em signos de fogo criam uma atracao magnetica e intensa. ' +
        'O desafio e manter a chama acesa sem queimar a relacao com conflitos de ego.';
    }

    if ((element1 === 'earth' && element2 === 'water') || (element1 === 'water' && element2 === 'earth')) {
      return 'Uma conexao sensual e profunda. A energia de terra ancora as emocoes de agua, ' +
        'criando uma intimidade que cresce com o tempo. Lealdade e devotacao marcam essa uniao.';
    }

    if ((element1 === 'fire' && element2 === 'air') || (element1 === 'air' && element2 === 'fire')) {
      return 'Quimica efervescente! O ar alimenta o fogo criando uma atracao dinamica e entusiasmada. ' +
        'Conversas flertam naturalmente para a intimidade. Mantenham a novidade viva.';
    }

    return 'A dinamica Venus-Marte entre voces requer consciencia das diferentes formas de expressar desejo. ' +
      'Com comunicacao, podem criar uma danca unica de dar e receber afeto.';
  }

  /**
   * Analyze Moon compatibility
   */
  private analyzeMoonCompatibility(moon1: ZodiacSign, moon2: ZodiacSign): string {
    const moon1Data = ZODIAC_DATA[moon1];
    const moon2Data = ZODIAC_DATA[moon2];

    if (moon1Data.element === moon2Data.element) {
      return `Luas no mesmo elemento (${moon1Data.element}) criam uma sintonia emocional profunda. ` +
        `Voces instintivamente entendem as necessidades emocionais um do outro. ` +
        `Este e um dos indicadores mais positivos para harmonia domestica e apoio mutuo.`;
    }

    if (moon1 === getOppositeSign(moon2)) {
      return `Luas opostas criam uma atracao de "almas gemeas" - voces se completam emocionalmente. ` +
        `O que um precisa, o outro oferece naturalmente. Podem aprender muito sobre equilibrio emocional juntos.`;
    }

    if (getSquareSigns(moon1).includes(moon2)) {
      return `Luas em quadratura indicam que suas necessidades emocionais podem entrar em conflito. ` +
        `Isso nao e insuperável, mas requer esforço consciente para entender e acomodar as necessidades do outro. ` +
        `A comunicacao sobre sentimentos e crucial.`;
    }

    return `Suas Luas em ${moon1Data.name} e ${moon2Data.name} trazem uma combinacao interessante de necessidades emocionais. ` +
      `Com paciencia e comunicacao, podem aprender a nutrir um ao outro de formas unicas.`;
  }

  /**
   * Analyze communication styles
   */
  private analyzeCommunicationStyles(chart1: NatalChart, chart2: NatalChart): string {
    const sign1 = chart1.sunSign;
    const sign2 = chart2.sunSign;
    const element1 = ZODIAC_DATA[sign1].element;
    const element2 = ZODIAC_DATA[sign2].element;

    if (element1 === 'air' || element2 === 'air') {
      return 'Com pelo menos um signo de ar, a comunicacao flui naturalmente. ' +
        'Conversas podem ser estimulantes e ajudam a resolver conflitos atraves do dialogo. ' +
        'Cuidado para nao intelectualizar demais as emocoes.';
    }

    if (element1 === 'fire' && element2 === 'fire') {
      return 'Dois signos de fogo comunicam com paixao e entusiasmo. ' +
        'Podem ser diretos demais às vezes, mas raramente ha mal-entendidos sobre intencoes. ' +
        'Aprendam a ouvir tanto quanto falam.';
    }

    if (element1 === 'water' || element2 === 'water') {
      return 'Comunicacao intuitiva marca essa conexao. ' +
        'Voces frequentemente sabem o que o outro sente sem palavras. ' +
        'No entanto, e importante verbalizar necessidades para evitar suposicoes erradas.';
    }

    return 'Seus estilos de comunicacao sao praticos e fundamentados. ' +
      'Conversas sobre planos concretos fluem bem. ' +
      'Trabalhem em expressar mais os aspectos emocionais e sonhadores.';
  }

  /**
   * Assess long-term potential
   */
  private assessLongTermPotential(chart1: NatalChart, chart2: NatalChart, baseScore: number): string {
    if (baseScore >= 80) {
      return 'O potencial de longo prazo e excelente. As estrelas indicam uma conexao que pode resistir ao tempo. ' +
        'Com compromisso mutuo, esse relacionamento tem todas as bases para uma vida compartilhada significativa. ' +
        'Continuem nutrindo a conexao e nunca parem de crescer juntos.';
    } else if (baseScore >= 65) {
      return 'Ha potencial solido para uma relacao duradoura, embora requeira trabalho consciente. ' +
        'Foquem em construir tradicoes juntos e enfrentar desafios como uma equipe. ' +
        'Os obstaculos que superarem fortalecerão a uniao.';
    } else if (baseScore >= 50) {
      return 'O caminho de longo prazo requer dedicacao excepcional de ambas as partes. ' +
        'Isso nao significa impossibilidade, mas sim que o crescimento pessoal sera uma parte integral dessa jornada. ' +
        'Se estiverem dispostos ao trabalho, podem criar algo unico.';
    } else {
      return 'Os desafios de longo prazo sao significativos, mas nao intransponiveis. ' +
        'Esta e uma conexao que testará ambos e, se persistirem, transformará profundamente. ' +
        'Perguntem-se se estao comprometidos com esse nivel de crescimento.';
    }
  }

  /**
   * Identify areas for growth together
   */
  private identifyGrowthAreas(chart1: NatalChart, chart2: NatalChart): string[] {
    const areas: string[] = [];
    const sign1Data = ZODIAC_DATA[chart1.sunSign];
    const sign2Data = ZODIAC_DATA[chart2.sunSign];

    // Complementary weaknesses = growth opportunities
    if (sign1Data.weaknesses.some((w) => sign2Data.traits.includes(w))) {
      areas.push('Uma das forcas de voce pode ajudar o outro a superar uma fraqueza');
    }

    // Different elements bring different perspectives
    if (sign1Data.element !== sign2Data.element) {
      areas.push('Aprender a apreciar formas diferentes de ver o mundo');
    }

    // Different modalities teach different approaches
    if (sign1Data.modality !== sign2Data.modality) {
      areas.push('Equilibrar diferentes ritmos e abordagens para acao');
    }

    // Moon sign development
    areas.push('Desenvolver inteligencia emocional atraves da relacao');

    // Always include communication
    areas.push('Aprofundar comunicacao e compreensao mutua');

    return areas.slice(0, 4);
  }

  /**
   * Adjust scores based on full chart analysis
   */
  private adjustScoresForFullChart(
    basicResult: CompatibilityResult,
    chart1: NatalChart,
    chart2: NatalChart,
  ): Partial<CompatibilityResult> {
    // Moon compatibility adjustment
    const moonElement1 = ZODIAC_DATA[chart1.moonSign].element;
    const moonElement2 = ZODIAC_DATA[chart2.moonSign].element;
    let emotionalAdjustment = 0;

    if (moonElement1 === moonElement2) emotionalAdjustment = 5;
    else if (
      (moonElement1 === 'water' && moonElement2 === 'earth') ||
      (moonElement1 === 'earth' && moonElement2 === 'water')
    ) {
      emotionalAdjustment = 5;
    }

    // Ascendant compatibility adjustment
    const risingCompatible = ZODIAC_DATA[chart1.ascendant].compatibility.includes(chart2.sunSign);
    const firstImpressionAdjustment = risingCompatible ? 3 : -2;

    return {
      overallScore: Math.min(100, basicResult.overallScore + emotionalAdjustment + firstImpressionAdjustment),
      loveScore: Math.min(100, basicResult.loveScore + emotionalAdjustment),
      communicationScore: Math.min(100, basicResult.communicationScore + firstImpressionAdjustment),
    };
  }

  // ==================== CELEBRITY MATCHING METHODS ====================

  /**
   * Find commonalities between user chart and celebrity
   */
  private findCommonalities(
    chart: NatalChart,
    celebrity: { name: string; sunSign: ZodiacSign; category: string; trait: string },
  ): string[] {
    const commonalities: string[] = [];
    const userSign = ZODIAC_DATA[chart.sunSign];
    const celebSign = ZODIAC_DATA[celebrity.sunSign];

    // Same sign
    if (chart.sunSign === celebrity.sunSign) {
      commonalities.push(`Mesmo signo solar: ${userSign.name}`);
    }

    // Same element
    if (userSign.element === celebSign.element) {
      commonalities.push(`Mesmo elemento: ${userSign.element}`);
    }

    // Same modality
    if (userSign.modality === celebSign.modality) {
      commonalities.push(`Mesma modalidade: ${userSign.modality}`);
    }

    // Compatible signs
    if (userSign.compatibility.includes(celebrity.sunSign)) {
      commonalities.push('Signos naturalmente compativeis');
    }

    // Shared traits
    const sharedTraits = userSign.traits.filter((t) => celebSign.traits.includes(t));
    if (sharedTraits.length > 0) {
      commonalities.push(`Tracos compartilhados: ${sharedTraits[0]}`);
    }

    return commonalities.slice(0, 3);
  }

  /**
   * Generate fun fact about celebrity match
   */
  private generateCelebrityFunFact(
    userSign: ZodiacSign,
    celebrity: { name: string; sunSign: ZodiacSign; category: string; trait: string },
  ): string {
    const userSignData = ZODIAC_DATA[userSign];
    const celebSignData = ZODIAC_DATA[celebrity.sunSign];

    if (userSign === celebrity.sunSign) {
      return `Voce e ${celebrity.name} compartilham o mesmo Sol em ${userSignData.name}! ` +
        `Isso significa que voces expressam sua identidade de formas similares e tem missões de vida parecidas.`;
    }

    if (userSignData.element === celebSignData.element) {
      return `Voce e ${celebrity.name} pertencem ao elemento ${userSignData.element === 'fire' ? 'Fogo' :
        userSignData.element === 'earth' ? 'Terra' :
        userSignData.element === 'air' ? 'Ar' : 'Agua'}! ` +
        `Voces compartilham uma energia fundamental que os motiva de formas similares.`;
    }

    if (userSignData.compatibility.includes(celebrity.sunSign)) {
      return `${userSignData.name} e ${celebSignData.name} sao naturalmente compativeis! ` +
        `Se voces se conhecessem, provavelmente se dariam muito bem.`;
    }

    return `${celebrity.name} e conhecida por ser ${celebrity.trait}. ` +
      `Com sua energia de ${userSignData.name}, voces poderiam criar uma dinamica interessante juntos!`;
  }
}
