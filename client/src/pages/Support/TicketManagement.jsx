import React, { useEffect, useState } from 'react'
import { CheckCircle, Clock, Filter, Inbox, RefreshCw, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

const TicketManagement = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', priority: '' })

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  })

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)

      const response = await fetch(`/api/support/admin/tickets?${params.toString()}`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load tickets')
      }

      setTickets(data.data || [])
      setStats(data.stats || {})
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [filters.status, filters.priority])

  const updateTicketStatus = async (ticketId, status) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update ticket')
      }

      toast.success(data.message || 'Ticket updated')
      fetchTickets()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const assignToMe = async (ticketId) => {
    const staffId = user?.id || user?._id

    if (!staffId) {
      toast.error('Could not identify current staff user')
      return
    }

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/assign`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ staffId }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign ticket')
      }

      toast.success(data.message || 'Ticket assigned')
      fetchTickets()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusClass = (status) => {
    if (status === 'resolved' || status === 'closed') return 'bg-green-100 text-green-700'
    if (status === 'in_progress') return 'bg-blue-100 text-blue-700'
    if (status === 'awaiting_reply') return 'bg-yellow-100 text-yellow-700'
    return 'bg-slate-100 text-slate-700'
  }

  const priorityClass = (priority) => {
    if (priority === 'urgent' || priority === 'high') return 'bg-red-100 text-red-700'
    if (priority === 'medium') return 'bg-amber-100 text-amber-700'
    return 'bg-emerald-100 text-emerald-700'
  }

  const formatName = (user) => (
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Customer'
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Ticket Management</h1>
            <p className="mt-2 text-gray-600">Assign, track, and resolve customer support tickets.</p>
          </div>
          <button
            type="button"
            onClick={fetchTickets}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            ['Open', stats.open || 0, Inbox],
            ['In Progress', stats.inProgress || 0, Clock],
            ['Awaiting Reply', stats.awaitingReply || 0, Filter],
            ['Resolved', stats.resolved || 0, CheckCircle],
            ['Closed', stats.closed || 0, CheckCircle],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-lg bg-white p-4 shadow sm:flex-row">
          <select
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_reply">Awaiting Reply</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No tickets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Assigned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{ticket.subject}</p>
                        <p className="text-sm text-gray-500">{ticket.ticketNumber || ticket.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatName(ticket.userId)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClass(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(ticket.status)}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatName(ticket.assignedTo)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => assignToMe(ticket._id)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Assign
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTicketStatus(ticket._id, 'in_progress')}
                            className="rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                          >
                            Start
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTicketStatus(ticket._id, 'resolved')}
                            className="rounded-md border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                          >
                            Resolve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketManagement
