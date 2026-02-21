import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const RoleSwitcher = () => {
  const { user, switchRole, availableRoles, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleRoleSwitch = (role) => {
    switchRole(role)
    // Navigate to appropriate dashboard
    switch(role) {
      case 'super_admin':
        navigate('/super-admin')
        break
      case 'admin':
        navigate('/admin')
        break
      case 'employee':
        navigate('/employee')
        break
      default:
        navigate('/dashboard')
    }
  }

  const getDashboardUrl = () => {
    if (!user) return '/'
    switch(user.role) {
      case 'super_admin': return '/super-admin'
      case 'admin': return '/admin'
      case 'employee': return '/employee'
      default: return '/dashboard'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
      <div className="mb-3 pb-2 border-b border-gray-200">
        <p className="text-xs text-gray-500">Dev Mode Active</p>
        <p className="text-sm font-semibold text-gray-900">
          Current: <span className="text-blue-600 capitalize">{user.role}</span>
        </p>
      </div>
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500">Switch Role:</p>
        {availableRoles.map(role => (
          <button
            key={role}
            onClick={() => handleRoleSwitch(role)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              user.role === role 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="capitalize">{role.replace('_', ' ')}</span>
            {user.role === role && ' ✓'}
          </button>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 space-y-2">
        <a
          href={getDashboardUrl()}
          className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          Go to {user.role} Dashboard
        </a>
        
        <button
          onClick={logout}
          className="w-full text-center bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Click any role to switch instantly
      </p>
    </div>
  )
}

export default RoleSwitcher