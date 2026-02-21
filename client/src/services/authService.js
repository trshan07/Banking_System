import api from './api'

export const authService = {
  async login(email, password) {
    return api.post('/auth/login', { email, password })
  },

  async register(userData) {
    return api.post('/auth/register', userData)
  },

  async getCurrentUser() {
    return api.get('/auth/me')
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token, password) {
    return api.post('/auth/reset-password', { token, password })
  },

  async verifyEmail(token) {
    return api.get(`/auth/verify-email/${token}`)
  },

  async logout() {
    return api.post('/auth/logout')
  }
}