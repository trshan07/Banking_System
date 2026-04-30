import api from './api'

export const loanService = {
  async applyForLoan(loanData) {
    return api.post('/loans/apply', loanData)
  },

  async getMyLoans() {
    return api.get('/loans')
  },

  async getLoanById(id) {
    return api.get(`/loans/${id}`)
  },

  async getLoanStatus(id) {
    return api.get(`/loans/${id}/status`)
  },

  async getPendingLoans(params = {}) {
    return api.get('/loans/admin/pending', { params })
  },

  async approveLoan(loanId, adminComment = '') {
    return api.put(`/loans/${loanId}/approve`, { adminComment })
  },

  async rejectLoan(loanId, adminComment) {
    return api.put(`/loans/${loanId}/reject`, { adminComment })
  },

  async addLoanComment(loanId, comment) {
    return api.post(`/loans/${loanId}/comment`, { comment })
  },

  // Upload a single document tied to a loan
  async uploadDocument(loanId, file, documentType) {
    const formData = new FormData()
    formData.append('documents', file)
    formData.append('documentType', documentType)
    formData.append('loanId', loanId)
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Upload all loan application documents
  async uploadAllDocuments(loanId, { idProof, addressProof, incomeProof }) {
    const requiredDocs = {
      idProof: idProof?.[0],
      addressProof: addressProof?.[0],
      incomeProof: incomeProof?.[0]
    }

    const missingDocs = Object.entries(requiredDocs)
      .filter(([, file]) => !file)
      .map(([key]) => key)

    if (missingDocs.length > 0) {
      throw new Error('Please upload all required documents: identity proof, address proof, and income proof.')
    }

    return Promise.all([
      this.uploadDocument(loanId, requiredDocs.idProof, 'id_proof'),
      this.uploadDocument(loanId, requiredDocs.addressProof, 'address_proof'),
      this.uploadDocument(loanId, requiredDocs.incomeProof, 'income_proof')
    ])
  }
}
