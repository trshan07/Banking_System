import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBolt, FaArrowRight } from 'react-icons/fa'
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
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <aside className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-[linear-gradient(135deg,#0f2742_0%,#173d61_55%,#1f5d88_100%)] px-5 py-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">Guided Actions</p>
            <h2 className="mt-1 text-xl font-semibold">Smart Shortcuts</h2>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <FaBolt />
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-200">
          Context-aware shortcuts from the banking backend.
        </p>
      </div>

      <div className="border-b border-slate-200 px-5 py-4">
        <button
          type="button"
          onClick={refreshSidebar}
          className="text-sm font-semibold text-[#173d61] transition hover:text-[#102d49]"
          disabled={loading}
        >
          Refresh shortcuts
        </button>
      </div>

      <div className="space-y-3 p-5">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">No shortcuts available right now.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAction(item.id)}
              className="group w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
              disabled={actionLoading}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="break-words font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#173d61]">
                    {item.tag}
                  </span>
                  <span className="rounded-full bg-slate-900 p-2 text-white transition group-hover:translate-x-1">
                    <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}

export default Sidebar
