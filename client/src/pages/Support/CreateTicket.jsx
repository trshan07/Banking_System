import React from 'react'
import { Link } from 'react-router-dom'

const CreateTicket = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard/support" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Tickets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Support Ticket</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Ticket creation form will go here.</p>
        </div>
      </div>
    </div>
  )
}

export default CreateTicket