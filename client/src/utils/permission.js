import { ROLES } from './constants'

export const hasPermission = (user, permission) => {
  if (!user) return false
  if (user.role === ROLES.SUPER_ADMIN) return true
  
  const permissions = {
    [ROLES.ADMIN]: [
      'view_users',
      'manage_users',
      'view_loans',
      'manage_loans',
      'view_tickets',
      'manage_tickets',
      'view_reports'
    ],
    [ROLES.EMPLOYEE]: [
      'view_loans',
      'process_loans',
      'view_tickets',
      'respond_tickets'
    ],
    [ROLES.CUSTOMER]: [
      'view_own_account',
      'apply_loans',
      'create_tickets',
      'view_own_transactions'
    ]
  }

  return permissions[user.role]?.includes(permission) || false
}

export const canAccess = (user, resource, action) => {
  const permission = `${action}_${resource}`
  return hasPermission(user, permission)
}

export const getDashboardRoute = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return '/super-admin'
    case ROLES.ADMIN:
      return '/admin'
    case ROLES.EMPLOYEE:
      return '/employee'
    default:
      return '/dashboard'
  }
}