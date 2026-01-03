/**
 * ProfileCard Component
 * Displays a profile with avatar, name, and zodiac badges
 */

import React from 'react';
import { Profile, ZODIAC_SIGNS, PROFILE_TYPE_INFO } from '../../../types/profiles';
import './ProfileCard.css';

export interface ProfileCardProps {
  profile: Profile;
  onClick?: () => void;
  onEdit?: () => void;
  onCompare?: () => void;
  showActions?: boolean;
  selected?: boolean;
  compact?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onClick,
  onEdit,
  onCompare,
  showActions = true,
  selected = false,
  compact = false,
}) => {
  const sunSign = ZODIAC_SIGNS[profile.sunSign];
  const moonSign = profile.moonSign ? ZODIAC_SIGNS[profile.moonSign] : null;
  const ascendant = profile.ascendant ? ZODIAC_SIGNS[profile.ascendant] : null;
  const profileTypeInfo = PROFILE_TYPE_INFO[profile.type];

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getElementGradient = (element: string): string => {
    switch (element) {
      case 'fire':
        return 'linear-gradient(135deg, #FF6B35 0%, #F7C531 100%)';
      case 'earth':
        return 'linear-gradient(135deg, #2D5016 0%, #8BC34A 100%)';
      case 'air':
        return 'linear-gradient(135deg, #64B5F6 0%, #E1BEE7 100%)';
      case 'water':
        return 'linear-gradient(135deg, #0277BD 0%, #4DD0E1 100%)';
      default:
        return 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)';
    }
  };

  return (
    <div
      className={`profile-card ${selected ? 'profile-card--selected' : ''} ${
        compact ? 'profile-card--compact' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="profile-card__header">
        <div
          className="profile-card__avatar"
          style={{ background: getElementGradient(sunSign.element) }}
        >
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} />
          ) : (
            <span className="profile-card__initials">{getInitials(profile.name)}</span>
          )}
          <span className="profile-card__type-badge" title={profileTypeInfo.label}>
            {profileTypeInfo.icon}
          </span>
        </div>

        <div className="profile-card__info">
          <h3 className="profile-card__name">{profile.name}</h3>
          <div className="profile-card__signs">
            <span className="profile-card__sign profile-card__sign--sun" title="Sol">
              {sunSign.emoji} {sunSign.name}
            </span>
            {moonSign && !compact && (
              <span className="profile-card__sign profile-card__sign--moon" title="Lua">
                {moonSign.emoji}
              </span>
            )}
            {ascendant && !compact && (
              <span className="profile-card__sign profile-card__sign--asc" title="Ascendente">
                {ascendant.emoji}
              </span>
            )}
          </div>
        </div>
      </div>

      {!compact && profile.traits && profile.traits.length > 0 && (
        <div className="profile-card__traits">
          {profile.traits.slice(0, 3).map((trait, index) => (
            <span key={index} className="profile-card__trait">
              {trait}
            </span>
          ))}
        </div>
      )}

      {showActions && !compact && (
        <div className="profile-card__actions">
          {onEdit && (
            <button
              className="profile-card__action profile-card__action--edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </button>
          )}
          {onCompare && (
            <button
              className="profile-card__action profile-card__action--compare"
              onClick={(e) => {
                e.stopPropagation();
                onCompare();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Comparar
            </button>
          )}
        </div>
      )}

      {selected && (
        <div className="profile-card__selected-indicator">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
