/**
 * DailyGreeting Component
 * Personalized greeting with time of day, user name, date, and moon phase
 */

import React from 'react';
import type { MoonInfo } from '../../../types/dashboard';
import './DailyGreeting.css';

interface DailyGreetingProps {
  greeting: string;
  date: string;
  moon: MoonInfo;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const timeIcons: Record<string, string> = {
  morning: '\u2600\uFE0F',
  afternoon: '\uD83C\uDF24\uFE0F',
  evening: '\uD83C\uDF05',
  night: '\uD83C\uDF19',
};

const moonPhaseIcons: Record<string, string> = {
  'new-moon': '\uD83C\uDF11',
  'waxing-crescent': '\uD83C\uDF12',
  'first-quarter': '\uD83C\uDF13',
  'waxing-gibbous': '\uD83C\uDF14',
  'full-moon': '\uD83C\uDF15',
  'waning-gibbous': '\uD83C\uDF16',
  'last-quarter': '\uD83C\uDF17',
  'waning-crescent': '\uD83C\uDF18',
};

export const DailyGreeting: React.FC<DailyGreetingProps> = ({
  greeting,
  date,
  moon,
  timeOfDay,
}) => {
  const timeIcon = timeIcons[timeOfDay];
  const moonIcon = moonPhaseIcons[moon.phase] || '\uD83C\uDF19';

  return (
    <div className="daily-greeting">
      <div className="daily-greeting__main">
        <span className="daily-greeting__icon" aria-hidden="true">{timeIcon}</span>
        <h1 className="daily-greeting__text">{greeting}</h1>
      </div>
      <p className="daily-greeting__date">{date}</p>

      <div className="daily-greeting__moon">
        <span className="daily-greeting__moon-icon" aria-hidden="true">{moonIcon}</span>
        <div className="daily-greeting__moon-info">
          <span className="daily-greeting__moon-sign">Lua em {moon.signName}</span>
          <span className="daily-greeting__moon-desc">{moon.description}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyGreeting;
