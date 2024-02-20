import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from 'src/context/AuthContext';

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null;

  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;