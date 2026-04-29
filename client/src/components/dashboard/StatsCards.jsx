import React from 'react'
import { FaUniversity, FaMoneyBillWave, FaPiggyBank, FaReceipt } from 'react-icons/fa'
import { formatCurrency } from '../../utils/formatters'

const statThemes = {
  'Account Balance': {
    panel: 'from-[#0f2742] via-[#16385d] to-[#1e5a83] text-white border-[#295b82]/50',
    iconWrap: 'bg-white/12 text-white',
    label: 'text-slate-200',
    value: 'text-white',
    change: 'text-slate-200',
  },
  'Active Loans': {
    panel: 'from-[#f5fbf8] to-[#edf8f2] text-slate-900 border-[#cde9d6]',
    iconWrap: 'bg-[#dff3e6] text-[#1c7c54]',
    label: 'text-slate-500',
    value: 'text-slate-900',
    change: 'text-[#1c7c54]',
  },
  'Savings Goals': {
    panel: 'from-[#fff8ec] to-[#fff3d8] text-slate-900 border-[#f4dfae]',
    iconWrap: 'bg-[#ffe5a8] text-[#9a6700]',
    label: 'text-slate-500',
    value: 'text-slate-900',
    change: 'text-[#9a6700]',
  },
  'Monthly Expenses': {
    panel: 'from-[#faf5ff] to-[#f4ecff] text-slate-900 border-[#e5d5ff]',
    iconWrap: 'bg-[#e7d8ff] text-[#6c3dd1]',
    label: 'text-slate-500',
    value: 'text-slate-900',
    change: 'text-[#6c3dd1]',
  },
}

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const getIcon = (label) => {
    switch (label) {
      case 'Account Balance': return FaUniversity
      case 'Active Loans': return FaMoneyBillWave
      case 'Savings Goals': return FaPiggyBank
      case 'Monthly Expenses': return FaReceipt
      default: return FaReceipt
    }
  }

  const normalizedStats = Array.isArray(stats)
    ? stats
    : Object.entries(stats || {}).map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (char) => char.toUpperCase())
          .trim(),
        value: String(value ?? 0),
        change: ''
      }))

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {normalizedStats.map((stat, index) => {
        const Icon = getIcon(stat.label)
        const theme = statThemes[stat.label] || {
          panel: 'from-white to-white text-slate-900 border-slate-200',
          iconWrap: 'bg-slate-100 text-slate-700',
          label: 'text-slate-500',
          value: 'text-slate-900',
          change: 'text-slate-500',
        }
        
        // Extract numeric value for formatting if needed
        const rawValue = stat?.displayValue ?? stat?.value ?? ''
        const numericValue = typeof rawValue === 'number'
          ? rawValue
          : parseFloat(String(rawValue).replace(/[^0-9.-]+/g, ''))
        
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.panel}`}
          >
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.label}`}>{stat.label}</p>
                <p className={`mt-3 text-3xl font-bold tracking-tight ${theme.value}`}>
                  {stat.label === 'Account Balance' && Number.isFinite(numericValue)
                    ? formatCurrency(numericValue)
                    : stat.label === 'Monthly Expenses' && Number.isFinite(numericValue)
                    ? formatCurrency(numericValue)
                    : String(rawValue)}
                </p>
                {stat.change ? (
                  <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${theme.change} bg-white/10`}>
                    {stat.change}
                  </p>
                ) : null}
              </div>
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${theme.iconWrap} shadow-sm`}>
                <Icon className="text-2xl" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
