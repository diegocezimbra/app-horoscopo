import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  ZodiacSign,
  ZODIAC_SIGNS,
  Planet,
  PLANETS,
  House,
  HOUSES,
  Aspect,
  PlanetPosition,
  NatalChart,
  ChartAspect,
  ZODIAC_SIGN_DATA,
  ELEMENT_SIGNS,
  MODALITY_SIGNS,
  getZodiacSignFromDate,
} from '../types/zodiac.types';
import { ZODIAC_SIGNS as ZODIAC_DATA } from '../data/zodiac.data';
import { PLANETS as PLANET_DATA } from '../data/planets.data';
import { HOUSES as HOUSE_DATA } from '../data/houses.data';
import { BirthDataDto } from '../dto/birth-data.dto';

// Import shared types
import {
  ChartAreaInterpretation,
  ChartInterpretation,
} from '../types/astrology.types';

/**
 * Element and modality balance
 */
interface ChartBalance {
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    dominant: 'fire' | 'earth' | 'air' | 'water';
    lacking: 'fire' | 'earth' | 'air' | 'water' | null;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
    dominant: 'cardinal' | 'fixed' | 'mutable';
    lacking: 'cardinal' | 'fixed' | 'mutable' | null;
  };
}

/**
 * NatalChartService
 *
 * This service handles all natal chart calculations including:
 * - Sun sign calculation based on birth date
 * - Moon sign approximation based on birth date and time
 * - Ascendant calculation based on birth time and location
 * - Planet positions throughout the chart
 * - Aspect calculations between planets
 * - Complete chart generation and interpretation
 *
 * Note: This uses simplified astronomical calculations.
 * For production accuracy, integrate with Swiss Ephemeris.
 */
@Injectable()
export class NatalChartService {
  private readonly logger = new Logger(NatalChartService.name);

  /**
   * Calculate the Sun sign based on birth date
   * The Sun moves through one sign approximately every 30 days
   *
   * @param birthDate - Date of birth
   * @returns The zodiac sign the Sun was in
   */
  calculateSunSign(birthDate: Date): ZodiacSign {
    return getZodiacSignFromDate(birthDate);
  }

  /**
   * Calculate approximate Moon sign based on birth date and time
   *
   * The Moon moves through all 12 signs in approximately 28 days,
   * spending about 2.5 days in each sign.
   *
   * This is a simplified calculation. For accuracy, use an ephemeris.
   *
   * @param birthDate - Date of birth
   * @param birthTime - Time of birth in HH:mm format (optional)
   * @returns The approximate zodiac sign the Moon was in
   */
  calculateMoonSign(birthDate: Date, birthTime?: string): ZodiacSign {
    // Get the day of the year (0-365)
    const startOfYear = new Date(birthDate.getFullYear(), 0, 0);
    const diff = birthDate.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Moon completes a cycle approximately every 27.3 days
    // This is a simplified calculation
    const moonCycle = 27.3;
    const daysPerSign = moonCycle / 12;

    // Calculate position in the current lunar cycle
    let moonPosition = (dayOfYear % moonCycle) / daysPerSign;

    // Adjust for birth time if provided
    if (birthTime) {
      const [hours, minutes] = birthTime.split(':').map(Number);
      const hourFraction = (hours + minutes / 60) / 24;
      moonPosition += hourFraction / daysPerSign;
    }

    // Add an offset based on the year to vary results
    const yearOffset = (birthDate.getFullYear() % 12);
    moonPosition = (moonPosition + yearOffset) % 12;

    const moonSignIndex = Math.floor(moonPosition);
    return ZODIAC_SIGNS[moonSignIndex];
  }

