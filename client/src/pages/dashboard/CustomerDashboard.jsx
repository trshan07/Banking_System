import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useDashboardData } from '../../hooks/useDashboardData'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import CustomerDashboardHeader from '../../components/customer-dashboard/CustomerDashboardHeader'
import CustomerKpiGrid from '../../components/customer-dashboard/CustomerKpiGrid'
import CustomerAnalyticsPanel from '../../components/customer-dashboard/CustomerAnalyticsPanel'
import {
  buildCustomerKpis,
  buildLoanStatusBreakdown,
  buildTrendData,
  getCustomerLastSyncedAt,
} from '../../components/customer-dashboard/customerDashboardUtils'
import QuickActions from '../../components/dashboard/QuickActionsNew'
import RecentTransactions from '../../components/dashboard/RecentTransactions'
import AccountSummary from '../../components/dashboard/AccountSummary'
import SavingsGoals from '../../components/dashboard/SavingsGoals'

const searchDashboardItems = (items, fields, term) => {
  const query = term.trim().toLowerCase()
  if (!query) return items

  return items.filter((item) =>
    fields.some((field) =>
      String(item?.[field] ?? '')
        .toLowerCase()
        .includes(query)
    )
  )
}

const CustomerDashboard = () => {
  const { user } = useAuth()
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Customer'
  const [searchTerm, setSearchTerm] = useState('')
  const {
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

  const kpiCards = buildCustomerKpis({ accounts, transactions, savingsGoals, loans, alerts, overview })
  const filteredAccounts = useMemo(
    () => searchDashboardItems(accounts, ['name', 'number', 'accountNumber', 'type', 'accountType', 'status'], searchTerm),
    [accounts, searchTerm]
  )
  const filteredTransactions = useMemo(
    () => searchDashboardItems(transactions, ['description', 'category', 'type', 'status', 'account', 'reference'], searchTerm),
    [transactions, searchTerm]
  )
  const filteredSavingsGoals = useMemo(
    () => searchDashboardItems(savingsGoals, ['name', 'goalName', 'category', 'status'], searchTerm),
    [savingsGoals, searchTerm]
  )
  const filteredLoans = useMemo(
    () => searchDashboardItems(loans, ['type', 'loanType', 'status', 'tenure'], searchTerm),
    [loans, searchTerm]
  )
  const filteredAlerts = useMemo(
    () => searchDashboardItems(alerts, ['title', 'message', 'type', 'severity'], searchTerm),
    [alerts, searchTerm]
  )
  const isSearching = searchTerm.trim().length > 0
  const visibleResultCount =
    filteredAccounts.length +
    filteredTransactions.length +
    filteredSavingsGoals.length +
    filteredLoans.length +
    filteredAlerts.length
  const trendData = buildTrendData(isSearching ? filteredTransactions : transactions)
  const loanBreakdown = buildLoanStatusBreakdown(isSearching ? filteredLoans : loans)
  const lastSyncedAt = getCustomerLastSyncedAt({ transactions, alerts })
  const scrollToAlerts = () => {
    document.getElementById('dashboard-alerts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
    <div className="mx-auto max-w-[1380px] space-y-6 pb-6">
      <CustomerDashboardHeader
        firstName={firstName}
        user={user}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refreshData}
        onOpenNotifications={scrollToAlerts}
        notificationCount={alerts.length}
        lastSyncedAt={lastSyncedAt}
      />

      {isSearching ? (
        <div className="flex flex-col gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Showing {visibleResultCount} dashboard result{visibleResultCount === 1 ? '' : 's'} for "{searchTerm}"
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Accounts, transactions, loans, savings, and alerts are filtered below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="inline-flex justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Clear search
          </button>
        </div>
      ) : null}

      <CustomerKpiGrid cards={kpiCards} />

      <CustomerAnalyticsPanel
        trendData={trendData}
        loanBreakdown={loanBreakdown}
        alerts={isSearching ? filteredAlerts : alerts}
        onDismiss={dismissAlert}
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use the shortcuts below for the tasks you do most often.
          </p>
        </div>
        <QuickActions accounts={accounts} loans={loans} savingsGoals={savingsGoals} />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <RecentTransactions transactions={isSearching ? filteredTransactions : transactions} loading={loading} />
        </div>
        <div className="xl:col-span-5">
          <AccountSummary accounts={isSearching ? filteredAccounts : accounts} loading={loading} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <SavingsGoals goals={isSearching ? filteredSavingsGoals : savingsGoals} loading={loading} />
        </div>
        <div className="xl:col-span-6">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Support</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Need help with anything?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get in touch with support if you need help with cards, transfers, or account access.
              </p>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Support Tickets</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{overview.openTickets || 0}</p>
                <p className="mt-2 text-sm text-slate-500">Open requests in progress.</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Pending Alerts</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{alerts.length}</p>
                <p className="mt-2 text-sm text-slate-500">Security and account notices.</p>
              </div>
              <div className="sm:col-span-2 rounded-[1.5rem] bg-[linear-gradient(135deg,#0f2742_0%,#173d61_100%)] p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">Customer Service</p>
                <p className="mt-2 text-lg font-semibold">Reach the support team when you need a hand.</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  You can open a new ticket, review existing requests, or report anything suspicious.
                </p>
                <Link
                  to="/dashboard/support/create"
                  className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#173d61] transition hover:bg-slate-100"
                >
                  Create Support Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CustomerDashboard
