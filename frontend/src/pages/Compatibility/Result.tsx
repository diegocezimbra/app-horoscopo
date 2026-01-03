/**
 * CompatibilityResult Page
 * Beautiful result display with sharing options
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompatibility, CompatibilityResultDisplay } from '../../hooks/useCompatibility';
import { CompatibilityMeter } from '../../components/compatibility/CompatibilityMeter';
import { CategoryBar } from '../../components/compatibility/CategoryBar';
import { ShareCard } from '../../components/compatibility/ShareCard';
import { ZODIAC_SIGNS, ZodiacSignId } from '../../types/profiles';
import './Compatibility.css';

// Local result type for page display
interface DisplayResult {
  sign1: ZodiacSignId;
  sign2: ZodiacSignId;
  name1: string;
  name2: string;
  overallScore: number;
  categories: { id: string; name: string; icon: string; score: number; description?: string }[];
  strengths: { id: string; text: string }[];
  challenges: { id: string; text: string }[];
  advice: string;
}

// Convert hook result to display result
const toDisplayResult = (result: CompatibilityResultDisplay): DisplayResult => ({
  sign1: result.sign1,
  sign2: result.sign2,
  name1: result.name1,
  name2: result.name2,
  overallScore: result.overallScore,
  categories: [
    { id: 'love', name: 'Amor', icon: '\uD83D\uDC95', score: result.loveScore },
    { id: 'communication', name: 'Comunicacao', icon: '\uD83D\uDCAC', score: result.communicationScore },
    { id: 'friendship', name: 'Amizade', icon: '\uD83E\uDD1D', score: result.friendshipScore },
    { id: 'trust', name: 'Confianca', icon: '\uD83D\uDD12', score: result.trustScore },
    { id: 'activities', name: 'Atividades', icon: '\uD83C\uDFAF', score: result.sharedActivitiesScore },
  ],
  strengths: result.strengths.map((text, i) => ({ id: `s${i}`, text })),
  challenges: result.challenges.map((text, i) => ({ id: `c${i}`, text })),
  advice: result.advice,
});

export const CompatibilityResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResult, recentComparisons } = useCompatibility();
  const [result, setResult] = useState<DisplayResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Try to get result from current state
    if (currentResult) {
      setResult(toDisplayResult(currentResult));
    } else if (id) {
      // Try to find in recent comparisons
      const recent = recentComparisons.find((r) => r.id === id);
      if (recent) {
        // Reconstruct minimal result for display
        setResult({
          sign1: recent.sign1,
          sign2: recent.sign2,
          name1: recent.name1,
          name2: recent.name2,
          overallScore: recent.score,
          categories: [
            { id: 'love', name: 'Amor', icon: '\uD83D\uDC95', score: Math.min(100, recent.score + 5) },
            { id: 'communication', name: 'Comunicacao', icon: '\uD83D\uDCAC', score: Math.max(20, recent.score - 10) },
            { id: 'passion', name: 'Paixao', icon: '\uD83D\uDD25', score: Math.min(100, recent.score + 10) },
            { id: 'trust', name: 'Confianca', icon: '\uD83E\uDD1D', score: recent.score },
            { id: 'values', name: 'Valores', icon: '\uD83C\uDFAF', score: Math.max(20, recent.score - 5) },
          ],
          strengths: [
            { id: 's1', text: 'Conexao emocional forte' },
            { id: 's2', text: 'Potencial para crescimento mutuo' },
          ],
          challenges: [
            { id: 'c1', text: 'Comunicacao requer atencao' },
          ],
          advice: 'Mantenham o dialogo aberto e celebrem as diferencas!',
        });
      }
    }
  }, [id, currentResult, recentComparisons]);

  const handleBack = () => {
    navigate('/compatibility');
  };

  const handleNewAnalysis = () => {
    navigate('/compatibility');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const getScoreEmoji = (score: number): string => {
    if (score >= 90) return '\uD83D\uDC96';
    if (score >= 80) return '\u2764\uFE0F';
    if (score >= 70) return '\uD83E\uDDE1';
    if (score >= 60) return '\uD83D\uDC9B';
    if (score >= 50) return '\uD83D\uDC9A';
    return '\uD83D\uDC99';
  };

  if (!result) {
    return (
      <div className="compatibility-result">
        <div className="compatibility-result__loading">
          <div className="compatibility-result__spinner" />
          <span>Calculando compatibilidade...</span>
        </div>
      </div>
    );
  }

  const sign1 = ZODIAC_SIGNS[result.sign1];
  const sign2 = ZODIAC_SIGNS[result.sign2];

  return (
    <div className="compatibility-result">
      {/* Header */}
      <header className="compatibility-result__header">
        <button className="compatibility-result__back" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="compatibility-result__title">Resultado</h1>
        <div className="compatibility-result__spacer" />
      </header>

      {/* Profiles Display */}
      <section className="compatibility-result__profiles">
        <div className="compatibility-result__profile">
          <span className="compatibility-result__sign-emoji">{sign1.emoji}</span>
          <span className="compatibility-result__name">{result.name1}</span>
          <span className="compatibility-result__sign-name">{sign1.name}</span>
        </div>

        <span className="compatibility-result__heart">
          {getScoreEmoji(result.overallScore)}
        </span>

        <div className="compatibility-result__profile">
          <span className="compatibility-result__sign-emoji">{sign2.emoji}</span>
          <span className="compatibility-result__name">{result.name2}</span>
          <span className="compatibility-result__sign-name">{sign2.name}</span>
        </div>
      </section>

      {/* Overall Score */}
      <section className="compatibility-result__score-section">
        <CompatibilityMeter
          score={result.overallScore}
          size="lg"
          label="Compatibilidade Geral"
        />
      </section>

      {/* Categories */}
      <section className="compatibility-result__categories">
        <h2 className="compatibility-result__section-title">
          <span>\uD83D\uDCCA</span> Detalhes
        </h2>
        <div className="compatibility-result__category-list">
          {result.categories.map((category, index) => (
            <CategoryBar
              key={category.id}
              icon={category.icon}
              label={category.name}
              score={category.score}
              description={category.description}
              delay={index * 100}
            />
          ))}
        </div>
      </section>

      {/* Strengths */}
      <section className="compatibility-result__strengths">
        <h2 className="compatibility-result__section-title">
          <span>\u2728</span> Pontos Fortes
        </h2>
        <ul className="compatibility-result__list">
          {result.strengths.map((strength) => (
            <li key={strength.id} className="compatibility-result__list-item">
              <span>\u2714\uFE0F</span>
              {strength.text}
            </li>
          ))}
        </ul>
      </section>

      {/* Challenges */}
      <section className="compatibility-result__challenges">
        <h2 className="compatibility-result__section-title">
          <span>\u26A0\uFE0F</span> Desafios
        </h2>
        <ul className="compatibility-result__list">
          {result.challenges.map((challenge) => (
            <li key={challenge.id} className="compatibility-result__list-item">
              <span>\uD83D\uDCA1</span>
              {challenge.text}
            </li>
          ))}
        </ul>
      </section>

      {/* Advice */}
      <section className="compatibility-result__advice">
        <h2 className="compatibility-result__section-title">
          <span>\uD83D\uDCAC</span> Conselho
        </h2>
        <p className="compatibility-result__advice-text">"{result.advice}"</p>
      </section>

      {/* Actions */}
      <section className="compatibility-result__actions">
        <button
          className="compatibility-result__action compatibility-result__action--share"
          onClick={handleShare}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartilhar
        </button>
        <button
          className="compatibility-result__action compatibility-result__action--new"
          onClick={handleNewAnalysis}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nova Analise
        </button>
      </section>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="compatibility-result__share-modal"
          onClick={() => setShowShareModal(false)}
        >
          <button
            className="compatibility-result__share-modal-close"
            onClick={() => setShowShareModal(false)}
          >
            x
          </button>
          <div
            className="compatibility-result__share-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <ShareCard
              result={result}
              onShare={() => setShowShareModal(false)}
              onDownload={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompatibilityResult;
