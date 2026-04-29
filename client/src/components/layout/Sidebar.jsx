import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSidebarData } from '../../hooks/useSidebarData'
import LoadingSpinner from '../common/LoadingSpinner'

const Sidebar = () => {
  const { items, loading, error, actionLoading, refreshSidebar, invokeSidebarAction } = useSidebarData()
  const navigate = useNavigate()

  const handleAction = async (actionId) => {
    try {
      const result = await invokeSidebarAction(actionId)
      if (result?.redirectTo) {
        navigate(result.redirectTo)
      }
    } catch (error) {
      console.error('Sidebar action failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <aside className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <button
          type="button"
          onClick={refreshSidebar}
          className="text-sm text-primary-600 hover:text-primary-800"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No sidebar items available.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAction(item.id)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:bg-primary-50"
              disabled={actionLoading}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <span className="text-xs text-primary-600">{item.tag}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export default Sidebar
