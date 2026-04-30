import React from 'react'
import { Link } from 'react-router-dom'
import { FaBullseye, FaPiggyBank, FaPlus } from 'react-icons/fa'
import { formatCurrency, formatDate } from '../../utils/formatters'

const SavingsGoals = ({ goals, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#fff8eb_100%)] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Savings</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Savings Goals</h2>
            </div>
            <Link
              to="/dashboard/savings"
              className="inline-flex items-center justify-center rounded-full bg-[#173d61] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#102d49] sm:justify-start"
            >
              <FaPlus className="mr-2 text-xs" /> Create Goal
            </Link>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <FaBullseye className="mx-auto text-3xl text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No active savings goals yet</p>
            <p className="mt-2 text-sm text-slate-500">Create a goal to track progress toward an emergency fund, trip, or major purchase.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalSaved = goals.reduce((sum, goal) => sum + (Number(goal.current ?? goal.currentAmount) || 0), 0)
  const totalTarget = goals.reduce((sum, goal) => sum + (Number(goal.target ?? goal.targetAmount) || 0), 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#fff8eb_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Savings</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Savings Goals</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track progress clearly and keep your funding goals moving.
            </p>
          </div>
          <Link
            to="/dashboard/savings"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:justify-start"
          >
            <FaPlus className="mr-2 text-xs" /> New Goal
          </Link>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5 grid gap-3 lg:grid-cols-3">
          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#fff9ef_0%,#fff4dd_100%)] p-5 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Overall Progress</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{Math.min(overallProgress, 100).toFixed(1)}%</p>
              </div>
              <div className="text-sm leading-6 text-slate-600">
                {formatCurrency(totalSaved)} saved of {formatCurrency(totalTarget)}
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#d97706_0%,#f59e0b_100%)] transition-all duration-500"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Active Goals</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{goals.length}</p>
            <p className="mt-2 text-sm text-slate-500">Savings goals currently being tracked.</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const currentAmount = Number(goal.current ?? goal.currentAmount) || 0
            const targetAmount = Number(goal.target ?? goal.targetAmount) || 0
            const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0

            return (
              <div key={goal.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <FaPiggyBank />
                    </div>
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-900">{goal.name || goal.goalName}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Target: {goal.targetDate ? formatDate(goal.targetDate) : 'No deadline'}
                      </p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                    {progress.toFixed(0)}%
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-slate-500">Progress</span>
                    <span className="break-words font-semibold text-slate-900">
                      {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-emerald-500' : 'bg-[linear-gradient(90deg,#173d61_0%,#2a6ea5_100%)]'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to="/dashboard/savings" className="rounded-full bg-[#173d61] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#102d49]">
                    Add Funds
                  </Link>
                  <Link to="/dashboard/savings" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                    Manage
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <Link
          to="/dashboard/savings"
          className="mt-5 block border-t border-slate-200 pt-4 text-center text-sm font-semibold text-[#173d61] transition hover:text-[#102d49]"
        >
          View All Savings Goals
        </Link>
      </div>
    </div>
  )
}

export default SavingsGoals
