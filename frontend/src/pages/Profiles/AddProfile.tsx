/**
 * AddProfile Page
 * Form to add new profiles
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProfiles } from '../../hooks/useProfiles';
import { ProfileTypeSelector } from '../../components/profiles/ProfileTypeSelector';
import { ProfileCard } from '../../components/profiles/ProfileCard';
import { ProfileType, ProfileFormData, Profile } from '../../types/profiles';
import './AddProfile.css';

export const AddProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addProfile, searchCelebs } = useProfiles();

  const initialType = (searchParams.get('type') as ProfileType) || null;

  const [formData, setFormData] = useState<ProfileFormData>({
    type: initialType || 'friend',
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });

  const [celebritySearch, setCelebritySearch] = useState('');
  const [celebrityResults, setCelebrityResults] = useState<Profile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search celebrities when query changes
  useEffect(() => {
    const searchCelebrities = async () => {
      if (formData.type === 'celebrity' && celebritySearch.length >= 2) {
        const results = await searchCelebs(celebritySearch);
        setCelebrityResults(results);
      } else {
        setCelebrityResults([]);
      }
    };
    searchCelebrities();
  }, [celebritySearch, formData.type, searchCelebs]);

  const handleTypeChange = (type: ProfileType) => {
    setFormData({ ...formData, type });
    setCelebritySearch('');
    setCelebrityResults([]);
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleCelebritySelect = (celebrity: Profile) => {
    setFormData({
      type: 'celebrity',
      name: celebrity.name,
      birthDate: celebrity.birthDate,
      birthTime: '',
      birthPlace: '',
    });
    setCelebrityResults([]);
    setCelebritySearch(celebrity.name);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome e obrigatorio';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento e obrigatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const profile = await addProfile(formData);
      navigate(`/profiles/${profile.id}`);
    } catch (error) {
      console.error('Error creating profile:', error);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/profiles');
  };

  return (
    <div className="add-profile">
      {/* Header */}
      <header className="add-profile__header">
        <button className="add-profile__back" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="add-profile__title">Novo Perfil</h1>
        <div className="add-profile__spacer" />
      </header>

      <form className="add-profile__form" onSubmit={handleSubmit}>
        {/* Profile Type */}
        <ProfileTypeSelector
          value={formData.type}
          onChange={handleTypeChange}
          excludeMain={initialType !== 'main'}
        />

        {/* Celebrity Search */}
        {formData.type === 'celebrity' && (
          <div className="add-profile__celebrity-search">
            <label className="add-profile__label">
              Buscar Celebridade
            </label>
            <input
              type="text"
              className="add-profile__input"
              placeholder="Digite o nome..."
              value={celebritySearch}
              onChange={(e) => setCelebritySearch(e.target.value)}
            />
            {celebrityResults.length > 0 && (
              <div className="add-profile__celebrity-results">
                {celebrityResults.map((celeb) => (
                  <ProfileCard
                    key={celeb.id}
                    profile={celeb}
                    compact
                    showActions={false}
                    onClick={() => handleCelebritySelect(celeb)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Name */}
        <div className="add-profile__field">
          <label className="add-profile__label">
            Nome *
          </label>
          <input
            type="text"
            className={`add-profile__input ${errors.name ? 'add-profile__input--error' : ''}`}
            placeholder="Nome do perfil"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          {errors.name && (
            <span className="add-profile__error">{errors.name}</span>
          )}
        </div>

        {/* Birth Date */}
        <div className="add-profile__field">
          <label className="add-profile__label">
            Data de Nascimento *
          </label>
          <input
            type="date"
            className={`add-profile__input ${errors.birthDate ? 'add-profile__input--error' : ''}`}
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
          />
          {errors.birthDate && (
            <span className="add-profile__error">{errors.birthDate}</span>
          )}
        </div>

        {/* Birth Time (Optional) */}
        <div className="add-profile__field">
          <label className="add-profile__label">
            Hora de Nascimento
            <span className="add-profile__optional">(opcional)</span>
          </label>
          <input
            type="time"
            className="add-profile__input"
            value={formData.birthTime}
            onChange={(e) => handleInputChange('birthTime', e.target.value)}
          />
          <span className="add-profile__hint">
            A hora ajuda a calcular a Lua e Ascendente
          </span>
        </div>

        {/* Birth Place (Optional) */}
        <div className="add-profile__field">
          <label className="add-profile__label">
            Local de Nascimento
            <span className="add-profile__optional">(opcional)</span>
          </label>
          <input
            type="text"
            className="add-profile__input"
            placeholder="Cidade, Estado"
            value={formData.birthPlace}
            onChange={(e) => handleInputChange('birthPlace', e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="add-profile__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="add-profile__spinner" />
              Salvando...
            </>
          ) : (
            <>
              <span>\u2728</span>
              Criar Perfil
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProfile;
