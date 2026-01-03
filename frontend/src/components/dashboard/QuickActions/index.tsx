/**
 * QuickActions Component
 * Grid of action buttons for quick navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  color: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    id: 'tarot',
    label: 'Taro do Dia',
    icon: '\uD83C\uDCCF',
    route: '/tarot',
    color: 'purple',
  },
  {
    id: 'numerology',
    label: 'Numerologia',
    icon: '\uD83D\uDD22',
    route: '/numerology',
    color: 'blue',
  },
  {
    id: 'compatibility',
    label: 'Compatibilidade',
    icon: '\uD83D\uDC95',
    route: '/compatibility',
    color: 'pink',
  },
  {
    id: 'chart',
    label: 'Mapa Astral',
    icon: '\uD83C\uDF0C',
    route: '/chart',
    color: 'teal',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
}) => {
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="quick-actions">
      <div className="quick-actions__header">
        <span className="quick-actions__icon" aria-hidden="true">\u26A1</span>
        <h3 className="quick-actions__title">Acoes Rapidas</h3>
      </div>

      <div className="quick-actions__grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`quick-actions__button quick-actions__button--${action.color}`}
            onClick={() => handleClick(action.route)}
          >
            <span className="quick-actions__button-icon" aria-hidden="true">
              {action.icon}
            </span>
            <span className="quick-actions__button-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
