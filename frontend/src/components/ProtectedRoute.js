// frontend/components/ProtectedRoute.js

/**
 * Purpose:
 *  - Restricts access to certain routes if user is not authenticated.
 *  - If no user or no token is present, redirects to the login screen.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute checks if a user is authenticated.
 * If they are not, it redirects them to the login page.
 * Otherwise, it renders its child components.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If no user or no token, redirect to authentication page
  if (!user || !user.token) {
    return <Navigate to="/" />;
  }

  // Otherwise, allow access to the protected component
  return children;
}
