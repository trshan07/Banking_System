import React from 'react'
import { Link } from 'react-router-dom'
import { FaPiggyBank, FaPlus } from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'

const SavingsGoals = ({ goals, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const overallProgress = (totalSaved / totalTarget) * 100

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Savings Goals</h2>
        <Link
          to="/dashboard/savings/create"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
        >
          <FaPlus className="mr-1 text-xs" /> New Goal
        </Link>
      </div>

      {/* Overall Progress */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(totalSaved)} / {formatCurrency(totalTarget)}
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          
          return (
            <div key={goal.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <FaPiggyBank className="text-primary-600" />
                  <span className="font-medium text-gray-900">{goal.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </span>
              </div>
              
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress >= 100 ? 'bg-green-600' : 'bg-primary-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    Target: {goal.targetDate ? formatDate(goal.targetDate) : 'No deadline'}
                  </span>
                  <span className="text-xs font-medium text-primary-600">
                    {progress.toFixed(1)}% achieved
                  </span>
                </div>
              </div>

              {/* Quick actions on hover */}
              <div className="hidden group-hover:flex items-center space-x-2 mt-2">
                <button className="text-xs text-primary-600 hover:underline">Add Funds</button>
                <button className="text-xs text-primary-600 hover:underline">Edit</button>
                <Link to={`/dashboard/savings/${goal.id}`} className="text-xs text-primary-600 hover:underline">
                  Details
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <Link
        to="/dashboard/savings"
        className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 pt-4 border-t border-gray-200"
      >
        View All Savings Goals
      </Link>
    </div>
  )
}

export default SavingsGoals