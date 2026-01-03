import React from 'react';
import { Link } from 'react-router-dom';
import './Tarot.css';

/**
 * Tarot index page - Hub for all tarot features
 */
export const TarotIndex: React.FC = () => {
  return (
    <div className="tarot">
      <div className="tarot__container">
        <header className="tarot__header">
          <h1 className="tarot__title">Tarot</h1>
          <p className="tarot__subtitle">
            Descubra as mensagens do universo atraves das cartas
          </p>
        </header>

        <div className="tarot__grid">
          <Link to="/tarot/daily" className="tarot__card">
            <div className="tarot__card-icon">🌅</div>
            <h2 className="tarot__card-title">Carta do Dia</h2>
            <p className="tarot__card-description">
              Receba uma mensagem especial para guiar seu dia
            </p>
          </Link>

          <Link to="/tarot/draw" className="tarot__card">
            <div className="tarot__card-icon">🎴</div>
            <h2 className="tarot__card-title">Tiragem Personalizada</h2>
            <p className="tarot__card-description">
              Faca uma pergunta e receba orientacao das cartas
            </p>
          </Link>

          <Link to="/tarot/card/0" className="tarot__card">
            <div className="tarot__card-icon">📚</div>
            <h2 className="tarot__card-title">Biblioteca de Cartas</h2>
            <p className="tarot__card-description">
              Explore os significados de todas as cartas
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TarotIndex;
