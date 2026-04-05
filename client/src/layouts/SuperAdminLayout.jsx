import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'

const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
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