/**
 * Dados dos ciclos de biorritmo
 *
 * Os biorritmos sao baseados em tres ciclos naturais que afetam
 * diferentes aspectos da vida humana a partir do nascimento.
 */

export interface BiorhythmCycle {
  name: string;
  namePt: string;
  period: number;
  description: string;
  aspects: string[];
  highPhaseAdvice: string;
  lowPhaseAdvice: string;
  criticalPhaseAdvice: string;
}

export const BIORHYTHM_CYCLES: Record<string, BiorhythmCycle> = {
  physical: {
    name: 'Physical',
    namePt: 'Fisico',
    period: 23,
    description: 'O ciclo fisico influencia sua forca, resistencia, coordenacao motora e bem-estar geral do corpo.',
    aspects: [
      'Forca muscular',
      'Coordenacao motora',
      'Resistencia fisica',
      'Sistema imunologico',
      'Energia vital',
      'Recuperacao fisica',
    ],
    highPhaseAdvice: 'Excelente momento para atividades fisicas intensas, competicoes esportivas e trabalhos que exigem forca e resistencia. Seu corpo esta no auge da performance.',
    lowPhaseAdvice: 'Evite esforcos fisicos excessivos. Priorize o descanso e atividades leves. Seu corpo precisa de recuperacao.',
    criticalPhaseAdvice: 'Dia critico para o ciclo fisico. Tenha cuidado extra com atividades fisicas e evite riscos. Acidentes sao mais provaveis.',
  },
  emotional: {
    name: 'Emotional',
    namePt: 'Emocional',
    period: 28,
    description: 'O ciclo emocional afeta seu humor, sensibilidade, intuicao e capacidade criativa.',
    aspects: [
      'Estado de humor',
      'Sensibilidade emocional',
      'Criatividade artistica',
      'Intuicao',
      'Empatia',
      'Relacoes interpessoais',
    ],
    highPhaseAdvice: 'Otimo periodo para expressar sentimentos, criar arte, fortalecer relacionamentos e confiar em sua intuicao. Sua sensibilidade esta aguada.',
    lowPhaseAdvice: 'Evite decisoes emocionais importantes. Pode haver maior tendencia a irritabilidade ou melancolia. Pratique autocuidado emocional.',
    criticalPhaseAdvice: 'Dia critico emocional. Suas emocoes podem estar instaveis. Evite discussoes e decisoes importantes. Pratique meditacao.',
  },
  intellectual: {
    name: 'Intellectual',
    namePt: 'Intelectual',
    period: 33,
    description: 'O ciclo intelectual governa sua capacidade mental, memoria, concentracao e habilidades analiticas.',
    aspects: [
      'Memoria',
      'Concentracao',
      'Capacidade analitica',
      'Tomada de decisao',
      'Aprendizado',
      'Resolucao de problemas',
    ],
    highPhaseAdvice: 'Momento ideal para estudar, fazer provas, resolver problemas complexos e tomar decisoes importantes. Sua mente esta afiada.',
    lowPhaseAdvice: 'Evite tarefas que exijam alta concentracao. Pode haver dificuldade de foco e memoria. Revise trabalhos importantes.',
    criticalPhaseAdvice: 'Dia critico intelectual. Erros de julgamento sao mais provaveis. Evite assinar contratos ou tomar decisoes financeiras importantes.',
  },
};

/**
 * Conselhos gerais baseados nos valores combinados dos ciclos
 */
export const GENERAL_ADVICE: Record<string, string> = {
  allHigh: 'Dia excepcional! Todos os seus ciclos estao em fase positiva. Aproveite para realizar atividades importantes e desafiadoras.',
  allLow: 'Dia para ir com calma. Seus ciclos estao em fase baixa. Priorize descanso e evite grandes desafios.',
  allCritical: 'Dia triplo critico! Extrema cautela recomendada. Evite riscos, decisoes importantes e atividades perigosas.',
  physicalHigh: 'Seu corpo esta energizado. Bom dia para exercicios e atividades fisicas.',
  emotionalHigh: 'Suas emocoes estao positivas. Otimo para relacionamentos e expressao criativa.',
  intellectualHigh: 'Sua mente esta afiada. Ideal para estudos e resolucao de problemas.',
  mixed: 'Dia com energias mistas. Aproveite os ciclos em alta e tenha cuidado com os em baixa.',
  doubleCritical: 'Dois ciclos estao criticos. Tenha cautela extra e evite decisoes precipitadas.',
  balanced: 'Seus ciclos estao equilibrados. Um dia normal para atividades cotidianas.',
};

/**
 * Retorna o conselho apropriado baseado nos valores dos ciclos
 */
export function getAdviceForValues(
  physical: number,
  emotional: number,
  intellectual: number,
): string {
  const threshold = 20;
  const criticalThreshold = 5;

  const isPhysicalHigh = physical > threshold;
  const isEmotionalHigh = emotional > threshold;
  const isIntellectualHigh = intellectual > threshold;

  const isPhysicalLow = physical < -threshold;
  const isEmotionalLow = emotional < -threshold;
  const isIntellectualLow = intellectual < -threshold;

  const isPhysicalCritical = Math.abs(physical) < criticalThreshold;
  const isEmotionalCritical = Math.abs(emotional) < criticalThreshold;
  const isIntellectualCritical = Math.abs(intellectual) < criticalThreshold;

  const criticalCount = [isPhysicalCritical, isEmotionalCritical, isIntellectualCritical].filter(Boolean).length;
  const highCount = [isPhysicalHigh, isEmotionalHigh, isIntellectualHigh].filter(Boolean).length;
  const lowCount = [isPhysicalLow, isEmotionalLow, isIntellectualLow].filter(Boolean).length;

  if (criticalCount === 3) return GENERAL_ADVICE.allCritical;
  if (criticalCount === 2) return GENERAL_ADVICE.doubleCritical;
  if (highCount === 3) return GENERAL_ADVICE.allHigh;
  if (lowCount === 3) return GENERAL_ADVICE.allLow;

  if (isPhysicalHigh && !isEmotionalHigh && !isIntellectualHigh) return GENERAL_ADVICE.physicalHigh;
  if (isEmotionalHigh && !isPhysicalHigh && !isIntellectualHigh) return GENERAL_ADVICE.emotionalHigh;
  if (isIntellectualHigh && !isPhysicalHigh && !isEmotionalHigh) return GENERAL_ADVICE.intellectualHigh;

  if (highCount > 0 || lowCount > 0) return GENERAL_ADVICE.mixed;

  return GENERAL_ADVICE.balanced;
}
