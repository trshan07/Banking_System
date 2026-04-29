import React from 'react'
import { FaUniversity, FaMoneyBillWave, FaPiggyBank, FaReceipt } from 'react-icons/fa'
import { formatCurrency } from '../../utils/formatters'

const statThemes = {
  'Account Balance': {
    icon: FaUniversity,
    card: 'bg-[linear-gradient(135deg,#0f2742_0%,#173d61_100%)] text-white border-[#264f73]',
    iconWrap: 'bg-white/12 text-white',
    label: 'text-slate-200',
    value: 'text-white',
    meta: 'text-slate-100/90',
  },
  'Active Loans': {
    icon: FaMoneyBillWave,
    card: 'bg-[linear-gradient(135deg,#f4fbf7_0%,#ebf7f0_100%)] text-slate-900 border-[#d2eadb]',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-emerald-700',
  },
  'Savings Goals': {
    icon: FaPiggyBank,
    card: 'bg-[linear-gradient(135deg,#fffaf0_0%,#fff1d6_100%)] text-slate-900 border-[#f1ddb1]',
    iconWrap: 'bg-amber-100 text-amber-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-amber-700',
  },
  'Monthly Expenses': {
    icon: FaReceipt,
    card: 'bg-[linear-gradient(135deg,#f8f6ff_0%,#efeaff_100%)] text-slate-900 border-[#e0d4ff]',
    iconWrap: 'bg-violet-100 text-violet-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-violet-700',
  },
}

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    )
  }

  const normalizedStats = Array.isArray(stats)
    ? stats
    : Object.entries(stats || {}).map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (char) => char.toUpperCase())
          .trim(),
        value: String(value ?? 0),
        change: '',
      }))

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {normalizedStats.map((stat, index) => {
        const theme = statThemes[stat.label] || {
          icon: FaReceipt,
          card: 'bg-white text-slate-900 border-slate-200',
          iconWrap: 'bg-slate-100 text-slate-700',
          label: 'text-slate-500',
          value: 'text-slate-900',
          meta: 'text-slate-500',
        }

        const Icon = theme.icon
        const rawValue = stat?.displayValue ?? stat?.value ?? ''
        const numericValue = typeof rawValue === 'number'
          ? rawValue
          : parseFloat(String(rawValue).replace(/[^0-9.-]+/g, ''))

        const formattedValue =
          (stat.label === 'Account Balance' || stat.label === 'Monthly Expenses') && Number.isFinite(numericValue)
            ? formatCurrency(numericValue)
            : String(rawValue)

        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-[1.65rem] border p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgba(15,23,42,0.4)] ${theme.card}`}
          >
            <div className="absolute -right-6 top-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${theme.label}`}>
                  {stat.label}
                </p>
                <p className={`mt-3 break-words text-[1.65rem] font-bold leading-tight sm:text-3xl ${theme.value}`}>
                  {formattedValue}
                </p>
                {stat.change ? (
                  <p className={`mt-4 text-sm font-medium leading-6 ${theme.meta}`}>
                    {stat.change}
                  </p>
                ) : null}
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-14 sm:w-14 ${theme.iconWrap}`}>
                <Icon className="text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
