import { useState, useEffect, useCallback } from 'react'
import { fetchDashboard, dismissAlert as dismissDashboardAlert } from '../api/dashboard'

export const useDashboardData = () => {
  const [stats, setStats] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [alerts, setAlerts] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchDashboard()

      setStats(data.stats || null)
      setAccounts(data.accounts || [])
      setTransactions(data.transactions || [])
      setAlerts(data.alerts || [])
      setSavingsGoals(data.savingsGoals || [])
      setLoans(data.loans || [])
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const dismissAlert = useCallback(async (alertId) => {
    try {
      const updatedAlerts = alerts.filter((alert) => alert.id !== alertId)
      setAlerts(updatedAlerts)
      await dismissDashboardAlert(alertId)
    } catch (err) {
      console.error('Dismiss alert failed', err)
    }
  }, [alerts])

  return {
    stats,
    accounts,
    transactions,
    alerts,
    savingsGoals,
    loans,
    loading,
    error,
    dismissAlert,
    refreshData: loadDashboard,
  }
}
