import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaFilePdf, FaMoneyBillWave } from 'react-icons/fa'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { loanService } from '../../services/loanService'
import { mapLoanFromApi } from './loanHelpers'

const LoanDetails = () => {
  const { loanId } = useParams()
  const [loan, setLoan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await loanService.getLoanStatus(loanId)
        const loanData = response?.data?.data
        setLoan(loanData ? mapLoanFromApi(loanData) : null)
      } catch (err) {
        console.error('Failed to fetch loan details:', err)
        setError('Unable to load this loan right now.')
        setLoan(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLoan()
  }, [loanId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-red-600">{error || 'Loan not found.'}</p>
            <Link to="/dashboard/loans" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
              Back to Loans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard/loans" className="mb-4 inline-block text-blue-600 hover:text-blue-700">
            Back to Loans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{loan.type}</h1>
          <p className="mt-2 break-all text-gray-600">Loan ID: {loan.id}</p>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-lg font-semibold text-gray-900">{loan.interestRate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(loan.remainingAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold capitalize text-gray-900">
                  {String(loan.status).replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Loan Information</h2>
              <dl className="space-y-3">
                <div className="flex justify-between gap-3">
                  <dt className="text-sm text-gray-600">Purpose</dt>
                  <dd className="text-right text-sm font-medium text-gray-900">{loan.purpose || 'Not provided'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-sm text-gray-600">Tenure</dt>
                  <dd className="text-right text-sm font-medium text-gray-900">{loan.tenure}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-sm text-gray-600">Applied Date</dt>
                  <dd className="text-right text-sm font-medium text-gray-900">{formatDate(loan.appliedDate)}</dd>
                </div>
                {loan.approvedDate ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-sm text-gray-600">Approved Date</dt>
                    <dd className="text-right text-sm font-medium text-gray-900">{formatDate(loan.approvedDate)}</dd>
                  </div>
                ) : null}
                {loan.disbursedDate ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-sm text-gray-600">Disbursed Date</dt>
                    <dd className="text-right text-sm font-medium text-gray-900">{formatDate(loan.disbursedDate)}</dd>
                  </div>
                ) : null}
                {loan.nextEMIDate ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-sm text-gray-600">Next EMI Date</dt>
                    <dd className="text-right text-sm font-medium text-gray-900">{formatDate(loan.nextEMIDate)}</dd>
                  </div>
                ) : null}
                {loan.account?.accountNumber ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-sm text-gray-600">Linked Account</dt>
                    <dd className="text-right text-sm font-medium text-gray-900">{loan.account.accountNumber}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Documents</h2>
              {loan.documents.length ? (
                <ul className="space-y-3">
                  {loan.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="flex items-center text-sm text-gray-700">
                        <FaFilePdf className="mr-2 text-red-500" />
                        {doc.name}
                      </span>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500">Uploaded</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                  No loan documents are linked yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Timeline</h2>
            <div className="space-y-3">
              {loan.statusHistory.map((event, index) => (
                <div key={`${event.status}-${index}`} className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{event.status}</p>
                    <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 shadow">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <FaMoneyBillWave />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Need help with this loan?</h3>
                <p className="mt-1 text-sm text-blue-800">
                  If you need clarification about approval, repayment, or documents, contact the support team directly.
                </p>
                <Link
                  to="/dashboard/support/create"
                  className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Create Support Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanDetails
