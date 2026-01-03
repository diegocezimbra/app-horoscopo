import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { Loading } from './components/common/Loading';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './styles/global.css';

// Eager loaded pages (critical path)
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';

// Lazy loaded pages for better performance
const Login = lazy(() => import('./pages/Auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));

// Tarot page (TarotHome manages internal tabs for daily/draw/history)
const TarotHome = lazy(() => import('./pages/Tarot').then(m => ({ default: m.TarotHome })));

// Lunar pages
const LunarHome = lazy(() => import('./pages/Lunar').then(m => ({ default: m.default })));

// Biorhythm pages
const BiorhythmHome = lazy(() => import('./pages/Biorhythm').then(m => ({ default: m.default })));

// Profile pages
const ProfileList = lazy(() => import('./pages/Profiles').then(m => ({ default: m.ProfileList })));
const ProfileDetail = lazy(() => import('./pages/Profiles').then(m => ({ default: m.ProfileDetail })));
const AddProfile = lazy(() => import('./pages/Profiles').then(m => ({ default: m.AddProfile })));

// Compatibility pages
const CompatibilityHome = lazy(() => import('./pages/Compatibility').then(m => ({ default: m.CompatibilityHome })));
const CompatibilityResult = lazy(() => import('./pages/Compatibility/Result').then(m => ({ default: m.CompatibilityResult })));

// Settings and Premium pages
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Premium = lazy(() => import('./pages/Premium').then(m => ({ default: m.Premium })));

/**
 * Main App component with routing for the horoscope application
 * Includes AuthProvider, lazy loading, and protected routes
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OnboardingProvider>
          <Suspense fallback={<Loading message="Carregando..." />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboard - Protected */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Tarot routes - Protected (TarotHome has internal tabs for daily/draw/history) */}
              <Route
                path="/tarot"
                element={
                  <ProtectedRoute>
                    <TarotHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tarot/daily"
                element={
                  <ProtectedRoute>
                    <TarotHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tarot/draw"
                element={
                  <ProtectedRoute>
                    <TarotHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tarot/card/:id"
                element={
                  <ProtectedRoute>
                    <TarotHome />
                  </ProtectedRoute>
                }
              />

              {/* Lunar routes - Protected */}
              <Route
                path="/lunar"
                element={
                  <ProtectedRoute>
                    <LunarHome />
                  </ProtectedRoute>
                }
              />

              {/* Biorhythm routes - Protected */}
              <Route
                path="/biorhythm"
                element={
                  <ProtectedRoute>
                    <BiorhythmHome />
                  </ProtectedRoute>
                }
              />

              {/* Compatibility routes */}
              <Route path="/compatibility" element={<CompatibilityHome />} />
              <Route path="/compatibility/result" element={<CompatibilityResult />} />
              <Route path="/compatibility/result/:id" element={<CompatibilityResult />} />

              {/* Profile routes */}
              <Route path="/profiles" element={<ProfileList />} />
              <Route path="/profiles/add" element={<AddProfile />} />
              <Route path="/profiles/:id" element={<ProfileDetail />} />
              <Route path="/profiles/:id/edit" element={<AddProfile />} />

              {/* Settings - Protected */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Premium page */}
              <Route path="/premium" element={<Premium />} />

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
