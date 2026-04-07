import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaCreditCard, FaUniversity } from 'react-icons/fa'
import { formatCurrency, formatAccountNumber } from '../../utils/formatters'

const AccountSummary = ({ accounts = [], loading }) => {
  const [showBalances, setShowBalances] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Accounts</h2>
        <p className="text-gray-500 text-center py-6">No accounts found.</p>
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Accounts</h2>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showBalances ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-5 mb-4 text-white">
        <p className="text-primary-100 text-sm">Total Balance</p>
        <p className="text-3xl font-bold mt-1">
          {showBalances ? formatCurrency(totalBalance) : '••••••'}
        </p>
      </div>

      {/* Account List */}
      <div className="space-y-3">
        {accounts.map((account) => {
          const accountId = account._id || account.id
          const accountType = account.accountType || account.type || 'checking'
          const accountName = account.name || `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`
          const accountNum = account.accountNumber || account.number

          return (
          <div
            key={accountId}
            className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedAccount === accountId 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => setSelectedAccount(accountId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  accountType === 'checking' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {accountType === 'checking' ? (
                    <FaUniversity className="text-blue-600" />
                  ) : (
                    <FaCreditCard className="text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{accountName}</p>
                  <p className="text-sm text-gray-500">{accountNum ? formatAccountNumber(accountNum) : '—'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {showBalances ? formatCurrency(account.balance || 0) : '••••••'}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{accountType}</p>
              </div>
            </div>

            {selectedAccount === accountId && (
              <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                <Link to="/dashboard/banking/transfer" className="text-xs text-primary-600 hover:underline">
                  Transfer
                </Link>
                <Link to="/dashboard/banking/statement" className="text-xs text-primary-600 hover:underline">
                  Statement
                </Link>
                <Link to={`/dashboard/banking/accounts/${accountId}`} className="text-xs text-primary-600 hover:underline">
                  Details
                </Link>
              </div>
            )}
          </div>
          )
        })}
      </div>

      <Link
        to="/dashboard/banking/accounts"
        className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 py-2 border-t border-gray-200"
      >
        View All Accounts
      </Link>
    </div>
  )
}

export default AccountSummary