import React from 'react'
import { FaUniversity, FaMoneyBillWave, FaPiggyBank, FaHeadset } from 'react-icons/fa'
import { formatCurrency } from '../../utils/formatters'

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
      default: return FaHeadset
    }
  }

  const getColor = (label) => {
    switch (label) {
      case 'Account Balance': return 'bg-blue-500'
      case 'Active Loans': return 'bg-green-500'
      case 'Savings Goals': return 'bg-purple-500'
      default: return 'bg-orange-500'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = getIcon(stat.label)
        const color = getColor(stat.label)
        
        // Extract numeric value for formatting if needed
        const numericValue = parseFloat(stat.value.replace(/[^0-9.-]+/g, ''))
        
        return (
          <div key={index} className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.label === 'Account Balance' ? formatCurrency(numericValue) : stat.value}
                </p>
                <p className={`text-sm mt-2 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`${color} p-4 rounded-xl shadow-lg`}>
                <Icon className="text-white text-2xl" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards