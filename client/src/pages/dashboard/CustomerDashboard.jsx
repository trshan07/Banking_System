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
  const { 
    stats, 
    accounts, 
    transactions, 
    alerts, 
    savingsGoals, 
    loans,
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary-600">
              Welcome back, {user?.name?.split(' ')[0] || 'Customer'}!
            </h1>
            <p className="text-primary-400">Here's what's happening with your accounts today.</p>
          </div>
          <button 
            onClick={refreshData}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Quick Actions */}
      <QuickActions accounts={accounts} loans={loans} savingsGoals={savingsGoals} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Account Summary and Savings Goals */}
        <div className="lg:col-span-2 space-y-6">
          <AccountSummary accounts={accounts} loading={loading} />
          <SavingsGoals goals={savingsGoals} loading={loading} />
          <LoanSummary loans={loans} loading={loading} />
        </div>

        {/* Center Column - Recent Transactions and Alerts */}
        <div className="space-y-6 lg:col-span-1">
          <RecentTransactions transactions={transactions} loading={loading} />
          <ActiveAlerts alerts={alerts} onDismiss={dismissAlert} />
        </div>

        {/* Sidebar Column - Backend-powered actions and navigation */}
        <div className="space-y-6 lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard