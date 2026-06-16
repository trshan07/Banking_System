import React from 'react'
import { Link } from 'react-router-dom'
import { FaBell, FaSearch, FaSyncAlt } from 'react-icons/fa'

const CustomerDashboardHeader = ({
  firstName,
  user,
  searchValue,
  onSearchChange,
  onRefresh,
  notificationCount = 0,
  lastSyncedAt,
}) => {
  const isAvatarImage = typeof user?.avatar === 'string' && /^https?:\/\//i.test(user.avatar)
  const initials = (user?.name || firstName || 'Customer')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            Customer Dashboard
          </span>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your banking overview, latest transactions, savings, loans, and support updates are all in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center rounded-xl bg-[#173d61] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#102d49]"
            >
              <FaSyncAlt className="mr-2 text-xs" />
              Refresh Dashboard
            </button>
            {lastSyncedAt ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                Last updated {lastSyncedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                Live data from your banking profile
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-[520px] rounded-[1.5rem] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fc_100%)] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search anything..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-[#173d61]/10"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                aria-label="Notifications"
              >
                <FaBell />
                {notificationCount > 0 ? (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                ) : null}
              </button>

              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#173d61] text-sm font-semibold text-white">
                  {isAvatarImage ? (
                    <img src={user.avatar} alt={user?.name || firstName} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="pr-2">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || `${firstName} User`}</p>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerDashboardHeader
