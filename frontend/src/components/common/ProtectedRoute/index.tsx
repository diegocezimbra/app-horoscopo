import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

/**
 * ProtectedRoute component
 * Wraps routes that require authentication
 * Optionally can require premium subscription
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePremium = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const location = useLocation();

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to premium page if premium is required but user is not premium
  if (requirePremium && user && !user.isPremium) {
    return <Navigate to="/premium" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
