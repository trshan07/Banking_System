// services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';
let refreshPromise = null;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios.post(
    `${API_URL}/auth/refresh-token`,
    {
      refreshToken: localStorage.getItem('refreshToken') || undefined,
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  )
    .then((response) => {
      const newToken = response?.data?.data?.token;
      const newRefreshToken = response?.data?.data?.refreshToken;

      if (!newToken) {
        throw new Error('Token refresh did not return an access token');
      }

      localStorage.setItem('token', newToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      return newToken;
    })
    .catch((error) => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      delete api.defaults.headers.common.Authorization;
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const originalRequest = error.config;

    if (
      response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }
    
    // Handle specific error status codes
    if (response) {
      switch (response.status) {
        case 400:
          console.error('Bad request:', response.data);
          break;
        case 401:
          // Unauthorized - handled by AuthContext
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          console.error('Resource not found:', response.config.url);
          break;
        case 422:
          // Validation errors
          if (response.data.errors) {
            Object.values(response.data.errors).forEach(error => {
              toast.error(error);
            });
          }
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;

export const dashboardAPI = {
  getData: () => api.get('/accounts'),
  dismissAlert: (alertId) => api.patch(`/accounts/alerts/${alertId}/dismiss`)
};

export const bankingAPI = {
  getAccounts: () => api.get('/accounts'),
  transferFunds: (data) => api.post('/accounts/transfer', data),
};

export const loanAPI = {
  getLoans: () => api.get('/loans')
};

export const savingsAPI = {
  getGoals: () => api.get('/savings/goals'),
  createGoal: (data) => api.post('/savings/goals', data),
  addFunds: (goalId, data) => api.put(`/savings/goals/${goalId}/progress`, data),
  getSavingsAccounts: () => api.get('/savings/accounts')
};