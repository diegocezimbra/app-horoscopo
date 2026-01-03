import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '../../components/common/AnimatedBackground';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/layout/Header';
import './Home.css';

export function Home() {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/onboarding');
  };

  return (
    <div className="home-page">
      <AnimatedBackground variant="cosmic" intensity="high" />

      <Header transparent showLogo />

      <main className="home-page__content">
        {/* Hero section */}
        <section className="home-page__hero">
          <div className="home-page__decoration">
            <span className="home-page__constellation">{'\u2728'}</span>
            <div className="home-page__glow" />
          </div>

          <h1 className="home-page__title">
            Discover Your
            <span className="home-page__title-highlight"> Cosmic Path</span>
          </h1>

          <p className="home-page__subtitle">
            Unlock personalized daily horoscopes, compatibility insights,
            and celestial guidance tailored to your unique astrological profile.
          </p>

          <div className="home-page__cta">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartJourney}
            >
              Begin Your Journey
            </Button>

            <p className="home-page__cta-note">
              Join <span className="home-page__highlight">2M+</span> cosmic explorers
            </p>
          </div>
        </section>

        {/* Features preview */}
        <section className="home-page__features">
          <div className="home-page__feature">
            <span className="home-page__feature-icon">{'\u2600'}</span>
            <span className="home-page__feature-text">Daily Readings</span>
          </div>
          <div className="home-page__feature">
            <span className="home-page__feature-icon">{'\u2665'}</span>
            <span className="home-page__feature-text">Love Match</span>
          </div>
          <div className="home-page__feature">
            <span className="home-page__feature-icon">{'\u2B50'}</span>
            <span className="home-page__feature-text">Birth Chart</span>
          </div>
        </section>

        {/* Trust badges */}
        <section className="home-page__trust">
          <div className="home-page__rating">
            <span className="home-page__stars">{'\u2605\u2605\u2605\u2605\u2605'}</span>
            <span className="home-page__rating-text">4.9 on App Store</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
