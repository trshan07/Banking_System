import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { bankingAPI, transactionAPI } from '../../services/api'
import { formatCurrency } from '../../utils/formatters'

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const Statement = () => {
  const [searchParams] = useSearchParams()
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    accountId: searchParams.get('accountId') || 'all',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const accountsResponse = await bankingAPI.getAccounts()
        const accountData = accountsResponse.data?.data || []
        setAccounts(accountData)

        const selectedAccount = filters.accountId !== 'all' ? filters.accountId : accountData[0]?._id
        if (selectedAccount) {
          const transactionsResponse = await transactionAPI.getAccountTransactions(selectedAccount, {
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            limit: 100,
          })
          setTransactions(transactionsResponse.data?.data || [])
        } else {
          setTransactions([])
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load statement')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters.accountId, filters.startDate, filters.endDate])

  const selectedAccount = accounts.find((account) => account._id === (filters.accountId === 'all' ? accounts[0]?._id : filters.accountId))

  const summary = useMemo(() => {
    const accountId = selectedAccount?._id
    return transactions.reduce((acc, transaction) => {
      const outgoing = String(transaction.fromAccountId?._id || transaction.fromAccountId) === String(accountId)
      if (outgoing) acc.debits += Number(transaction.amount || 0)
      else acc.credits += Number(transaction.amount || 0)
      return acc
    }, { credits: 0, debits: 0 })
  }, [transactions, selectedAccount?._id])

  const exportCsv = () => {
    const rows = transactions.map((transaction) => [
      new Date(transaction.createdAt).toLocaleString(),
      transaction.reference || transaction.id || transaction._id,
      transaction.type,
      transaction.status,
      transaction.description || '',
      transaction.amount,
    ])
    const csv = [
      ['Date', 'Reference', 'Type', 'Status', 'Description', 'Amount'],
      ...rows,
    ].map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')

    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `statement_${Date.now()}.csv`)
  }

  const downloadReceipt = async (transactionId) => {
    try {
      const response = await transactionAPI.downloadReceipt(transactionId)
      downloadBlob(response.data, `receipt_${transactionId}.txt`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download receipt')
    }
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Statement</h1>
            <p className="mt-2 text-gray-600">Review transaction history and download receipts.</p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <select
            value={filters.accountId}
            onChange={(event) => setFilters((current) => ({ ...current, accountId: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.accountType} - {account.accountNumber}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(selectedAccount?.balance || 0, selectedAccount?.currency || 'LKR')}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Credits</p>
            <p className="mt-1 text-2xl font-bold text-green-700">{formatCurrency(summary.credits, selectedAccount?.currency || 'LKR')}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Debits</p>
            <p className="mt-1 text-2xl font-bold text-red-700">{formatCurrency(summary.debits, selectedAccount?.currency || 'LKR')}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.reference || transaction.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.description || transaction.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.status}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.amount || 0, selectedAccount?.currency || 'LKR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => downloadReceipt(transaction._id)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <FileText className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                      No transactions found for this statement period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statement
