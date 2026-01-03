/**
 * Lunar Page
 * Main page for lunar phases and calendar
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLunar } from '../../hooks/useLunar';
import { MoonPhase } from './MoonPhase';
import { LunarCalendar } from './LunarCalendar';
import './Lunar.css';

type TabType = 'phase' | 'calendar';

export const LunarPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('phase');

  const {
    currentMoon,
    calendar,
    upcomingEvents,
    selectedDay,
    currentMonth,
    currentYear,
    isLoading,
    selectDay,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
  } = useLunar();

  if (isLoading || !currentMoon) {
    return (
      <div className="lunar-page">
        <div className="lunar-page__loading">
          <div className="lunar-page__loading-moon">&#x1F315;</div>
          <p className="lunar-page__loading-text">Carregando dados lunares...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lunar-page">
      {/* Header */}
      <header className="lunar-page__header">
        <button className="lunar-page__back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="lunar-page__title">Fases Lunares</h1>
        <div className="lunar-page__spacer" />
      </header>

      {/* Tab Navigation */}
      <div className="lunar-page__tabs">
        <button
          className={`lunar-page__tab ${activeTab === 'phase' ? 'lunar-page__tab--active' : ''}`}
          onClick={() => setActiveTab('phase')}
        >
          <span>&#x1F315;</span> Fase Atual
        </button>
        <button
          className={`lunar-page__tab ${activeTab === 'calendar' ? 'lunar-page__tab--active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <span>&#x1F4C5;</span> Calendario
        </button>
      </div>

      {/* Content */}
      {activeTab === 'phase' && <MoonPhase moonData={currentMoon} />}

      {activeTab === 'calendar' && (
        <LunarCalendar
          calendar={calendar}
          currentMonth={currentMonth}
          currentYear={currentYear}
          selectedDay={selectedDay}
          upcomingEvents={upcomingEvents}
          onSelectDay={selectDay}
          onNextMonth={goToNextMonth}
          onPreviousMonth={goToPreviousMonth}
          onGoToToday={goToToday}
        />
      )}
    </div>
  );
};

export default LunarPage;
