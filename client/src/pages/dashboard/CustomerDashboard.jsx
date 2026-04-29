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
      <div className="rounded-3xl bg-gradient-to-r from-[#0f2742] via-[#16385d] to-[#1e5a83] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Customer Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
              Here&apos;s a clear snapshot of your accounts, recent activity, savings progress, and support items.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                {overview.activeAccounts} active account{overview.activeAccounts === 1 ? '' : 's'}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                {overview.pendingAlerts} pending alert{overview.pendingAlerts === 1 ? '' : 's'}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                KYC: {String(overview.kycStatus || 'not submitted').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button 
              onClick={refreshData}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0f2742] transition-colors hover:bg-slate-100"
            >
              Refresh Data
            </button>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100">
              <p className="font-semibold">{transactions.length} recent transaction{transactions.length === 1 ? '' : 's'}</p>
              <p className="mt-1 text-xs text-slate-200">Updated from your live banking records</p>
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
