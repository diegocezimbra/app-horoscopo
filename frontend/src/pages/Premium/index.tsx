/**
 * Premium Page
 * Subscription plans and premium features showcase
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Premium.css';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: 'R$ 19,90',
    period: '/mes',
    features: [
      'Horoscopo diario detalhado',
      'Tarot ilimitado',
      'Compatibilidade avancada',
      'Previsoes semanais e mensais',
      'Sem anuncios',
    ],
  },
  {
    id: 'yearly',
    name: 'Anual',
    price: 'R$ 149,90',
    period: '/ano',
    popular: true,
    features: [
      'Tudo do plano mensal',
      'Economia de 37%',
      'Mapa astral completo',
      'Alertas de transitos',
      'Suporte prioritario',
    ],
  },
  {
    id: 'lifetime',
    name: 'Vitalicio',
    price: 'R$ 299,90',
    period: 'pagamento unico',
    features: [
      'Acesso vitalicio',
      'Todas as funcionalidades',
      'Atualizacoes futuras gratis',
      'Consultoria inicial',
      'Comunidade exclusiva',
    ],
  },
];

export const Premium: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');

  const handleSubscribe = (planId: string) => {
    // TODO: Integrate with payment system
    console.log('Subscribe to plan:', planId);
    alert('Integracao com pagamento em desenvolvimento');
  };

  return (
    <div className="premium">
      <div className="premium__container">
        <header className="premium__header">
          <button className="premium__back" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="premium__title">Premium</h1>
          <div className="premium__spacer" />
        </header>

        <main className="premium__content">
          {/* Hero Section */}
          <section className="premium__hero">
            <div className="premium__icon">&#x2728;</div>
            <h2 className="premium__headline">Desbloqueie o Poder dos Astros</h2>
            <p className="premium__subheadline">
              Acesse recursos exclusivos e descubra tudo que o universo reserva para voce
            </p>
          </section>

          {/* Features Grid */}
          <section className="premium__features">
            <div className="premium__feature">
              <span className="premium__feature-icon">&#x1F52E;</span>
              <h3>Tarot Ilimitado</h3>
              <p>Faca quantas tiragens quiser</p>
            </div>
            <div className="premium__feature">
              <span className="premium__feature-icon">&#x1F4AB;</span>
              <h3>Mapa Astral</h3>
              <p>Analise completa e detalhada</p>
            </div>
            <div className="premium__feature">
              <span className="premium__feature-icon">&#x1F31F;</span>
              <h3>Previsoes Avancadas</h3>
              <p>Semanal, mensal e anual</p>
            </div>
            <div className="premium__feature">
              <span className="premium__feature-icon">&#x1F493;</span>
              <h3>Compatibilidade</h3>
              <p>Analise profunda de relacoes</p>
            </div>
          </section>

          {/* Plans */}
          <section className="premium__plans">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                className={`premium__plan ${selectedPlan === plan.id ? 'premium__plan--selected' : ''} ${plan.popular ? 'premium__plan--popular' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <span className="premium__plan-badge">Mais Popular</span>}
                <h3 className="premium__plan-name">{plan.name}</h3>
                <div className="premium__plan-price">
                  <span className="premium__plan-amount">{plan.price}</span>
                  <span className="premium__plan-period">{plan.period}</span>
                </div>
                <ul className="premium__plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="premium__check">&#x2713;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </section>

          {/* CTA */}
          <button
            className="premium__cta"
            onClick={() => handleSubscribe(selectedPlan)}
          >
            Assinar Agora
          </button>

          {/* Guarantee */}
          <p className="premium__guarantee">
            &#x1F512; 7 dias de garantia. Cancele quando quiser.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Premium;
