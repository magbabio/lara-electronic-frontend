import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from 'src/context/AuthContext';

function ProtectedRoute() {

    const {loading, isAuthenticated} = useAuth();

    if (loading) return 
    if (!loading && !isAuthenticated) return <Navigate to='/login' replace />

  return <Outlet/>
}

export default ProtectedRoute