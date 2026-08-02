import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SongsView } from '../views/songs.view';
import { MassesView } from '../views/masses.view';
import { AdminSongsView } from '../views/admin-songs.view';
import { AdminMassesView } from '../views/admin-masses.view';
import { AdminProfileView } from '../views/admin-profile.view';
import { ProtectedRoute } from './protected-route';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/musicas" replace />} />
      <Route path="/musicas" element={<SongsView />} />
      <Route path="/missas" element={<MassesView />} />
      
      {/* Rotas Protegidas de Administração */}
      <Route 
        path="/admin/musicas" 
        element={
          <ProtectedRoute>
            <AdminSongsView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/missas" 
        element={
          <ProtectedRoute>
            <AdminMassesView />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/perfil" 
        element={
          <ProtectedRoute>
            <AdminProfileView />
          </ProtectedRoute>
        } 
      />

      {/* Fallback de rotas desconhecidas */}
      <Route path="*" element={<Navigate to="/musicas" replace />} />
    </Routes>
  );
};

