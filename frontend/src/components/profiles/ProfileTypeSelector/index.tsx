/**
 * ProfileTypeSelector Component
 * Grid of profile types for selection
 */

import React from 'react';
import { ProfileType, PROFILE_TYPE_INFO } from '../../../types/profiles';
import './ProfileTypeSelector.css';

export interface ProfileTypeSelectorProps {
  value: ProfileType | null;
  onChange: (type: ProfileType) => void;
  excludeMain?: boolean;
}

export const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = ({
  value,
  onChange,
  excludeMain = true,
}) => {
  const types = Object.entries(PROFILE_TYPE_INFO).filter(
    ([key]) => !excludeMain || key !== 'main'
  ) as [ProfileType, typeof PROFILE_TYPE_INFO[ProfileType]][];

  return (
    <div className="profile-type-selector">
      <label className="profile-type-selector__label">
        Tipo de Perfil
      </label>
      <div className="profile-type-selector__grid">
        {types.map(([type, info]) => (
          <button
            key={type}
            type="button"
            className={`profile-type-selector__option ${
              value === type ? 'profile-type-selector__option--selected' : ''
            }`}
            onClick={() => onChange(type)}
          >
            <span className="profile-type-selector__icon">{info.icon}</span>
            <span className="profile-type-selector__name">{info.label}</span>
            <span className="profile-type-selector__description">{info.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTypeSelector;
