import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      if (actionId === 'apply-loan') {
        // Navigate to loan application page instead of API call
        navigate('/dashboard/loans/apply')
        return
      }

      const result = await executeSidebarAction(actionId, payload)
      setMessage(result.message || 'Action completed successfully.')
    } catch (error) {
      setMessage(error.message || 'Action failed, please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const actionButtons = [
    {
      id: 'transfer-funds',
      title: 'Transfer Funds',
      description: 'Move money between your accounts quickly.',
      payload: { fromAccount: accounts[0]?.id, toAccount: accounts[1]?.id },
    },
    {
      id: 'pay-bills',
      title: 'Pay Bills',
      description: 'Schedule payments and clear bills.',
      payload: { amount: loans?.[0]?.nextPayment || 0 },
    },
    {
      id: 'open-savings',
      title: 'Open Savings Goal',
      description: 'Create a new savings target in seconds.',
      payload: { target: savingsGoals?.[0]?.target || 500 },
    },
    {
      id: 'apply-loan',
      title: 'Apply for Loan',
      description: 'Start a loan application with pre-filled details.',
      payload: { loanType: 'personal' },
    },
  ]

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        {actionLoading && <span className="text-sm text-primary-600">Processing...</span>}
      </div>

      <div className="space-y-3">
        {actionButtons.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleQuickAction(action.id, action.payload)}
            disabled={actionLoading}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition hover:bg-primary-50"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
              <span className="text-sm text-primary-600">Go</span>
            </div>
          </button>
        ))}
      </div>

      {message && <div className="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">{message}</div>}
    </div>
  )
}

export default QuickActions
