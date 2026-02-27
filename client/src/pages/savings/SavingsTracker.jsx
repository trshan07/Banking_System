import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaPiggyBank, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaBullseye,  // Changed from FaTarget to FaBullseye
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaBell,
  FaCog,
  FaChartPie,
  FaChartBar,
  FaDownload,
  FaEye,
  FaFilter,
  FaSearch,
  FaTimes,
  FaCheck,
  FaExclamationCircle,
  FaInfoCircle
} from 'react-icons/fa'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { formatCurrency, formatDate } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const SavingsTracker = () => {
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState([])
  const [transactions, setTransactions] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [view, setView] = useState('grid') // grid or list
  const [timeframe, setTimeframe] = useState('month')

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setGoals([
        {
          id: 1,
          name: 'Emergency Fund',
          target: 10000,
          current: 7500,
          targetDate: '2024-12-31',
          status: 'active',
          color: 'blue',
          icon: '🛡️',
          category: 'Safety',
          priority: 'high',
          contributions: [
            { date: '2024-02-01', amount: 500 },
            { date: '2024-01-15', amount: 1000 },
            { date: '2024-01-01', amount: 500 },
            { date: '2023-12-15', amount: 500 },
            { date: '2023-12-01', amount: 500 }
          ],
          milestones: [
            { amount: 2500, achieved: true, date: '2023-12-15' },
            { amount: 5000, achieved: true, date: '2024-01-15' },
            { amount: 7500, achieved: true, date: '2024-02-01' },
            { amount: 10000, achieved: false }
          ]
        },
        {
          id: 2,
          name: 'Vacation Fund',
          target: 5000,
          current: 2300,
          targetDate: '2024-08-31',
          status: 'active',
          color: 'green',
          icon: '✈️',
          category: 'Travel',
          priority: 'medium',
          contributions: [
            { date: '2024-02-10', amount: 300 },
            { date: '2024-01-25', amount: 200 },
            { date: '2024-01-10', amount: 500 },
            { date: '2023-12-20', amount: 300 }
          ],
          milestones: [
            { amount: 1000, achieved: true, date: '2024-01-10' },
            { amount: 2000, achieved: true, date: '2024-01-25' },
            { amount: 3000, achieved: false },
            { amount: 5000, achieved: false }
          ]
        },
        {
          id: 3,
          name: 'New Car',
          target: 15000,
          current: 4500,
          targetDate: '2025-06-30',
          status: 'active',
          color: 'purple',
          icon: '🚗',
          category: 'Vehicle',
          priority: 'low',
          contributions: [
            { date: '2024-02-05', amount: 1000 },
            { date: '2024-01-20', amount: 500 },
            { date: '2024-01-05', amount: 1000 }
          ],
          milestones: [
            { amount: 5000, achieved: false },
            { amount: 10000, achieved: false },
            { amount: 15000, achieved: false }
          ]
        },
        {
          id: 4,
          name: 'Home Down Payment',
          target: 50000,
          current: 12500,
          targetDate: '2025-12-31',
          status: 'active',
          color: 'orange',
          icon: '🏠',
          category: 'Home',
          priority: 'high',
          contributions: [
            { date: '2024-02-15', amount: 2000 },
            { date: '2024-02-01', amount: 1500 },
            { date: '2024-01-15', amount: 1000 }
          ],
          milestones: [
            { amount: 10000, achieved: true, date: '2024-02-01' },
            { amount: 25000, achieved: false },
            { amount: 50000, achieved: false }
          ]
        }
      ])

      setTransactions([
        { id: 1, goalId: 1, date: '2024-02-15', amount: 500, type: 'contribution', note: 'Monthly savings' },
        { id: 2, goalId: 4, date: '2024-02-15', amount: 2000, type: 'contribution', note: 'Bonus deposit' },
        { id: 3, goalId: 2, date: '2024-02-10', amount: 300, type: 'contribution', note: 'Weekly transfer' },
        { id: 4, goalId: 3, date: '2024-02-05', amount: 1000, type: 'contribution', note: 'Savings' },
        { id: 5, goalId: 1, date: '2024-02-01', amount: 500, type: 'contribution', note: 'Monthly savings' },
        { id: 6, goalId: 4, date: '2024-02-01', amount: 1500, type: 'contribution', note: 'Regular deposit' },
        { id: 7, goalId: 1, date: '2024-01-15', amount: 1000, type: 'contribution', note: 'Bonus' }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const overallProgress = (totalSaved / totalTarget) * 100

  // Prepare chart data
  const monthlyData = goals.map(goal => ({
    name: goal.name,
    saved: goal.current,
    target: goal.target,
    progress: (goal.current / goal.target) * 100
  }))

  const timelineData = [
    { month: 'Jan', savings: 2500 },
    { month: 'Feb', savings: 3800 },
    { month: 'Mar', savings: 4200 },
    { month: 'Apr', savings: 5100 },
    { month: 'May', savings: 5800 },
    { month: 'Jun', savings: 6400 }
  ]

  const categoryData = [
    { name: 'Safety', value: 7500 },
    { name: 'Travel', value: 2300 },
    { name: 'Vehicle', value: 4500 },
    { name: 'Home', value: 12500 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

  const getProgressColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-600'
      case 'green': return 'bg-green-600'
      case 'purple': return 'bg-purple-600'
      case 'orange': return 'bg-orange-600'
      default: return 'bg-primary-600'
    }
  }

  const getProgressBgColor = (color) => {
    switch(color) {
      case 'blue': return 'bg-blue-100'
      case 'green': return 'bg-green-100'
      case 'purple': return 'bg-purple-100'
      case 'orange': return 'bg-orange-100'
      default: return 'bg-primary-100'
    }
  }

  const getTextColor = (color) => {
    switch(color) {
      case 'blue': return 'text-blue-600'
      case 'green': return 'text-green-600'
      case 'purple': return 'text-purple-600'
      case 'orange': return 'text-orange-600'
      default: return 'text-primary-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Savings Tracker</h1>
            <p className="text-gray-600 mt-2">Track and manage your savings goals</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {view === 'grid' ? 'List View' : 'Grid View'}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <FaPlus className="mr-2" /> New Goal
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSaved)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaPiggyBank className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBullseye className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Savings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(6400)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaMoneyBillWave className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="saved" fill="#3b82f6" name="Saved" />
                  <Bar dataKey="target" fill="#94a3b8" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Timeline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Average Goal Progress</span>
                  <span className="font-medium">{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: `${overallProgress}%` }} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-gray-500">Goals Achieved</p>
                  <p className="text-xl font-bold text-gray-900">
                    {goals.filter(g => g.current >= g.target).length}/{goals.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Transactions</p>
                  <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Average Monthly</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(2100)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Top Category</p>
                  <p className="text-xl font-bold text-gray-900">Home</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Savings Goals</h2>
            <div className="flex space-x-2">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100
                const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
                
                return (
                  <div
                    key={goal.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Header */}
                    <div className={`h-2 ${getProgressColor(goal.color)}`} />
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getProgressBgColor(goal.color)}`}>
                            <span>{goal.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                            <p className="text-xs text-gray-500">{goal.category}</p>
                          </div>
                        </div>
                        {goal.current >= goal.target && (
                          <FaCheckCircle className="text-green-600" />
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className={`font-semibold ${getTextColor(goal.color)}`}>
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(goal.color)} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
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
                          <p className="text-sm font-medium text-gray-900">{formatDate(goal.targetDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Days Left</p>
                          <p className={`text-sm font-medium ${daysLeft < 30 ? 'text-orange-600' : 'text-gray-900'}`}>
                            {daysLeft} days
                          </p>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Milestones</p>
                        <div className="flex space-x-1">
                          {goal.milestones.map((milestone, index) => (
                            <div
                              key={index}
                              className={`flex-1 h-1 rounded-full ${
                                milestone.achieved ? getProgressColor(goal.color) : 'bg-gray-200'
                              }`}
                              title={`$${milestone.amount.toLocaleString()}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setSelectedGoal(goal)
                            setShowAddFundsModal(true)
                          }}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          <FaArrowUp className="mr-1" /> Add Funds
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center">
                          <FaHistory className="mr-1" /> History
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-700 flex items-center">
                          <FaCog className="mr-1" /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // List View
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goals.map((goal) => (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{goal.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{goal.name}</div>
                            <div className="text-sm text-gray-500">{goal.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(goal.color)} rounded-full`}
                              style={{ width: `${(goal.current / goal.target) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {formatCurrency(goal.current)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {formatCurrency(goal.target)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {formatDate(goal.targetDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          Add
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contributions</h3>
            <Link to="/dashboard/savings/history" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => {
              const goal = goals.find(g => g.id === transaction.goalId)
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getProgressBgColor(goal?.color)}`}>
                      <FaArrowUp className={getTextColor(goal?.color)} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{goal?.name}</p>
                      <p className="text-sm text-gray-500">{transaction.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{formatCurrency(transaction.amount)}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add Goal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Savings Goal</h3>
              <form className="space-y-4">
                <div>
                  <label className="form-label">Goal Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                <div>
                  <label className="form-label">Target Amount</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="form-label">Target Date</label>
                  <input 
                    type="date" 
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="input-field">
                    <option>Safety</option>
                    <option>Travel</option>
                    <option>Vehicle</option>
                    <option>Home</option>
                    <option>Education</option>
                    <option>Retirement</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Color Theme</label>
                  <div className="flex space-x-2">
                    {['blue', 'green', 'purple', 'orange'].map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 hover:ring-${color}-500`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Funds Modal */}
        {showAddFundsModal && selectedGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add Funds to {selectedGoal.name}</h3>
              <form className="space-y-4">
                <div>
                  <label className="form-label">Amount</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="form-label">From Account</label>
                  <select className="input-field">
                    <option>Main Checking (****1234)</option>
                    <option>Savings Account (****5678)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Note (Optional)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g., Monthly savings"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Current progress: {formatCurrency(selectedGoal.current)} / {formatCurrency(selectedGoal.target)}
                  </p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddFundsModal(false)
                      setSelectedGoal(null)
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Funds
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