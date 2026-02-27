// services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

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
  (error) => {
    const { response } = error;
    
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