import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaFilePdf,
  FaSpinner
} from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { loanService } from '../../services/loanService'

const formatLoanType = (loanType = '') =>
  loanType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') + ' Loan'

const buildStatusHistory = (loan) => [
  {
    date: loan.createdAt,
    status: 'Application Submitted',
    description: 'Loan application received',
  },
  ...(loan.approvedAt
    ? [{ date: loan.approvedAt, status: 'Approved', description: 'Loan approved by the loan team' }]
    : []),
  ...(loan.disbursedAt
    ? [{ date: loan.disbursedAt, status: 'Disbursed', description: 'Funds disbursed to your account' }]
    : []),
  ...(loan.status === 'rejected'
    ? [{ date: loan.updatedAt, status: 'Rejected', description: loan.adminComment || 'Application rejected' }]
    : []),
]

const normalizeDocuments = (documents = []) =>
  Array.isArray(documents)
    ? documents.map((doc, index) => ({
        id: doc?._id || doc?.id || `document-${index}`,
        name: doc?.fileName || doc?.originalName || doc?.documentType || `Document ${index + 1}`,
        type: doc?.documentType || 'loan_document',
        url: doc?.cloudinaryUrl || '',
      }))
    : []

const mapLoan = (loan) => {
  const paidAmount = Array.isArray(loan.payments)
    ? loan.payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
    : 0
  const total = Number(loan.totalPayment) || Number(loan.amount) || 0
  const progress = total > 0 ? Math.min(100, Math.round((paidAmount / total) * 100)) : 0

  return {
    id: loan.id || loan._id,
    lookupId: loan._id || loan.id,
    type: formatLoanType(loan.loanType),
    amount: Number(loan.amount) || 0,
    interestRate: `${Number(loan.interestRate) || 0}%`,
    tenure: `${Number(loan.term) || 0} months`,
    status: loan.status,
    appliedDate: loan.createdAt,
    approvedDate: loan.approvedAt,
    disbursedDate: loan.disbursedAt,
    emiAmount: Number(loan.monthlyPayment) || 0,
    nextEMIDate: loan.nextPaymentDate,
    remainingAmount: Number.isFinite(Number(loan.remainingAmount))
      ? Number(loan.remainingAmount)
      : Math.max(0, total - paidAmount),
    progress: Number.isFinite(Number(loan.progress)) ? Number(loan.progress) : progress,
    purpose: loan.purpose,
    documents: normalizeDocuments(loan.documents),
    rejectionReason: loan.status === 'rejected' ? loan.adminComment : '',
    statusHistory: buildStatusHistory(loan),
    account: loan.accountId || null,
    updatedAt: loan.updatedAt,
  }
}

const LoanStatus = () => {
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loanDetails, setLoanDetails] = useState({})
  const [detailsLoadingId, setDetailsLoadingId] = useState('')

  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await loanService.getMyLoans()
        const loanList = Array.isArray(response?.data?.data) ? response.data.data : []
        setLoans(loanList.map(mapLoan))
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
    if (selectedLoan === loan.id) {
      setSelectedLoan(null)
      return
    }

    setSelectedLoan(loan.id)

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
          [loan.id]: mapLoan(detailedLoan),
        }))
      }
    } catch (err) {
      console.error('Failed to fetch loan details:', err)
    } finally {
      setDetailsLoadingId('')
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheckCircle className="text-green-600" />
      case 'disbursed': return <FaCheckCircle className="text-green-600" />
      case 'active': return <FaCheckCircle className="text-green-600" />
      case 'completed': return <FaCheckCircle className="text-green-600" />
      case 'under_review': return <FaClock className="text-blue-600" />
      case 'pending': return <FaClock className="text-yellow-600" />
      case 'defaulted': return <FaTimesCircle className="text-red-600" />
      case 'cancelled': return <FaTimesCircle className="text-red-600" />
      case 'rejected': return <FaTimesCircle className="text-red-600" />
      default: return <FaMoneyBillWave className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'disbursed': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'defaulted': return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approved'
      case 'disbursed': return 'Disbursed'
      case 'active': return 'Active'
      case 'completed': return 'Completed'
      case 'under_review': return 'Under Review'
      case 'pending': return 'Pending'
      case 'defaulted': return 'Defaulted'
      case 'cancelled': return 'Cancelled'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const filteredLoans = loans
    .filter(loan => filter === 'all' || loan.status === filter)
    .filter(loan => 
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const stats = {
    total: loans.length,
    approved: loans.filter(l => l.status === 'approved').length,
    pending: loans.filter(l => l.status === 'pending' || l.status === 'under_review').length,
    rejected: loans.filter(l => l.status === 'rejected').length,
    totalAmount: loans.reduce((sum, l) => sum + l.amount, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Loan Applications</h1>
          <p className="text-gray-600 mt-2">Track and manage your loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Loan ID or Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Apply New Button */}
            <Link
              to="/dashboard/loans/apply"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              Apply for New Loan
            </Link>
          </div>
        </div>

        {/* Loans List */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {filteredLoans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FaMoneyBillWave className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Loan Applications Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filter !== 'all' 
                  ? 'No applications match your search criteria.' 
                  : "You haven't applied for any loans yet."}
              </p>
              <Link
                to="/dashboard/loans/apply"
                className="btn-primary inline-block"
              >
                Apply for Your First Loan
              </Link>
            </div>
          ) : (
            filteredLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Loan Header */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(loan.status)}
                        <h3 className="text-xl font-semibold text-gray-900">{loan.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                          {getStatusText(loan.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Loan ID</p>
                          <p className="font-medium text-gray-900">{loan.id}</p>
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

                    <div className="mt-4 lg:mt-0 flex space-x-2">
                      <button
                        onClick={() => handleToggleDetails(loan)}
                        className="text-primary-600 hover:text-primary-700 flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <FaEye className="mr-1" /> Details
                      </button>
                      {loan.status === 'approved' && (
                        <button className="text-green-600 hover:text-green-700 flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <FaDownload className="mr-1" /> Agreement
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for Active Loans */}
                  {['approved', 'disbursed', 'active', 'completed'].includes(loan.status) && loan.progress !== undefined && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Repayment Progress</span>
                        <span className="font-medium text-gray-900">{loan.progress}% Paid</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${loan.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Next EMI: {formatCurrency(loan.emiAmount)}</span>
                        <span>Due: {formatDate(loan.nextEMIDate)}</span>
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedLoan === loan.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {detailsLoadingId === loan.id ? (
                        <div className="flex items-center justify-center py-8 text-gray-500">
                          <FaSpinner className="mr-2 animate-spin" /> Loading latest loan details...
                        </div>
                      ) : null}

                      {(() => {
                        const activeLoan = loanDetails[loan.id] || loan

                        return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Purpose:</dt>
                              <dd className="text-sm font-medium text-gray-900">{activeLoan.purpose}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Tenure:</dt>
                              <dd className="text-sm font-medium text-gray-900">{activeLoan.tenure}</dd>
                            </div>
                            {activeLoan.approvedDate && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Approved Date:</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(activeLoan.approvedDate)}</dd>
                              </div>
                            )}
                            {activeLoan.disbursedDate && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Disbursed Date:</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(activeLoan.disbursedDate)}</dd>
                              </div>
                            )}
                            {activeLoan.nextEMIDate && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Next EMI Date:</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(activeLoan.nextEMIDate)}</dd>
                              </div>
                            )}
                            {activeLoan.account?.accountNumber && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Linked Account:</dt>
                                <dd className="text-sm font-medium text-gray-900">{activeLoan.account.accountNumber}</dd>
                              </div>
                            )}
                            {activeLoan.rejectionReason && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Rejection Reason:</dt>
                                <dd className="text-sm font-medium text-red-600">{activeLoan.rejectionReason}</dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        {/* Right Column - Documents */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                          {activeLoan.documents?.length ? (
                            <ul className="space-y-2">
                              {activeLoan.documents.map((doc) => (
                                <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                  <span className="text-sm text-gray-700 flex items-center">
                                    <FaFilePdf className="text-red-500 mr-2" />
                                    {doc.name}
                                  </span>
                                  {doc.url ? (
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-primary-600 hover:text-primary-700 text-sm"
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

                          {/* Status Timeline */}
                          <h4 className="font-semibold text-gray-900 mt-4 mb-3">Status Timeline</h4>
                          <div className="space-y-2">
                            {activeLoan.statusHistory?.map((event, index) => (
                              <div key={`${event.status}-${index}`} className="flex items-start space-x-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                  <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                                  <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                        )
                      })()}

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          to="/dashboard/support/create"
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Contact Support
                        </Link>
                        {['approved', 'disbursed', 'active'].includes(loan.status) && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                            Make Payment
                          </button>
                        )}
                        {loan.status === 'rejected' && (
                          <Link
                            to="/dashboard/loans/apply"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                          >
                            Re-apply
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default LoanStatus
