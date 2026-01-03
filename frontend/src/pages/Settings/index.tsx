/**
 * Settings Page
 * User settings and preferences
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import './Settings.css';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="settings">
      <div className="settings__container">
        <header className="settings__header">
          <button className="settings__back" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="settings__title">Configuracoes</h1>
          <div className="settings__spacer" />
        </header>

        <main className="settings__content">
          {/* Profile Section */}
          <section className="settings__section">
            <h2 className="settings__section-title">Perfil</h2>
            <div className="settings__card">
              <div className="settings__profile">
                <div className="settings__avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="settings__profile-info">
                  <span className="settings__profile-name">{user?.name || 'Usuario'}</span>
                  <span className="settings__profile-email">{user?.email || ''}</span>
                </div>
              </div>
              <button className="settings__btn settings__btn--secondary">
                Editar Perfil
              </button>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="settings__section">
            <h2 className="settings__section-title">Assinatura</h2>
            <div className="settings__card">
              <div className="settings__subscription">
                <span className="settings__plan">
                  {user?.isPremium ? 'Premium' : 'Gratuito'}
                </span>
                {!user?.isPremium && (
                  <p className="settings__plan-desc">
                    Desbloqueie recursos exclusivos
                  </p>
                )}
              </div>
              {!user?.isPremium && (
                <button
                  className="settings__btn settings__btn--primary"
                  onClick={() => navigate('/premium')}
                >
                  Assinar Premium
                </button>
              )}
            </div>
          </section>

          {/* Notifications Section */}
          <section className="settings__section">
            <h2 className="settings__section-title">Notificacoes</h2>
            <div className="settings__card">
              <div className="settings__option">
                <div className="settings__option-info">
                  <span className="settings__option-label">Horoscopo Diario</span>
                  <span className="settings__option-desc">Receba seu horoscopo todo dia</span>
                </div>
                <label className="settings__toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="settings__toggle-slider" />
                </label>
              </div>
              <div className="settings__option">
                <div className="settings__option-info">
                  <span className="settings__option-label">Eventos Cosmicos</span>
                  <span className="settings__option-desc">Alertas de luas cheias e eclipses</span>
                </div>
                <label className="settings__toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="settings__toggle-slider" />
                </label>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="settings__section">
            <h2 className="settings__section-title">Conta</h2>
            <div className="settings__card">
              <button className="settings__btn settings__btn--danger" onClick={handleLogout}>
                Sair da Conta
              </button>
            </div>
          </section>

          {/* App Info */}
          <div className="settings__footer">
            <p>Horoscopo App v1.0.0</p>
            <p>Feito com amor sob as estrelas</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
