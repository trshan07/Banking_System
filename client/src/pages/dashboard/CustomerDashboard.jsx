import React from 'react'
import { FaArrowUp, FaBell, FaShieldAlt } from 'react-icons/fa'
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
      <section className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_30%),linear-gradient(135deg,#091726_0%,#0f2742_40%,#1f5d88_100%)] p-5 text-white shadow-[0_30px_70px_-30px_rgba(15,39,66,0.8)] sm:p-7 lg:p-8">
        <div className="absolute -right-14 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="relative grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-100">
                  Customer Dashboard
                </span>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                  Live Banking View
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.8rem]">
                Welcome back, {firstName}
              </h1>

              <p className="max-w-2xl text-sm leading-7 text-slate-100/90 sm:text-base">
                A clearer snapshot of balances, spending, savings, alerts, and support so the important things are easy to see at a glance.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Available Balance</p>
                <p className="mt-4 break-words text-4xl font-bold leading-tight sm:text-[2.85rem]">
                  {formatCurrency(totalBalance)}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-100/90">
                  <span className="rounded-full bg-white/10 px-3 py-1.5">
                    {overview.activeAccounts} active account{overview.activeAccounts === 1 ? '' : 's'}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 capitalize">
                    KYC: {String(overview.kycStatus || 'not submitted').replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">This Month</p>
                  <p className="mt-3 text-2xl font-bold">{formatCurrency(totalMonthlyExpenses)}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-100/80">Outgoing spend currently tracked</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Saved So Far</p>
                  <p className="mt-3 text-2xl font-bold">{formatCurrency(savingsTotal)}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-100/80">Across your active savings goals</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={refreshData}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0f2742] transition-colors hover:bg-slate-100"
              >
                Refresh Dashboard
              </button>
              <div className="rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm leading-6 text-slate-100/95">
                Synced with your live banking records
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Account Health</p>
                  <p className="mt-2 text-lg font-semibold text-white">Stable overview</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <FaArrowUp />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-100/85">
                Your balances, savings, and activity are all visible from one place without extra navigation.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Open Attention Items</p>
                  <p className="mt-2 text-lg font-semibold text-white">{overview.pendingAlerts} alert{overview.pendingAlerts === 1 ? '' : 's'}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <FaBell />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-100/85">
                Review anything that needs action before it becomes a problem.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Security</p>
                  <p className="mt-2 text-lg font-semibold text-white">Protected access</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <FaShieldAlt />
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-100/85">
                Keep an eye on activity, KYC status, and support updates from one secure workspace.
              </p>
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
