import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from 'src/context/AuthContext';

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return 
  const token = localStorage.getItem('token');
  if (!loading && !isAuthenticated && !token) return <Navigate to='/login' replace />
  
  return <Outlet />;
}

export default ProtectedRoute;