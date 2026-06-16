import React from 'react'
import {
  FaChartLine,
  FaHeadset,
  FaPiggyBank,
  FaShieldAlt,
  FaUniversity,
  FaWallet,
} from 'react-icons/fa'

const toneStyles = {
  sky: {
    card: 'bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_100%)] border-[#d9e7ff]',
    iconWrap: 'bg-sky-100 text-sky-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-slate-500',
    icon: FaUniversity,
  },
  amber: {
    card: 'bg-[linear-gradient(135deg,#fffaf0_0%,#fff2da_100%)] border-[#f2dfb3]',
    iconWrap: 'bg-amber-100 text-amber-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-slate-500',
    icon: FaChartLine,
  },
  emerald: {
    card: 'bg-[linear-gradient(135deg,#f4fbf7_0%,#e8f7ef_100%)] border-[#d0ead8]',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-slate-500',
    icon: FaPiggyBank,
  },
  violet: {
    card: 'bg-[linear-gradient(135deg,#f8f6ff_0%,#efeaff_100%)] border-[#ded4ff]',
    iconWrap: 'bg-violet-100 text-violet-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-slate-500',
    icon: FaWallet,
  },
  rose: {
    card: 'bg-[linear-gradient(135deg,#fff6f6_0%,#ffecec_100%)] border-[#ffd5d5]',
    iconWrap: 'bg-rose-100 text-rose-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-slate-500',
    icon: FaHeadset,
  },
  slate: {
    card: 'bg-[linear-gradient(135deg,#f8fafc_0%,#eef2f7_100%)] border-[#dbe3ed]',
    iconWrap: 'bg-slate-100 text-slate-700',
    label: 'text-slate-500',
    value: 'text-slate-900',
    meta: 'text-slate-500',
    icon: FaShieldAlt,
  },
}

const CustomerKpiGrid = ({ cards = [] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const theme = toneStyles[card.tone] || toneStyles.slate
        const Icon = theme.icon

        return (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-[1.65rem] border p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgba(15,23,42,0.4)] ${theme.card}`}
          >
            <div className="absolute -right-6 top-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${theme.label}`}>
                  {card.title}
                </p>
                <p className={`mt-3 break-words text-[1.65rem] font-bold leading-tight sm:text-3xl ${theme.value}`}>
                  {card.value}
                </p>
                <p className={`mt-4 text-sm font-medium leading-6 ${theme.meta}`}>{card.note}</p>
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

export default CustomerKpiGrid
