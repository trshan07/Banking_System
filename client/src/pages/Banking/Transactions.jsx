import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowDown,
  FaArrowUp,
  FaCreditCard,
  FaDownload,
  FaExchangeAlt,
  FaSearch,
} from 'react-icons/fa'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { bankingAPI, transactionAPI } from '../../services/api'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

const formatTitle = (value = '') =>
  String(value)
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const getObjectId = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value._id) return String(value._id)
  return String(value)
}

const formatAccountName = (accountType = '') => {
  const label = formatTitle(accountType || 'checking')
  return label ? `${label} Account` : 'Bank Account'
}

const mapTransaction = (transaction, ownAccountIds) => {
  const fromAccountId = getObjectId(transaction?.fromAccountId)
  const toAccountId = getObjectId(transaction?.toAccountId)
  const isOutgoing = ownAccountIds.has(fromAccountId)
  const isIncoming = ownAccountIds.has(toAccountId)

  let direction = 'neutral'
  if (isOutgoing && isIncoming) direction = 'internal'
  else if (isOutgoing) direction = 'out'
  else if (isIncoming) direction = 'in'

  const sourceName = formatAccountName(transaction?.fromAccountId?.accountType)
  const destinationName = formatAccountName(transaction?.toAccountId?.accountType)

  return {
    id: transaction?._id || transaction?.id,
    description: transaction?.description || `${formatTitle(transaction?.type || 'transaction')} activity`,
    amount: Number(transaction?.amount) || 0,
    type: transaction?.type || 'transfer',
    status: transaction?.status || 'pending',
    category: formatTitle(transaction?.category || 'other'),
    date: transaction?.createdAt || transaction?.date,
    direction,
    account: direction === 'in' ? destinationName : sourceName,
    counterparty: direction === 'out' ? destinationName : sourceName,
    reference: transaction?.reference || '',
  }
}

const isInRange = (date, dateRange) => {
  if (!date || dateRange === 'all') return true

  const targetDate = new Date(date)
  if (Number.isNaN(targetDate.getTime())) return false

  const now = new Date()
  const diffMs = now - targetDate
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  switch (dateRange) {
    case '7days':
      return diffDays <= 7
    case '30days':
      return diffDays <= 30
    case '90days':
      return diffDays <= 90
    case 'year':
      return targetDate.getFullYear() === now.getFullYear()
    default:
      return true
  }
}

const Transactions = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('30days')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setErrorMessage('')

        const [transactionsResponse, accountsResponse] = await Promise.all([
          transactionAPI.getTransactions({ page: 1, limit: 100 }),
          bankingAPI.getAccounts(),
        ])
        const rawTransactions = transactionsResponse?.data?.data || []
        const ownAccountIds = new Set((accountsResponse?.data?.data || []).map((account) => getObjectId(account?._id || account?.id)))

        const mappedTransactions = rawTransactions.map((transaction) => mapTransaction(transaction, ownAccountIds))

        if (isMounted) {
          setTransactions(mappedTransactions)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error?.response?.data?.message || 'Failed to load your transactions. Please try again.')
          setTransactions([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchTransactions()

    return () => {
      isMounted = false
    }
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
    .filter((transaction) => filter === 'all' || transaction.type === filter)
    .filter((transaction) => isInRange(transaction.date, dateRange))
    .filter((transaction) => {
      const query = searchTerm.toLowerCase()
      return (
        String(transaction.description || '').toLowerCase().includes(query) ||
        String(transaction.category || '').toLowerCase().includes(query) ||
        String(transaction.account || '').toLowerCase().includes(query) ||
        String(transaction.reference || '').toLowerCase().includes(query) ||
        String(transaction.amount || '').includes(searchTerm)
      )
    })

  const totalInflow = filteredTransactions
    .filter((transaction) => transaction.direction === 'in' || transaction.type === 'deposit')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalOutflow = filteredTransactions
    .filter((transaction) => transaction.direction === 'out' || ['withdrawal', 'payment', 'fee'].includes(transaction.type))
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const exportTransactions = () => {
    if (filteredTransactions.length === 0) return

    const header = ['Date', 'Description', 'Category', 'Account', 'Direction', 'Amount', 'Status', 'Reference']
    const rows = filteredTransactions.map((transaction) => [
      transaction.date ? new Date(transaction.date).toISOString() : '',
      transaction.description,
      transaction.category,
      transaction.account,
      transaction.direction,
      transaction.amount,
      transaction.status,
      transaction.reference,
    ])

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'transactions.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <Link to="/dashboard/banking/accounts" className="text-primary-600 hover:text-primary-700">
          Back to Accounts
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="mt-2 text-gray-600">Search, filter, and export your recent banking activity.</p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Visible Transactions</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Inflow</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{formatCurrency(totalInflow)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Outflow</p>
          <p className="mt-2 text-2xl font-bold text-red-600">{formatCurrency(totalOutflow)}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer">Transfers</option>
            <option value="payment">Payments</option>
          </select>

          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This year</option>
            <option value="all">All time</option>
          </select>

          <button
            type="button"
            onClick={exportTransactions}
            className="flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2 font-medium text-white transition hover:bg-primary-700"
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">No transactions matched your filters.</div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="px-4 py-4 transition hover:bg-gray-50 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>{formatDateTime(transaction.date)}</span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {transaction.category}
                        </span>
                        <span>{transaction.account}</span>
                      </div>
                      {transaction.reference && (
                        <p className="mt-1 text-xs text-gray-400">Ref: {transaction.reference}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className={`text-lg font-bold ${
                      transaction.direction === 'in' || transaction.type === 'deposit'
                        ? 'text-green-600'
                        : transaction.direction === 'out' || transaction.type === 'withdrawal'
                          ? 'text-red-600'
                          : 'text-gray-900'
                    }`}>
                      {(transaction.direction === 'in' || transaction.type === 'deposit') ? '+' : ''}
                      {(transaction.direction === 'out' || transaction.type === 'withdrawal') ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className={`mt-1 text-xs ${
                      transaction.status === 'completed'
                        ? 'text-green-600'
                        : transaction.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}>
                      {formatTitle(transaction.status)}
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

export default Transactions
