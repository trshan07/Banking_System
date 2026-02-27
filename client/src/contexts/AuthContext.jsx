// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Use import.meta.env instead of process.env for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set auth header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Validate token with backend
          await validateToken();
        } catch (error) {
          console.error('Failed to load user:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Validate token
  const validateToken = async () => {
    const response = await api.get('/auth/validate');
    if (response.data.success) {
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please check your email to verify your account.');
        
        return { 
          success: true, 
          message: response.data.message,
          user: response.data.user 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${userData.firstName || userData.name}!`);
        
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout').catch(() => {});
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success('Logged out successfully');
    }
  };

  // Verify email
  const verifyEmail = async (verificationToken) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/verify-email', { token: verificationToken });
      
      if (response.data.success) {
        toast.success('Email verified successfully! You can now login.');
        return { success: true };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/resend-verification', { email });
      
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
        return { success: true };
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        toast.success('Password reset email sent! Please check your inbox.');
        return { success: true };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', { token, newPassword });
      
      if (response.data.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        return { success: true };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', profileData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully!');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile picture updated!');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      
      if (response.data.success) {
        const { token: newToken } = response.data.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return { success: true };
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // Check role
  const hasRole = useCallback((roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  }, [user]);

  // Check permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  // Get dashboard route
  const getDashboardRoute = useCallback(() => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'super_admin':
        return '/super-admin/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        return '/dashboard';
    }
  }, [user]);

  // Get user full name
  const getUserFullName = useCallback(() => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email?.split('@')[0] || 'User';
  }, [user]);

  // Get user initials
  const getUserInitials = useCallback(() => {
    const fullName = getUserFullName();
    if (!fullName) return '';
    
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }, [getUserFullName]);

  // Axios response interceptor for token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await refreshToken();
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/auth/login')) {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    // State
    user,
    loading,
    token,
    isAuthenticated,
    
    // Core auth functions
    register,
    login,
    logout,
    
    // Email verification
    verifyEmail,
    resendVerification,
    
    // Password management
    forgotPassword,
    resetPassword,
    changePassword,
    
    // Profile management
    updateProfile,
    uploadProfilePicture,
    
    // Token management
    refreshToken,
    
    // Role and permission checks
    hasRole,
    hasPermission,
    
    // Helper functions
    getDashboardRoute,
    getUserFullName,
    getUserInitials,
    
    // Role shortcuts
    isSuperAdmin: user?.role === 'super_admin',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isEmployee: user?.role === 'employee',
    isCustomer: user?.role === 'customer',
    
    // API instance
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;