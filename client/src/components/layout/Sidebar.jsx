import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaBolt,
  FaChartBar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHeadset,
  FaHome,
  FaMoneyBillWave,
  FaPiggyBank,
  FaRedoAlt,
  FaTasks,
  FaThLarge,
  FaUniversity,
  FaUserCheck,
} from 'react-icons/fa'
import { useSidebarData } from '../../hooks/useSidebarData'
import LoadingSpinner from '../common/LoadingSpinner'

const itemThemeMap = {
  dashboard: {
    icon: FaHome,
    iconClass: 'bg-slate-100 text-slate-700',
    accentClass: 'bg-slate-600',
  },
  'apply-loan': {
    icon: FaMoneyBillWave,
    iconClass: 'bg-emerald-100 text-emerald-700',
    accentClass: 'bg-emerald-500',
  },
  'loan-status': {
    icon: FaTasks,
    iconClass: 'bg-teal-100 text-teal-700',
    accentClass: 'bg-teal-500',
  },
  accounts: {
    icon: FaUniversity,
    iconClass: 'bg-sky-100 text-sky-700',
    accentClass: 'bg-sky-500',
  },
  'transfer-funds': {
    icon: FaMoneyBillWave,
    iconClass: 'bg-indigo-100 text-indigo-700',
    accentClass: 'bg-indigo-500',
  },
  transfer: {
    icon: FaMoneyBillWave,
    iconClass: 'bg-indigo-100 text-indigo-700',
    accentClass: 'bg-indigo-500',
  },
  transactions: {
    icon: FaChartBar,
    iconClass: 'bg-amber-100 text-amber-700',
    accentClass: 'bg-amber-500',
  },
  savings: {
    icon: FaPiggyBank,
    iconClass: 'bg-yellow-100 text-yellow-700',
    accentClass: 'bg-yellow-500',
  },
  'support-tickets': {
    icon: FaHeadset,
    iconClass: 'bg-rose-100 text-rose-700',
    accentClass: 'bg-rose-500',
  },
  support: {
    icon: FaHeadset,
    iconClass: 'bg-rose-100 text-rose-700',
    accentClass: 'bg-rose-500',
  },
  'report-fraud': {
    icon: FaExclamationTriangle,
    iconClass: 'bg-red-100 text-red-700',
    accentClass: 'bg-red-500',
  },
  'kyc-verification': {
    icon: FaUserCheck,
    iconClass: 'bg-cyan-100 text-cyan-700',
    accentClass: 'bg-cyan-500',
  },
}

const getItemTheme = (itemId) =>
  itemThemeMap[itemId] || {
    icon: FaBolt,
    iconClass: 'bg-slate-100 text-slate-700',
    accentClass: 'bg-slate-500',
  }

const Sidebar = ({
  title = 'Helpful customer services',
  subtitle = 'Open every major customer area from one friendly dashboard panel, with live banking status from the backend.',
  compact = false,
}) => {
  const { items, loading, error, actionLoading, refreshSidebar, invokeSidebarAction } = useSidebarData()
  const navigate = useNavigate()
  const visibleItems = compact ? items.slice(0, 6) : items

  const handleAction = async (actionId) => {
    try {
      const result = await invokeSidebarAction(actionId)
      if (result?.redirectTo) {
        navigate(result.redirectTo)
      }
    } catch (error) {
      console.error('Sidebar action failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <aside className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_55%,#eef6ff_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Help Center
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[300px]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Shortcuts
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{items.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Layout
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {compact ? 'Compact' : 'Flexible'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {actionLoading ? 'Working...' : 'Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              <FaThLarge className="mr-2 text-[10px]" /> Smart actions
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <FaHeadset className="mr-2 text-[10px]" /> Support ready
            </span>
          </div>
          <button
            type="button"
            onClick={refreshSidebar}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#173d61] transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#102d49]"
            disabled={loading || actionLoading}
          >
            <FaRedoAlt className="mr-2 text-xs" /> Refresh shortcuts
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {visibleItems.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
              <FaBolt />
            </div>
            <p className="mt-4 font-medium text-slate-900">No shortcuts available right now</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Refresh this panel later and your most relevant banking actions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(135deg,#173d61_0%,#245b86_100%)] px-5 py-5 text-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
                    Customer hub
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">Everything in one place</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-100/90">
                    The same areas from your sidebar are available here as dashboard cards, with live counts and current status from your account data.
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-slate-100">
                  <FaCheckCircle className="mr-2 text-xs" /> Backend connected
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item) => {
                const theme = getItemTheme(item.id)
                const ItemIcon = theme.icon

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAction(item.id)}
                    className="group w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                    disabled={actionLoading}
                  >
                    <div className={`mb-4 h-1.5 w-16 rounded-full ${theme.accentClass}`} />
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${theme.iconClass}`}>
                        <ItemIcon className="text-lg" />
                      </div>
                      {item.tag ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#173d61]">
                          {item.tag}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 min-w-0">
                      <p className="break-words text-lg font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          Current status
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                          {item.metric || 'Available'}
                        </p>
                      </div>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:translate-x-1">
                        <FaArrowRight className="text-[10px]" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {compact && items.length > visibleItems.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                {items.length - visibleItems.length} more service item{items.length - visibleItems.length === 1 ? '' : 's'} available.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
