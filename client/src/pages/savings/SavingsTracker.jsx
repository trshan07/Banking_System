import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  FaArrowUp,
  FaBullseye,
  FaChartLine,
  FaCheckCircle,
  FaExclamationCircle,
  FaMoneyBillWave,
  FaPiggyBank,
  FaPlus
} from 'react-icons/fa'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { bankingAPI, savingsAPI } from '../../services/api'
import { formatAccountNumber, formatCurrency, formatDate } from '../../utils/formatters'

const CATEGORY_OPTIONS = [
  { value: 'emergency_fund', label: 'Emergency Fund', color: 'blue', icon: '🛡️' },
  { value: 'vacation', label: 'Vacation', color: 'green', icon: '✈️' },
  { value: 'home_purchase', label: 'Home Purchase', color: 'orange', icon: '🏠' },
  { value: 'car_purchase', label: 'Car Purchase', color: 'purple', icon: '🚗' },
  { value: 'education', label: 'Education', color: 'blue', icon: '🎓' },
  { value: 'retirement', label: 'Retirement', color: 'green', icon: '🌴' },
  { value: 'wedding', label: 'Wedding', color: 'orange', icon: '💍' },
  { value: 'business', label: 'Business', color: 'purple', icon: '💼' },
  { value: 'other', label: 'Other', color: 'blue', icon: '🎯' }
]

const CATEGORY_META = CATEGORY_OPTIONS.reduce((accumulator, option) => {
  accumulator[option.value] = option
  return accumulator
}, {})

const COLOR_CLASSES = {
  blue: {
    bar: 'bg-blue-600',
    soft: 'bg-blue-100',
    text: 'text-blue-600',
    hex: '#2563eb'
  },
  green: {
    bar: 'bg-green-600',
    soft: 'bg-green-100',
    text: 'text-green-600',
    hex: '#16a34a'
  },
  purple: {
    bar: 'bg-purple-600',
    soft: 'bg-purple-100',
    text: 'text-purple-600',
    hex: '#9333ea'
  },
  orange: {
    bar: 'bg-orange-600',
    soft: 'bg-orange-100',
    text: 'text-orange-600',
    hex: '#ea580c'
  }
}

const EMPTY_GOAL_FORM = {
  goalName: '',
  targetAmount: '',
  deadline: '',
  category: 'other',
  notes: ''
}

const EMPTY_FUNDS_FORM = {
  amount: '',
  accountId: '',
  note: ''
}

const getColorClasses = (color) => COLOR_CLASSES[color] || COLOR_CLASSES.blue

const buildMilestones = (targetAmount, currentAmount) => {
  const target = Number(targetAmount) || 0
  const current = Number(currentAmount) || 0

  if (target <= 0) {
    return []
  }

  return [0.25, 0.5, 0.75, 1].map((step) => {
    const amount = Math.round(target * step)

    return {
      amount,
      achieved: current >= amount
    }
  })
}

const normalizeGoal = (goal) => {
  const category = goal?.category || 'other'
  const meta = CATEGORY_META[category] || CATEGORY_META.other
  const current = Number(goal?.currentAmount ?? goal?.current ?? 0)
  const target = Number(goal?.targetAmount ?? goal?.target ?? 0)
  const contributions = Array.isArray(goal?.contributions)
    ? goal.contributions.map((contribution, index) => ({
        id: contribution?._id || contribution?.transactionId || `${goal?._id || goal?.id}-contribution-${index}`,
        amount: Number(contribution?.amount || 0),
        date: contribution?.date,
        note: contribution?.note || 'Savings contribution'
      }))
    : []

  return {
    id: goal?._id || goal?.id,
    name: goal?.goalName || goal?.name || 'Untitled goal',
    target,
    current,
    targetDate: goal?.deadline || goal?.targetDate,
    status: goal?.status || 'active',
    category,
    categoryLabel: meta.label,
    color: meta.color,
    icon: meta.icon,
    notes: goal?.notes || '',
    contributions,
    milestones: buildMilestones(target, current)
  }
}

const flattenTransactions = (goals) => (
  goals
    .flatMap((goal) => goal.contributions.map((contribution) => ({
      id: contribution.id,
      goalId: goal.id,
      goalName: goal.name,
      goalColor: goal.color,
      amount: contribution.amount,
      date: contribution.date,
      note: contribution.note
    })))
    .sort((left, right) => new Date(right.date) - new Date(left.date))
)

const getTimeframeStart = (timeframe) => {
  if (timeframe === 'all') {
    return null
  }

  const now = new Date()

  if (timeframe === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }

  if (timeframe === 'quarter') {
    return new Date(now.getFullYear(), now.getMonth() - 2, 1)
  }

  return new Date(now.getFullYear(), 0, 1)
}

const buildTimelineData = (transactions) => {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' })
  const now = new Date()
  const buckets = []

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)

    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: formatter.format(date),
      savings: 0
    })
  }

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const bucketKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`
    const bucket = buckets.find((entry) => entry.key === bucketKey)

    if (bucket) {
      bucket.savings += Number(transaction.amount) || 0
    }
  })

  return buckets.map((entry) => ({
    month: entry.month,
    savings: entry.savings
  }))
}

const getDaysLeft = (targetDate) => {
  if (!targetDate) {
    return null
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)

  return Math.ceil((target - startOfToday) / (1000 * 60 * 60 * 24))
}

const getProgressPercentage = (current, target) => {
  if (!target) {
    return 0
  }

  return (current / target) * 100
}

const SavingsTracker = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [goals, setGoals] = useState([])
  const [accounts, setAccounts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState(null)
  const [view, setView] = useState('grid')
  const [timeframe, setTimeframe] = useState('month')
  const [goalForm, setGoalForm] = useState(EMPTY_GOAL_FORM)
  const [fundsForm, setFundsForm] = useState(EMPTY_FUNDS_FORM)
  const [submittingGoal, setSubmittingGoal] = useState(false)
  const [submittingFunds, setSubmittingFunds] = useState(false)

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) || null
  const transactions = flattenTransactions(goals)
  const timeframeStart = getTimeframeStart(timeframe)
  const filteredTransactions = timeframeStart
    ? transactions.filter((transaction) => new Date(transaction.date) >= timeframeStart)
    : transactions

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const overallProgress = totalTarget ? (totalSaved / totalTarget) * 100 : 0
  const averageGoalProgress = goals.length
    ? goals.reduce((sum, goal) => sum + getProgressPercentage(goal.current, goal.target), 0) / goals.length
    : 0
  const monthlySavings = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const monthlyData = goals.map((goal) => ({
    name: goal.name,
    saved: goal.current,
    target: goal.target
  }))
  const timelineData = buildTimelineData(transactions)
  const categoryData = Object.values(
    goals.reduce((accumulator, goal) => {
      if (!accumulator[goal.category]) {
        accumulator[goal.category] = {
          name: goal.categoryLabel,
          value: 0,
          color: getColorClasses(goal.color).hex
        }
      }

      accumulator[goal.category].value += goal.current
      return accumulator
    }, {})
  )
  const averageMonthly = timelineData.length
    ? timelineData.reduce((sum, entry) => sum + entry.savings, 0) / timelineData.length
    : 0
  const topCategory = categoryData.length
    ? [...categoryData].sort((left, right) => right.value - left.value)[0].name
    : 'No category yet'

  const loadSavingsData = async (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true)
    }

    try {
      setError('')

      const [goalsResult, accountsResult] = await Promise.allSettled([
        savingsAPI.getGoals(),
        bankingAPI.getAccounts()
      ])

      if (goalsResult.status === 'fulfilled') {
        const goalsData = goalsResult.value?.data?.data
        const nextGoals = Array.isArray(goalsData) ? goalsData.map(normalizeGoal) : []
        setGoals(nextGoals)
      } else {
        throw goalsResult.reason
      }

      if (accountsResult.status === 'fulfilled') {
        const accountsData = accountsResult.value?.data?.data
        const nextAccounts = Array.isArray(accountsData)
          ? accountsData.filter((account) => account?.status === 'active')
          : []
        setAccounts(nextAccounts)
      } else {
        setAccounts([])
      }
    } catch (requestError) {
      console.error('Failed to load savings tracker data:', requestError)
      setError(requestError.response?.data?.message || 'Failed to load savings goals.')
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavingsData()
  }, [])

  useEffect(() => {
    if (!accounts.length || fundsForm.accountId) {
      return
    }

    setFundsForm((currentForm) => ({
      ...currentForm,
      accountId: accounts[0]._id || accounts[0].id || ''
    }))
  }, [accounts, fundsForm.accountId])

  const closeCreateModal = () => {
    setShowAddModal(false)
    setGoalForm(EMPTY_GOAL_FORM)
  }

  const closeFundsModal = () => {
    setShowAddFundsModal(false)
    setSelectedGoalId(null)
    setFundsForm({
      ...EMPTY_FUNDS_FORM,
      accountId: accounts[0]?._id || accounts[0]?.id || ''
    })
  }

  const openFundsModal = (goal) => {
    setSelectedGoalId(goal.id)
    setFundsForm({
      ...EMPTY_FUNDS_FORM,
      accountId: accounts[0]?._id || accounts[0]?.id || ''
    })
    setShowAddFundsModal(true)
  }

  const handleCreateGoal = async (event) => {
    event.preventDefault()

    const trimmedName = goalForm.goalName.trim()
    const targetAmount = Number(goalForm.targetAmount)
    const deadline = new Date(goalForm.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!trimmedName) {
      toast.error('Goal name is required.')
      return
    }

    if (!targetAmount || targetAmount <= 0) {
      toast.error('Target amount must be greater than 0.')
      return
    }

    if (!goalForm.deadline || Number.isNaN(deadline.getTime()) || deadline <= today) {
      toast.error('Choose a target date after today.')
      return
    }

    try {
      setSubmittingGoal(true)

      await savingsAPI.createGoal({
        goalName: trimmedName,
        targetAmount,
        deadline: goalForm.deadline,
        category: goalForm.category,
        notes: goalForm.notes.trim() || undefined
      })

      toast.success('Savings goal created successfully.')
      closeCreateModal()
      await loadSavingsData(false)
    } catch (requestError) {
      console.error('Failed to create savings goal:', requestError)
      toast.error(requestError.response?.data?.message || 'Failed to create savings goal.')
    } finally {
      setSubmittingGoal(false)
    }
  }

  const handleAddFunds = async (event) => {
    event.preventDefault()

    if (!selectedGoal) {
      toast.error('Select a savings goal first.')
      return
    }

    const amount = Number(fundsForm.amount)

    if (!amount || amount <= 0) {
      toast.error('Contribution amount must be greater than 0.')
      return
    }

    if (!fundsForm.accountId) {
      toast.error('Select a funding account.')
      return
    }

    try {
      setSubmittingFunds(true)

      await savingsAPI.addFunds(selectedGoal.id, {
        amount,
        accountId: fundsForm.accountId,
        note: fundsForm.note.trim() || undefined
      })

      toast.success('Funds added to your savings goal.')
      closeFundsModal()
      await loadSavingsData(false)
    } catch (requestError) {
      console.error('Failed to add funds to savings goal:', requestError)
      toast.error(requestError.response?.data?.message || 'Failed to add funds to the savings goal.')
    } finally {
      setSubmittingFunds(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Savings Tracker</h1>
            <p className="mt-2 text-gray-600">Create goals, fund them from your live accounts, and track progress from the database.</p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0">
            <button
              type="button"
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              {view === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <FaPlus className="mr-2" /> New Goal
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start justify-between rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start space-x-3">
              <FaExclamationCircle className="mt-0.5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Unable to load savings data</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button type="button" onClick={() => loadSavingsData()} className="text-sm font-medium text-red-700 hover:text-red-800">
              Retry
            </button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSaved)}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <FaPiggyBank className="text-xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <FaBullseye className="text-xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <FaChartLine className="text-xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Period Savings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlySavings)}</p>
              </div>
              <div className="rounded-lg bg-orange-100 p-3">
                <FaMoneyBillWave className="text-xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Savings Progress</h3>
            <div className="h-64 min-h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                  <Legend />
                  <Bar dataKey="saved" fill="#2563eb" name="Saved" />
                  <Bar dataKey="target" fill="#94a3b8" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Contribution Timeline</h3>
            <div className="h-64 min-h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                  <Legend />
                  <Line type="monotone" dataKey="savings" stroke="#2563eb" strokeWidth={2} name="Contributions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Savings by Category</h3>
            <div className="h-64 min-h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value) || 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Average Goal Progress</span>
                  <span className="font-medium">{averageGoalProgress.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(averageGoalProgress, 100)}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-gray-500">Goals Achieved</p>
                  <p className="text-xl font-bold text-gray-900">{goals.filter((goal) => goal.current >= goal.target).length}/{goals.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Contributions</p>
                  <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Average Monthly</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(averageMonthly)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Top Category</p>
                  <p className="text-xl font-bold text-gray-900">{topCategory}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Savings Goals</h2>
            <div className="flex space-x-2">
              <select
                value={timeframe}
                onChange={(event) => setTimeframe(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {!goals.length ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-900">No savings goals yet</p>
              <p className="mt-2 text-sm text-gray-600">Create your first goal and it will be stored in the database and shown here automatically.</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const progress = getProgressPercentage(goal.current, goal.target)
                const daysLeft = getDaysLeft(goal.targetDate)
                const colors = getColorClasses(goal.color)
                const contributionCount = goal.contributions.length

                return (
                  <div key={goal.id} className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                    <div className={`h-2 ${colors.bar}`} />

                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${colors.soft}`}>
                            <span>{goal.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                            <p className="text-xs text-gray-500">{goal.categoryLabel}</p>
                          </div>
                        </div>
                        {goal.current >= goal.target && <FaCheckCircle className="text-green-600" />}
                      </div>

                      <div className="mb-4">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className={`font-semibold ${colors.text}`}>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Saved</p>
                          <p className="font-bold text-gray-900">{formatCurrency(goal.current)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Target</p>
                          <p className="font-bold text-gray-900">{formatCurrency(goal.target)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Target Date</p>
                          <p className="text-sm font-medium text-gray-900">{goal.targetDate ? formatDate(goal.targetDate) : 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Days Left</p>
                          <p className={`text-sm font-medium ${daysLeft !== null && daysLeft < 30 ? 'text-orange-600' : 'text-gray-900'}`}>
                            {daysLeft === null ? 'Not set' : daysLeft < 0 ? 'Overdue' : `${daysLeft} days`}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                          <span>Milestones</span>
                          <span>{contributionCount} contribution{contributionCount === 1 ? '' : 's'}</span>
                        </div>
                        <div className="flex space-x-1">
                          {goal.milestones.map((milestone) => (
                            <div
                              key={`${goal.id}-${milestone.amount}`}
                              className={`h-1 flex-1 rounded-full ${milestone.achieved ? colors.bar : 'bg-gray-200'}`}
                              title={formatCurrency(milestone.amount)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between border-t border-gray-200 pt-4">
                        <button
                          type="button"
                          onClick={() => openFundsModal(goal)}
                          disabled={goal.status === 'completed' || !accounts.length}
                          className="flex items-center text-sm text-primary-600 hover:text-primary-700 disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                          <FaArrowUp className="mr-1" /> Add Funds
                        </button>
                        <span className="text-sm text-gray-500">{goal.status === 'completed' ? 'Completed' : 'Live database sync'}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl bg-white shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Goal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Saved</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Target Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {goals.map((goal) => {
                    const progress = getProgressPercentage(goal.current, goal.target)
                    const colors = getColorClasses(goal.color)

                    return (
                      <tr key={goal.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <span className="mr-3 text-2xl">{goal.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{goal.name}</div>
                              <div className="text-sm text-gray-500">{goal.categoryLabel}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="w-24">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span>{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                              <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{formatCurrency(goal.current)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">{formatCurrency(goal.target)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500">{goal.targetDate ? formatDate(goal.targetDate) : 'Not set'}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => openFundsModal(goal)}
                            disabled={goal.status === 'completed' || !accounts.length}
                            className="text-primary-600 hover:text-primary-900 disabled:cursor-not-allowed disabled:text-gray-400"
                          >
                            Add Funds
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contributions</h3>
            <span className="text-sm text-gray-500">Latest database-backed activity</span>
          </div>

          {!transactions.length ? (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">No contributions recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => {
                const colors = getColorClasses(transaction.goalColor)

                return (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.soft}`}>
                        <FaArrowUp className={colors.text} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.goalName}</p>
                        <p className="text-sm text-gray-500">{transaction.note}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{formatCurrency(transaction.amount)}</p>
                      <p className="text-xs text-gray-500">{transaction.date ? formatDate(transaction.date) : 'Unknown date'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Create New Savings Goal</h3>
              <form className="space-y-4" onSubmit={handleCreateGoal}>
                <div>
                  <label className="form-label">Goal Name</label>
                  <input
                    type="text"
                    value={goalForm.goalName}
                    onChange={(event) => setGoalForm((currentForm) => ({ ...currentForm, goalName: event.target.value }))}
                    className="input-field"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div>
                  <label className="form-label">Target Amount</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={goalForm.targetAmount}
                    onChange={(event) => setGoalForm((currentForm) => ({ ...currentForm, targetAmount: event.target.value }))}
                    className="input-field"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="form-label">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.deadline}
                    onChange={(event) => setGoalForm((currentForm) => ({ ...currentForm, deadline: event.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={goalForm.category}
                    onChange={(event) => setGoalForm((currentForm) => ({ ...currentForm, category: event.target.value }))}
                    className="input-field"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Notes</label>
                  <textarea
                    value={goalForm.notes}
                    onChange={(event) => setGoalForm((currentForm) => ({ ...currentForm, notes: event.target.value }))}
                    className="input-field min-h-24"
                    placeholder="Optional note about this goal"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={closeCreateModal} className="btn-secondary flex-1" disabled={submittingGoal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={submittingGoal}>
                    {submittingGoal ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddFundsModal && selectedGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Add Funds to {selectedGoal.name}</h3>
              <form className="space-y-4" onSubmit={handleAddFunds}>
                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={fundsForm.amount}
                    onChange={(event) => setFundsForm((currentForm) => ({ ...currentForm, amount: event.target.value }))}
                    className="input-field"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="form-label">From Account</label>
                  <select
                    value={fundsForm.accountId}
                    onChange={(event) => setFundsForm((currentForm) => ({ ...currentForm, accountId: event.target.value }))}
                    className="input-field"
                    disabled={!accounts.length}
                  >
                    {!accounts.length ? (
                      <option value="">No active funding accounts</option>
                    ) : (
                      accounts.map((account) => (
                        <option key={account._id || account.id} value={account._id || account.id}>
                          {`${String(account.accountType || 'account').replace(/^./, (character) => character.toUpperCase())} • ${formatAccountNumber(account.accountNumber || account.id || '0000')} • ${formatCurrency(Number(account.balance) || 0, account.currency || 'LKR')}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="form-label">Note</label>
                  <input
                    type="text"
                    value={fundsForm.note}
                    onChange={(event) => setFundsForm((currentForm) => ({ ...currentForm, note: event.target.value }))}
                    className="input-field"
                    placeholder="e.g., Monthly savings"
                  />
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-800">Current progress: {formatCurrency(selectedGoal.current)} / {formatCurrency(selectedGoal.target)}</p>
                  <p className="mt-1 text-sm text-blue-800">Remaining to target: {formatCurrency(Math.max(selectedGoal.target - selectedGoal.current, 0))}</p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={closeFundsModal} className="btn-secondary flex-1" disabled={submittingFunds}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={submittingFunds || !accounts.length}>
                    {submittingFunds ? 'Adding...' : 'Add Funds'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavingsTracker
