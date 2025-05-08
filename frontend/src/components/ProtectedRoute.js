// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If there's no user, redirect to the Auth page
  if (!user || !user.token) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the protected component
  return children;
}
