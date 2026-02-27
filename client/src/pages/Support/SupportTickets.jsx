import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaHeadset, 
  FaPlus, 
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaEye
} from 'react-icons/fa'
import { formatDateTime } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const SupportTickets = () => {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setTickets([
        {
          id: 'TKT-001',
          subject: 'Cannot access online banking',
          category: 'technical',
          priority: 'high',
          status: 'open',
          createdAt: '2024-02-23T10:30:00',
          lastUpdate: '2024-02-23T10:30:00',
          messages: 3
        },
        {
          id: 'TKT-002',
          subject: 'Loan application status inquiry',
          category: 'loan',
          priority: 'medium',
          status: 'in_progress',
          createdAt: '2024-02-22T14:20:00',
          lastUpdate: '2024-02-23T09:15:00',
          messages: 5
        },
        {
          id: 'TKT-003',
          subject: 'Fraud transaction report',
          category: 'fraud',
          priority: 'high',
          status: 'open',
          createdAt: '2024-02-21T16:45:00',
          lastUpdate: '2024-02-21T16:45:00',
          messages: 2
        },
        {
          id: 'TKT-004',
          subject: 'Update contact information',
          category: 'account',
          priority: 'low',
          status: 'resolved',
          createdAt: '2024-02-20T09:00:00',
          lastUpdate: '2024-02-22T11:30:00',
          messages: 4
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <FaExclamationCircle className="text-red-600" />
      case 'medium': return <FaClock className="text-yellow-600" />
      case 'low': return <FaCheckCircle className="text-green-600" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-2">View and manage your support requests</p>
          </div>
          <Link
            to="/dashboard/support/create"
            className="btn-primary flex items-center"
          >
            <FaPlus className="mr-2" /> New Ticket
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Open</p>
            <p className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'open').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      {getPriorityIcon(ticket.priority)}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Ticket ID: {ticket.id}</span>
                      <span>•</span>
                      <span>Category: {ticket.category}</span>
                      <span>•</span>
                      <span>Created: {formatDateTime(ticket.createdAt)}</span>
                      <span>•</span>
                      <span>Messages: {ticket.messages}</span>
                    </div>
                  </div>

                  <Link
                    to={`/dashboard/support/ticket/${ticket.id}`}
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <FaEye className="mr-1" /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportTickets