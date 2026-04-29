import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowDown,
  FaArrowUp,
  FaExchangeAlt,
  FaCreditCard,
  FaUniversity,
  FaSearch,
} from 'react-icons/fa'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const RecentTransactions = ({ transactions, loading }) => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded bg-gray-100" />
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
    .filter((t) => filter === 'all' || t.type === filter)
    .filter((t) =>
      String(t?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(t?.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(t?.amount ?? '').includes(searchTerm)
    )
    .slice(0, 5)

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Activity</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Recent Transactions</h2>
            </div>
            <Link
              to="/dashboard/banking/transactions"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search transactions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'deposit', 'withdrawal', 'transfer', 'payment'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    filter === option
                      ? 'bg-[#173d61] text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="rounded-[1.5rem] bg-slate-50 py-10 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-[1.5rem] border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{transaction.description}</p>
                      <p className="mt-1 text-sm text-slate-500">{formatDateTime(transaction.date)}</p>
                      {transaction.category && (
                        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          {transaction.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'deposit'
                        ? 'text-green-600'
                        : transaction.type === 'withdrawal'
                          ? 'text-red-600'
                          : 'text-slate-900'
                    }`}>
                      {transaction.direction === 'in' || transaction.type === 'deposit'
                        ? '+'
                        : transaction.direction === 'out' || transaction.type === 'withdrawal'
                          ? '-'
                          : ''}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="mt-1 text-xs">
                      {transaction.status === 'completed' ? (
                        <span className="font-semibold text-emerald-600">Completed</span>
                      ) : transaction.status === 'pending' ? (
                        <span className="font-semibold text-amber-600">Pending</span>
                      ) : (
                        <span className="font-semibold text-red-600">Failed</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentTransactions
