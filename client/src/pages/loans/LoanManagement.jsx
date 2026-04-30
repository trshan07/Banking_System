import React, { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { loanService } from '../../services/loanService'

const LoanManagement = () => {
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState([])
  const [error, setError] = useState('')
  const [commentByLoan, setCommentByLoan] = useState({})
  const [actionLoadingId, setActionLoadingId] = useState('')

  useEffect(() => {
    const fetchPendingLoans = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await loanService.getPendingLoans()
        setLoans(Array.isArray(response?.data?.data) ? response.data.data : [])
      } catch (err) {
        console.error('Failed to load pending loans:', err)
        setError('Unable to load pending loan applications right now.')
        setLoans([])
      } finally {
        setLoading(false)
      }
    }

    fetchPendingLoans()
  }, [])

  const handleApprove = async (loanId) => {
    try {
      setActionLoadingId(loanId)
      await loanService.approveLoan(loanId, commentByLoan[loanId] || '')
      setLoans((current) => current.filter((loan) => loan._id !== loanId))
    } catch (err) {
      console.error('Approve loan failed:', err)
      setError(err?.response?.data?.message || 'Failed to approve loan.')
    } finally {
      setActionLoadingId('')
    }
  }

  const handleReject = async (loanId) => {
    const adminComment = commentByLoan[loanId]
    if (!adminComment?.trim()) {
      setError('A rejection reason is required before rejecting a loan.')
      return
    }

    try {
      setActionLoadingId(loanId)
      await loanService.rejectLoan(loanId, adminComment)
      setLoans((current) => current.filter((loan) => loan._id !== loanId))
    } catch (err) {
      console.error('Reject loan failed:', err)
      setError(err?.response?.data?.message || 'Failed to reject loan.')
    } finally {
      setActionLoadingId('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan Management</h1>
          <p className="mt-2 text-gray-600">Review pending loan applications directly from the live backend queue.</p>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Applications ({loans.length})
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-gray-600">Loading pending applications...</p>
            ) : loans.length === 0 ? (
              <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-gray-600">
                No pending loans are waiting for review.
              </div>
            ) : (
              <div className="space-y-6">
                {loans.map((loan) => (
                  <div key={loan._id} className="rounded-xl border border-slate-200 p-5">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                      <div>
                        <p className="text-xs text-gray-500">Applicant</p>
                        <p className="font-semibold text-gray-900">
                          {loan.userId?.firstName} {loan.userId?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{loan.userId?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Loan Type</p>
                        <p className="font-semibold capitalize text-gray-900">{String(loan.loanType).replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Term</p>
                        <p className="font-semibold text-gray-900">{loan.term} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Applied</p>
                        <p className="font-semibold text-gray-900">{formatDate(loan.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500">Purpose</p>
                      <p className="mt-1 text-sm text-gray-700">{loan.purpose}</p>
                    </div>

                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Review Comment</label>
                      <textarea
                        value={commentByLoan[loan._id] || ''}
                        onChange={(e) =>
                          setCommentByLoan((current) => ({
                            ...current,
                            [loan._id]: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add an approval note or rejection reason"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApprove(loan._id)}
                        disabled={actionLoadingId === loan._id}
                        className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {actionLoadingId === loan._id ? 'Working...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(loan._id)}
                        disabled={actionLoadingId === loan._id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {actionLoadingId === loan._id ? 'Working...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanManagement
