/**
 * ProfileList Page
 * Shows all user profiles with quick actions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfiles } from '../../hooks/useProfiles';
import { ProfileCard } from '../../components/profiles/ProfileCard';
import { PROFILE_TYPE_INFO } from '../../types/profiles';
import './ProfileList.css';

export const ProfileList: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, mainProfile, isLoading } = useProfiles();

  const handleProfileClick = (id: string) => {
    navigate(`/profiles/${id}`);
  };

  const handleEditProfile = (id: string) => {
    navigate(`/profiles/${id}/edit`);
  };

  const handleCompareProfile = (id: string) => {
    navigate(`/compatibility?profile1=${id}`);
  };

  const handleAddProfile = () => {
    navigate('/profiles/add');
  };

  if (isLoading) {
    return (
      <div className="profile-list">
        <div className="profile-list__loading">
          <div className="profile-list__spinner" />
          <span>Carregando perfis...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-list">
      {/* Header */}
      <header className="profile-list__header">
        <h1 className="profile-list__title">Meus Perfis</h1>
        <p className="profile-list__subtitle">
          Gerencie seus perfis e compare compatibilidades
        </p>
      </header>

      {/* Main Profile */}
      {mainProfile && (
        <section className="profile-list__section">
          <h2 className="profile-list__section-title">
            <span className="profile-list__section-icon">\u2B50</span>
            Meu Perfil
          </h2>
          <ProfileCard
            profile={mainProfile}
            onClick={() => handleProfileClick(mainProfile.id)}
            onEdit={() => handleEditProfile(mainProfile.id)}
            onCompare={() => handleCompareProfile(mainProfile.id)}
          />
        </section>
      )}

      {/* No main profile - prompt to create */}
      {!mainProfile && (
        <section className="profile-list__section">
          <div className="profile-list__empty-main">
            <span className="profile-list__empty-icon">\uD83C\uDF1F</span>
            <h3>Crie seu perfil</h3>
            <p>Adicione seus dados de nascimento para comecar</p>
            <button
              className="profile-list__create-btn"
              onClick={() => navigate('/profiles/add?type=main')}
            >
              Criar Meu Perfil
            </button>
          </div>
        </section>
      )}

      {/* Other Profiles */}
      {profiles.length > 0 && (
        <section className="profile-list__section">
          <h2 className="profile-list__section-title">
            <span className="profile-list__section-icon">\uD83D\uDC65</span>
            Outros Perfis
            <span className="profile-list__count">{profiles.length}</span>
          </h2>

          <div className="profile-list__grid">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => handleProfileClick(profile.id)}
                onEdit={() => handleEditProfile(profile.id)}
                onCompare={() => handleCompareProfile(profile.id)}
              />
            ))}

            {/* Add Profile Card */}
            <div className="profile-card profile-card--add" onClick={handleAddProfile}>
              <div className="profile-card__add-icon">+</div>
              <span className="profile-card__add-text">Adicionar Perfil</span>
            </div>
          </div>
        </section>
      )}

      {/* Empty state - no other profiles */}
      {profiles.length === 0 && mainProfile && (
        <section className="profile-list__section">
          <h2 className="profile-list__section-title">
            <span className="profile-list__section-icon">\uD83D\uDC65</span>
            Outros Perfis
          </h2>
          <div className="profile-list__empty">
            <span className="profile-list__empty-icon">\u2764\uFE0F</span>
            <h3>Adicione pessoas importantes</h3>
            <p>
              Parceiros, filhos, amigos, crushes ou celebridades para descobrir
              a compatibilidade entre voces!
            </p>
            <div className="profile-list__type-hints">
              {Object.entries(PROFILE_TYPE_INFO)
                .filter(([key]) => key !== 'main')
                .map(([key, info]) => (
                  <span key={key} className="profile-list__type-hint">
                    {info.icon} {info.label}
                  </span>
                ))}
            </div>
            <button className="profile-list__add-btn" onClick={handleAddProfile}>
              <span>+</span>
              Adicionar Primeiro Perfil
            </button>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="profile-list__quick-actions">
        <button
          className="profile-list__quick-action"
          onClick={() => navigate('/compatibility')}
        >
          <span className="profile-list__quick-action-icon">\u2764\uFE0F</span>
          <span className="profile-list__quick-action-label">Comparar</span>
        </button>
        <button
          className="profile-list__quick-action"
          onClick={handleAddProfile}
        >
          <span className="profile-list__quick-action-icon">+</span>
          <span className="profile-list__quick-action-label">Novo Perfil</span>
        </button>
      </section>
    </div>
  );
};

export default ProfileList;
