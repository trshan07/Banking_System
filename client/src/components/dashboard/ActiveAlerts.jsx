import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaExclamationTriangle, 
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaBell
} from 'react-icons/fa'
import { formatDateTime } from '../../utils/formatters'

const ActiveAlerts = ({ alerts, onDismiss }) => {
  const [dismissed, setDismissed] = useState([])

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-600" />
      case 'info':
        return <FaInfoCircle className="text-blue-600" />
      case 'success':
        return <FaCheckCircle className="text-green-600" />
      case 'error':
        return <FaShieldAlt className="text-red-600" />
      default:
        return <FaBell className="text-gray-600" />
    }
  }

  const getAlertColors = (type) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          subtext: 'text-yellow-600'
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          subtext: 'text-blue-600'
        }
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          subtext: 'text-green-600'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          subtext: 'text-red-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          subtext: 'text-gray-600'
        }
    }
  }

  const handleDismiss = (alertId) => {
    setDismissed([...dismissed, alertId])
    if (onDismiss) {
      onDismiss(alertId)
    }
  }

  const activeAlerts = alerts.filter(alert => !dismissed.includes(alert.id))

  if (activeAlerts.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
        <div className="text-center py-8">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
          <p className="text-gray-600">No active alerts</p>
          <p className="text-sm text-gray-500 mt-1">All systems are running smoothly</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Active Alerts</h2>
        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
          {activeAlerts.length} New
        </span>
      </div>

      <div className="space-y-3">
        {activeAlerts.map((alert) => {
          const colors = getAlertColors(alert.type)
          
          return (
            <div 
              key={alert.id} 
              className={`${colors.bg} border ${colors.border} rounded-xl p-4 relative group hover:shadow-md transition-shadow`}
            >
              <button
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes />
              </button>

              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${colors.text}`}>{alert.title}</p>
                  <p className={`text-sm ${colors.subtext} mt-1`}>{alert.message}</p>
                  
                  {alert.action && (
                    <Link 
                      to={alert.action.link} 
                      className={`inline-flex items-center text-sm font-medium ${colors.text} hover:underline mt-3`}
                    >
                      {alert.action.label}
                      <span className="ml-1">→</span>
                    </Link>
                  )}

                  {alert.date && (
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDateTime(alert.date)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Link 
        to="/dashboard/notifications" 
        className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium mt-4 py-2 border-t border-gray-200"
      >
        View All Notifications
      </Link>
    </div>
  )
}

export default ActiveAlerts