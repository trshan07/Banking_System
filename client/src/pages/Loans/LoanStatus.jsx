import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFilePdf,
  FaFilter,
  FaMoneyBillWave,
  FaSearch,
  FaSpinner,
  FaTimesCircle,
} from 'react-icons/fa'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { loanService } from '../../services/loanService'
import { mapLoanFromApi } from './loanHelpers'

const LoanStatus = () => {
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLoanId, setSelectedLoanId] = useState('')
  const [loanDetails, setLoanDetails] = useState({})
  const [detailsLoadingId, setDetailsLoadingId] = useState('')

  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await loanService.getMyLoans()
        const loanList = Array.isArray(response?.data?.data) ? response.data.data : []
        setLoans(loanList.map(mapLoanFromApi))
      } catch (err) {
        console.error('Failed to fetch user loans:', err)
        setError('Unable to load your loans right now. Please try again later.')
        setLoans([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserLoans()
  }, [])

  const handleToggleDetails = async (loan) => {
    if (selectedLoanId === loan.id) {
      setSelectedLoanId('')
      return
    }

    setSelectedLoanId(loan.id)

    if (loanDetails[loan.id]) {
      return
    }

    try {
      setDetailsLoadingId(loan.id)
      const response = await loanService.getLoanStatus(loan.lookupId)
      const detailedLoan = response?.data?.data

      if (detailedLoan) {
        setLoanDetails((current) => ({
          ...current,
          [loan.id]: mapLoanFromApi(detailedLoan),
        }))
      }
    } catch (err) {
      console.error('Failed to fetch loan details:', err)
    } finally {
      setDetailsLoadingId('')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
      case 'active':
      case 'completed':
        return <FaCheckCircle className="text-green-600" />
      case 'under_review':
        return <FaClock className="text-blue-600" />
      case 'pending':
        return <FaClock className="text-yellow-600" />
      case 'defaulted':
      case 'cancelled':
      case 'rejected':
        return <FaTimesCircle className="text-red-600" />
      default:
        return <FaMoneyBillWave className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'defaulted':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'under_review':
        return 'Under Review'
      case 'defaulted':
        return 'Defaulted'
      default:
        return String(status || '').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    }
  }

  const filteredLoans = loans
    .filter((loan) => filter === 'all' || loan.status === filter)
    .filter(
      (loan) =>
        String(loan.id || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(loan.type || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )

  const stats = {
    total: loans.length,
    approved: loans.filter((loan) => ['approved', 'active', 'disbursed', 'completed'].includes(loan.status)).length,
    pending: loans.filter((loan) => ['pending', 'under_review'].includes(loan.status)).length,
    totalAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="mb-4 inline-block text-primary-600 hover:text-primary-700">
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Loan Applications</h1>
          <p className="mt-2 text-gray-600">Track and manage your loan applications with live backend data.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by loan ID or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="disbursed">Disbursed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <Link
              to="/dashboard/loans/apply"
              className="rounded-lg bg-primary-600 px-4 py-2 text-center text-white transition-colors hover:bg-primary-700"
            >
              Apply for New Loan
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          ) : null}

          {filteredLoans.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-md">
              <FaMoneyBillWave className="mx-auto mb-4 text-5xl text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No Loan Applications Found</h3>
              <p className="mb-4 text-gray-600">
                {searchTerm || filter !== 'all'
                  ? 'No applications match your search criteria.'
                  : "You haven't applied for any loans yet."}
              </p>
              <Link to="/dashboard/loans/apply" className="btn-primary inline-block">
                Apply for Your First Loan
              </Link>
            </div>
          ) : (
            filteredLoans.map((loan) => {
              const activeLoan = loanDetails[loan.id] || loan
              const isExpanded = selectedLoanId === loan.id
              const isDetailsLoading = detailsLoadingId === loan.id

              return (
                <div
                  key={loan.id}
                  className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          {getStatusIcon(loan.status)}
                          <h3 className="text-xl font-semibold text-gray-900">{loan.type}</h3>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(loan.status)}`}
                          >
                            {getStatusText(loan.status)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="text-xs text-gray-500">Loan ID</p>
                            <p className="break-all font-medium text-gray-900">{loan.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-medium text-gray-900">{formatCurrency(loan.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Interest Rate</p>
                            <p className="font-medium text-gray-900">{loan.interestRate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Applied Date</p>
                            <p className="font-medium text-gray-900">{formatDate(loan.appliedDate)}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleDetails(loan)}
                        className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-primary-600 transition-colors hover:bg-gray-50 hover:text-primary-700"
                      >
                        <FaEye className="mr-2" /> {isExpanded ? 'Hide Details' : 'Details'}
                      </button>
                    </div>

                    {['approved', 'disbursed', 'active', 'completed'].includes(loan.status) ? (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Repayment Progress</span>
                          <span className="font-medium text-gray-900">{loan.progress}% Paid</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-green-600"
                            style={{ width: `${loan.progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
                          <span>Next EMI: {formatCurrency(loan.emiAmount)}</span>
                          <span>{loan.nextEMIDate ? `Due: ${formatDate(loan.nextEMIDate)}` : 'No next payment scheduled'}</span>
                        </div>
                      </div>
                    ) : null}

                    {isExpanded ? (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        {isDetailsLoading ? (
                          <div className="flex items-center justify-center py-8 text-gray-500">
                            <FaSpinner className="mr-2 animate-spin" />
                            Loading latest loan details...
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div>
                                <h4 className="mb-3 font-semibold text-gray-900">Application Details</h4>
                                <dl className="space-y-2">
                                  <div className="flex justify-between gap-3">
                                    <dt className="text-sm text-gray-600">Purpose:</dt>
                                    <dd className="text-right text-sm font-medium text-gray-900">{activeLoan.purpose || 'Not provided'}</dd>
                                  </div>
                                  <div className="flex justify-between gap-3">
                                    <dt className="text-sm text-gray-600">Tenure:</dt>
                                    <dd className="text-right text-sm font-medium text-gray-900">{activeLoan.tenure}</dd>
                                  </div>
                                  {activeLoan.approvedDate ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-sm text-gray-600">Approved Date:</dt>
                                      <dd className="text-right text-sm font-medium text-gray-900">{formatDate(activeLoan.approvedDate)}</dd>
                                    </div>
                                  ) : null}
                                  {activeLoan.disbursedDate ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-sm text-gray-600">Disbursed Date:</dt>
                                      <dd className="text-right text-sm font-medium text-gray-900">{formatDate(activeLoan.disbursedDate)}</dd>
                                    </div>
                                  ) : null}
                                  {activeLoan.nextEMIDate ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-sm text-gray-600">Next EMI Date:</dt>
                                      <dd className="text-right text-sm font-medium text-gray-900">{formatDate(activeLoan.nextEMIDate)}</dd>
                                    </div>
                                  ) : null}
                                  {activeLoan.account?.accountNumber ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-sm text-gray-600">Linked Account:</dt>
                                      <dd className="text-right text-sm font-medium text-gray-900">{activeLoan.account.accountNumber}</dd>
                                    </div>
                                  ) : null}
                                  {activeLoan.rejectionReason ? (
                                    <div className="flex justify-between gap-3">
                                      <dt className="text-sm text-gray-600">Rejection Reason:</dt>
                                      <dd className="text-right text-sm font-medium text-red-600">{activeLoan.rejectionReason}</dd>
                                    </div>
                                  ) : null}
                                </dl>
                              </div>

                              <div>
                                <h4 className="mb-3 font-semibold text-gray-900">Documents</h4>
                                {activeLoan.documents?.length ? (
                                  <ul className="space-y-2">
                                    {activeLoan.documents.map((doc) => (
                                      <li
                                        key={doc.id}
                                        className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                                      >
                                        <span className="flex items-center text-sm text-gray-700">
                                          <FaFilePdf className="mr-2 text-red-500" />
                                          {doc.name}
                                        </span>
                                        {doc.url ? (
                                          <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-primary-600 hover:text-primary-700"
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
                                  <div className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-500">
                                    No supporting documents have been linked yet.
                                  </div>
                                )}

                                <h4 className="mb-3 mt-4 font-semibold text-gray-900">Status Timeline</h4>
                                <div className="space-y-2">
                                  {activeLoan.statusHistory?.map((event, index) => (
                                    <div key={`${event.status}-${index}`} className="flex items-start space-x-3">
                                      <div className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                        <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                                        <p className="mt-1 text-xs text-gray-600">{event.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                              <Link
                                to={`/dashboard/loans/${activeLoan.lookupId}`}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Open Loan Page
                              </Link>
                              <Link
                                to="/dashboard/support/create"
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Contact Support
                              </Link>
                              {loan.status === 'rejected' ? (
                                <Link
                                  to="/dashboard/loans/apply"
                                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700"
                                >
                                  Re-apply
                                </Link>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default LoanStatus
