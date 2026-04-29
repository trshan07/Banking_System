import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaHandHoldingUsd, FaPiggyBank, FaLifeRing, FaMoneyCheckAlt } from 'react-icons/fa'
import { executeSidebarAction } from '../../api/dashboard'

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
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        {actionLoading && <span className="text-sm text-primary-600">Processing...</span>}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {actionButtons.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleQuickAction(action.id, action.payload)}
            disabled={actionLoading}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition hover:border-primary-200 hover:bg-primary-50"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm">
              <action.icon />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
              <span className="text-sm text-primary-600">Open</span>
            </div>
          </button>
        ))}
      </div>

      {message && <div className="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">{message}</div>}
    </div>
  )
}

export default QuickActions
