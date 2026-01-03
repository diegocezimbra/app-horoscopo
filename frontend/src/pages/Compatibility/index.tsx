/**
 * CompatibilityHome Page
 * Select profiles or signs to compare compatibility
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfiles } from '../../hooks/useProfiles';
import { useCompatibility } from '../../hooks/useCompatibility';
import { ProfileCard } from '../../components/profiles/ProfileCard';
import { Profile, ZodiacSignId, ZODIAC_SIGNS } from '../../types/profiles';
import './Compatibility.css';

type SelectionMode = 'profiles' | 'signs';

export const CompatibilityHome: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profiles, mainProfile } = useProfiles();
  const { recentComparisons, compare } = useCompatibility();

  const preselectedId = searchParams.get('profile1');

  const [mode, setMode] = useState<SelectionMode>('profiles');
  const [selectedProfile1, setSelectedProfile1] = useState<Profile | null>(
    preselectedId ? profiles.find((p) => p.id === preselectedId) || null : mainProfile
  );
  const [selectedProfile2, setSelectedProfile2] = useState<Profile | null>(null);
  const [selectedSign1, setSelectedSign1] = useState<ZodiacSignId | null>(
    mainProfile?.sunSign || null
  );
  const [selectedSign2, setSelectedSign2] = useState<ZodiacSignId | null>(null);
  const [name1, setName1] = useState(mainProfile?.name || '');
  const [name2, setName2] = useState('');

  const handleProfileSelect = (profile: Profile) => {
    if (!selectedProfile1 || selectedProfile1.id === profile.id) {
      setSelectedProfile1(profile);
    } else if (!selectedProfile2) {
      setSelectedProfile2(profile);
    } else {
      // Swap selection
      setSelectedProfile1(profile);
      setSelectedProfile2(null);
    }
  };

  const handleSignSelect = (sign: ZodiacSignId) => {
    if (!selectedSign1) {
      setSelectedSign1(sign);
    } else if (!selectedSign2) {
      setSelectedSign2(sign);
    } else {
      setSelectedSign1(sign);
      setSelectedSign2(null);
    }
  };

  const handleCompare = async () => {
    if (mode === 'profiles' && selectedProfile1 && selectedProfile2) {
      const result = await compare(selectedProfile1, selectedProfile2);
      navigate(`/compatibility/result/${result.sign1}-${result.sign2}`);
    } else if (mode === 'signs' && selectedSign1 && selectedSign2) {
      const result = await compare(
        { name: name1 || ZODIAC_SIGNS[selectedSign1].name, sign: selectedSign1 },
        { name: name2 || ZODIAC_SIGNS[selectedSign2].name, sign: selectedSign2 }
      );
      navigate(`/compatibility/result/${result.sign1}-${result.sign2}`);
    }
  };

  const handleRecentClick = async (comparison: typeof recentComparisons[0]) => {
    const result = await compare(
      { name: comparison.name1, sign: comparison.sign1 },
      { name: comparison.name2, sign: comparison.sign2 }
    );
    navigate(`/compatibility/result/${result.sign1}-${result.sign2}`);
  };

  const canCompare =
    (mode === 'profiles' && selectedProfile1 && selectedProfile2) ||
    (mode === 'signs' && selectedSign1 && selectedSign2);

  return (
    <div className="compatibility-home">
      {/* Header */}
      <header className="compatibility-home__header">
        <button className="compatibility-home__back" onClick={() => navigate('/profiles')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="compatibility-home__title">Compatibilidade</h1>
        <div className="compatibility-home__spacer" />
      </header>

      {/* Mode Selector */}
      <div className="compatibility-home__mode-selector">
        <button
          className={`compatibility-home__mode-btn ${mode === 'profiles' ? 'compatibility-home__mode-btn--active' : ''}`}
          onClick={() => setMode('profiles')}
        >
          <span>\uD83D\uDC65</span> Perfis
        </button>
        <button
          className={`compatibility-home__mode-btn ${mode === 'signs' ? 'compatibility-home__mode-btn--active' : ''}`}
          onClick={() => setMode('signs')}
        >
          <span>\u2728</span> Signos
        </button>
      </div>

      {/* Profiles Mode */}
      {mode === 'profiles' && (
        <section className="compatibility-home__section">
          <h2 className="compatibility-home__section-title">Selecione dois perfis</h2>

          {/* Selected Profiles Display */}
          {(selectedProfile1 || selectedProfile2) && (
            <div className="compatibility-home__selected">
              <div
                className={`compatibility-home__selected-slot ${selectedProfile1 ? 'compatibility-home__selected-slot--filled' : ''}`}
                onClick={() => setSelectedProfile1(null)}
              >
                {selectedProfile1 ? (
                  <>
                    <span className="compatibility-home__selected-emoji">
                      {ZODIAC_SIGNS[selectedProfile1.sunSign].emoji}
                    </span>
                    <span className="compatibility-home__selected-name">
                      {selectedProfile1.name}
                    </span>
                  </>
                ) : (
                  <span className="compatibility-home__selected-placeholder">?</span>
                )}
              </div>

              <span className="compatibility-home__heart">\u2764\uFE0F</span>

              <div
                className={`compatibility-home__selected-slot ${selectedProfile2 ? 'compatibility-home__selected-slot--filled' : ''}`}
                onClick={() => setSelectedProfile2(null)}
              >
                {selectedProfile2 ? (
                  <>
                    <span className="compatibility-home__selected-emoji">
                      {ZODIAC_SIGNS[selectedProfile2.sunSign].emoji}
                    </span>
                    <span className="compatibility-home__selected-name">
                      {selectedProfile2.name}
                    </span>
                  </>
                ) : (
                  <span className="compatibility-home__selected-placeholder">?</span>
                )}
              </div>
            </div>
          )}

          {/* Profile List */}
          <div className="compatibility-home__profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  compact
                  showActions={false}
                  selected={
                    selectedProfile1?.id === profile.id ||
                    selectedProfile2?.id === profile.id
                  }
                  onClick={() => handleProfileSelect(profile)}
                />
              ))
            ) : (
              <div className="compatibility-home__empty">
                <p>Nenhum perfil encontrado.</p>
                <button onClick={() => navigate('/profiles/add')}>
                  Criar Perfil
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Signs Mode */}
      {mode === 'signs' && (
        <section className="compatibility-home__section">
          <h2 className="compatibility-home__section-title">Selecione dois signos</h2>

          {/* Names Input */}
          <div className="compatibility-home__names">
            <input
              type="text"
              placeholder="Seu nome"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="compatibility-home__name-input"
            />
            <span className="compatibility-home__heart">\u2764\uFE0F</span>
            <input
              type="text"
              placeholder="Nome da pessoa"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="compatibility-home__name-input"
            />
          </div>

          {/* Signs Grid */}
          <div className="compatibility-home__signs-grid">
            {Object.values(ZODIAC_SIGNS).map((sign) => (
              <button
                key={sign.id}
                className={`compatibility-home__sign-btn ${
                  selectedSign1 === sign.id || selectedSign2 === sign.id
                    ? 'compatibility-home__sign-btn--selected'
                    : ''
                } ${selectedSign1 === sign.id ? 'compatibility-home__sign-btn--first' : ''}`}
                onClick={() => handleSignSelect(sign.id)}
              >
                <span className="compatibility-home__sign-emoji">{sign.emoji}</span>
                <span className="compatibility-home__sign-name">{sign.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Compare Button */}
      <button
        className="compatibility-home__compare-btn"
        disabled={!canCompare}
        onClick={handleCompare}
      >
        <span>\u2764\uFE0F</span>
        Descobrir Compatibilidade
      </button>

      {/* Recent Comparisons */}
      {recentComparisons.length > 0 && (
        <section className="compatibility-home__recent">
          <h2 className="compatibility-home__section-title">
            <span>\uD83D\uDD52</span> Comparacoes Recentes
          </h2>
          <div className="compatibility-home__recent-list">
            {recentComparisons.slice(0, 5).map((comparison) => (
              <button
                key={comparison.id}
                className="compatibility-home__recent-item"
                onClick={() => handleRecentClick(comparison)}
              >
                <div className="compatibility-home__recent-profiles">
                  <span>{ZODIAC_SIGNS[comparison.sign1].emoji}</span>
                  <span className="compatibility-home__recent-name">{comparison.name1}</span>
                  <span className="compatibility-home__recent-vs">\u2764\uFE0F</span>
                  <span>{ZODIAC_SIGNS[comparison.sign2].emoji}</span>
                  <span className="compatibility-home__recent-name">{comparison.name2}</span>
                </div>
                <span className="compatibility-home__recent-score">{comparison.score}%</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CompatibilityHome;
