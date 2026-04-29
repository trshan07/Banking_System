import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaHandHoldingUsd,
  FaPiggyBank,
  FaLifeRing,
  FaMoneyCheckAlt,
} from 'react-icons/fa'
import { executeSidebarAction } from '../../api/dashboard'

const actionButtons = [
  {
    id: 'transfer',
    title: 'Transfer Funds',
    description: 'Move money between your accounts or send money out securely.',
    icon: FaMoneyCheckAlt,
    layout: 'xl:col-span-4',
    card: 'bg-[linear-gradient(135deg,#0f2742_0%,#173d61_100%)] text-white border-[#264f73]',
    iconWrap: 'bg-white/12 text-white',
    body: 'text-slate-100/90',
    cta: 'bg-white/12 text-white',
  },
  {
    id: 'pay-bills',
    title: 'Pay Bills',
    description: 'Stay on top of outgoing payments and due items.',
    icon: FaHandHoldingUsd,
    layout: 'xl:col-span-2',
    card: 'bg-[linear-gradient(135deg,#f4fbf7_0%,#ebf7f0_100%)] text-slate-900 border-[#d2eadb]',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    body: 'text-slate-600',
    cta: 'bg-white text-slate-700',
  },
  {
    id: 'savings',
    title: 'Savings Goals',
    description: 'Add funds and keep your goals progressing steadily.',
    icon: FaPiggyBank,
    layout: 'xl:col-span-2',
    card: 'bg-[linear-gradient(135deg,#fffaf0_0%,#fff1d6_100%)] text-slate-900 border-[#f1ddb1]',
    iconWrap: 'bg-amber-100 text-amber-700',
    body: 'text-slate-600',
    cta: 'bg-white text-slate-700',
  },
  {
    id: 'apply-loan',
    title: 'Apply for Loan',
    description: 'Start a new application with the details you already have.',
    icon: FaArrowRight,
    layout: 'xl:col-span-2',
    card: 'bg-[linear-gradient(135deg,#f8f6ff_0%,#efeaff_100%)] text-slate-900 border-[#e0d4ff]',
    iconWrap: 'bg-violet-100 text-violet-700',
    body: 'text-slate-600',
    cta: 'bg-white text-slate-700',
  },
  {
    id: 'support',
    title: 'Get Support',
    description: 'Reach the support team if you need help with your banking.',
    icon: FaLifeRing,
    layout: 'xl:col-span-2',
    card: 'bg-[linear-gradient(135deg,#fff6f2_0%,#ffe9e2_100%)] text-slate-900 border-[#ffd3c6]',
    iconWrap: 'bg-rose-100 text-rose-700',
    body: 'text-slate-600',
    cta: 'bg-white text-slate-700',
  },
]

const QuickActions = ({ accounts, loans, savingsGoals }) => {
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const payloadByAction = {
    transfer: { fromAccountId: accounts[0]?.id, toAccountId: accounts[1]?.id },
    'pay-bills': { amount: loans?.[0]?.monthlyPayment || 0 },
    savings: { targetAmount: savingsGoals?.[0]?.targetAmount || 500 },
    'apply-loan': { loanType: 'personal' },
    support: {},
  }

  const handleQuickAction = async (actionId) => {
    if (actionLoading) return

    setActionLoading(true)
    setMessage(null)

    try {
      const result = await executeSidebarAction(actionId, payloadByAction[actionId] || {})
      if (result?.redirectTo) {
        navigate(result.redirectTo)
      }
      setMessage(result.message || 'Action completed successfully.')
    } catch (error) {
      setMessage(error.message || 'Action failed, please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_44px_-28px_rgba(15,23,42,0.25)]">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_50%,#eef6ff_100%)] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Fast Access</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Move Faster</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              High-frequency tasks live here so routine banking feels quick and calm.
            </p>
          </div>
          {actionLoading ? <span className="text-sm font-medium text-[#173d61]">Processing...</span> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-12">
        {actionButtons.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleQuickAction(action.id)}
            disabled={actionLoading}
            className={`group relative h-full overflow-hidden rounded-[1.6rem] border p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${action.layout} ${action.card}`}
          >
            <div className="absolute -right-6 top-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${action.iconWrap}`}>
              <action.icon className="text-xl" />
            </div>

            <div className="relative mt-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{action.title}</p>
                <p className={`mt-2 text-sm leading-6 ${action.body}`}>{action.description}</p>
              </div>
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition group-hover:translate-x-1 ${action.cta}`}>
                <FaArrowRight className="text-[11px]" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {message ? (
        <div className="mx-5 mb-5 rounded-2xl bg-slate-900 px-4 py-3 text-sm leading-6 text-white sm:mx-6 sm:mb-6">
          {message}
        </div>
      ) : null}
    </div>
  )
}

export default QuickActions
