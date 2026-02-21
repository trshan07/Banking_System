import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleBasedRoute