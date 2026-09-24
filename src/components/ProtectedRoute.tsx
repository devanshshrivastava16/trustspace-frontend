import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const AUTH_TOKEN_KEY = 'trustspace_access_token';

// Check if user is authenticated
function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  // If not logged in redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If logged in render child page
  return <>{children}</>;
}

export default ProtectedRoute;