  /**
   * Calculate the Ascendant (Rising Sign) based on birth time and location
   *
   * The Ascendant is the zodiac sign rising on the eastern horizon
   * at the moment of birth. It changes approximately every 2 hours.
   *
   * This is a simplified calculation using birth time only.
   * For accuracy, latitude/longitude and sidereal time are needed.
   *
   * @param birthDate - Date of birth
   * @param birthTime - Time of birth in HH:mm format
   * @param birthPlace - Birth location (for future enhancement)
   * @returns The rising zodiac sign
   */
  calculateAscendant(
    birthDate: Date,
    birthTime?: string,
    birthPlace?: string,
  ): ZodiacSign {
    // If no birth time, use a default (sunrise approximation)
    if (!birthTime) {
      // Without birth time, we approximate based on sun sign
      // This is a common fallback in astrology apps
      return this.calculateSunSign(birthDate);
    }

    const [hours, minutes] = birthTime.split(':').map(Number);

    // Convert time to decimal hours
    const decimalTime = hours + minutes / 60;

    // Each sign rises for approximately 2 hours
    // Starting at midnight (0:00), Capricorn is typically rising
    // This is a Northern Hemisphere approximation

    // Get the sun sign to use as a base reference
    const sunSign = this.calculateSunSign(birthDate);
    const sunSignIndex = ZODIAC_SIGNS.indexOf(sunSign);

    // Calculate the rising sign based on time
    // At sunrise (~6:00), the sun sign is typically rising
    // Before sunrise, earlier signs; after sunrise, later signs
    const hoursFromSunrise = decimalTime - 6;
    const signOffset = Math.floor(hoursFromSunrise / 2);

    // Adjust for the date (sun's position changes through the year)
    const dayOfYear = this.getDayOfYear(birthDate);
    const yearOffset = Math.floor((dayOfYear / 30.44)); // Average days per sign

    let ascendantIndex = (sunSignIndex + signOffset + yearOffset) % 12;
    if (ascendantIndex < 0) ascendantIndex += 12;

    return ZODIAC_SIGNS[ascendantIndex];
  }

  /**
   * Calculate all planet positions for a birth chart
   *
   * This uses simplified orbital calculations.
   * Each planet has a different orbital period which we approximate.
   *
   * @param birthDate - Date of birth
   * @param birthTime - Optional birth time for more accuracy
   * @returns Array of planet positions
   */
  calculatePlanetPositions(birthDate: Date, birthTime?: string): PlanetPosition[] {
    const positions: PlanetPosition[] = [];
    const daysSinceEpoch = this.getDaysSinceJ2000(birthDate);

    // Orbital periods in days (approximate)
    const orbitalPeriods: Record<Planet, number> = {
      sun: 365.25,
      moon: 27.32,
      mercury: 87.97,
      venus: 224.7,
      mars: 686.98,
      jupiter: 4332.59,
      saturn: 10759.22,
      uranus: 30688.5,
      neptune: 60182,
      pluto: 90560,
    };

    // Reference positions at J2000 (January 1, 2000) - approximate
    const referencePositions: Record<Planet, number> = {
      sun: 280,
      moon: 218,
      mercury: 252,
      venus: 181,
      mars: 355,
      jupiter: 34,
      saturn: 50,
      uranus: 314,
      neptune: 304,
      pluto: 238,
    };

    for (const planet of PLANETS) {
      // Calculate current position based on orbital period
      const period = orbitalPeriods[planet];
      const reference = referencePositions[planet];

      // Mean motion (degrees per day)
      const meanMotion = 360 / period;

      // Current longitude (simplified, no perturbations)
      let longitude = (reference + meanMotion * daysSinceEpoch) % 360;
      if (longitude < 0) longitude += 360;

      // Convert longitude to sign and degree
      const signIndex = Math.floor(longitude / 30);
      const degree = longitude % 30;

      // Determine house (simplified - equal house system from Ascendant)
      const ascendant = this.calculateAscendant(birthDate, birthTime);
      const ascIndex = ZODIAC_SIGNS.indexOf(ascendant);
      const house = ((signIndex - ascIndex + 12) % 12) + 1;

      // Determine if retrograde (simplified check)
      // Mercury retrogrades about 3 times a year, Venus once every 18 months
      const retrograde = this.isRetrograde(planet, daysSinceEpoch);

      positions.push({
        planet,
        sign: ZODIAC_SIGNS[signIndex],
        degree: Math.round(degree * 100) / 100,
        minute: Math.round((degree % 1) * 60),
        house: house as House,
        retrograde,
      });
    }

    return positions;
  }

