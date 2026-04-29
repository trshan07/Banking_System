import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaHandHoldingUsd, FaPiggyBank, FaLifeRing, FaMoneyCheckAlt } from 'react-icons/fa'
import { executeSidebarAction } from '../../api/dashboard'

const actionThemes = {
  transfer: 'from-[#0f2742] to-[#1b4c73] text-white border-[#234d70]',
  'pay-bills': 'from-[#f7fbf9] to-[#eef7f3] text-slate-900 border-[#d5eadf]',
  savings: 'from-[#fff9ef] to-[#fff3db] text-slate-900 border-[#f3e0b5]',
  'apply-loan': 'from-[#f7f3ff] to-[#eee7ff] text-slate-900 border-[#ddd0ff]',
  support: 'from-[#fff5f3] to-[#ffebe7] text-slate-900 border-[#ffd2c7]',
}

const iconThemes = {
  transfer: 'bg-white/12 text-white',
  'pay-bills': 'bg-[#dff1e7] text-[#16724f]',
  savings: 'bg-[#ffe5ab] text-[#9f6700]',
  'apply-loan': 'bg-[#e4dbff] text-[#6440c9]',
  support: 'bg-[#ffd8d0] text-[#bf4d32]',
}

const QuickActions = ({ accounts, loans, savingsGoals }) => {
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleQuickAction = async (actionId, payload = {}) => {
    if (actionLoading) return

    setActionLoading(true)
    setMessage(null)

    try {
      const result = await executeSidebarAction(actionId, payload)
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

  const actionButtons = [
    {
      id: 'transfer',
      title: 'Transfer Funds',
      description: 'Move money between your accounts or send it out securely.',
      payload: { fromAccountId: accounts[0]?.id, toAccountId: accounts[1]?.id },
      icon: FaMoneyCheckAlt,
    },
    {
      id: 'pay-bills',
      title: 'Pay Bills',
      description: 'Review recent outgoing payments and keep due dates on track.',
      payload: { amount: loans?.[0]?.monthlyPayment || 0 },
      icon: FaHandHoldingUsd,
    },
    {
      id: 'savings',
      title: 'Savings Goals',
      description: 'Track progress and add funds to your active goals.',
      payload: { targetAmount: savingsGoals?.[0]?.targetAmount || 500 },
      icon: FaPiggyBank,
    },
    {
      id: 'apply-loan',
      title: 'Apply for Loan',
      description: 'Start a loan application with pre-filled details.',
      payload: { loanType: 'personal' },
      icon: FaArrowRight,
    },
    {
      id: 'support',
      title: 'Get Support',
      description: 'Reach the support team if you need help with an account issue.',
      payload: {},
      icon: FaLifeRing,
    },
  ]

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#fff_0%,#f8fbff_45%,#eef6ff_100%)] px-6 py-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Fast Access</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Quick Actions</h2>
          </div>
          {actionLoading && <span className="text-sm font-medium text-primary-600">Processing...</span>}
        </div>
        <p className="max-w-2xl text-sm text-slate-500">
          Move through everyday banking tasks without digging through menus.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
        {actionButtons.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleQuickAction(action.id, action.payload)}
            disabled={actionLoading}
            className={`group relative w-full overflow-hidden rounded-[1.5rem] border bg-gradient-to-br px-4 py-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg ${actionThemes[action.id] || 'from-white to-slate-50 border-slate-200 text-slate-900'}`}
          >
            <div className="absolute right-0 top-0 h-20 w-20 -translate-y-5 translate-x-5 rounded-full bg-white/10 blur-2xl" />
            <div className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${iconThemes[action.id] || 'bg-slate-100 text-slate-700'}`}>
              <action.icon />
            </div>
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{action.title}</p>
                <p className={`mt-2 text-sm ${action.id === 'transfer' ? 'text-slate-200' : 'text-slate-500'}`}>{action.description}</p>
              </div>
              <span className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition group-hover:translate-x-1 ${action.id === 'transfer' ? 'bg-white/15 text-white' : 'bg-white text-slate-500'}`}>
                <FaArrowRight className="text-xs" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {message && <div className="mx-6 mb-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white">{message}</div>}
    </div>
  )
}

export default QuickActions
