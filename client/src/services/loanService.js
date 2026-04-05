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
    const uploads = []
    if (idProof?.[0])      uploads.push(this.uploadDocument(loanId, idProof[0],      'id_proof'))
    if (addressProof?.[0]) uploads.push(this.uploadDocument(loanId, addressProof[0], 'address_proof'))
    if (incomeProof?.[0])  uploads.push(this.uploadDocument(loanId, incomeProof[0],  'income_proof'))
    return Promise.allSettled(uploads)
  }
}
