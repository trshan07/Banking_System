import React from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaClock, FaMoneyBillWave, FaTimesCircle } from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'
import LoanProgress from './LoanProgress'

const LoanCard = ({ loan }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'disbursed':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-emerald-100 text-emerald-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'rejected':
      case 'defaulted':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'disbursed':
      case 'completed':
        return <FaCheckCircle className="text-green-600" />
      case 'pending':
      case 'under_review':
        return <FaClock className="text-yellow-600" />
      case 'rejected':
      case 'cancelled':
      case 'defaulted':
        return <FaTimesCircle className="text-red-600" />
      default:
        return <FaMoneyBillWave className="text-gray-600" />
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white transition-colors hover:border-blue-300">
      <div className="p-6">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              {getStatusIcon(loan.status)}
              <h3 className="text-lg font-semibold text-gray-900">
                <Link to={`/dashboard/loans/${loan.lookupId}`} className="hover:text-blue-600">
                  {loan.type}
                </Link>
              </h3>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(loan.status)}`}>
                {String(loan.status || '').replace(/_/g, ' ')}
              </span>
            </div>
            <p className="mt-2 break-all text-sm text-gray-600">ID: {loan.id}</p>
          </div>

          <Link
            to={`/dashboard/loans/${loan.lookupId}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-sm text-gray-600">Loan Amount</p>
            <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Interest Rate</p>
            <p className="font-semibold text-gray-900">{loan.interestRate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="font-semibold text-gray-900">{formatCurrency(loan.remainingAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly EMI</p>
            <p className="font-semibold text-gray-900">
              {loan.emiAmount > 0 ? formatCurrency(loan.emiAmount) : 'Not scheduled'}
            </p>
          </div>
        </div>

        {['active', 'approved', 'disbursed', 'completed'].includes(loan.status) ? (
          <div className="mb-4">
            <LoanProgress progress={loan.progress} />
            <div className="mt-1 flex justify-between text-sm text-gray-600">
              <span>Repayment Progress</span>
              <span>{loan.progress}%</span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <div className="flex flex-wrap gap-4">
            {loan.disbursedDate ? <span>Disbursed: {formatDate(loan.disbursedDate)}</span> : null}
            {loan.tenure ? <span>Tenure: {loan.tenure}</span> : null}
            {loan.nextEMIDate ? (
              <span className="font-medium text-orange-600">Next EMI: {formatDate(loan.nextEMIDate)}</span>
            ) : null}
          </div>

          <Link to="/dashboard/support/create" className="text-blue-600 hover:text-blue-700">
            Need help?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoanCard
