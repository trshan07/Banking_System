import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaHeadset,
  FaExclamationTriangle,
  FaUserCheck,
  FaUniversity,
  FaArrowRight
} from 'react-icons/fa'

const CustomerDashboard = () => {
  const { user } = useAuth()

  const quickActions = [
    { to: '/dashboard/loans/apply', icon: FaMoneyBillWave, label: 'Apply for Loan', color: 'bg-blue-500' },
    { to: '/dashboard/banking/transfer', icon: FaUniversity, label: 'Transfer Funds', color: 'bg-green-500' },
    { to: '/dashboard/support/create', icon: FaHeadset, label: 'Get Support', color: 'bg-purple-500' },
    { to: '/dashboard/kyc', icon: FaUserCheck, label: 'Complete KYC', color: 'bg-orange-500' },
  ]

  const stats = [
    { label: 'Account Balance', value: '$12,450.00', change: '+2.5%', icon: FaUniversity, color: 'bg-blue-500' },
    { label: 'Active Loans', value: '2', change: '1 pending', icon: FaMoneyBillWave, color: 'bg-green-500' },
    { label: 'Savings Goals', value: '3', change: '68% achieved', icon: FaPiggyBank, color: 'bg-purple-500' },
    { label: 'Support Tickets', value: '1', change: 'Awaiting response', icon: FaHeadset, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-primary-100">Here's what's happening with your accounts today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="group p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="text-white text-xl" />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                {action.label}
              </h3>
              <div className="flex items-center text-primary-600 text-sm mt-2">
                <span>Get started</span>
                <FaArrowRight className="ml-1 text-xs" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link to="/dashboard/banking/transactions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUniversity className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Transfer to Savings</p>
                    <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                  </div>
                </div>
                <p className="font-semibold text-success-600">+$500.00</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Alerts</h2>
            <Link to="/dashboard/notifications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-yellow-600 mt-1" />
                <div>
                  <p className="font-medium text-yellow-800">KYC Verification Pending</p>
                  <p className="text-sm text-yellow-600">Please complete your KYC to continue using all features.</p>
                  <Link to="/dashboard/kyc" className="text-sm text-yellow-700 font-medium mt-2 inline-block">
                    Complete Now →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FaMoneyBillWave className="text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-blue-800">Loan Application Update</p>
                  <p className="text-sm text-blue-600">Your personal loan application is under review.</p>
                  <Link to="/dashboard/loans/status" className="text-sm text-blue-700 font-medium mt-2 inline-block">
                    Check Status →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard