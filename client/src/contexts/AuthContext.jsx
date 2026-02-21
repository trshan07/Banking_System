import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

// Mock users for development - REMOVE THIS IN PRODUCTION
const MOCK_USERS = {
  customer: {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
    permissions: ['view_own_account', 'apply_loans', 'create_tickets'],
    avatar: null
  },
  employee: {
    id: '2',
    name: 'Jane Employee',
    email: 'employee@example.com',
    role: 'employee',
    permissions: ['view_loans', 'process_loans', 'view_tickets', 'respond_tickets'],
    avatar: null
  },
  admin: {
    id: '3',
    name: 'Bob Admin',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['view_users', 'manage_users', 'view_loans', 'manage_loans', 'view_tickets', 'manage_tickets', 'view_reports'],
    avatar: null
  },
  super_admin: {
    id: '4',
    name: 'Alice Super Admin',
    email: 'super@example.com',
    role: 'super_admin',
    permissions: ['ALL'],
    avatar: null
  }
}

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [devMode] = useState(true) // Set to true for development

  // Auto-login as customer for development
  useEffect(() => {
    if (devMode) {
      // Check if there's a saved dev role in localStorage
      const savedRole = localStorage.getItem('dev_role') || 'customer'
      setUser(MOCK_USERS[savedRole])
      toast.success(`Dev Mode: Logged in as ${savedRole}`)
    }
  }, [devMode])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      // Mock login for development
      if (devMode) {
        // Find user by email in mock users
        const foundUser = Object.values(MOCK_USERS).find(u => u.email === email)
        if (foundUser && password === 'password123') {
          setUser(foundUser)
          localStorage.setItem('dev_role', foundUser.role)
          toast.success(`Logged in as ${foundUser.role}`)
          return { user: foundUser, token: 'mock-token' }
        } else {
          throw new Error('Invalid credentials')
        }
      }
      
      // Real API call would go here
      // const response = await authService.login(email, password)
      // localStorage.setItem('token', response.token)
      // setUser(response.user)
      
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('dev_role')
    toast.success('Logged out successfully')
  }, [])

  const switchRole = (role) => {
    if (MOCK_USERS[role]) {
      setUser(MOCK_USERS[role])
      localStorage.setItem('dev_role', role)
      toast.success(`Switched to ${role} role`)
    }
  }

  const hasRole = useCallback((roles) => {
    if (!user) return false
    if (typeof roles === 'string') return user.role === roles
    return roles.includes(user.role)
  }, [user])

  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false
    if (user.role === 'super_admin') return true
    return user.permissions.includes(permission)
  }, [user])

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    switchRole,
    hasRole,
    hasPermission,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isEmployee: user?.role === 'employee',
    isCustomer: user?.role === 'customer',
    devMode,
    availableRoles: Object.keys(MOCK_USERS)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}