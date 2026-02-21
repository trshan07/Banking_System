import api from './api'

export const supportService = {
  async createTicket(ticketData) {
    return api.post('/support/tickets', ticketData)
  },

  async getMyTickets() {
    return api.get('/support/tickets/my-tickets')
  },

  async getTicketById(id) {
    return api.get(`/support/tickets/${id}`)
  },

  async addMessage(ticketId, message, attachments) {
    const formData = new FormData()
    formData.append('message', message)
    if (attachments) {
      attachments.forEach(file => formData.append('attachments', file))
    }
    return api.post(`/support/tickets/${ticketId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  async closeTicket(id) {
    return api.patch(`/support/tickets/${id}/close`)
  },

  // Agent endpoints
  async getAllTickets(filters) {
    return api.get('/support/admin/tickets', { params: filters })
  },

  async updateTicketStatus(id, status) {
    return api.patch(`/support/admin/tickets/${id}/status`, { status })
  },

  async assignTicket(id, agentId) {
    return api.patch(`/support/admin/tickets/${id}/assign`, { agentId })
  }
}