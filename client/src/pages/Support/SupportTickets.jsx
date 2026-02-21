import React from 'react'
import { Link } from 'react-router-dom'

const SupportTickets = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <Link to="/dashboard/support/create" className="btn-primary">
            Create New Ticket
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your support tickets will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default SupportTickets