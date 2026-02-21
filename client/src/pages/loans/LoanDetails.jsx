import React from 'react'
import { useParams } from 'react-router-dom'

const LoanDetails = () => {
  const { id } = useParams()
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loan Details #{id}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loan details will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default LoanDetails