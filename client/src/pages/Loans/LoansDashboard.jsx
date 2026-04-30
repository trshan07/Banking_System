import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoanCalculatorForm from './LoanCalculatorForm'
import LoanCard from './LoanCard'
import { loanService } from '../../services/loanService'
import { mapLoanFromApi } from './loanHelpers'
import { formatCurrency } from '../../utils/formatters'

const LoansDashboard = () => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await loanService.getMyLoans()
        const loanList = Array.isArray(response?.data?.data) ? response.data.data : []
        setLoans(loanList.map(mapLoanFromApi))
      } catch (err) {
        console.error('Failed to load loan dashboard:', err)
        setError('Unable to load your loan dashboard right now.')
        setLoans([])
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [])

  const tabConfigs = [
    { key: 'all', label: 'All Loans', matcher: () => true },
    { key: 'active', label: 'Active', matcher: (loan) => ['active', 'approved', 'disbursed'].includes(loan.status) },
    { key: 'pending', label: 'Pending', matcher: (loan) => ['pending', 'under_review'].includes(loan.status) },
    { key: 'completed', label: 'Completed', matcher: (loan) => loan.status === 'completed' },
    { key: 'rejected', label: 'Rejected', matcher: (loan) => loan.status === 'rejected' },
  ]

  const filteredLoans = loans.filter((loan) => {
    const activeConfig = tabConfigs.find((tab) => tab.key === activeTab)
    return activeConfig ? activeConfig.matcher(loan) : true
  })

  const totalActiveLoans = loans.filter((loan) => ['active', 'approved', 'disbursed'].includes(loan.status)).length
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your loans...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loans Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Review applications, check repayment progress, and open the next loan step from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/dashboard/loans/calculator"
                className="rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
              >
                Loan Calculator
              </Link>
              <Link
                to="/dashboard/loans/apply"
                className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                Apply for Loan
              </Link>
              <Link
                to="/dashboard/loans/status"
                className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
              >
                Status View
              </Link>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Total Loans</p>
            <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Active Loans</p>
            <p className="text-2xl font-bold text-gray-900">{totalActiveLoans}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Total Borrowed</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalLoanAmount)}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Outstanding</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap">
                  {tabConfigs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`border-b-2 px-4 py-4 text-sm font-medium ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {tab.label} ({loans.filter(tab.matcher).length})
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {filteredLoans.length === 0 ? (
                  <div className="py-8 text-center">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">No matching loans</h3>
                    <p className="mb-4 text-gray-600">This loan group is empty right now.</p>
                    <Link
                      to="/dashboard/loans/apply"
                      className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      Apply for Your First Loan
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLoans.map((loan) => (
                      <LoanCard key={loan.id} loan={loan} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick EMI Calculator</h3>
              <LoanCalculatorForm compact />
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/dashboard/loans/apply"
                  className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-white transition-colors hover:bg-blue-700"
                >
                  Apply for New Loan
                </Link>
                <Link
                  to="/dashboard/loans/status"
                  className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center text-white transition-colors hover:bg-green-700"
                >
                  Check Application Status
                </Link>
                <Link
                  to="/dashboard/banking/transactions"
                  className="block w-full rounded-lg bg-slate-700 px-4 py-3 text-center text-white transition-colors hover:bg-slate-800"
                >
                  View Transactions
                </Link>
                <Link
                  to="/dashboard/support/create"
                  className="block w-full rounded-lg bg-purple-600 px-4 py-3 text-center text-white transition-colors hover:bg-purple-700"
                >
                  Contact Loan Support
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow">
              <h3 className="mb-2 text-lg font-semibold">Need repayment clarity?</h3>
              <p className="mb-4 text-blue-100">
                Use the calculator before applying or open your loan details to review live backend data.
              </p>
              <Link
                to="/dashboard/loans/calculator"
                className="block w-full rounded-lg bg-white px-4 py-2 text-center font-semibold text-blue-600 transition-colors hover:bg-gray-100"
              >
                Open Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoansDashboard
