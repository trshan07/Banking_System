import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt,
  FaCreditCard,
  FaSearch,
  FaFilter,
  FaDownload,
  FaCalendarAlt
} from 'react-icons/fa'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Transactions = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('30days')

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setTransactions([
        {
          id: 1,
          description: 'Salary Deposit',
          amount: 3500.00,
          type: 'deposit',
          date: '2024-02-23T10:30:00',
          status: 'completed',
          category: 'Income',
          account: 'Main Checking'
        },
        {
          id: 2,
          description: 'Grocery Store',
          amount: 156.78,
          type: 'payment',
          date: '2024-02-22T14:20:00',
          status: 'completed',
          category: 'Shopping',
          account: 'Main Checking'
        },
        {
          id: 3,
          description: 'Transfer to Savings',
          amount: 500.00,
          type: 'transfer',
          date: '2024-02-21T09:15:00',
          status: 'completed',
          category: 'Savings',
          account: 'Main Checking'
        },
        {
          id: 4,
          description: 'Restaurant',
          amount: 85.50,
          type: 'payment',
          date: '2024-02-20T19:30:00',
          status: 'completed',
          category: 'Dining',
          account: 'Main Checking'
        },
        {
          id: 5,
          description: 'Utility Bill',
          amount: 120.00,
          type: 'payment',
          date: '2024-02-19T11:00:00',
          status: 'pending',
          category: 'Bills',
          account: 'Main Checking'
        },
        {
          id: 6,
          description: 'ATM Withdrawal',
          amount: 200.00,
          type: 'withdrawal',
          date: '2024-02-18T08:45:00',
          status: 'completed',
          category: 'Cash',
          account: 'Main Checking'
        },
        {
          id: 7,
          description: 'Interest Credit',
          amount: 12.50,
          type: 'deposit',
          date: '2024-02-15T00:00:00',
          status: 'completed',
          category: 'Interest',
          account: 'Savings Account'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowDown className="text-green-600" />
      case 'withdrawal':
        return <FaArrowUp className="text-red-600" />
      case 'transfer':
        return <FaExchangeAlt className="text-blue-600" />
      case 'payment':
        return <FaCreditCard className="text-purple-600" />
      default:
        return <FaExchangeAlt className="text-gray-600" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100'
      case 'withdrawal':
        return 'bg-red-100'
      case 'transfer':
        return 'bg-blue-100'
      case 'payment':
        return 'bg-purple-100'
      default:
        return 'bg-gray-100'
    }
  }

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.amount.toString().includes(searchTerm)
    )

  const totalInflow = filteredTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalOutflow = filteredTransactions
    .filter(t => t.type === 'withdrawal' || t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0)

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
        <div className="mb-6">
          <Link to="/dashboard/banking/accounts" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Accounts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-2">View and search all your transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Inflow</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInflow)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Outflow</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutflow)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="transfer">Transfers</option>
              <option value="payment">Payments</option>
            </select>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
              <option value="all">All time</option>
            </select>

            {/* Export Button */}
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center">
              <FaDownload className="mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No transactions found
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getTransactionColor(transaction.type)} rounded-full flex items-center justify-center`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <span>{formatDateTime(transaction.date)}</span>
                          <span>•</span>
                          <span>{transaction.account}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {transaction.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'deposit' ? 'text-green-600' : 
                        transaction.type === 'withdrawal' ? 'text-red-600' : 
                        'text-gray-900'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : 
                         transaction.type === 'withdrawal' ? '-' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className={`text-xs mt-1 ${
                        transaction.status === 'completed' ? 'text-green-600' :
                        transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions