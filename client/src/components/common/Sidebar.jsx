import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  FaHome,
  FaMoneyBillWave,
  FaHeadset,
  FaUniversity,
  FaPiggyBank,
  FaExclamationTriangle,
  FaUserCheck,
  FaTasks,
  FaUserCog,
  FaShieldAlt,
  FaChartBar
} from 'react-icons/fa'

const Sidebar = () => {
  const { user } = useAuth()

  const customerLinks = [
    { to: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { to: '/dashboard/loans/apply', icon: FaMoneyBillWave, label: 'Apply for Loan' },
    { to: '/dashboard/loans/status', icon: FaTasks, label: 'Loan Status' },
    { to: '/dashboard/banking/accounts', icon: FaUniversity, label: 'Accounts' },
    { to: '/dashboard/banking/transfer', icon: FaMoneyBillWave, label: 'Transfer Funds' },
    { to: '/dashboard/savings', icon: FaPiggyBank, label: 'Savings Tracker' },
    { to: '/dashboard/support', icon: FaHeadset, label: 'Support Tickets' },
    { to: '/dashboard/fraud/report', icon: FaExclamationTriangle, label: 'Report Fraud' },
    { to: '/dashboard/kyc', icon: FaUserCheck, label: 'KYC Verification' },
  ]

  const adminLinks = [
    { to: '/admin', icon: FaHome, label: 'Dashboard' },
    { to: '/admin/users', icon: FaUserCog, label: 'User Management' },
    { to: '/admin/loans', icon: FaMoneyBillWave, label: 'Loan Management' },
    { to: '/admin/tickets', icon: FaHeadset, label: 'Ticket Management' },
    { to: '/admin/fraud', icon: FaExclamationTriangle, label: 'Fraud Cases' },
    { to: '/admin/reports', icon: FaChartBar, label: 'Reports' },
  ]

  const superAdminLinks = [
    { to: '/super-admin', icon: FaHome, label: 'Dashboard' },
    { to: '/super-admin/admins', icon: FaUserCog, label: 'Admin Management' },
    { to: '/super-admin/system', icon: FaShieldAlt, label: 'System Config' },
    { to: '/super-admin/audit', icon: FaTasks, label: 'Audit Trail' },
    { to: '/super-admin/security', icon: FaShieldAlt, label: 'Security' },
  ]

  const employeeLinks = [
    { to: '/employee', icon: FaHome, label: 'Dashboard' },
    { to: '/employee/tasks', icon: FaTasks, label: 'Tasks' },
    { to: '/employee/leaves', icon: FaTasks, label: 'Leave Requests' },
  ]

  const getLinks = () => {
    switch (user?.role) {
      case 'super_admin': return superAdminLinks
      case 'admin': return adminLinks
      case 'employee': return employeeLinks
      default: return customerLinks
    }
  }

  const links = getLinks()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/super-admin' || link.to === '/employee'}
              >
                <link.icon className="text-lg" />
                <span className="text-sm font-medium">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar