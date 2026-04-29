import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaCreditCard, FaUniversity, FaArrowUp, FaShieldAlt } from 'react-icons/fa'
import { formatCurrency, formatAccountNumber } from '../../utils/formatters'

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

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Portfolio</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Your Accounts</h2>
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

      <div className="p-6">
        <div className="mb-5 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#0f2742_0%,#16385d_45%,#1e5a83_100%)] p-6 text-white shadow-lg">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">Total Balance</p>
            <p className="relative mt-4 text-4xl font-bold tracking-tight">
              {showBalances ? formatCurrency(totalBalance) : '••••••'}
            </p>
            <div className="relative mt-6 flex flex-wrap gap-3 text-sm text-slate-100">
              <span className="rounded-full bg-white/12 px-3 py-1">
                {accounts.length} active account{accounts.length === 1 ? '' : 's'}
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1">
                Everyday banking ready
              </span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Snapshot</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Primary account type</span>
                <span className="font-semibold capitalize text-slate-900">{accounts[0]?.accountType || accounts[0]?.type || 'Checking'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Highest balance</span>
                <span className="font-semibold text-slate-900">
                  {showBalances ? formatCurrency(highestBalance) : '••••••'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Growth view</span>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <FaArrowUp className="mr-1" /> Stable
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {accounts.map((account) => {
            const accountId = account._id || account.id
            const accountType = account.accountType || account.type || 'checking'
            const accountName = account.name || `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`
            const accountNum = account.accountNumber || account.number

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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      accountType === 'checking' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {accountType === 'checking' ? <FaUniversity /> : <FaCreditCard />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{accountName}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          {accountType}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{accountNum ? formatAccountNumber(accountNum) : '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Available</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {showBalances ? formatCurrency(account.balance || 0) : '••••••'}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500">{account.status || 'active'}</p>
                  </div>
                </div>

                {selectedAccount === accountId && (
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200 pt-4 text-center">
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
