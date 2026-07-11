import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole, getDashboardRoute } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to={getDashboardRoute()} replace />
  }

  return children
}

export default RoleBasedRoute
