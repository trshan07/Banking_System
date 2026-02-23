import React from 'react'
import { Link } from 'react-router-dom'
import { FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'

const LoanSummary = ({ loans, loading }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-600" />
      case 'pending':
        return <FaClock className="text-yellow-600" />
      case 'rejected':
        return <FaTimesCircle className="text-red-600" />
      default:
        return <FaMoneyBillWave className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Loan Summary</h2>
        <Link
          to="/dashboard/loans/apply"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Apply New Loan
        </Link>
      </div>

      <div className="space-y-3">
        {loans.length === 0 ? (
          <div className="text-center py-6">
            <FaMoneyBillWave className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-600">No active loans</p>
            <Link
              to="/dashboard/loans/apply"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
            >
              Apply for a loan
            </Link>
          </div>
        ) : (
          loans.map((loan) => (
            <div key={loan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(loan.status)}
                  <span className="font-semibold text-gray-900">{loan.type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(loan.status)}`}>
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interest Rate</p>
                  <p className="font-semibold text-gray-900">{loan.interestRate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tenure</p>
                  <p className="font-semibold text-gray-900">{loan.tenure}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applied Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(loan.appliedDate)}</p>
                </div>
              </div>

              {loan.status === 'pending' && loan.expectedDecision && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-yellow-600">
                    Under review - Expected by {formatDate(loan.expectedDecision)}
                  </p>
                </div>
              )}

              {loan.status === 'approved' && loan.decisionDate && (
                <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-xs text-green-600">
                    Approved on {formatDate(loan.decisionDate)}
                  </p>
                  <Link to={`/dashboard/loans/${loan.id}`} className="text-xs text-primary-600 hover:underline">
                    View Details
                  </Link>
                </div>
              )}

              {loan.status === 'rejected' && loan.decisionDate && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-red-600">
                    Rejected on {formatDate(loan.decisionDate)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {loans.length > 0 && (
        <Link
          to="/dashboard/loans/status"
          className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 pt-4 border-t border-gray-200"
        >
          View All Loans
        </Link>
      )}
    </div>
  )
}

export default LoanSummary