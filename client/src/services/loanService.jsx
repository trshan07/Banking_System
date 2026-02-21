import api from './api'

export const loanService = {
  async applyForLoan(loanData) {
    return api.post('/loans/apply', loanData)
  },

  async getMyLoans() {
    return api.get('/loans/my-loans')
  },

  async getLoanById(id) {
    return api.get(`/loans/${id}`)
  },

  async getLoanStatus(id) {
    return api.get(`/loans/${id}/status`)
  },

  async uploadDocuments(id, documents) {
    const formData = new FormData()
    documents.forEach(doc => formData.append('documents', doc))
    return api.post(`/loans/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Admin endpoints
  async getAllLoans(filters) {
    return api.get('/loans/admin/all', { params: filters })
  },

  async updateLoanStatus(id, status, remarks) {
    return api.patch(`/loans/admin/${id}/status`, { status, remarks })
  },

  async assignLoanOfficer(id, officerId) {
    return api.patch(`/loans/admin/${id}/assign`, { officerId })
  }
}