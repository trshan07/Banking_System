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
  const totalMonthlyExpenses = transactions
    .filter((transaction) => {
      const type = String(transaction?.type || '').toLowerCase()
      return transaction?.direction === 'out' || ['withdrawal', 'payment', 'fee'].includes(type)
    })
    .filter((transaction) => {
      const date = transaction?.createdAt || transaction?.date
      if (!date) return false

      const txnDate = new Date(date)
      const today = new Date()
      return txnDate.getMonth() === today.getMonth() && txnDate.getFullYear() === today.getFullYear()
    })
    .reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0)
  const savingsTotal = savingsGoals.reduce(
    (sum, goal) => sum + (Number(goal.currentAmount ?? goal.current ?? 0) || 0),
    0
  )
  const totalLoanExposure = loans.reduce((sum, loan) => sum + (Number(loan.remainingAmount) || 0), 0)
  const kycStatus = String(overview.kycStatus || 'not submitted').replace(/_/g, ' ')

  const overviewCards = [
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      note: `${accounts.length} account${accounts.length === 1 ? '' : 's'} available`,
      icon: FaUniversity,
      iconClass: 'bg-sky-100 text-sky-700',
    },
    {
      title: 'This Month',
      value: formatCurrency(totalMonthlyExpenses),
      note: 'Outgoing spending tracked from recent activity',
      icon: FaChartLine,
      iconClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Savings',
      value: formatCurrency(savingsTotal),
      note: `${savingsGoals.length} goal${savingsGoals.length === 1 ? '' : 's'} in progress`,
      icon: FaPiggyBank,
      iconClass: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Loan Balance',
      value: formatCurrency(totalLoanExposure),
      note: loans.length > 0 ? `${loans.length} active loan record${loans.length === 1 ? '' : 's'}` : 'No active loans',
      icon: FaShieldAlt,
      iconClass: 'bg-rose-100 text-rose-700',
    },
  ]

  const todayItems = [
    {
      label: 'Active accounts',
      value: overview.activeAccounts,
      helper: 'Ready for everyday banking',
      icon: FaUniversity,
      iconClass: 'bg-sky-100 text-sky-700',
    },
    {
      label: 'Pending alerts',
      value: overview.pendingAlerts,
      helper: overview.pendingAlerts === 0 ? 'No urgent items right now' : 'Review these when you can',
      icon: FaBell,
      iconClass: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Support tickets',
      value: overview.openTickets,
      helper: overview.openTickets === 0 ? 'No open support requests' : 'Support is still working on these',
      icon: FaHeadset,
      iconClass: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'KYC status',
      value: kycStatus,
      helper: 'Keep your profile current for smooth service',
      icon: FaShieldAlt,
      iconClass: 'bg-slate-200 text-slate-700',
    },
  ]

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
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              Customer Dashboard
            </span>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Hello, {firstName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Your accounts, spending, savings, and support updates are all here in one simple
                place so you can find what you need quickly.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={refreshData}
                className="rounded-xl bg-[#173d61] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#102d49]"
              >
                Refresh Dashboard
              </button>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                Live data from your banking records
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Today
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">At a glance</h2>

            <div className="mt-5 space-y-3">
              {todayItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.iconClass}`}
                  >
                    <item.icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 break-words text-base text-slate-700">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {card.title}
                  </p>
                  <p className="mt-3 break-words text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{card.note}</p>
                </div>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.iconClass}`}
                >
                  <card.icon className="text-lg" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use the shortcuts below for the tasks you do most often.
          </p>
        </div>
        <QuickActions accounts={accounts} loans={loans} savingsGoals={savingsGoals} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Accounts and activity</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review your account balances and the latest transaction history.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <AccountSummary accounts={accounts} loading={loading} />
          </div>
          <div className="xl:col-span-5">
            <RecentTransactions transactions={transactions} loading={loading} />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Savings and loans</h2>
          <p className="mt-1 text-sm text-slate-600">
            Keep an eye on your progress and any money you still need to repay.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <SavingsGoals goals={savingsGoals} loading={loading} />
          </div>
          <div className="xl:col-span-6">
            <LoanSummary loans={loans} loading={loading} />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Alerts and help</h2>
          <p className="mt-1 text-sm text-slate-600">
            Stay aware of important notices and reach support when you need it.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <ActiveAlerts alerts={alerts} onDismiss={dismissAlert} />
          </div>
          <div className="xl:col-span-7">
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  )
}

export default CustomerDashboard
