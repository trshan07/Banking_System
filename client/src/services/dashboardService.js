// Mock data - replace with actual API calls
const mockDashboardData = {
  stats: [
    { label: 'Account Balance', value: '$12,450.00', change: '+2.5%' },
    { label: 'Active Loans', value: '2', change: '1 pending' },
    { label: 'Savings Goals', value: '3', change: '68% achieved' },
    { label: 'Support Tickets', value: '1', change: 'Awaiting response' }
  ],

  accounts: [
    {
      id: 1,
      name: 'Main Checking',
      number: '1234567890',
      balance: 8450.50,
      type: 'checking',
      currency: 'USD'
    },
    {
      id: 2,
      name: 'Savings Account',
      number: '0987654321',
      balance: 12500.75,
      type: 'savings',
      currency: 'USD'
    },
    {
      id: 3,
      name: 'Business Account',
      number: '5678901234',
      balance: 25000.00,
      type: 'business',
      currency: 'USD'
    }
  ],

  transactions: [
    {
      id: 1,
      description: 'Salary Deposit',
      amount: 3500.00,
      type: 'deposit',
      date: '2024-02-23T10:30:00',
      status: 'completed',
      category: 'Income'
    },
    {
      id: 2,
      description: 'Grocery Store',
      amount: 156.78,
      type: 'payment',
      date: '2024-02-22T14:20:00',
      status: 'completed',
      category: 'Shopping'
    },
    {
      id: 3,
      description: 'Transfer to Savings',
      amount: 500.00,
      type: 'transfer',
      date: '2024-02-21T09:15:00',
      status: 'completed',
      category: 'Savings'
    },
    {
      id: 4,
      description: 'Restaurant',
      amount: 85.50,
      type: 'payment',
      date: '2024-02-20T19:30:00',
      status: 'completed',
      category: 'Dining'
    },
    {
      id: 5,
      description: 'Utility Bill',
      amount: 120.00,
      type: 'payment',
      date: '2024-02-19T11:00:00',
      status: 'pending',
      category: 'Bills'
    }
  ],

  alerts: [
    {
      id: 1,
      type: 'warning',
      title: 'KYC Verification Pending',
      message: 'Please complete your KYC to continue using all features.',
      action: {
        label: 'Complete Now',
        link: '/dashboard/kyc'
      },
      date: '2024-02-23T08:00:00'
    },
    {
      id: 2,
      type: 'info',
      title: 'Loan Application Update',
      message: 'Your personal loan application is under review.',
      action: {
        label: 'Check Status',
        link: '/dashboard/loans/status'
      },
      date: '2024-02-22T15:30:00'
    },
    {
      id: 3,
      type: 'success',
      title: 'Savings Goal Achieved',
      message: 'Congratulations! You reached your "Emergency Fund" goal.',
      action: {
        label: 'View Goal',
        link: '/dashboard/savings'
      },
      date: '2024-02-21T12:00:00'
    }
  ],

  savingsGoals: [
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 7500,
      targetDate: '2024-12-31',
      status: 'active'
    },
    {
      id: 2,
      name: 'Vacation',
      target: 5000,
      current: 2300,
      targetDate: '2024-08-31',
      status: 'active'
    },
    {
      id: 3,
      name: 'New Car',
      target: 15000,
      current: 4500,
      targetDate: '2025-06-30',
      status: 'active'
    }
  ],

  loans: [
    {
      id: 1,
      type: 'Personal Loan',
      amount: 15000,
      interestRate: '12%',
      tenure: '36 months',
      status: 'pending',
      appliedDate: '2024-02-15',
      expectedDecision: '2024-02-29'
    },
    {
      id: 2,
      type: 'Home Loan',
      amount: 250000,
      interestRate: '8.5%',
      tenure: '240 months',
      status: 'approved',
      appliedDate: '2024-01-10',
      decisionDate: '2024-02-20'
    },
    {
      id: 3,
      type: 'Car Loan',
      amount: 35000,
      interestRate: '9.5%',
      tenure: '60 months',
      status: 'rejected',
      appliedDate: '2024-01-05',
      decisionDate: '2024-01-20'
    }
  ]
}

export const dashboardService = {
  async getDashboardData() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData)
      }, 1000)
    })
  },

  async getAccounts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData.accounts)
      }, 500)
    })
  },

  async getTransactions(limit = 10) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData.transactions.slice(0, limit))
      }, 500)
    })
  },

  async getAlerts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData.alerts)
      }, 500)
    })
  },

  async dismissAlert(alertId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockDashboardData.alerts = mockDashboardData.alerts.filter(alert => alert.id !== alertId)
        resolve({ success: true })
      }, 300)
    })
  }
}