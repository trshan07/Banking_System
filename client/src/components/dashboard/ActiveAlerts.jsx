import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaExclamationTriangle,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaBell,
} from 'react-icons/fa'
import { formatDateTime } from '../../utils/formatters'

const ActiveAlerts = ({ alerts, onDismiss }) => {
  const [dismissed, setDismissed] = useState([])

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-amber-600" />
      case 'info':
        return <FaInfoCircle className="text-sky-600" />
      case 'success':
        return <FaCheckCircle className="text-emerald-600" />
      case 'error':
        return <FaShieldAlt className="text-rose-600" />
      default:
        return <FaBell className="text-slate-600" />
    }
  }

  const getAlertColors = (type) => {
    switch (type) {
      case 'warning':
        return 'border-amber-200 bg-amber-50'
      case 'info':
        return 'border-sky-200 bg-sky-50'
      case 'success':
        return 'border-emerald-200 bg-emerald-50'
      case 'error':
        return 'border-rose-200 bg-rose-50'
      default:
        return 'border-slate-200 bg-slate-50'
    }
  }

  const handleDismiss = (alertId) => {
    setDismissed([...dismissed, String(alertId)])
    if (onDismiss) {
      onDismiss(alertId)
    }
  }

  const activeAlerts = alerts.filter((alert) => !dismissed.includes(String(alert.id || alert._id)))

  if (activeAlerts.length === 0) {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Attention</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Active Alerts</h2>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <FaCheckCircle className="text-2xl" />
          </div>
          <p className="mt-4 font-medium text-slate-900">No active alerts</p>
          <p className="mt-2 text-sm text-slate-500">Everything looks normal across your banking profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Attention</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Active Alerts</h2>
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
            {activeAlerts.length} live
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id || alert._id}
            className={`group relative rounded-[1.5rem] border p-4 ${getAlertColors(alert.type)}`}
          >
            <button
              onClick={() => handleDismiss(alert.id || alert._id)}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:bg-white/80 hover:text-slate-700"
            >
              <FaTimes />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                {getAlertIcon(alert.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{alert.message}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {alert.action && (
                    <Link
                      to={alert.action.link}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      {alert.action.label}
                    </Link>
                  )}
                  {alert.date && (
                    <span className="text-xs text-slate-400">
                      {formatDateTime(alert.date || alert.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-5 py-4">
        <Link
          to="/dashboard/support"
          className="block text-center text-sm font-semibold text-[#173d61] transition hover:text-[#102d49]"
        >
          Contact Support
        </Link>
      </div>
    </div>
  )
}

export default ActiveAlerts
