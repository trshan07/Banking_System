import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ChatWindow from '../../components/support/ChatWindow'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { supportService } from '../../services/supportService'

const statusClass = (status) => {
  if (status === 'resolved' || status === 'closed') return 'bg-green-100 text-green-700'
  if (status === 'in_progress') return 'bg-blue-100 text-blue-700'
  if (status === 'awaiting_reply') return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-700'
}

const priorityClass = (priority) => {
  if (priority === 'urgent' || priority === 'high') return 'bg-red-100 text-red-700'
  if (priority === 'medium') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

const TicketDetails = () => {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true)
      const response = await supportService.getTicketById(id)
      setTicket(response.data?.data || null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const appendMessage = useCallback((message) => {
    setTicket((current) => {
      if (!current) return current
      const exists = current.messages?.some((item) => String(item._id) === String(message._id))
      if (exists) return current
      return {
        ...current,
        messages: [...(current.messages || []), message],
      }
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard/support" className="mb-4 inline-block text-blue-600 hover:text-blue-700">
            Back to Tickets
          </Link>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-gray-600">Ticket not found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard/support" className="mb-4 inline-block text-blue-600 hover:text-blue-700">
          Back to Tickets
        </Link>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">{ticket.ticketNumber || ticket.id}</p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">{ticket.subject}</h1>
              <p className="mt-3 whitespace-pre-wrap text-gray-700">{ticket.description}</p>
            </div>
            <div className="flex gap-2">
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(ticket.status)}`}>
                {String(ticket.status || '').replace('_', ' ')}
              </span>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClass(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-gray-200 pt-5 text-sm text-gray-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-gray-900">Category</p>
              <p>{ticket.category}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Created</p>
              <p>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Assigned To</p>
              <p>{ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned'}</p>
            </div>
          </div>
        </div>

        <ChatWindow ticket={ticket} onMessage={appendMessage} />
      </div>
    </div>
  )
}

export default TicketDetails
