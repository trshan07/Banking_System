import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import RoleBasedRoute from './RoleBasedRoute'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminLayout from '../layouts/AdminLayout'
import SuperAdminLayout from '../layouts/SuperAdminLayout'

// Public Pages
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

// Customer Pages
import CustomerDashboard from '../pages/dashboard/CustomerDashboard'
import LoanApplication from '../pages/loans/LoanApplication'
import LoanStatus from '../pages/loans/LoanStatus'
import SupportTickets from '../pages/support/SupportTickets'
import CreateTicket from '../pages/support/CreateTicket'
import TicketDetails from '../pages/support/TicketDetails'
import Accounts from '../pages/banking/Accounts'
import TransferFunds from '../pages/banking/TransferFunds'
import SavingsTracker from '../pages/savings/SavingsTracker'
import ReportFraud from '../pages/fraud/ReportFraud'
import KYCVerification from '../pages/kyc/KYCVerification'
import KYCStatus from '../pages/kyc/KYCStatus'

// Admin Pages
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import UserManagement from '../pages/admin/UserManagement'
import LoanManagement from '../pages/loans/LoanManagement'
import TicketManagement from '../pages/support/TicketManagement'
import FraudInvestigation from '../pages/fraud/FraudInvestigation'
import Reports from '../pages/admin/Reports'

// Super Admin Pages
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard'
import AdminManagement from '../pages/super-admin/AdminManagement'
import SystemConfiguration from '../pages/super-admin/SystemConfiguration'
import AuditTrail from '../pages/super-admin/AuditTrail'
import SecuritySettings from '../pages/super-admin/SecuritySettings'

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard'
import TaskManagement from '../pages/employee/TaskManagement'
import LeaveRequests from '../pages/employee/LeaveRequests'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      </Route>

      {/* Customer Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<CustomerDashboard />} />
        <Route path="loans/apply" element={<LoanApplication />} />
        <Route path="loans/status" element={<LoanStatus />} />
        <Route path="support" element={<SupportTickets />} />
        <Route path="support/create" element={<CreateTicket />} />
        <Route path="support/ticket/:id" element={<TicketDetails />} />
        <Route path="banking/accounts" element={<Accounts />} />
        <Route path="banking/transfer" element={<TransferFunds />} />
        <Route path="savings" element={<SavingsTracker />} />
        <Route path="fraud/report" element={<ReportFraud />} />
        <Route path="kyc" element={<KYCVerification />} />
        <Route path="kyc/status" element={<KYCStatus />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="loans" element={<LoanManagement />} />
        <Route path="tickets" element={<TicketManagement />} />
        <Route path="fraud" element={<FraudInvestigation />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Super Admin Routes */}
      <Route path="/super-admin" element={
        <RoleBasedRoute allowedRoles={['super_admin']}>
          <SuperAdminLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<SuperAdminDashboard />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="system" element={<SystemConfiguration />} />
        <Route path="audit" element={<AuditTrail />} />
        <Route path="security" element={<SecuritySettings />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={
        <RoleBasedRoute allowedRoles={['employee', 'admin', 'super_admin']}>
          <DashboardLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<EmployeeDashboard />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="leaves" element={<LeaveRequests />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes