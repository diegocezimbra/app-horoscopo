/**
 * ==============================================================================
 * PricingPlans Component
 * ==============================================================================
 *
 * The monetization screen with pricing plans and countdown timer.
 * Creates urgency and drives conversions with compelling offers.
 *
 * Features:
 * - Countdown timer with discount urgency
 * - Three pricing plans with radio selection
 * - Highlighted "most popular" plan
 * - Sticky CTA button on mobile
 * - Security badges and payment icons
 * - Benefits list
 *
 * @module components/onboarding
 */
import React, { useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import './PricingPlans.css';

export interface PricingPlan {
  id: string;
  weeks: number;
  label: string;
  discountPercent: number;
  originalPricePerDay: number;
  discountedPricePerDay: number;
  originalTotal: number;
  discountedTotal: number;
  isMostPopular?: boolean;
}

export interface PricingPlansProps {
  onSelectPlan: (planId: string) => void;
  onContinue: () => void;
}

const PLANS: PricingPlan[] = [
  {
    id: '4-week',
    weeks: 4,
    label: '4-SEMANA PLANO',
    discountPercent: 50,
    originalPricePerDay: 1.07,
    discountedPricePerDay: 0.54,
    originalTotal: 29.98,
    discountedTotal: 14.99,
    isMostPopular: true,
  },
  {
    id: '12-week',
    weeks: 12,
    label: '12-SEMANA PLANO',
    discountPercent: 50,
    originalPricePerDay: 0.6,
    discountedPricePerDay: 0.3,
    originalTotal: 49.98,
    discountedTotal: 24.99,
  },
  {
    id: '24-week',
    weeks: 24,
    label: '24-SEMANA PLANO',
    discountPercent: 50,
    originalPricePerDay: 0.71,
    discountedPricePerDay: 0.36,
    originalTotal: 119.98,
    discountedTotal: 59.99,
  },
];

const BENEFITS = [
  'Mapa astral completo e personalizado',
  'Previsoes diarias, semanais e mensais',
  'Compatibilidade amorosa detalhada',
  'Analise de carreira e financas',
  'Orientacao para decisoes importantes',
  'Acesso ilimitado a todos os recursos',
];

const INITIAL_TIME = 10 * 60; // 10 minutes in seconds

export const PricingPlans: React.FC<PricingPlansProps> = ({
  onSelectPlan,
  onContinue,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('4-week');
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          return INITIAL_TIME; // Reset for demo
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    onSelectPlan(planId);
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <div className="pricing-plans" role="region" aria-label="Planos de assinatura">
      {/* Background */}
      <div className="pricing-plans-bg" aria-hidden="true">
        <div className="cosmic-gradient-bg" />
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="cosmic-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
      </div>

      <div className="pricing-plans-content">
        {/* Timer Header */}
        <div className="pricing-timer-header" role="timer" aria-live="polite">
          <div className="timer-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span className="timer-text">
            50% desconto reservado para: <strong className="timer-countdown">{formatTime(timeRemaining)}</strong>
          </span>
        </div>

        {/* Top CTA Button */}
        <div className="pricing-top-cta">
          <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
            OBTER O MEU RELATORIO
          </Button>
        </div>

        {/* Title */}
        <h1 className="pricing-title">
          Descubra seu <strong>mapa astral completo</strong>
        </h1>

        {/* Pricing Cards */}
        <div className="pricing-cards" role="radiogroup" aria-label="Escolha seu plano">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.id === selectedPlan ? 'selected' : ''} ${
                plan.isMostPopular ? 'most-popular' : ''
              }`}
              onClick={() => handlePlanSelect(plan.id)}
              role="radio"
              aria-checked={plan.id === selectedPlan}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlanSelect(plan.id);
                }
              }}
            >
              {plan.isMostPopular && (
                <div className="popular-badge">MAIS POPULARES</div>
              )}

              <div className="pricing-card-content">
                <div className="pricing-card-header">
                  <div className="pricing-radio">
                    <div className="radio-outer">
                      <div className="radio-inner" />
                    </div>
                  </div>
                  <div className="pricing-plan-info">
                    <span className="plan-label">{plan.label}</span>
                    <div className="discount-badge">Poupar {plan.discountPercent}%</div>
                  </div>
                </div>

                <div className="pricing-card-prices">
                  <div className="price-per-day">
                    <span className="original-price">${plan.originalPricePerDay.toFixed(2)}</span>
                    <span className="discounted-price">${plan.discountedPricePerDay.toFixed(2)}</span>
                    <span className="price-period">/por dia</span>
                  </div>
                  <div className="total-price">
                    <span className="original-total">${plan.originalTotal.toFixed(2)}</span>
                    <span className="discounted-total">${plan.discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main CTA Button */}
        <div className="pricing-main-cta">
          <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
            OBTER O MEU RELATORIO
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="pricing-disclaimer">
          Ao continuar, voce concorda com os Termos de Servico e a Politica de Privacidade.
          A assinatura sera renovada automaticamente. Cancele a qualquer momento.
        </p>

        {/* Security Section */}
        <div className="pricing-security">
          <div className="security-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Pagar de forma segura e protegida</span>
          </div>

          <div className="payment-icons" aria-label="Metodos de pagamento aceitos">
            {/* Visa */}
            <div className="payment-icon" title="Visa">
              <svg viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1A1F71" />
                <path d="M19.5 21H17L18.8 11H21.3L19.5 21Z" fill="white" />
                <path d="M28.5 11.3C28 11.1 27.2 11 26.2 11C23.7 11 22 12.3 22 14.1C22 15.5 23.2 16.2 24.2 16.7C25.2 17.2 25.5 17.5 25.5 18C25.5 18.7 24.6 19 23.8 19C22.7 19 22.1 18.8 21.2 18.4L20.8 18.2L20.4 21C21.2 21.4 22.5 21.7 23.8 21.7C26.5 21.7 28.1 20.4 28.1 18.5C28.1 17.4 27.4 16.5 25.8 15.8C24.9 15.4 24.4 15.1 24.4 14.5C24.4 14 25 13.5 26 13.5C26.8 13.5 27.5 13.7 28 13.9L28.3 14L28.5 11.3Z" fill="white" />
                <path d="M33.5 11H31.5C30.8 11 30.3 11.2 30 11.8L26.5 21H29.2L29.7 19.5H33L33.3 21H35.7L33.5 11ZM30.5 17.3L31.8 13.8L32.5 17.3H30.5Z" fill="white" />
                <path d="M16.5 11L14 17.8L13.7 16.3C13.2 14.7 11.7 13 10 12.2L12.3 21H15L19 11H16.5Z" fill="white" />
                <path d="M12.2 11H8L8 11.2C11.2 12 13.3 14.2 14.1 16.5L13.2 12C13 11.3 12.6 11 12.2 11Z" fill="#F9A533" />
              </svg>
            </div>

            {/* Mastercard */}
            <div className="payment-icon" title="Mastercard">
              <svg viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#2D2D2D" />
                <circle cx="19" cy="16" r="8" fill="#EB001B" />
                <circle cx="29" cy="16" r="8" fill="#F79E1B" />
                <path d="M24 10C22.5 11.3 21.5 13.1 21.5 15.1C21.5 17.1 22.5 18.9 24 20.2C25.5 18.9 26.5 17.1 26.5 15.1C26.5 13.1 25.5 11.3 24 10Z" fill="#FF5F00" />
              </svg>
            </div>

            {/* Maestro */}
            <div className="payment-icon" title="Maestro">
              <svg viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E5E5" />
                <circle cx="19" cy="16" r="7" fill="#6C6BBD" />
                <circle cx="29" cy="16" r="7" fill="#EB001B" />
                <path d="M24 11C22.7 12.2 22 13.9 22 15.8C22 17.7 22.7 19.4 24 20.6C25.3 19.4 26 17.7 26 15.8C26 13.9 25.3 12.2 24 11Z" fill="#6C6BBD" fillOpacity="0.5" />
              </svg>
            </div>

            {/* Discover */}
            <div className="payment-icon" title="Discover">
              <svg viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E5E5" />
                <ellipse cx="29" cy="16" rx="9" ry="7" fill="#F47216" />
                <circle cx="29" cy="16" r="5" fill="#FFFFFF" />
              </svg>
            </div>

            {/* PayPal */}
            <div className="payment-icon" title="PayPal">
              <svg viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#E5E5E5" />
                <path d="M19.5 24H16L18.5 8H25C27.5 8 29 9 29 11.5C29 15 26 17 23 17H20.5L19.5 24Z" fill="#003087" />
                <path d="M21 22H17.5L20 6H26.5C29 6 30.5 7 30.5 9.5C30.5 13 27.5 15 24.5 15H22L21 22Z" fill="#009CDE" />
              </svg>
            </div>

            {/* Amex */}
            <div className="payment-icon" title="American Express">
              <svg viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#016FD0" />
                <path d="M9 16L11 12H14L16 16L18 12H21L17 20H14L12 16L10 20H7L9 16Z" fill="white" />
                <path d="M22 12H30V14H24V15H29V17H24V18H30V20H22V12Z" fill="white" />
                <path d="M31 12H34L36 16L38 12H41L37 20H34L31 12Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="pricing-benefits">
          <h2 className="benefits-title">O que obtém</h2>
          <ul className="benefits-list" role="list">
            {BENEFITS.map((benefit, index) => (
              <li key={index} className="benefit-item" role="listitem">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="pricing-sticky-cta">
        <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
          OBTER O MEU RELATORIO
        </Button>
      </div>
    </div>
  );
};

export default PricingPlans;
