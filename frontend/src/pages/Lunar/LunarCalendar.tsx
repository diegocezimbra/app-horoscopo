/**
 * LunarCalendar Component
 * Displays a monthly calendar with moon phases
 */

import React from 'react';
import { LunarDayInfo, LunarEvent } from '../../services/lunar.service';

interface LunarCalendarProps {
  calendar: LunarDayInfo[];
  currentMonth: number;
  currentYear: number;
  selectedDay: LunarDayInfo | null;
  upcomingEvents: LunarEvent[];
  onSelectDay: (day: LunarDayInfo) => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  onGoToToday: () => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

export const LunarCalendar: React.FC<LunarCalendarProps> = ({
  calendar,
  currentMonth,
  currentYear,
  selectedDay,
  upcomingEvents,
  onSelectDay,
  onNextMonth,
  onPreviousMonth,
  onGoToToday,
}) => {
  // Get the first day of the month to calculate offset
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Create empty slots for days before the month starts
  const emptySlots = Array(startingDayOfWeek).fill(null);

  return (
    <section className="lunar-page__calendar-section">
      {/* Calendar header */}
      <div className="lunar-page__calendar-header">
        <button
          className="lunar-page__calendar-nav"
          onClick={onPreviousMonth}
          aria-label="Mes anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="lunar-page__calendar-title">
          <h2>{MONTH_NAMES[currentMonth]} {currentYear}</h2>
          <button className="lunar-page__today-btn" onClick={onGoToToday}>
            Hoje
          </button>
        </div>

        <button
          className="lunar-page__calendar-nav"
          onClick={onNextMonth}
          aria-label="Proximo mes"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="lunar-page__weekdays">
        {WEEKDAY_NAMES.map((day) => (
          <div key={day} className="lunar-page__weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="lunar-page__calendar-grid">
        {/* Empty slots */}
        {emptySlots.map((_, index) => (
          <div key={`empty-${index}`} className="lunar-page__calendar-day lunar-page__calendar-day--empty" />
        ))}

        {/* Days with moon phases */}
        {calendar.map((day, index) => (
          <button
            key={index}
            className={`lunar-page__calendar-day ${
              day.isToday ? 'lunar-page__calendar-day--today' : ''
            } ${
              selectedDay?.date.getTime() === day.date.getTime()
                ? 'lunar-page__calendar-day--selected'
                : ''
            }`}
            onClick={() => onSelectDay(day)}
          >
            <span className="lunar-page__day-number">{day.date.getDate()}</span>
            <span className="lunar-page__day-moon">{day.emoji}</span>
          </button>
        ))}
      </div>

      {/* Selected day details */}
      {selectedDay && (
        <div className="lunar-page__day-details">
          <div className="lunar-page__day-details-header">
            <span className="lunar-page__day-details-emoji">{selectedDay.emoji}</span>
            <div>
              <h3 className="lunar-page__day-details-date">
                {selectedDay.date.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
              <p className="lunar-page__day-details-illumination">
                {selectedDay.illumination}% iluminada
              </p>
            </div>
          </div>

          <div className="lunar-page__day-details-energy">
            <span>&#x2728;</span> {selectedDay.energy}
          </div>

          <div className="lunar-page__day-details-section">
            <h4>Rituais do Dia</h4>
            <ul>
              {selectedDay.rituals.slice(0, 3).map((ritual, idx) => (
                <li key={idx}>{ritual}</li>
              ))}
            </ul>
          </div>

          <div className="lunar-page__day-details-row">
            <div className="lunar-page__day-details-crystals">
              <h4>&#x1F48E; Cristais</h4>
              <p>{selectedDay.crystals.slice(0, 2).join(', ')}</p>
            </div>
            <div className="lunar-page__day-details-colors">
              <h4>&#x1F3A8; Cores</h4>
              <p>{selectedDay.colors.join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <div className="lunar-page__events">
        <h3 className="lunar-page__events-title">
          <span>&#x1F4C5;</span> Proximos Eventos Lunares
        </h3>

        <div className="lunar-page__events-list">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className={`lunar-page__event-card lunar-page__event-card--${event.type}`}
            >
              <div className="lunar-page__event-header">
                <span className="lunar-page__event-emoji">{event.emoji}</span>
                <div className="lunar-page__event-info">
                  <h4 className="lunar-page__event-name">{event.name}</h4>
                  <p className="lunar-page__event-date">{formatDate(event.date)}</p>
                </div>
                <div className="lunar-page__event-countdown">
                  {event.daysUntil === 0 ? (
                    <span className="lunar-page__event-countdown-value">Hoje!</span>
                  ) : event.daysUntil === 1 ? (
                    <span className="lunar-page__event-countdown-value">Amanha</span>
                  ) : (
                    <>
                      <span className="lunar-page__event-countdown-value">{event.daysUntil}</span>
                      <span className="lunar-page__event-countdown-label">dias</span>
                    </>
                  )}
                </div>
              </div>

              <div className="lunar-page__event-todos">
                <h5>O que fazer:</h5>
                <ul>
                  {event.whatToDo.slice(0, 3).map((todo, idx) => (
                    <li key={idx}>{todo}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LunarCalendar;
