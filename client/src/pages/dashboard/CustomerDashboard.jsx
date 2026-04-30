import React from 'react'
import {
  FaBell,
  FaChartLine,
  FaHeadset,
  FaPiggyBank,
  FaShieldAlt,
  FaUniversity,
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useDashboardData } from '../../hooks/useDashboardData'
import StatsCards from '../../components/dashboard/StatsCards'
import QuickActions from '../../components/dashboard/QuickActionsNew'
import RecentTransactions from '../../components/dashboard/RecentTransactions'
import ActiveAlerts from '../../components/dashboard/ActiveAlerts'
import AccountSummary from '../../components/dashboard/AccountSummary'
import SavingsGoals from '../../components/dashboard/SavingsGoals'
import LoanSummary from '../../components/dashboard/LoanSummary'
import Sidebar from '../../components/layout/Sidebar'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency } from '../../utils/formatters'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Customer'
  const {
    stats,
    accounts,
    transactions,
    alerts,
    savingsGoals,
    loans,
    overview,
    loading,
    error,
    dismissAlert,
    refreshData,
  } = useDashboardData()

  const totalBalance = accounts.reduce((sum, account) => sum + (Number(account.balance) || 0), 0)
  const totalMonthlyExpenses = Array.isArray(stats)
    ? Number(stats.find((stat) => stat.label === 'Monthly Expenses')?.value || 0)
    : 0
  const savingsTotal = savingsGoals.reduce((sum, goal) => sum + (Number(goal.currentAmount ?? goal.current ?? 0) || 0), 0)
  const totalLoanExposure = loans.reduce((sum, loan) => sum + (Number(loan.remainingAmount) || 0), 0)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button onClick={refreshData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1450px] space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f4f8fc_0%,#ffffff_42%,#f8fafc_100%)] p-5 shadow-[0_30px_80px_-42px_rgba(15,23,42,0.32)] sm:p-7">
        <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute left-0 top-28 h-24 w-24 -translate-x-1/2 rounded-full bg-amber-100/70 blur-2xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#173d61] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Customer Dashboard
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Responsive Banking
                </span>
              </div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.9rem]">
                Welcome back, {firstName}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Your daily banking should feel calm, readable, and easy to act on. This view keeps balances, activity, savings, loans, and support in one clear workspace.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-[1.9rem] bg-[linear-gradient(145deg,#0f2742_0%,#173d61_60%,#1f5d88_100%)] p-6 text-white shadow-[0_28px_60px_-30px_rgba(15,39,66,0.72)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Total Available Balance</p>
                    <p className="mt-4 break-words text-4xl font-bold leading-tight sm:text-[3rem]">
                      {formatCurrency(totalBalance)}
                    </p>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-slate-100/85">
                      Your primary banking snapshot updates from live account, transaction, and customer profile data.
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <FaUniversity className="text-xl" />
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Accounts</p>
                    <p className="mt-2 text-lg font-semibold">{overview.activeAccounts}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Alerts</p>
                    <p className="mt-2 text-lg font-semibold">{overview.pendingAlerts}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">KYC Status</p>
                    <p className="mt-2 text-lg font-semibold capitalize">
                      {String(overview.kycStatus || 'not submitted').replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Control Center</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Today&apos;s priorities</h2>
                <div className="mt-5 space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <FaChartLine />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Spending this month</p>
                      <p className="mt-1 text-sm text-slate-600">{formatCurrency(totalMonthlyExpenses)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <FaHeadset />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Support status</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {overview.openTickets} open ticket{overview.openTickets === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <FaShieldAlt />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Outstanding loans</p>
                      <p className="mt-1 text-sm text-slate-600">{formatCurrency(totalLoanExposure)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={refreshData}
                className="rounded-xl bg-[#173d61] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#102d49]"
              >
                Refresh Dashboard
              </button>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm leading-6 text-slate-600">
                Synced with your live banking records
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">This Month</p>
                  <p className="mt-3 break-words text-2xl font-bold text-slate-900">
                    {formatCurrency(totalMonthlyExpenses)}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <FaBell className="text-lg" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Outgoing spending currently tracked in your recent activity.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Saved So Far</p>
                  <p className="mt-3 break-words text-2xl font-bold text-slate-900">
                    {formatCurrency(savingsTotal)}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <FaPiggyBank className="text-lg" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Combined savings progress across your active goals.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Account Health</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {overview.pendingAlerts} alert{overview.pendingAlerts === 1 ? '' : 's'}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <FaShieldAlt className="text-lg" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review attention items, KYC status, and support updates from one secure workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsCards stats={stats} loading={loading} />

      <QuickActions accounts={accounts} loans={loans} savingsGoals={savingsGoals} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AccountSummary accounts={accounts} loading={loading} />
        </div>
        <div className="xl:col-span-5">
          <RecentTransactions transactions={transactions} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <SavingsGoals goals={savingsGoals} loading={loading} />
        </div>
        <div className="xl:col-span-6">
          <LoanSummary loans={loans} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <ActiveAlerts alerts={alerts} onDismiss={dismissAlert} />
        </div>
        <div className="xl:col-span-7">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
