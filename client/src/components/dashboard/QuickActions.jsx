import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FaMoneyBillWave, 
  FaUniversity, 
  FaHeadset, 
  FaUserCheck,
  FaArrowRight,
  FaFileInvoiceDollar,
  FaHistory,
  FaExclamationTriangle,
  FaPiggyBank
} from 'react-icons/fa'

const QuickActions = () => {
  const actions = [
    { 
      to: '/dashboard/loans/apply', 
      icon: FaMoneyBillWave, 
      label: 'Apply for Loan', 
      color: 'bg-blue-500',
      description: 'Get funds for your needs'
    },
    { 
      to: '/dashboard/banking/transfer', 
      icon: FaUniversity, 
      label: 'Transfer Funds', 
      color: 'bg-green-500',
      description: 'Send money instantly'
    },
    { 
      to: '/dashboard/support/create', 
      icon: FaHeadset, 
      label: 'Get Support', 
      color: 'bg-purple-500',
      description: '24/7 customer service'
    },
    { 
      to: '/dashboard/kyc', 
      icon: FaUserCheck, 
      label: 'Complete KYC', 
      color: 'bg-orange-500',
      description: 'Verify your identity'
    },
    { 
      to: '/dashboard/loans/status', 
      icon: FaFileInvoiceDollar, 
      label: 'Loan Status', 
      color: 'bg-indigo-500',
      description: 'Track your applications'
    },
    { 
      to: '/dashboard/banking/transactions', 
      icon: FaHistory, 
      label: 'Transaction History', 
      color: 'bg-pink-500',
      description: 'View all transactions'
    },
    { 
      to: '/dashboard/fraud/report', 
      icon: FaExclamationTriangle, 
      label: 'Report Fraud', 
      color: 'bg-red-500',
      description: 'Report suspicious activity'
    },
    { 
      to: '/dashboard/savings', 
      icon: FaPiggyBank, 
      label: 'Savings Goals', 
      color: 'bg-teal-500',
      description: 'Track your savings'
    }
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className="group p-5 border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
              <action.icon className="text-white text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-lg">
              {action.label}
            </h3>
            <p className="text-gray-500 text-sm mt-1">{action.description}</p>
            <div className="flex items-center text-primary-600 text-sm mt-3 font-medium">
              <span>Get started</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickActions