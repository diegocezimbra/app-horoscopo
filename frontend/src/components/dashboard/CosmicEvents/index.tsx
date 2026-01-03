/**
 * CosmicEvents Component
 * Displays upcoming astrological events with countdown
 */

import React from 'react';
import type { CosmicEvent } from '../../../types/dashboard';
import './CosmicEvents.css';

interface CosmicEventsProps {
  events: CosmicEvent[];
}

const eventTypeColors: Record<string, string> = {
  retrograde: 'orange',
  eclipse: 'purple',
  'new-moon': 'blue',
  'full-moon': 'yellow',
  conjunction: 'pink',
  other: 'teal',
};

export const CosmicEvents: React.FC<CosmicEventsProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  const nextEvent = events[0];

  return (
    <div className="cosmic-events">
      <div className="cosmic-events__header">
        <span className="cosmic-events__icon" aria-hidden="true">\uD83D\uDCAB</span>
        <h3 className="cosmic-events__title">Eventos Cosmicos</h3>
      </div>

      {/* Featured next event */}
      <div className={`cosmic-events__featured cosmic-events__featured--${eventTypeColors[nextEvent.type] || 'teal'}`}>
        <div className="cosmic-events__featured-icon" aria-hidden="true">
          {nextEvent.icon}
        </div>
        <div className="cosmic-events__featured-content">
          <h4 className="cosmic-events__featured-title">{nextEvent.title}</h4>
          <p className="cosmic-events__featured-desc">{nextEvent.description}</p>
          <div className="cosmic-events__countdown">
            <span className="cosmic-events__countdown-number">{nextEvent.daysUntil}</span>
            <span className="cosmic-events__countdown-label">
              {nextEvent.daysUntil === 1 ? 'dia' : 'dias'}
            </span>
          </div>
        </div>
      </div>

      {/* Other upcoming events */}
      {events.length > 1 && (
        <div className="cosmic-events__list">
          {events.slice(1).map((event) => (
            <div
              key={event.id}
              className={`cosmic-events__item cosmic-events__item--${eventTypeColors[event.type] || 'teal'}`}
            >
              <span className="cosmic-events__item-icon" aria-hidden="true">
                {event.icon}
              </span>
              <div className="cosmic-events__item-content">
                <span className="cosmic-events__item-title">{event.title}</span>
                <span className="cosmic-events__item-days">
                  em {event.daysUntil} {event.daysUntil === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CosmicEvents;
