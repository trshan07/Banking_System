import React from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaClock, FaMoneyBillWave, FaTimesCircle } from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'

const LoanSummary = ({ loans, loading }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-600" />
      case 'active':
      case 'disbursed':
        return <FaMoneyBillWave className="text-emerald-600" />
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
      case 'active':
      case 'disbursed':
        return 'bg-emerald-100 text-emerald-800'
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
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbf7_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Credit</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Loan Summary</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track applications, active repayments, and upcoming milestones.
            </p>
          </div>
          <Link
            to="/dashboard/loans/apply"
            className="inline-flex items-center justify-center rounded-full bg-[#173d61] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#102d49] sm:justify-start"
          >
            Apply New Loan
          </Link>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {loans.length > 0 && (
          <div className="mb-5 grid gap-3 lg:grid-cols-3">
            <div className="rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Applications</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{loans.length}</p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Active Loans</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {loans.filter((loan) => ['active', 'approved', 'disbursed'].includes(loan.status)).length}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Outstanding</p>
              <p className="mt-2 break-words text-2xl font-bold text-slate-900">
                {formatCurrency(loans.reduce((sum, loan) => sum + (Number(loan.remainingAmount) || 0), 0))}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {loans.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
              <FaMoneyBillWave className="mx-auto text-4xl text-slate-300" />
              <p className="mt-4 font-medium text-slate-900">No active loans</p>
              <Link
                to="/dashboard/loans/apply"
                className="mt-3 inline-block text-sm font-semibold text-[#173d61] hover:text-[#102d49]"
              >
                Apply for a loan
              </Link>
            </div>
          ) : (
            loans.map((loan) => (
              <div key={loan.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(loan.status)}
                      <span className="break-words font-semibold text-slate-900">{loan.type}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Applied on {formatDate(loan.appliedDate)}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Amount</p>
                    <p className="mt-2 break-words font-semibold text-slate-900">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Interest</p>
                    <p className="mt-2 break-words font-semibold text-slate-900">{loan.interestRate}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Tenure</p>
                    <p className="mt-2 break-words font-semibold text-slate-900">{loan.tenure}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Remaining</p>
                    <p className="mt-2 break-words font-semibold text-slate-900">{formatCurrency(loan.remainingAmount)}</p>
                  </div>
                </div>

                {loan.monthlyPayment > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3 text-sm leading-6 text-slate-600">
                    <span className="rounded-full bg-white px-3 py-1.5">
                      Monthly payment: <strong className="text-slate-900">{formatCurrency(loan.monthlyPayment)}</strong>
                    </span>
                    {loan.nextPaymentDate && (
                      <span className="rounded-full bg-white px-3 py-1.5">
                        Next payment: <strong className="text-slate-900">{formatDate(loan.nextPaymentDate)}</strong>
                      </span>
                    )}
                  </div>
                )}

                {loan.status === 'pending' && loan.expectedDecision && (
                  <p className="mt-4 text-xs font-medium text-yellow-700">
                    Under review. Expected by {formatDate(loan.expectedDecision)}
                  </p>
                )}

                {loan.status === 'approved' && loan.decisionDate && (
                  <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-medium text-green-700">
                      Approved on {formatDate(loan.decisionDate)}
                    </p>
                    <Link to="/dashboard/loans/status" className="text-xs font-semibold text-[#173d61] hover:text-[#102d49]">
                      View Details
                    </Link>
                  </div>
                )}

                {loan.status === 'rejected' && loan.decisionDate && (
                  <p className="mt-4 text-xs font-medium text-red-700">
                    Rejected on {formatDate(loan.decisionDate)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {loans.length > 0 && (
          <Link
            to="/dashboard/loans/status"
            className="mt-5 block border-t border-slate-200 pt-4 text-center text-sm font-semibold text-[#173d61] transition hover:text-[#102d49]"
          >
            View All Loans
          </Link>
        )}
      </div>
    </div>
  )
}

export default LoanSummary
