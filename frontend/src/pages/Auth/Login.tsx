import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

/**
 * Login Page Component
 * Cosmic dark design with animated background
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoading,
    error,
    isAuthenticated,
    clearError,
    validationErrors,
    clearValidationError,
    loginWithValidation,
  } = useAuth();

  // Get redirect path
  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const success = await loginWithValidation(email, password);

      if (success) {
        navigate(from, { replace: true });
      }

      setIsSubmitting(false);
    },
    [email, password, loginWithValidation, navigate, from]
  );

  // Handle social login (visual only)
  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`Social login with ${provider} - not implemented`);
    // TODO: Implement social login
  }, []);

  const isButtonDisabled = isLoading || isSubmitting || !email || !password;

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div className="auth-background">
        <div className="auth-stars"></div>
        <div className="auth-stars auth-stars--secondary"></div>
        <div className="auth-glow auth-glow--1"></div>
        <div className="auth-glow auth-glow--2"></div>
      </div>

      <div className="auth-container">
        {/* Logo/Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo__icon">&#x2728;</span>
          </div>
          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-subtitle">Entre para explorar seu destino cosmico</p>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Global Error */}
          {error && (
            <div className="auth-error auth-error--global">
              <span className="auth-error__icon">&#x26A0;</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">&#x2709;</span>
              <input
                id="email"
                type="email"
                className={`auth-input ${validationErrors.email ? 'auth-input--error' : ''}`}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearValidationError('email');
                }}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>
            {validationErrors.email && (
              <span className="auth-field-error">{validationErrors.email}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Senha
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">&#x1F512;</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input auth-input--with-toggle ${validationErrors.password ? 'auth-input--error' : ''}`}
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearValidationError('password');
                }}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {validationErrors.password && (
              <span className="auth-field-error">{validationErrors.password}</span>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="auth-forgot">
            <Link to="/forgot-password" className="auth-link">
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-button auth-button--primary"
            disabled={isButtonDisabled}
          >
            {isLoading || isSubmitting ? (
              <span className="auth-button__loading">
                <span className="auth-spinner"></span>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <span>ou continue com</span>
          </div>

          {/* Social Login Buttons */}
          <div className="auth-social">
            <button
              type="button"
              className="auth-social-button auth-social-button--google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <svg className="auth-social-icon" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#4285F4"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="auth-social-button auth-social-button--apple"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <svg className="auth-social-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </svg>
              Apple
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="auth-footer">
          <p>
            Nao tem uma conta?{' '}
            <Link to="/register" className="auth-link auth-link--highlight">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
