import React from 'react'

const TicketCard = ({ ticket }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-gray-600">Ticket: {ticket?.id || 'N/A'}</p>
    </div>
  )
}

export default TicketCard