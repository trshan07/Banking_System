import { useState, useEffect, useCallback } from 'react'
import { fetchDashboard, dismissAlert as dismissDashboardAlert } from '../api/dashboard'

const formatTitle = (value = '') =>
  String(value)
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const formatAccountName = (accountType = '') => {
  const label = formatTitle(accountType || 'checking')
  return label ? `${label} Account` : 'Bank Account'
}

const getObjectId = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value._id) return String(value._id)
  return String(value)
}

const normalizeAccount = (account) => ({
  id: account?._id || account?.id,
  _id: account?._id || account?.id,
  name: account?.name || formatAccountName(account?.accountType || account?.type),
  number: account?.accountNumber || account?.number || '',
  accountNumber: account?.accountNumber || account?.number || '',
  balance: Number(account?.balance) || 0,
  type: account?.accountType || account?.type || 'checking',
  accountType: account?.accountType || account?.type || 'checking',
  currency: account?.currency || 'LKR',
  status: account?.status || 'active',
  interestRate: Number(account?.interestRate) || 0,
  openedAt: account?.openedAt || account?.createdAt || null,
})

const normalizeGoal = (goal) => {
  const current = Number(goal?.currentAmount ?? goal?.current ?? 0)
  const target = Number(goal?.targetAmount ?? goal?.target ?? 0)
  const progress = Number.isFinite(Number(goal?.progress))
    ? Number(goal.progress)
    : target > 0
      ? (current / target) * 100
      : 0

  return {
    id: goal?._id || goal?.id,
    _id: goal?._id || goal?.id,
    name: goal?.goalName || goal?.name || 'Savings Goal',
    goalName: goal?.goalName || goal?.name || 'Savings Goal',
    current,
    currentAmount: current,
    target,
    targetAmount: target,
    progress,
    percentage: Number(goal?.percentage) || progress,
    targetDate: goal?.deadline || goal?.targetDate || null,
    deadline: goal?.deadline || goal?.targetDate || null,
    status: goal?.status || 'active',
    category: goal?.category || 'other',
  }
}

const normalizeLoan = (loan) => {
  const interestRate = Number(loan?.interestRate)
  const term = Number(loan?.term)
  const paidAmount = Array.isArray(loan?.payments)
    ? loan.payments
        .filter((payment) => payment?.status === 'paid')
        .reduce((sum, payment) => sum + (Number(payment?.amount) || 0), 0)
    : 0
  const totalPayment = Number(loan?.totalPayment) || 0
  const remainingAmount = Number(loan?.remainingAmount) || Math.max(totalPayment - paidAmount, 0)

  return {
    id: loan?._id || loan?.id,
    _id: loan?._id || loan?.id,
    type: loan?.type || formatTitle(loan?.loanType || 'loan'),
    loanType: loan?.loanType || loan?.type || 'loan',
    amount: Number(loan?.amount) || 0,
    interestRate: Number.isFinite(interestRate) ? `${interestRate.toFixed(2)}%` : loan?.interestRate || 'N/A',
    interestRateValue: Number.isFinite(interestRate) ? interestRate : 0,
    tenure: loan?.tenure || (Number.isFinite(term) && term > 0 ? `${term} months` : 'N/A'),
    term: Number.isFinite(term) ? term : 0,
    status: loan?.status || 'pending',
    appliedDate: loan?.appliedDate || loan?.createdAt || null,
    decisionDate: loan?.decisionDate || loan?.approvedAt || null,
    expectedDecision: loan?.expectedDecision || null,
    monthlyPayment: Number(loan?.monthlyPayment) || 0,
    totalPayment,
    remainingAmount,
    nextPaymentDate: loan?.nextPaymentDate || null,
  }
}

const normalizeTransaction = (transaction, ownAccountIds) => {
  const fromAccountId = getObjectId(transaction?.fromAccount?._id || transaction?.fromAccountId)
  const toAccountId = getObjectId(transaction?.toAccount?._id || transaction?.toAccountId)
  const isOutgoing = ownAccountIds.has(fromAccountId)
  const isIncoming = ownAccountIds.has(toAccountId)

  let direction = 'neutral'
  if (isOutgoing && isIncoming) direction = 'internal'
  else if (isOutgoing) direction = 'out'
  else if (isIncoming) direction = 'in'

  const sourceName =
    transaction?.fromAccount?.name ||
    formatAccountName(transaction?.fromAccount?.type || transaction?.fromAccountId?.accountType)
  const destinationName =
    transaction?.toAccount?.name ||
    formatAccountName(transaction?.toAccount?.type || transaction?.toAccountId?.accountType)

  const description =
    transaction?.description ||
    (direction === 'in'
      ? `Received via ${formatTitle(transaction?.type || 'transaction')}`
      : direction === 'out'
        ? `Sent via ${formatTitle(transaction?.type || 'transaction')}`
        : `${formatTitle(transaction?.type || 'transaction')} activity`)

  return {
    id: transaction?._id || transaction?.id,
    _id: transaction?._id || transaction?.id,
    description,
    amount: Number(transaction?.amount) || 0,
    type: transaction?.type || 'transfer',
    status: transaction?.status || 'pending',
    category: formatTitle(transaction?.category || 'other'),
    date: transaction?.date || transaction?.createdAt || null,
    createdAt: transaction?.createdAt || transaction?.date || null,
    direction,
    fromAccountId,
    toAccountId,
    fromAccountName: sourceName,
    toAccountName: destinationName,
    account: direction === 'in' ? destinationName : sourceName,
    reference: transaction?.reference || '',
  }
}

