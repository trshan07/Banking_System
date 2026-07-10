import api from './api'

export const supportService = {
  async createTicket(ticketData) {
    return api.post('/support/tickets', ticketData)
  },

  async getMyTickets() {
    return api.get('/support/tickets')
  },

  async getTicketById(id) {
    return api.get(`/support/tickets/${id}`)
  },

  async addMessage(ticketId, message) {
    return api.post(`/support/tickets/${ticketId}/messages`, { message })
  },

  async closeTicket(id) {
    return api.put(`/support/tickets/${id}/status`, { status: 'closed' })
  },

  // Agent endpoints
  async getAllTickets(filters) {
    return api.get('/support/admin/tickets', { params: filters })
  },

  async updateTicketStatus(id, status) {
    return api.put(`/support/tickets/${id}/status`, { status })
  },

  async assignTicket(id, agentId) {
    return api.put(`/support/tickets/${id}/assign`, { staffId: agentId })
  }
}
