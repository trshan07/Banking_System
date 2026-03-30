// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext();

// Use import.meta.env instead of process.env for Vite
// Prefer configured env URL and fall back to the known working fallback port (5001)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// ✅ FIXED: Export useAuth as a named export
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use ref to track pending requests
  const pendingRequests = useRef(new Map());
  const refreshPromise = useRef(null);

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
          // Don't logout on validation error, just clear state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Validate token
  const validateToken = async () => {
    try {
      const response = await api.get('/auth/validate');
      if (response.data.success) {
        const userData = response.data.data?.user || response.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        try {
          await refreshToken();
          return true;
        } catch (refreshError) {
          console.error('Refresh failed during validation');
          return false;
        }
      }
      return false;
    }
  };

  // Register user with retry logic
  const register = async (userData, retryCount = 0) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful! Please check your email to verify your account.');
        
        return { 
          success: true, 
          message: response.data.message,
          user: response.data.data?.user || response.data.user 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle rate limiting with retry
      if (error.response?.status === 429 && retryCount < 3) {
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Rate limited, retrying in ${waitTime}ms... (attempt ${retryCount + 1}/3)`);
        toast.loading(`Please wait ${waitTime/1000} seconds before trying again...`, { duration: waitTime });
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return register(userData, retryCount + 1);
      }
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).join(', ');
        toast.error(errorMessages);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
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
        const { user: userData, token: authToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Store tokens
        localStorage.setItem('token', authToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${userData.firstName || userData.email}!`);
        
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please wait a few minutes before trying again.');
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.response?.status === 423) {
        toast.error('Account is locked. Please try again later.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh token with proper promise handling
  const refreshToken = async () => {
    // If already refreshing, return the existing promise
    if (refreshPromise.current) {
      console.log('Refresh already in progress, waiting...');
      return refreshPromise.current;
    }

    refreshPromise.current = (async () => {
      try {
        setIsRefreshing(true);
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        if (!storedRefreshToken) {
          console.log('No refresh token found');
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token...');
        
        const response = await api.post('/auth/refresh-token', {
          refreshToken: storedRefreshToken
        }, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          const { token: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update tokens
          localStorage.setItem('token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          setToken(newAccessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          
          console.log('Token refreshed successfully');
          return { success: true, token: newAccessToken };
        } else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete api.defaults.headers.common['Authorization'];
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/login';
        }
        
        throw error;
      } finally {
        setIsRefreshing(false);
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  };

  // Logout user with proper cleanup
  const logout = async () => {
    // Prevent multiple logout calls
    if (isLoggingOut) {
      console.log('Logout already in progress, skipping...');
      return;
    }
    
    try {
      setIsLoggingOut(true);
      console.log('Logging out...');
      
      const currentToken = localStorage.getItem('token');
      const currentRefreshToken = localStorage.getItem('refreshToken');
      
      if (currentToken) {
        try {
          // Set a timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Logout timeout')), 5000);
          });
          
          const logoutPromise = api.post('/auth/logout', {
            refreshToken: currentRefreshToken
          }, {
            headers: {
              'Authorization': `Bearer ${currentToken}`
            },
            timeout: 5000
          });
          
          await Promise.race([logoutPromise, timeoutPromise]);
          console.log('✅ Server logout successful');
        } catch (error) {
          // Don't throw on logout errors - just log them
          console.error('Server logout error (non-critical):', error.message);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data, even if server call fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear axios default header
      delete api.defaults.headers.common['Authorization'];
      
      setIsLoggingOut(false);
      
      toast.success('Logged out successfully');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }
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
      toast.error(error.response?.data?.message || 'Email verification failed');
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
      toast.error(error.response?.data?.message || 'Failed to send verification email');
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
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (resetToken, newPassword) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/reset-password', { token: resetToken, newPassword });
      
      if (response.data.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        return { success: true };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
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
        const updatedUser = response.data.data?.user || response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile updated successfully!');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
      toast.error(error.response?.data?.message || 'Failed to change password');
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
        },
        timeout: 30000 // 30 seconds for file upload
      });
      
      if (response.data.success) {
        const updatedUser = response.data.data?.user || response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile picture updated!');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
      throw error;
    } finally {
      setLoading(false);
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
    if (user.role === 'superadmin') return true;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  // Get dashboard route
  const getDashboardRoute = useCallback(() => {
    if (!user) return '/auth/login';
    
    switch (user.role) {
      case 'superadmin':
        return '/super-admin';
      case 'admin':
        return '/admin';
      case 'employee':
        return '/employee';
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

  // Axios response interceptor for token refresh with rate limit handling
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle rate limiting (429)
        if (error.response?.status === 429) {
          console.error('Rate limited:', error.response.data);
          
          if (!originalRequest._rateLimitHandled) {
            originalRequest._rateLimitHandled = true;
            
            const retryAfter = error.response.headers['retry-after'];
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 15000;
            
            toast.error(`Too many requests. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
            
            // Don't retry automatically for auth endpoints
            if (originalRequest.url.includes('/auth/')) {
              return Promise.reject(error);
            }
            
            // Wait and retry for non-auth endpoints
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return api(originalRequest);
          }
          
          return Promise.reject(error);
        }
        
        // Don't retry logout requests
        if (originalRequest.url.includes('/auth/logout')) {
          return Promise.reject(error);
        }
        
        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry && 
            !originalRequest.url.includes('/auth/login') && 
            !originalRequest.url.includes('/auth/register') &&
            !originalRequest.url.includes('/auth/refresh-token')) {
          originalRequest._retry = true;
          
          try {
            await refreshToken();
            
            // Update the authorization header with new token
            const newToken = localStorage.getItem('token');
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            console.error('Refresh token failed, logging out...');
            // Only logout if we're not already logging out
            if (!isLoggingOut) {
              logout();
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
  }, [refreshToken, logout, isLoggingOut]);

  const value = {
    // State
    user,
    loading,
    token,
    isAuthenticated,
    isLoggingOut,
    isRefreshing,
    
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
    isSuperAdmin: user?.role === 'super_admin' || user?.role === 'superadmin',
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'superadmin',
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

// ✅ Default export for backward compatibility
export default AuthContext;