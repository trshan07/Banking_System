// client/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => api.get('/dashboard/data'),
  getAlerts: (page = 1, status = 'all') => api.get(`/dashboard/alerts?page=${page}&status=${status}`),
  dismissAlert: (alertId) => api.put(`/dashboard/alerts/${alertId}/dismiss`),
  markAlertAsRead: (alertId) => api.put(`/dashboard/alerts/${alertId}/read`),
  getAnalytics: (period = 'month') => api.get(`/dashboard/analytics?period=${period}`),
};

// Banking API
export const bankingAPI = {
  getAccounts: () => api.get('/banking/accounts'),
  getAccountDetails: (accountId) => api.get(`/banking/accounts/${accountId}`),
  createAccount: (accountData) => api.post('/banking/accounts', accountData),
  transferFunds: (transferData) => api.post('/banking/transfer', transferData),
  getTransactions: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/banking/transactions?${params}`);
  },
  downloadStatement: (startDate, endDate, format = 'csv') => 
    api.get(`/banking/transactions/download?startDate=${startDate}&endDate=${endDate}&format=${format}`, {
      responseType: 'blob'
    }),
};

// Loans API
export const loanAPI = {
  apply: (loanData) => api.post('/loans/apply', loanData),
  getLoans: () => api.get('/loans/status'),
  getLoanById: (loanId) => api.get(`/loans/${loanId}`),
  repayLoan: (repaymentData) => api.post('/loans/repay', repaymentData),
  getEMISchedule: (loanId) => api.get(`/loans/${loanId}/emi-schedule`),
};

// Savings API
export const savingsAPI = {
  createGoal: (goalData) => api.post('/savings/goals', goalData),
  getGoals: () => api.get('/savings/goals'),
  updateGoal: (goalId, goalData) => api.put(`/savings/goals/${goalId}`, goalData),
  deleteGoal: (goalId) => api.delete(`/savings/goals/${goalId}`),
  contribute: (contributionData) => api.post('/savings/goals/contribute', contributionData),
};

// Support API
export const supportAPI = {
  createTicket: (ticketData) => api.post('/support/tickets', ticketData),
  getTickets: () => api.get('/support/tickets'),
  getTicketById: (ticketId) => api.get(`/support/tickets/${ticketId}`),
  addResponse: (ticketId, message) => api.post(`/support/tickets/${ticketId}/response`, { message }),
  closeTicket: (ticketId) => api.put(`/support/tickets/${ticketId}/close`),
};

// Fraud API
export const fraudAPI = {
  report: (reportData) => api.post('/fraud/report', reportData),
  getReports: () => api.get('/fraud/reports'),
  getReportById: (reportId) => api.get(`/fraud/reports/${reportId}`),
  updateReport: (reportId, data) => api.put(`/fraud/reports/${reportId}`, data),
};

// KYC API
export const kycAPI = {
  submit: (formData) => api.post('/kyc/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStatus: () => api.get('/kyc/status'),
  getDocuments: () => api.get('/kyc/documents'),
};

export default api;