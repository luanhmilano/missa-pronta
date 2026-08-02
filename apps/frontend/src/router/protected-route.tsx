import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-state">Verificando permissões de acesso...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/musicas" replace />;
  }

  return <>{children}</>;
};