  /**
   * Calculate aspects between planets
   *
   * @param positions - Array of planet positions
   * @returns Array of aspects between planets
   */
  calculateAspects(positions: PlanetPosition[]): ChartAspect[] {
    const aspects: ChartAspect[] = [];

    const aspectDefinitions: Array<{ name: Aspect; angle: number; orb: number }> = [
      { name: 'conjunction', angle: 0, orb: 8 },
      { name: 'sextile', angle: 60, orb: 6 },
      { name: 'square', angle: 90, orb: 8 },
      { name: 'trine', angle: 120, orb: 8 },
      { name: 'opposition', angle: 180, orb: 8 },
    ];

    // Compare each pair of planets
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const pos1 = positions[i];
        const pos2 = positions[j];

        // Calculate absolute longitude for each planet
        const long1 = ZODIAC_SIGNS.indexOf(pos1.sign) * 30 + pos1.degree;
        const long2 = ZODIAC_SIGNS.indexOf(pos2.sign) * 30 + pos2.degree;

        // Calculate angle between planets
        let angle = Math.abs(long1 - long2);
        if (angle > 180) angle = 360 - angle;

        // Check each aspect type
        for (const aspectDef of aspectDefinitions) {
          const orb = Math.abs(angle - aspectDef.angle);
          if (orb <= aspectDef.orb) {
            aspects.push({
              planet1: pos1.planet,
              planet2: pos2.planet,
              aspect: aspectDef.name,
              orb: Math.round(orb * 100) / 100,
              applying: long1 < long2, // Simplified
            });
            break; // Only one aspect per planet pair
          }
        }
      }
    }

    return aspects;
  }

  /**
   * Generate a complete natal chart from birth data
   *
   * @param birthData - Birth date, time, and place information
   * @returns Complete natal chart object
   */
  generateNatalChart(birthData: BirthDataDto): NatalChart & { id: string; name?: string } {
    const birthDate = new Date(birthData.birthDate);

    this.logger.log(`Generating natal chart for ${birthData.name || 'user'}`);

    // Calculate the big three
    const sunSign = this.calculateSunSign(birthDate);
    const moonSign = this.calculateMoonSign(birthDate, birthData.birthTime);
    const ascendant = this.calculateAscendant(birthDate, birthData.birthTime, birthData.birthPlace);

    // Calculate all planet positions
    const planets = this.calculatePlanetPositions(birthDate, birthData.birthTime);

    // Calculate aspects
    const aspects = this.calculateAspects(planets);

    // Generate house cusps (equal house system)
    const houses = this.generateHouseCusps(ascendant);

    return {
      id: uuidv4(),
      name: birthData.name,
      sunSign,
      moonSign,
      ascendant,
      planets,
      houses,
      aspects,
      calculatedAt: new Date(),
    };
  }

  /**
   * Generate house cusps using equal house system
   *
   * @param ascendant - The rising sign
   * @returns Array of house cusps
   */
  private generateHouseCusps(ascendant: ZodiacSign): Array<{ house: House; sign: ZodiacSign; degree: number }> {
    const ascIndex = ZODIAC_SIGNS.indexOf(ascendant);
    const houses: Array<{ house: House; sign: ZodiacSign; degree: number }> = [];

    for (let i = 0; i < 12; i++) {
      const signIndex = (ascIndex + i) % 12;
      houses.push({
        house: (i + 1) as House,
        sign: ZODIAC_SIGNS[signIndex],
        degree: 0, // Equal house system starts at 0 degrees
      });
    }

    return houses;
  }

  /**
   * Calculate element and modality balance in the chart
   *
   * @param planets - Planet positions
   * @returns Balance analysis
   */
  calculateChartBalance(planets: PlanetPosition[]): ChartBalance {
    const elements = { fire: 0, earth: 0, air: 0, water: 0 };
    const modalities = { cardinal: 0, fixed: 0, mutable: 0 };

    for (const planet of planets) {
      // Count elements
      if (ELEMENT_SIGNS.fire.includes(planet.sign)) elements.fire++;
      else if (ELEMENT_SIGNS.earth.includes(planet.sign)) elements.earth++;
      else if (ELEMENT_SIGNS.air.includes(planet.sign)) elements.air++;
      else if (ELEMENT_SIGNS.water.includes(planet.sign)) elements.water++;

      // Count modalities
      if (MODALITY_SIGNS.cardinal.includes(planet.sign)) modalities.cardinal++;
      else if (MODALITY_SIGNS.fixed.includes(planet.sign)) modalities.fixed++;
      else if (MODALITY_SIGNS.mutable.includes(planet.sign)) modalities.mutable++;
    }

    // Determine dominant and lacking
    const elementEntries = Object.entries(elements) as Array<['fire' | 'earth' | 'air' | 'water', number]>;
    const modalityEntries = Object.entries(modalities) as Array<['cardinal' | 'fixed' | 'mutable', number]>;

    const dominantElement = elementEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    const lackingElement = elementEntries.find(([_, count]) => count === 0)?.[0] || null;

    const dominantModality = modalityEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    const lackingModality = modalityEntries.find(([_, count]) => count === 0)?.[0] || null;

    return {
      elements: { ...elements, dominant: dominantElement, lacking: lackingElement },
      modalities: { ...modalities, dominant: dominantModality, lacking: lackingModality },
    };
  }

  /**
   * Generate comprehensive interpretation for a natal chart
   *
   * @param chart - The natal chart to interpret
   * @returns Full chart interpretation
   */
  generateChartInterpretation(chart: NatalChart): ChartInterpretation {
    const sunData = ZODIAC_DATA[chart.sunSign];
    const moonData = ZODIAC_DATA[chart.moonSign];
    const risingData = ZODIAC_DATA[chart.ascendant];

    const balance = this.calculateChartBalance(chart.planets);

    // Generate overview
    const overview = this.generateOverview(chart, balance);

    // Generate Big Three interpretations
    const bigThree = {
      sun: this.generateSunInterpretation(chart.sunSign),
      moon: this.generateMoonInterpretation(chart.moonSign),
      rising: this.generateRisingInterpretation(chart.ascendant),
    };

    // Generate life area interpretations
    const areas = this.generateAreaInterpretations(chart);

    // Identify key themes
    const keyThemes = this.identifyKeyThemes(chart, balance);

    // Generate life path insight
    const lifePath = this.generateLifePathInsight(chart);

    return {
      overview,
      bigThree,
      areas,
      keyThemes,
      lifePath,
    };
  }

  /**
   * Generate chart overview
   */
  private generateOverview(chart: NatalChart, balance: ChartBalance): string {
    const sunData = ZODIAC_DATA[chart.sunSign];
    const elementDescriptions = {
      fire: 'energia ardente, paixao e iniciativa',
      earth: 'praticidade, estabilidade e determinacao',
      air: 'intelecto, comunicacao e sociabilidade',
      water: 'emocoes profundas, intuicao e sensibilidade',
    };

    return `Voce nasceu sob o signo de ${sunData.name}, com a Lua em ${ZODIAC_DATA[chart.moonSign].name} ` +
      `e ${ZODIAC_DATA[chart.ascendant].name} ascendendo no horizonte. ` +
      `Seu mapa natal revela uma alma com ${elementDescriptions[balance.elements.dominant]}. ` +
      `Como ${sunData.name}, voce carrega a essencia ${sunData.element === 'fire' ? 'do fogo transformador' :
        sunData.element === 'earth' ? 'da terra nutridora' :
        sunData.element === 'air' ? 'do ar libertador' : 'da agua que flui'}. ` +
      `Esta e uma combinacao unica que colore sua jornada de vida com propositos especiais.`;
  }

  /**
   * Generate Sun sign interpretation
   */
  private generateSunInterpretation(sunSign: ZodiacSign): string {
    const data = ZODIAC_DATA[sunSign];
    const planetData = PLANET_DATA[data.rulingPlanet];

    return `Seu Sol em ${data.name} ilumina sua essencia com ${data.traits.slice(0, 3).join(', ')}. ` +
      `Regido por ${planetData.name}, voce busca ${planetData.meaning.toLowerCase()}. ` +
      `${data.description} ` +
      `Sua missao de vida envolve expressar as qualidades mais elevadas de ${data.name}: ` +
      `${data.traits.slice(0, 2).join(' e ')}.`;
  }

  /**
   * Generate Moon sign interpretation
   */
  private generateMoonInterpretation(moonSign: ZodiacSign): string {
    const data = ZODIAC_DATA[moonSign];
    const moonPlanetData = PLANET_DATA.moon;

    return `Sua Lua em ${data.name} revela seu mundo emocional interno. ` +
      `Voce sente as coisas de forma ${data.element === 'water' ? 'profunda e intuitiva' :
        data.element === 'fire' ? 'intensa e apaixonada' :
        data.element === 'earth' ? 'estavel e pratica' : 'racional e comunicativa'}. ` +
      `Para se sentir seguro(a), voce precisa de ${data.element === 'water' ? 'conexao emocional profunda' :
        data.element === 'fire' ? 'liberdade para expressar-se' :
        data.element === 'earth' ? 'estabilidade material e rotina' : 'estimulo mental e social'}. ` +
      `Suas reacoes instintivas sao coloridas pelas caracteristicas de ${data.name}.`;
  }

  /**
   * Generate Rising sign interpretation
   */
  private generateRisingInterpretation(risingSign: ZodiacSign): string {
    const data = ZODIAC_DATA[risingSign];

    return `Seu Ascendente em ${data.name} e a mascara que voce apresenta ao mundo. ` +
      `As pessoas percebem voce como alguem ${data.traits.slice(0, 2).join(' e ')}. ` +
      `Este e o filtro atraves do qual voce experimenta a vida e como inicia novos projetos. ` +
      `Com ${data.name} ascendendo, voce aborda a vida com ${data.element === 'fire' ? 'entusiasmo e coragem' :
        data.element === 'earth' ? 'praticidade e cautela' :
        data.element === 'air' ? 'curiosidade e sociabilidade' : 'sensibilidade e intuicao'}.`;
  }

  /**
   * Generate interpretations for different life areas
   */
  private generateAreaInterpretations(chart: NatalChart): ChartAreaInterpretation[] {
    const areas: ChartAreaInterpretation[] = [];

    // Personality
    areas.push(this.generatePersonalityArea(chart));

    // Love and Relationships
    areas.push(this.generateLoveArea(chart));

    // Career and Purpose
    areas.push(this.generateCareerArea(chart));

    // Emotions and Inner Life
    areas.push(this.generateEmotionalArea(chart));

    // Communication
    areas.push(this.generateCommunicationArea(chart));

    return areas;
  }

  private generatePersonalityArea(chart: NatalChart): ChartAreaInterpretation {
    const sunData = ZODIAC_DATA[chart.sunSign];
    const risingData = ZODIAC_DATA[chart.ascendant];

    return {
      area: 'personality',
      title: 'Sua Personalidade',
      interpretation: `A fusao do Sol em ${sunData.name} com Ascendente em ${risingData.name} cria uma personalidade unica. ` +
        `Voce combina a essencia ${sunData.traits[0]} do seu Sol com a abordagem ${risingData.traits[0]} do seu Ascendente.`,
      keyInfluences: [`Sol em ${sunData.name}`, `Ascendente em ${risingData.name}`],
      strengths: sunData.traits.slice(0, 3),
      challenges: sunData.weaknesses.slice(0, 2),
      advice: `Abrace suas qualidades de ${sunData.name} enquanto trabalha conscientemente em equilibrar ${sunData.weaknesses[0]}.`,
    };
  }

  private generateLoveArea(chart: NatalChart): ChartAreaInterpretation {
    const venusPosition = chart.planets.find(p => p.planet === 'venus');
    const marsPosition = chart.planets.find(p => p.planet === 'mars');
    const moonData = ZODIAC_DATA[chart.moonSign];

    return {
      area: 'love',
      title: 'Amor e Relacionamentos',
      interpretation: `Com Venus em ${venusPosition?.sign || 'seu signo'} e Marte em ${marsPosition?.sign || 'seu signo'}, ` +
        `voce busca amor de forma ${venusPosition?.sign ? ZODIAC_DATA[venusPosition.sign].traits[0] : 'unica'}. ` +
        `Sua Lua em ${moonData.name} revela que voce precisa de ${moonData.element === 'water' ? 'profundidade emocional' :
          moonData.element === 'fire' ? 'paixao e aventura' :
          moonData.element === 'earth' ? 'seguranca e lealdade' : 'estimulo intelectual'} em relacionamentos.`,
      keyInfluences: [
        `Venus em ${venusPosition?.sign || 'transito'}`,
        `Marte em ${marsPosition?.sign || 'transito'}`,
        `Lua em ${chart.moonSign}`,
      ],
      strengths: ['Capacidade de amar profundamente', 'Lealdade', 'Expressao romantica'],
      challenges: ['Equilibrar necessidades proprias e do parceiro', 'Comunicacao emocional'],
      advice: 'Honre suas necessidades emocionais enquanto permanece aberto(a) as do seu parceiro.',
    };
  }

  private generateCareerArea(chart: NatalChart): ChartAreaInterpretation {
    const sunData = ZODIAC_DATA[chart.sunSign];
    const saturnPosition = chart.planets.find(p => p.planet === 'saturn');

    return {
      area: 'career',
      title: 'Carreira e Proposito',
      interpretation: `Seu Sol em ${sunData.name} sugere realizacao em carreiras que envolvam ${
        sunData.element === 'fire' ? 'lideranca, criatividade e inspiracao' :
        sunData.element === 'earth' ? 'construcao, gestao e resultados tangiveis' :
        sunData.element === 'air' ? 'comunicacao, ideias e conexoes' : 'cura, arte e servico aos outros'
      }. Saturno em ${saturnPosition?.sign || 'seu mapa'} indica onde voce construira sua autoridade e legado.`,
      keyInfluences: [`Sol em ${sunData.name}`, `Saturno em ${saturnPosition?.sign || 'transito'}`],
      strengths: ['Determinacao', 'Talentos naturais de ' + sunData.name, 'Ambicao'],
      challenges: ['Paciencia no caminho', 'Superar medos de Saturno'],
      advice: `Siga carreiras que honrem sua natureza de ${sunData.name} e construa seu legado com paciencia.`,
    };
  }

  private generateEmotionalArea(chart: NatalChart): ChartAreaInterpretation {
    const moonData = ZODIAC_DATA[chart.moonSign];
    const neptunePosition = chart.planets.find(p => p.planet === 'neptune');

    return {
      area: 'emotions',
      title: 'Vida Emocional e Interior',
      interpretation: `Sua Lua em ${moonData.name} colore todo seu mundo emocional. ` +
        `Voce processa sentimentos de forma ${moonData.modality === 'cardinal' ? 'ativa e iniciadora' :
          moonData.modality === 'fixed' ? 'profunda e persistente' : 'flexivel e adaptavel'}. ` +
        `Sua intuicao e ${moonData.element === 'water' ? 'extremamente aguçada' : 'presente mas mais racional'}.`,
      keyInfluences: [`Lua em ${moonData.name}`, `Netuno em ${neptunePosition?.sign || 'transito'}`],
      strengths: ['Intuicao', 'Profundidade emocional', 'Empatia'],
      challenges: ['Gerenciar emocoes intensas', 'Estabelecer limites saudaveis'],
      advice: 'Honre seus ciclos emocionais e crie espacos seguros para processar sentimentos.',
    };
  }

  private generateCommunicationArea(chart: NatalChart): ChartAreaInterpretation {
    const mercuryPosition = chart.planets.find(p => p.planet === 'mercury');
    const mercurySign = mercuryPosition?.sign || chart.sunSign;

    return {
      area: 'communication',
      title: 'Comunicacao e Intelecto',
      interpretation: `Mercurio em ${mercurySign} define como voce pensa e se comunica. ` +
        `Seu estilo mental e ${ZODIAC_DATA[mercurySign].element === 'fire' ? 'rapido, direto e entusiasmado' :
          ZODIAC_DATA[mercurySign].element === 'earth' ? 'pratico, metodico e concreto' :
          ZODIAC_DATA[mercurySign].element === 'air' ? 'logico, curioso e sociavel' :
          'intuitivo, poetico e imaginativo'}.`,
      keyInfluences: [`Mercurio em ${mercurySign}`],
      strengths: ['Clareza mental', 'Habilidade comunicativa', 'Aprendizado ' + ZODIAC_DATA[mercurySign].modality],
      challenges: ['Ouvir ativamente', 'Paciencia na comunicacao'],
      advice: 'Use sua mente de Mercurio em ' + mercurySign + ' para conectar e inspirar outros.',
    };
  }

  /**
   * Identify key themes in the chart
   */
  private identifyKeyThemes(chart: NatalChart, balance: ChartBalance): string[] {
    const themes: string[] = [];

    // Element theme
    themes.push(`Enfase no elemento ${balance.elements.dominant === 'fire' ? 'Fogo - paixao e acao' :
      balance.elements.dominant === 'earth' ? 'Terra - praticidade e construcao' :
      balance.elements.dominant === 'air' ? 'Ar - ideias e comunicacao' : 'Agua - emocoes e intuicao'}`);

    // Modality theme
    themes.push(`Energia ${balance.modalities.dominant === 'cardinal' ? 'Cardinal - iniciativa e lideranca' :
      balance.modalities.dominant === 'fixed' ? 'Fixa - persistencia e determinacao' :
      'Mutavel - adaptabilidade e flexibilidade'}`);

    // Sun-Moon relationship
    const sunElement = ZODIAC_DATA[chart.sunSign].element;
    const moonElement = ZODIAC_DATA[chart.moonSign].element;
    if (sunElement === moonElement) {
      themes.push('Harmonia entre consciencia e emocoes (Sol e Lua no mesmo elemento)');
    } else {
      themes.push('Tensao criativa entre mente e coracao para integrar');
    }

    // Retrograde planets
    const retrogrades = chart.planets.filter(p => p.retrograde);
    if (retrogrades.length > 0) {
      themes.push(`Internalizacao das energias de ${retrogrades.map(r =>
        PLANET_DATA[r.planet].name).join(', ')} (planetas retrogrados)`);
    }

    return themes;
  }

  /**
   * Generate life path insight
   */
  private generateLifePathInsight(chart: NatalChart): string {
    const sunData = ZODIAC_DATA[chart.sunSign];
    const moonData = ZODIAC_DATA[chart.moonSign];
    const risingData = ZODIAC_DATA[chart.ascendant];

    return `Sua jornada de vida e sobre integrar a essencia radiante de ${sunData.name}, ` +
      `nutrir suas necessidades emocionais de ${moonData.name}, ` +
      `e apresentar-se ao mundo com a graca de ${risingData.name}. ` +
      `O universo te equipou com talentos unicos: ${sunData.traits.slice(0, 2).join(' e ')}. ` +
      `Seu proposito mais elevado envolve usar esses dons para ${
        sunData.element === 'fire' ? 'inspirar e liderar outros' :
        sunData.element === 'earth' ? 'construir algo duradouro' :
        sunData.element === 'air' ? 'conectar e comunicar verdades' : 'curar e transformar'
      }. Confie na sabedoria do seu mapa natal - ele e o blueprint da sua alma.`;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get days since J2000 epoch (January 1, 2000, 12:00 TT)
   */
  private getDaysSinceJ2000(date: Date): number {
    const j2000 = new Date('2000-01-01T12:00:00Z');
    return (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);
  }

  /**
   * Get day of year (1-366)
   */
  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Simplified retrograde check
   * In reality, this requires ephemeris calculations
   */
  private isRetrograde(planet: Planet, daysSinceEpoch: number): boolean {
    // Mercury retrogrades ~3 times/year for ~3 weeks each
    if (planet === 'mercury') {
      const mercuryYear = daysSinceEpoch / 365.25;
      const phase = (mercuryYear * 3) % 1;
      return phase > 0.85 || phase < 0.05;
    }

    // Venus retrogrades every ~18 months for ~40 days
    if (planet === 'venus') {
      const venusPhase = (daysSinceEpoch / 584) % 1;
      return venusPhase > 0.9 || venusPhase < 0.02;
    }

    // Mars retrogrades every ~26 months for ~2.5 months
    if (planet === 'mars') {
      const marsPhase = (daysSinceEpoch / 780) % 1;
      return marsPhase > 0.88 || marsPhase < 0.05;
    }

    // Outer planets retrograde more frequently (~4-5 months/year)
    if (['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(planet)) {
      const outerPhase = (daysSinceEpoch / 365.25) % 1;
      return outerPhase > 0.5 && outerPhase < 0.9;
    }

    return false;
  }

  /**
   * Get zodiac sign data by sign name
   */
  getZodiacSignData(sign: ZodiacSign) {
    return ZODIAC_DATA[sign];
  }

  /**
   * Get planet data by planet name
   */
  getPlanetData(planet: Planet) {
    return PLANET_DATA[planet];
  }

  /**
   * Get house data by house number
   */
  getHouseData(house: number) {
    return HOUSE_DATA[house];
  }
}