const normalizeAlert = (alert) => ({
  id: alert?._id || alert?.id,
  _id: alert?._id || alert?.id,
  type: alert?.type || 'info',
  severity: alert?.severity || 'low',
  title: alert?.title || 'Account update',
  message: alert?.message || '',
  action: alert?.action || null,
  date: alert?.date || alert?.createdAt || null,
  createdAt: alert?.createdAt || alert?.date || null,
})

const buildStats = ({ accounts = [], loans = [], savingsGoals = [], transactions = [], alerts = [], tickets = 0 }) => {
  const totalBalance = accounts.reduce((sum, account) => sum + (Number(account?.balance) || 0), 0)
  const activeLoans = loans.filter((loan) => ['pending', 'approved', 'active', 'disbursed'].includes(loan?.status)).length
  const savingsCount = savingsGoals.filter((goal) => goal?.status !== 'cancelled').length

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyExpenses = transactions
    .filter((transaction) => {
      const date = transaction?.createdAt || transaction?.date
      if (!date) return false
      const txnDate = new Date(date)
      return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear
    })
    .filter((transaction) => transaction?.direction === 'out' || ['withdrawal', 'payment', 'fee'].includes(String(transaction?.type || '').toLowerCase()))
    .reduce((sum, transaction) => sum + (Number(transaction?.amount) || 0), 0)

  return [
    {
      label: 'Account Balance',
      value: totalBalance,
      displayValue: totalBalance,
      change: `${accounts.length} account${accounts.length === 1 ? '' : 's'}`,
    },
    {
      label: 'Active Loans',
      value: activeLoans,
      displayValue: String(activeLoans),
      change: `${loans.length} total`,
    },
    {
      label: 'Savings Goals',
      value: savingsCount,
      displayValue: String(savingsCount),
      change: `${savingsGoals.length} tracked`,
    },
    {
      label: 'Monthly Expenses',
      value: monthlyExpenses,
      displayValue: monthlyExpenses,
      change: alerts.length > 0 ? `${alerts.length} alert${alerts.length === 1 ? '' : 's'}` : `${tickets} open ticket${tickets === 1 ? '' : 's'}`,
    },
  ]
}

export const useDashboardData = () => {
  const [stats, setStats] = useState([])
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [alerts, setAlerts] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [loans, setLoans] = useState([])
  const [overview, setOverview] = useState({
    activeAccounts: 0,
    openTickets: 0,
    pendingAlerts: 0,
    kycStatus: 'not_submitted',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in to view dashboard data.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetchDashboard()
      const dashData = response?.data || response

      const nextAccounts = (dashData?.accounts || []).map(normalizeAccount)
      const ownAccountIds = new Set(nextAccounts.map((account) => String(account.id)))
      const nextTransactions = (dashData?.transactions || []).map((transaction) => normalizeTransaction(transaction, ownAccountIds))
      const nextSavingsGoals = (dashData?.savingsGoals || []).map(normalizeGoal)
      const nextLoans = (dashData?.loans || []).map(normalizeLoan)
      const nextAlerts = (dashData?.alerts || []).map(normalizeAlert)
      const nextOverview = {
        activeAccounts: Number(dashData?.stats?.activeAccounts) || nextAccounts.filter((account) => account.status === 'active').length,
        openTickets: Number(dashData?.stats?.openTickets) || (dashData?.recentTickets || []).length,
        pendingAlerts: Number(dashData?.stats?.pendingAlerts) || nextAlerts.length,
        kycStatus: dashData?.stats?.kycStatus || 'not_submitted',
      }

      setAccounts(nextAccounts)
      setTransactions(nextTransactions)
      setSavingsGoals(nextSavingsGoals)
      setLoans(nextLoans)
      setAlerts(nextAlerts)
      setOverview(nextOverview)
      setStats(
        buildStats({
          accounts: nextAccounts,
          loans: nextLoans,
          savingsGoals: nextSavingsGoals,
          transactions: nextTransactions,
          alerts: nextAlerts,
          tickets: nextOverview.openTickets,
        })
      )
    } catch (err) {
      setError(err?.message || 'Unable to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const dismissAlert = useCallback(
    async (alertId) => {
      const normalizedAlertId = String(alertId)
      const previousAlerts = alerts
      const nextAlerts = alerts.filter((alert) => String(alert.id) !== normalizedAlertId)

      setAlerts(nextAlerts)
      setOverview((current) => ({
        ...current,
        pendingAlerts: Math.max(0, current.pendingAlerts - 1),
      }))
      setStats((currentStats) =>
        currentStats.map((stat) =>
          stat.label === 'Monthly Expenses'
            ? {
                ...stat,
                change: nextAlerts.length > 0 ? `${nextAlerts.length} alert${nextAlerts.length === 1 ? '' : 's'}` : stat.change,
              }
            : stat
        )
      )

      try {
        await dismissDashboardAlert(normalizedAlertId)
      } catch (err) {
        console.error('Dismiss alert failed', err)
        setAlerts(previousAlerts)
        setOverview((current) => ({
          ...current,
          pendingAlerts: previousAlerts.length,
        }))
      }
    },
    [alerts]
  )

  return {
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
    refreshData: loadDashboard,
  }
}
