import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowUp,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUniversity,
} from 'react-icons/fa'
import { formatCurrency, formatAccountNumber } from '../../utils/formatters'

const accountThemes = {
  checking: {
    accent: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-700',
    iconWrap: 'bg-sky-100 text-sky-700',
    icon: FaUniversity,
  },
  savings: {
    accent: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    icon: FaCreditCard,
  },
}

const AccountSummary = ({ accounts = [], loading }) => {
  const [showBalances, setShowBalances] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Accounts</h2>
        <p className="py-6 text-center text-gray-500">No accounts found.</p>
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0)
  const highestBalance = Math.max(...accounts.map((account) => Number(account.balance) || 0))
  const activeAccounts = accounts.filter((account) => (account.status || '').toLowerCase() === 'active').length

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Portfolio</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Your Accounts</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Clear account cards with quick access to transfers, history, and savings actions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
              <FaShieldAlt className="mr-1 mt-0.5" /> Protected banking
            </div>
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
            >
              {showBalances ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          <div className="rounded-[1.4rem] bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_100%)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Total Balance</p>
            <p className="mt-2 break-words text-2xl font-bold text-slate-900">
              {showBalances ? formatCurrency(totalBalance) : 'Hidden'}
            </p>
            <p className="mt-2 text-sm text-slate-500">Across all linked customer accounts.</p>
          </div>
          <div className="rounded-[1.4rem] bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Highest Balance</p>
            <p className="mt-2 break-words text-2xl font-bold text-slate-900">
              {showBalances ? formatCurrency(highestBalance) : 'Hidden'}
            </p>
            <p className="mt-2 text-sm text-slate-500">Largest available amount in one account.</p>
          </div>
          <div className="rounded-[1.4rem] bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Protection</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <FaArrowUp className="mr-1" /> {activeAccounts} active
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                <FaShieldAlt className="mr-1" /> secured
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Healthy account access for daily banking.</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {accounts.map((account) => {
            const accountId = account._id || account.id
            const accountType = account.accountType || account.type || 'checking'
            const accountName = account.name || `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`
            const accountNum = account.accountNumber || account.number
            const theme = accountThemes[accountType] || accountThemes.checking
            const Icon = theme.icon

            return (
              <div
                key={accountId}
                className={`cursor-pointer rounded-[1.5rem] border p-5 transition-all duration-300 ${
                  selectedAccount === accountId
                    ? 'border-[#173d61] bg-[linear-gradient(145deg,#f8fbfe_0%,#eef5fb_100%)] shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedAccount(accountId)}
              >
                <div className={`mb-4 h-1.5 w-16 rounded-full ${theme.accent}`} />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center space-x-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconWrap}`}>
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words font-semibold text-slate-900">{accountName}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${theme.badge}`}>
                          {accountType}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {accountNum ? formatAccountNumber(accountNum) : 'Account number unavailable'}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Available</p>
                    <p className="mt-2 break-words text-2xl font-bold text-slate-900">
                      {showBalances ? formatCurrency(account.balance || 0) : 'Hidden'}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500">{account.status || 'active'}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Daily banking ready
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Statements available
                  </span>
                </div>

                {selectedAccount === accountId && (
                  <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-200 pt-4 text-center sm:grid-cols-3">
                    <Link to="/dashboard/banking/transfer" className="rounded-full bg-[#173d61] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#102d49]">
                      Transfer
                    </Link>
                    <Link to="/dashboard/banking/transactions" className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
                      History
                    </Link>
                    <Link to="/dashboard/savings" className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
                      Savings
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Link
          to="/dashboard/banking/accounts"
          className="mt-5 block border-t border-slate-200 pt-4 text-center text-sm font-semibold text-[#173d61] transition hover:text-[#102d49]"
        >
          View All Accounts
        </Link>
      </div>
    </div>
  )
}

export default AccountSummary
