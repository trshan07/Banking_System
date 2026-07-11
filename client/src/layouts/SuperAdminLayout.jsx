import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'

const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-100 to-indigo-200 bg-fixed">
      <Header />
      <div className="flex">
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SuperAdminLayout
