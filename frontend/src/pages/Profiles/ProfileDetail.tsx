/**
 * ProfileDetail Page
 * Detailed view of a profile with all information
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../../hooks/useProfiles';
import { Profile, ZODIAC_SIGNS, PROFILE_TYPE_INFO } from '../../types/profiles';
import './ProfileDetail.css';

export const ProfileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProfile, removeProfile, mainProfile } = useProfiles();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (id) {
        const p = await getProfile(id);
        setProfile(p);
      }
    };
    loadProfile();
  }, [id, getProfile]);

  const handleBack = () => {
    navigate('/profiles');
  };

  const handleEdit = () => {
    navigate(`/profiles/${id}/edit`);
  };

  const handleCompare = () => {
    navigate(`/compatibility?profile1=${id}`);
  };

  const handleDelete = async () => {
    if (id) {
      const success = await removeProfile(id);
      if (success) {
        navigate('/profiles');
      }
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  if (!profile) {
    return (
      <div className="profile-detail">
        <div className="profile-detail__loading">
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  const sunSign = ZODIAC_SIGNS[profile.sunSign];
  const moonSign = profile.moonSign ? ZODIAC_SIGNS[profile.moonSign] : null;
  const ascendant = profile.ascendant ? ZODIAC_SIGNS[profile.ascendant] : null;
  const typeInfo = PROFILE_TYPE_INFO[profile.type];
  const isMainProfile = mainProfile?.id === profile.id;

  return (
    <div className="profile-detail">
      {/* Header */}
      <header className="profile-detail__header">
        <button className="profile-detail__back" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="profile-detail__edit" onClick={handleEdit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </header>

      {/* Avatar Section */}
      <section className="profile-detail__avatar-section">
        <div
          className="profile-detail__avatar"
          style={{ background: getElementGradient(sunSign.element) }}
        >
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} />
          ) : (
            <span className="profile-detail__sign-emoji">{sunSign.emoji}</span>
          )}
        </div>
        <span className="profile-detail__type-badge">
          {typeInfo.icon} {typeInfo.label}
        </span>
        <h1 className="profile-detail__name">{profile.name}</h1>
        <p className="profile-detail__birth-date">
          Nasceu em {formatDate(profile.birthDate)}
        </p>
      </section>

      {/* Signs Section */}
      <section className="profile-detail__signs">
        <div className="profile-detail__sign profile-detail__sign--sun">
          <span className="profile-detail__sign-icon">\u2600\uFE0F</span>
          <div className="profile-detail__sign-info">
            <span className="profile-detail__sign-label">Sol</span>
            <span className="profile-detail__sign-value">
              {sunSign.emoji} {sunSign.name}
            </span>
          </div>
        </div>

        {moonSign && (
          <div className="profile-detail__sign profile-detail__sign--moon">
            <span className="profile-detail__sign-icon">\uD83C\uDF19</span>
            <div className="profile-detail__sign-info">
              <span className="profile-detail__sign-label">Lua</span>
              <span className="profile-detail__sign-value">
                {moonSign.emoji} {moonSign.name}
              </span>
            </div>
          </div>
        )}

        {ascendant && (
          <div className="profile-detail__sign profile-detail__sign--asc">
            <span className="profile-detail__sign-icon">\u2B50</span>
            <div className="profile-detail__sign-info">
              <span className="profile-detail__sign-label">Ascendente</span>
              <span className="profile-detail__sign-value">
                {ascendant.emoji} {ascendant.name}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Element */}
      <section className="profile-detail__element">
        <span className="profile-detail__element-label">Elemento</span>
        <span
          className="profile-detail__element-value"
          style={{ background: getElementGradient(sunSign.element) }}
        >
          {sunSign.element === 'fire' && '\uD83D\uDD25 Fogo'}
          {sunSign.element === 'earth' && '\uD83C\uDF3F Terra'}
          {sunSign.element === 'air' && '\uD83D\uDCA8 Ar'}
          {sunSign.element === 'water' && '\uD83D\uDCA7 Agua'}
        </span>
      </section>

      {/* Traits */}
      <section className="profile-detail__traits">
        <h2 className="profile-detail__section-title">
          <span>\u2728</span> Caracteristicas
        </h2>
        <div className="profile-detail__traits-grid">
          {profile.traits.map((trait, index) => (
            <span key={index} className="profile-detail__trait">
              {trait}
            </span>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="profile-detail__actions">
        <button className="profile-detail__action profile-detail__action--compare" onClick={handleCompare}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Ver Compatibilidade
        </button>

        {!isMainProfile && (
          <button
            className="profile-detail__action profile-detail__action--delete"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Excluir Perfil
          </button>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="profile-detail__modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="profile-detail__modal" onClick={(e) => e.stopPropagation()}>
            <h3>Excluir Perfil?</h3>
            <p>
              Tem certeza que deseja excluir o perfil de <strong>{profile.name}</strong>?
              Esta acao nao pode ser desfeita.
            </p>
            <div className="profile-detail__modal-actions">
              <button
                className="profile-detail__modal-btn profile-detail__modal-btn--cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="profile-detail__modal-btn profile-detail__modal-btn--delete"
                onClick={handleDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
