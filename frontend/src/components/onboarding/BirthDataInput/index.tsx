/**
 * ==============================================================================
 * BirthDataInput Component - Birth Data Collection
 * ==============================================================================
 *
 * Collects user birth data (date, time, place) for astrological chart calculation.
 * Features wheel picker-style selects, autocomplete for cities, and cosmic styling.
 *
 * @module components/onboarding/BirthDataInput
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import './BirthDataInput.css';

export interface BirthData {
  day: number;
  month: number;
  year: number;
  time: string | null;
  place: string;
}

export interface BirthDataInputProps {
  onNext: (data: BirthData) => void;
  onBack?: () => void;
  progress?: number;
  initialData?: Partial<BirthData>;
}

// Brazilian cities for autocomplete
const CITIES = [
  'Sao Paulo, SP',
  'Rio de Janeiro, RJ',
  'Brasilia, DF',
  'Salvador, BA',
  'Fortaleza, CE',
  'Belo Horizonte, MG',
  'Manaus, AM',
  'Curitiba, PR',
  'Recife, PE',
  'Porto Alegre, RS',
  'Goiania, GO',
  'Belem, PA',
  'Guarulhos, SP',
  'Campinas, SP',
  'Sao Luis, MA',
  'Sao Goncalo, RJ',
  'Maceio, AL',
  'Duque de Caxias, RJ',
  'Natal, RN',
  'Teresina, PI',
  'Campo Grande, MS',
  'Sao Bernardo do Campo, SP',
  'Joao Pessoa, PB',
  'Nova Iguacu, RJ',
  'Santo Andre, SP',
  'Osasco, SP',
  'Jaboatao dos Guararapes, PE',
  'Ribeirao Preto, SP',
  'Uberlandia, MG',
  'Sorocaba, SP',
  'Contagem, MG',
  'Aracaju, SE',
  'Feira de Santana, BA',
  'Cuiaba, MT',
  'Joinville, SC',
  'Londrina, PR',
  'Juiz de Fora, MG',
  'Aparecida de Goiania, GO',
  'Niteroi, RJ',
  'Ananindeua, PA',
  'Florianopolis, SC',
  'Serra, ES',
  'Vitoria, ES',
  'Campos dos Goytacazes, RJ',
  'Caxias do Sul, RS',
  'Blumenau, SC',
  'Piracicaba, SP',
  'Maringa, PR',
  'Santos, SP',
  'Petropolis, RJ',
];

// Generate arrays for date selectors
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Marco' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

// Generate time options (00:00 to 23:45 in 15-minute intervals)
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

// Icons
const BackIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LocationIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BirthDataInput: React.FC<BirthDataInputProps> = ({
  onNext,
  onBack,
  progress = 40,
  initialData = {},
}) => {
  // Date state
  const [day, setDay] = useState<number>(initialData.day || 1);
  const [month, setMonth] = useState<number>(initialData.month || 1);
  const [year, setYear] = useState<number>(initialData.year || 2000);

  // Time state
  const [time, setTime] = useState<string | null>(initialData.time || null);
  const [knowsTime, setKnowsTime] = useState<boolean>(initialData.time !== null);

  // Place state
  const [place, setPlace] = useState<string>(initialData.place || '');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Animation state
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Refs
  const placeInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filtered cities for autocomplete
  const filteredCities = useMemo(() => {
    if (!place.trim()) return CITIES.slice(0, 8);
    const searchTerm = place.toLowerCase();
    return CITIES.filter((city) => city.toLowerCase().includes(searchTerm)).slice(0, 8);
  }, [place]);

  // Handle clicks outside suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        placeInputRef.current &&
        !placeInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validate date
  const isDateValid = (): boolean => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  };

  // Check if form is valid
  const isValid = (): boolean => {
    return isDateValid() && place.trim().length > 0;
  };

  // Handle time toggle
  const handleTimeToggle = (knows: boolean) => {
    setKnowsTime(knows);
    if (!knows) {
      setTime(null);
    } else if (!time) {
      setTime('12:00');
    }
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setPlace(city);
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isValid()) {
      onNext({
        day,
        month,
        year,
        time: knowsTime ? time : null,
        place: place.trim(),
      });
    }
  };

  return (
    <div className={`birth-data-screen ${isVisible ? 'visible' : ''}`}>
      {/* Progress Bar */}
      <div className="birth-data-progress-container">
        {onBack && (
          <button
            type="button"
            className="birth-data-back-button"
            onClick={onBack}
            aria-label="Voltar"
          >
            <BackIcon />
          </button>
        )}
        <div className="birth-data-progress">
          <div
            className="birth-data-progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div className="birth-data-progress-shimmer" />
        </div>
      </div>

      {/* Decorative Stars */}
      <div className="birth-data-stars" aria-hidden="true">
        <span className="star star-1" />
        <span className="star star-2" />
        <span className="star star-3" />
        <span className="star star-4" />
        <span className="star star-5" />
        <span className="star star-6" />
      </div>

      <div className="birth-data-content">
        <header className="birth-data-header">
          <h1 className="birth-data-title">Quando voce nasceu?</h1>
          <p className="birth-data-subtitle">
            Precisamos desta informacao para calcular seu mapa astral com precisao
          </p>
        </header>

        {/* Date Section */}
        <div className="birth-data-section">
          <div className="birth-data-section-label">
            <CalendarIcon />
            <span>Data de nascimento</span>
          </div>

          <div className="birth-data-date-selects">
            {/* Day Select */}
            <div className="birth-data-select-wrapper">
              <select
                className="birth-data-select"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                aria-label="Dia"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span className="birth-data-select-icon">
                <ChevronDownIcon />
              </span>
            </div>

            {/* Month Select */}
            <div className="birth-data-select-wrapper month-select">
              <select
                className="birth-data-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                aria-label="Mes"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <span className="birth-data-select-icon">
                <ChevronDownIcon />
              </span>
            </div>

            {/* Year Select */}
            <div className="birth-data-select-wrapper">
              <select
                className="birth-data-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                aria-label="Ano"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="birth-data-select-icon">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Date validation error */}
          {!isDateValid() && (
            <span className="birth-data-error">Data invalida para o mes selecionado</span>
          )}
        </div>

        {/* Time Section */}
        <div className="birth-data-section">
          <div className="birth-data-section-label">
            <ClockIcon />
            <span>Hora de nascimento</span>
            <span className="birth-data-optional">(opcional)</span>
          </div>

          <div className="birth-data-time-toggle">
            <button
              type="button"
              className={`birth-data-toggle-option ${knowsTime ? 'active' : ''}`}
              onClick={() => handleTimeToggle(true)}
            >
              Sei a hora
            </button>
            <button
              type="button"
              className={`birth-data-toggle-option ${!knowsTime ? 'active' : ''}`}
              onClick={() => handleTimeToggle(false)}
            >
              Nao sei
            </button>
          </div>

          {knowsTime && (
            <div className="birth-data-time-select-wrapper">
              <div className="birth-data-select-wrapper time-select">
                <select
                  className="birth-data-select"
                  value={time || '12:00'}
                  onChange={(e) => setTime(e.target.value)}
                  aria-label="Hora de nascimento"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="birth-data-select-icon">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          )}

          {!knowsTime && (
            <p className="birth-data-time-note">
              Tudo bem! Usaremos o meio-dia como referencia. Voce pode atualizar depois.
            </p>
          )}
        </div>

        {/* Place Section */}
        <div className="birth-data-section">
          <div className="birth-data-section-label">
            <LocationIcon />
            <span>Local de nascimento</span>
          </div>

          <div className="birth-data-place-wrapper">
            <input
              ref={placeInputRef}
              type="text"
              className={`birth-data-place-input ${isFocused ? 'focused' : ''}`}
              placeholder="Digite sua cidade de nascimento"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => setIsFocused(false)}
              aria-label="Cidade de nascimento"
              aria-autocomplete="list"
              aria-controls="city-suggestions"
              autoComplete="off"
            />
            <div className="birth-data-place-glow" aria-hidden="true" />

            {showSuggestions && filteredCities.length > 0 && (
              <div
                ref={suggestionsRef}
                id="city-suggestions"
                className="birth-data-suggestions"
                role="listbox"
              >
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="birth-data-suggestion-item"
                    onClick={() => handleCitySelect(city)}
                    role="option"
                  >
                    <LocationIcon />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        className={`birth-data-button ${!isValid() ? 'disabled' : ''}`}
        onClick={handleSubmit}
        disabled={!isValid()}
        aria-label="Continuar para a proxima etapa"
      >
        Continuar
      </button>
    </div>
  );
};

export default BirthDataInput;
