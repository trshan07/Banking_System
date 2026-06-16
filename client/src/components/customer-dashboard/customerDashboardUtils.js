import { formatCurrency } from '../../utils/formatters'

const getDateKey = (date) => {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return null
  return value.toISOString().slice(0, 10)
}

const getDisplayLabel = (date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date))

const getTransactionDirection = (transaction) => {
  const type = String(transaction?.type || '').toLowerCase()
  const direction = String(transaction?.direction || '').toLowerCase()

  if (direction === 'in' || type === 'deposit') return 'in'
  if (direction === 'out' || ['withdrawal', 'payment', 'fee'].includes(type)) return 'out'
  return 'neutral'
}

export const buildCustomerKpis = ({ accounts = [], transactions = [], savingsGoals = [], loans = [], alerts = [], overview = {} }) => {
  const totalBalance = accounts.reduce((sum, account) => sum + (Number(account?.balance) || 0), 0)
  const savingsTotal = savingsGoals.reduce(
    (sum, goal) => sum + (Number(goal?.currentAmount ?? goal?.current) || 0),
    0
  )
  const activeLoans = loans.filter((loan) =>
    ['pending', 'approved', 'active', 'disbursed'].includes(String(loan?.status || '').toLowerCase())
  )
  const monthlyOutgoing = transactions
    .filter((transaction) => {
      const date = transaction?.createdAt || transaction?.date
      if (!date) return false

      const txnDate = new Date(date)
      const today = new Date()
      return txnDate.getMonth() === today.getMonth() && txnDate.getFullYear() === today.getFullYear()
    })
    .filter((transaction) => getTransactionDirection(transaction) === 'out')
    .reduce((sum, transaction) => sum + (Number(transaction?.amount) || 0), 0)

  return [
    {
      key: 'balance',
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      note: `${accounts.length} account${accounts.length === 1 ? '' : 's'} available`,
      tone: 'sky',
    },
    {
      key: 'spending',
      title: 'This Month',
      value: formatCurrency(monthlyOutgoing),
      note: 'Outgoing spend across your recent activity',
      tone: 'amber',
    },
    {
      key: 'savings',
      title: 'Savings',
      value: formatCurrency(savingsTotal),
      note: `${savingsGoals.length} goal${savingsGoals.length === 1 ? '' : 's'} in progress`,
      tone: 'emerald',
    },
    {
      key: 'loans',
      title: 'Active Loans',
      value: String(activeLoans.length),
      note:
        activeLoans.length > 0
          ? `${formatCurrency(
              activeLoans.reduce((sum, loan) => sum + (Number(loan?.remainingAmount) || 0), 0)
            )} remaining`
          : 'No active loans',
      tone: 'violet',
    },
    {
      key: 'tickets',
      title: 'Open Tickets',
      value: String(Number(overview.openTickets) || alerts.length || 0),
      note:
        Number(overview.openTickets) > 0
          ? 'Support is still working through your requests'
          : 'No open support requests',
      tone: 'rose',
    },
    {
      key: 'kyc',
      title: 'KYC Status',
      value: String(overview.kycStatus || 'not submitted').replace(/_/g, ' '),
      note: 'Keep your profile current for smooth banking',
      tone: 'slate',
    },
  ]
}

export const buildTrendData = (transactions = []) => {
  const sortedTransactions = [...transactions].filter((transaction) => transaction?.date || transaction?.createdAt)
  const sourceDates = sortedTransactions
    .map((transaction) => new Date(transaction?.date || transaction?.createdAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a)

  const referenceDate = sourceDates[0] || new Date()
  const dateMap = new Map()

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(referenceDate)
    date.setDate(referenceDate.getDate() - offset)
    const key = getDateKey(date)

    if (!key) continue

    dateMap.set(key, {
      key,
      label: getDisplayLabel(date),
      incoming: 0,
      outgoing: 0,
    })
  }

  sortedTransactions.forEach((transaction) => {
    const dateKey = getDateKey(transaction?.date || transaction?.createdAt)
    if (!dateKey || !dateMap.has(dateKey)) return

    const row = dateMap.get(dateKey)
    const amount = Number(transaction?.amount) || 0

    if (getTransactionDirection(transaction) === 'in') {
      row.incoming += amount
    } else if (getTransactionDirection(transaction) === 'out') {
      row.outgoing += amount
    }
  })

  return Array.from(dateMap.values())
}

export const buildLoanStatusBreakdown = (loans = []) => {
  const buckets = [
    { key: 'pending', name: 'Pending', color: '#f59e0b', value: 0 },
    { key: 'approved', name: 'Approved', color: '#16a34a', value: 0 },
    { key: 'active', name: 'Active', color: '#2563eb', value: 0 },
    { key: 'rejected', name: 'Rejected', color: '#ef4444', value: 0 },
  ]

  loans.forEach((loan) => {
    const status = String(loan?.status || '').toLowerCase()

    if (status === 'disbursed') {
      const activeBucket = buckets.find((bucket) => bucket.key === 'active')
      if (activeBucket) activeBucket.value += 1
      return
    }

    const bucket = buckets.find((item) => item.key === status)
    if (bucket) {
      bucket.value += 1
    }
  })

  return buckets.filter((bucket) => bucket.value > 0)
}

export const getCustomerLastSyncedAt = ({ transactions = [], alerts = [] }) => {
  const timestamps = [...transactions, ...alerts]
    .map((item) => new Date(item?.createdAt || item?.date))
    .filter((date) => !Number.isNaN(date.getTime()))

  if (timestamps.length === 0) return null

  return timestamps.sort((a, b) => b - a)[0]
}
