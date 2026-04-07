import { useState, useEffect, useCallback } from 'react'
import { fetchSidebarItems, executeSidebarAction } from '../api/dashboard'

export const useSidebarData = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadSidebar = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchSidebarItems()
      setItems(data.items || [])
    } catch (err) {
      console.warn('Sidebar load failed:', err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSidebar()
  }, [loadSidebar])

  const invokeSidebarAction = useCallback(async (actionId, payload = {}) => {
    setActionLoading(true)
    try {
      const result = await executeSidebarAction(actionId, payload)
      await loadSidebar()
      return result
    } finally {
      setActionLoading(false)
    }
  }, [loadSidebar])

  return {
    items,
    loading,
    error,
    actionLoading,
    refreshSidebar: loadSidebar,
    invokeSidebarAction,
  }
}
