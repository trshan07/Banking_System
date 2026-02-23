import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaExchangeAlt,
  FaCreditCard,
  FaUniversity,
  FaSearch,
  FaFilter
} from 'react-icons/fa'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const RecentTransactions = ({ transactions, loading }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

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
        return <FaUniversity className="text-gray-600" />
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
      t.amount.toString().includes(searchTerm)
    )
    .slice(0, 5)

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer">Transfers</option>
            <option value="payment">Payments</option>
          </select>

          <Link 
            to="/dashboard/banking/transactions" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium whitespace-nowrap"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${getTransactionColor(transaction.type)} rounded-xl flex items-center justify-center`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{formatDateTime(transaction.date)}</p>
                  {transaction.category && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 mt-1 inline-block">
                      {transaction.category}
                    </span>
                  )}
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
                <p className="text-xs text-gray-500 mt-1">
                  {transaction.status === 'completed' ? (
                    <span className="text-green-600">Completed</span>
                  ) : transaction.status === 'pending' ? (
                    <span className="text-yellow-600">Pending</span>
                  ) : (
                    <span className="text-red-600">Failed</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentTransactions