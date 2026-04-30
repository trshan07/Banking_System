import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaUniversity, 
  FaCreditCard, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaDownload,
  FaHistory,
  FaExclamationCircle
} from 'react-icons/fa'
import { formatCurrency, formatAccountNumber } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { bankingAPI } from '../../services/api'

const formatAccountTypeLabel = (accountType = '') => {
  if (!accountType) return 'Bank Account'
  return `${accountType.charAt(0).toUpperCase()}${accountType.slice(1)} Account`
}

const mapApiAccountToViewModel = (account) => ({
  id: account._id || account.id,
  name: formatAccountTypeLabel(account.accountType),
  number: account.accountNumber,
  balance: Number(account.balance) || 0,
  type: account.accountType || 'checking',
  currency: account.currency || 'LKR',
  interestRate: `${Number(account.interestRate || 0).toFixed(2)}%`,
  openedDate: account.openedAt || account.createdAt,
  status: account.status || 'active'
})

const Accounts = () => {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [showBalances, setShowBalances] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchAccounts = async () => {
      try {
        setLoading(true)
        setErrorMessage('')
        const response = await bankingAPI.getAccounts()
        const mappedAccounts = (response.data?.data || []).map(mapApiAccountToViewModel)

        if (isMounted) {
          setAccounts(mappedAccounts)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.response?.data?.message || 'Failed to load your accounts. Please try again.')
          setAccounts([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAccounts()

    return () => {
      isMounted = false
    }
  }, [])

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const primaryCurrency = accounts[0]?.currency || 'LKR'

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Accounts</h1>
            <p className="text-gray-600 mt-2">Manage and view all your bank accounts</p>
          </div>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            {showBalances ? <FaEyeSlash /> : <FaEye />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-linear-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white mb-8">
          <p className="text-primary-500 text-sm font-medium">Total Balance</p>
          <p className="text-4xl font-bold mt-2 text-primary-400">
            {showBalances ? formatCurrency(totalBalance, primaryCurrency) : '••••••'}
          </p>
          <p className="text-primary-400 text-sm mt-2">Across {accounts.length} accounts</p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-start gap-3">
            <FaExclamationCircle className="mt-0.5" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.length === 0 && !errorMessage && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-700 font-medium">No accounts found</p>
              <p className="text-gray-500 text-sm mt-2">Your accounts will appear here once they are created.</p>
            </div>
          )}

          {accounts.map((account) => (
            <div
              key={account.id}
              className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedAccount === account.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedAccount(account.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    account.type === 'checking' ? 'bg-blue-100' : 
                    account.type === 'savings' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {account.type === 'checking' ? (
                      <FaUniversity className="text-blue-600 text-xl" />
                    ) : account.type === 'savings' ? (
                      <FaCreditCard className="text-green-600 text-xl" />
                    ) : (
                      <FaUniversity className="text-purple-600 text-xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">{formatAccountNumber(account.number)}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {account.status}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {showBalances ? formatCurrency(account.balance, account.currency) : '••••••'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="font-semibold text-gray-900">{account.interestRate}</p>
                  </div>
                </div>
              </div>

              {selectedAccount === account.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
                  <Link
                    to="/dashboard/banking/transfer"
                    className="text-center text-sm text-primary-600 hover:text-primary-700 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Transfer
                  </Link>
                  <Link
                    to="/dashboard/banking/transactions"
                    className="text-center text-sm text-primary-600 hover:text-primary-700 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    History
                  </Link>
                  <button
                    className="text-center text-sm text-primary-600 hover:text-primary-700 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Statement
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/banking/transfer"
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Transfer Money</h4>
                <p className="text-sm text-blue-700 mt-1">Send funds between accounts</p>
              </div>
              <FaArrowRight className="text-blue-600" />
            </div>
          </Link>

          <Link
            to="/dashboard/banking/transactions"
            className="bg-green-50 border border-green-200 rounded-xl p-4 hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900">Transaction History</h4>
                <p className="text-sm text-green-700 mt-1">View all transactions</p>
              </div>
              <FaHistory className="text-green-600" />
            </div>
          </Link>

          <button
            className="bg-purple-50 border border-purple-200 rounded-xl p-4 hover:bg-purple-100 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-purple-900">Download Statement</h4>
                <p className="text-sm text-purple-700 mt-1">PDF or Excel format</p>
              </div>
              <FaDownload className="text-purple-600" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Accounts
