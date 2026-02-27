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
  FaCalendarAlt,
  FaUser,
  FaPercent,
  FaDollarSign
} from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const LoanStatus = () => {
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLoan, setSelectedLoan] = useState(null)

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setLoans([
        {
          id: 'LN-2024-001',
          type: 'Personal Loan',
          amount: 15000,
          interestRate: '12%',
          tenure: '36 months',
          status: 'approved',
          appliedDate: '2024-02-15',
          approvedDate: '2024-02-20',
          disbursedDate: '2024-02-22',
          emiAmount: 498.50,
          nextEMIDate: '2024-03-15',
          remainingAmount: 14500,
          progress: 3,
          purpose: 'Home renovation',
          documents: ['ID Proof', 'Income Certificate'],
          officer: 'Sarah Wilson',
          officerContact: 'sarah.wilson@smartbank.com',
          statusHistory: [
            { date: '2024-02-15', status: 'Application Submitted', description: 'Loan application received' },
            { date: '2024-02-17', status: 'Under Review', description: 'Verification in progress' },
            { date: '2024-02-20', status: 'Approved', description: 'Loan approved by committee' },
            { date: '2024-02-22', status: 'Disbursed', description: 'Funds transferred to account' }
          ]
        },
        {
          id: 'LN-2024-002',
          type: 'Home Loan',
          amount: 250000,
          interestRate: '8.5%',
          tenure: '240 months',
          status: 'under_review',
          appliedDate: '2024-02-10',
          expectedDecision: '2024-03-10',
          purpose: 'House purchase',
          documents: ['Property Papers', 'Income Tax Returns', 'Bank Statements'],
          officer: 'Mike Chen',
          officerContact: 'mike.chen@smartbank.com',
          statusHistory: [
            { date: '2024-02-10', status: 'Application Submitted', description: 'Loan application received' },
            { date: '2024-02-12', status: 'Document Verification', description: 'Documents under review' },
            { date: '2024-02-15', status: 'Property Evaluation', description: 'Property valuation in progress' }
          ]
        },
        {
          id: 'LN-2024-003',
          type: 'Car Loan',
          amount: 35000,
          interestRate: '9.5%',
          tenure: '60 months',
          status: 'pending',
          appliedDate: '2024-02-18',
          purpose: 'New car purchase',
          documents: ['Vehicle Quotation', 'Driving License'],
          statusHistory: [
            { date: '2024-02-18', status: 'Application Submitted', description: 'Loan application received' }
          ]
        },
        {
          id: 'LN-2023-045',
          type: 'Education Loan',
          amount: 45000,
          interestRate: '10%',
          tenure: '84 months',
          status: 'rejected',
          appliedDate: '2023-12-20',
          rejectedDate: '2024-01-15',
          rejectionReason: 'Insufficient income to support loan amount',
          documents: ['Admission Letter', 'Fee Structure'],
          statusHistory: [
            { date: '2023-12-20', status: 'Application Submitted', description: 'Loan application received' },
            { date: '2023-12-28', status: 'Under Review', description: 'Income verification failed' },
            { date: '2024-01-15', status: 'Rejected', description: 'Application rejected' }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheckCircle className="text-green-600" />
      case 'under_review': return <FaClock className="text-blue-600" />
      case 'pending': return <FaClock className="text-yellow-600" />
      case 'rejected': return <FaTimesCircle className="text-red-600" />
      default: return <FaMoneyBillWave className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approved'
      case 'under_review': return 'Under Review'
      case 'pending': return 'Pending'
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
              <div
                key={loan.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
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
                        onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
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
                  {loan.status === 'approved' && loan.progress !== undefined && (
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Application Details</h4>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Purpose:</dt>
                              <dd className="text-sm font-medium text-gray-900">{loan.purpose}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-600">Tenure:</dt>
                              <dd className="text-sm font-medium text-gray-900">{loan.tenure}</dd>
                            </div>
                            {loan.approvedDate && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Approved Date:</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(loan.approvedDate)}</dd>
                              </div>
                            )}
                            {loan.disbursedDate && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Disbursed Date:</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(loan.disbursedDate)}</dd>
                              </div>
                            )}
                            {loan.expectedDecision && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Expected Decision:</dt>
                                <dd className="text-sm font-medium text-gray-900">{formatDate(loan.expectedDecision)}</dd>
                              </div>
                            )}
                            {loan.rejectionReason && (
                              <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Rejection Reason:</dt>
                                <dd className="text-sm font-medium text-red-600">{loan.rejectionReason}</dd>
                              </div>
                            )}
                          </dl>

                          {loan.officer && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-900">Loan Officer</p>
                              <p className="text-sm text-gray-600">{loan.officer}</p>
                              <p className="text-xs text-gray-500">{loan.officerContact}</p>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Documents */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                          <ul className="space-y-2">
                            {loan.documents?.map((doc, index) => (
                              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700 flex items-center">
                                  <FaFilePdf className="text-red-500 mr-2" />
                                  {doc}
                                </span>
                                <button className="text-primary-600 hover:text-primary-700 text-sm">
                                  View
                                </button>
                              </li>
                            ))}
                          </ul>

                          {/* Status Timeline */}
                          <h4 className="font-semibold text-gray-900 mt-4 mb-3">Status Timeline</h4>
                          <div className="space-y-2">
                            {loan.statusHistory?.map((event, index) => (
                              <div key={index} className="flex items-start space-x-3">
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

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                          Download Application
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                          Contact Support
                        </button>
                        {loan.status === 'approved' && (
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