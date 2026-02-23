import { useState, useEffect } from 'react'
import { dashboardService } from '../services/dashboardService'

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    stats: [],
    accounts: [],
    transactions: [],
    alerts: [],
    savingsGoals: [],
    loans: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const dashboardData = await dashboardService.getDashboardData()
      setData(dashboardData)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      console.error('Dashboard data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    fetchDashboardData()
  }

  const dismissAlert = (alertId) => {
    setData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }))
  }

  return {
    ...data,
    loading,
    error,
    refreshData,
    dismissAlert
  }
}