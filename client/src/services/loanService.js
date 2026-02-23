import api from './api'

export const loanService = {
  async applyForLoan(loanData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Loan application submitted:', loanData)
        resolve({ 
          success: true, 
          applicationId: 'LN-' + Date.now(),
          message: 'Application submitted successfully' 
        })
      }, 2000)
    })
    
    // Actual API call when backend is ready:
    // return api.post('/loans/apply', loanData)
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
  }
}