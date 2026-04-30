import React from 'react'
import { FaArrowUp, FaBell, FaShieldAlt, FaUniversity, FaWallet } from 'react-icons/fa'
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
    <div className="mx-auto max-w-[1440px] space-y-5 lg:space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_40%)] p-5 shadow-[0_26px_70px_-38px_rgba(15,23,42,0.35)] sm:p-7 lg:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute left-0 top-24 h-24 w-24 -translate-x-1/2 rounded-full bg-emerald-100/80 blur-2xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#173d61] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Customer Dashboard
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Smart Bank
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.8rem]">
                Welcome back, {firstName}
              </h1>

              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Your customer dashboard should feel simple, trustworthy, and premium. This view keeps the most important financial information readable and calm.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Monthly Spend</p>
                <p className="mt-3 break-words text-2xl font-bold text-slate-900">{formatCurrency(totalMonthlyExpenses)}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Tracked outgoing activity</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Saved So Far</p>
                <p className="mt-3 break-words text-2xl font-bold text-slate-900">{formatCurrency(savingsTotal)}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Across active goals</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Open Alerts</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{overview.pendingAlerts}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Items waiting for review</p>
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

          <div className="overflow-hidden rounded-[1.9rem] bg-[linear-gradient(145deg,#0f2742_0%,#173d61_60%,#1e5a83_100%)] p-5 text-white shadow-[0_28px_60px_-30px_rgba(15,39,66,0.7)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Primary Balance</p>
                <p className="mt-4 break-words text-4xl font-bold leading-tight sm:text-[2.9rem]">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <FaWallet className="text-xl" />
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <FaUniversity />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-200">Accounts</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {overview.activeAccounts} active
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <FaShieldAlt />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-200">KYC Status</p>
                    <p className="mt-1 text-lg font-semibold capitalize text-white">
                      {String(overview.kycStatus || 'not submitted').replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[1.45rem] border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <FaArrowUp />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-200">Account Health</p>
                    <p className="mt-1 text-base font-semibold text-white">Stable overview</p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-100/85">
                Balances, savings, and recent activity are visible in one place without needing extra navigation.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-100/90">
                <FaBell className="text-xs" />
                <span>{overview.pendingAlerts} alert{overview.pendingAlerts === 1 ? '' : 's'} waiting for attention</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsCards stats={stats} loading={loading} />

      <QuickActions accounts={accounts} loans={loans} savingsGoals={savingsGoals} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <AccountSummary accounts={accounts} loading={loading} />
          <SavingsGoals goals={savingsGoals} loading={loading} />
          <LoanSummary loans={loans} loading={loading} />
        </div>

        <div className="space-y-6 xl:col-span-3">
          <RecentTransactions transactions={transactions} loading={loading} />
          <ActiveAlerts alerts={alerts} onDismiss={dismissAlert} />
        </div>

        <div className="space-y-6 xl:col-span-2">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
