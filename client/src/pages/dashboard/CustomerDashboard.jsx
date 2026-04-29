import React from 'react'
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
    refreshData 
  } = useDashboardData()

  const totalBalance = accounts.reduce((sum, account) => sum + (Number(account.balance) || 0), 0)
  const totalMonthlyExpenses = Array.isArray(stats)
    ? Number(stats.find((stat) => stat.label === 'Monthly Expenses')?.value || 0)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_30%),linear-gradient(135deg,#0b1f36_0%,#123252_38%,#1e5a83_100%)] p-6 text-white shadow-[0_24px_60px_-24px_rgba(15,39,66,0.75)] sm:p-8">
        <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Customer Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Your banking overview should feel calm and trustworthy. This view keeps balances, activity, savings, and support in one place without the clutter.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                {overview.activeAccounts} active account{overview.activeAccounts === 1 ? '' : 's'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                {overview.pendingAlerts} pending alert{overview.pendingAlerts === 1 ? '' : 's'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium capitalize text-slate-100">
                KYC: {String(overview.kycStatus || 'not submitted').replace(/_/g, ' ')}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={refreshData}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0f2742] transition-colors hover:bg-slate-100"
              >
                Refresh Data
              </button>
              <div className="rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-slate-100">
                Synced with your live banking records
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Available Balance</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBalance)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Recent Activity</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {transactions.length}
              </p>
              <p className="mt-1 text-xs text-slate-200">transactions in view</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Monthly Spend</p>
              <p className="mt-3 text-2xl font-bold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalMonthlyExpenses)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Quick Actions */}
      <QuickActions accounts={accounts} loans={loans} savingsGoals={savingsGoals} />

      {/* Main Content Grid */}
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
