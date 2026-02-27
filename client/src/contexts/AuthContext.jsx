import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

// Fake user database
const FAKE_USERS = {
  'customer@example.com': {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    permissions: ['view_own_account', 'apply_loans', 'create_tickets'],
    avatar: null,
    phone: '+1 234 567 8900',
    address: '123 Main St, New York, NY 10001'
  },
  'employee@example.com': {
    id: '2',
    name: 'Sarah Employee',
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee',
    permissions: ['view_loans', 'process_loans', 'view_tickets', 'respond_tickets'],
    avatar: null,
    phone: '+1 234 567 8901',
    address: '456 Oak Ave, Los Angeles, CA 90001'
  },
  'admin@example.com': {
    id: '3',
    name: 'Mike Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    permissions: ['view_users', 'manage_users', 'view_loans', 'manage_loans', 'view_tickets', 'manage_tickets', 'view_reports'],
    avatar: null,
    phone: '+1 234 567 8902',
    address: '789 Pine St, Chicago, IL 60601'
  },
  'superadmin@example.com': {
    id: '4',
    name: 'Alice Super Admin',
    email: 'superadmin@example.com',
    password: 'superadmin123',
    role: 'super_admin',
    permissions: ['ALL'],
    avatar: null,
    phone: '+1 234 567 8903',
    address: '321 Elm Blvd, Houston, TX 77001'
  }
}

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = FAKE_USERS[email]
        
        if (user && user.password === password) {
          // Remove password before storing
          const { password: _, ...userWithoutPassword } = user
          setUser(userWithoutPassword)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword))
          localStorage.setItem('token', 'fake-jwt-token-' + Date.now())
          
          toast.success(`Welcome back, ${userWithoutPassword.name}!`)
          resolve({ user: userWithoutPassword, token: 'fake-jwt-token' })
        } else {
          toast.error('Invalid email or password')
          reject(new Error('Invalid credentials'))
        }
      }, 1000) // Simulate network delay
    })
  }

  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        if (FAKE_USERS[userData.email]) {
          toast.error('Email already registered')
          reject(new Error('Email already exists'))
          return
        }

        // Create new user (always as customer)
        const newUser = {
          id: Date.now().toString(),
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: 'customer',
          permissions: ['view_own_account', 'apply_loans', 'create_tickets'],
          phone: userData.phone,
          address: userData.address
        }

        // In a real app, you'd save this to a database
        // For demo, we'll just return success
        toast.success('Registration successful! Please login.')
        resolve({ user: newUser })
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
  }

  const hasRole = (roles) => {
    if (!user) return false
    if (typeof roles === 'string') return user.role === roles
    return roles.includes(user.role)
  }

  const getDashboardRoute = () => {
    if (!user) return '/auth/login'
    
    switch (user.role) {
      case 'super_admin': return '/super-admin'
      case 'admin': return '/admin'
      case 'employee': return '/employee'
      default: return '/dashboard'
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    getDashboardRoute,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isEmployee: user?.role === 'employee',
    isCustomer: user?.role === 'customer',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}