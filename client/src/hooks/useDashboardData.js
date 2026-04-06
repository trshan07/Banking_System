// client/src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import { bankingAPI, loanAPI, savingsAPI } from '../services/api';

const formatMoney = (value) => {
  const amount = Number(value) || 0;
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const buildStats = ({ accounts = [], loans = [], savingsGoals = [], transactions = [] }) => {
  const totalBalance = accounts.reduce((sum, account) => sum + (Number(account?.balance) || 0), 0);
  const activeLoans = loans.filter((loan) => ['pending', 'approved', 'active', 'disbursed'].includes(loan?.status)).length;
  const savingsCount = savingsGoals.filter((goal) => goal?.status !== 'cancelled').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    .filter((txn) => {
      const date = txn?.createdAt || txn?.date;
      if (!date) return false;
      const txnDate = new Date(date);
      return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
    })
    .filter((txn) => ['withdrawal', 'payment', 'debit'].includes(String(txn?.type || '').toLowerCase()))
    .reduce((sum, txn) => sum + (Number(txn?.amount) || 0), 0);

  return [
    { label: 'Account Balance', value: formatMoney(totalBalance), change: `${accounts.length} account${accounts.length === 1 ? '' : 's'}` },
    { label: 'Active Loans', value: String(activeLoans), change: `${loans.length} total` },
    { label: 'Savings Goals', value: String(savingsCount), change: `${savingsGoals.length} tracked` },
    { label: 'Monthly Expenses', value: formatMoney(monthlyExpenses), change: 'This month' }
  ];
};

export const useDashboardData = () => {
  const [stats, setStats] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch all data in parallel; individual failures won't block others
      const [bankingRes, loansRes, savingsRes] = await Promise.allSettled([
        bankingAPI.getAccounts(),
        loanAPI.getLoans(),
        savingsAPI.getGoals()
      ]);

      let nextAccounts = [];
      let nextLoans = [];
      let nextSavingsGoals = [];
      let nextTransactions = [];
      
      if (bankingRes.status === 'fulfilled') {
        const bankingData = bankingRes.value?.data?.data;
        if (bankingData) nextAccounts = Array.isArray(bankingData) ? bankingData : bankingData.accounts ?? [];
      }

      if (loansRes.status === 'fulfilled') {
        const loansData = loansRes.value?.data?.data;
        if (loansData) nextLoans = Array.isArray(loansData) ? loansData : loansData.loans ?? [];
      }

      if (savingsRes.status === 'fulfilled') {
        const savingsData = savingsRes.value?.data?.data;
        if (savingsData) nextSavingsGoals = Array.isArray(savingsData) ? savingsData : savingsData.goals ?? [];
      }

      setAccounts(nextAccounts);
      setLoans(nextLoans);
      setSavingsGoals(nextSavingsGoals);
      setTransactions(nextTransactions);
      setAlerts([]);
      setStats(buildStats({
        accounts: nextAccounts,
        loans: nextLoans,
        savingsGoals: nextSavingsGoals,
        transactions: nextTransactions
      }));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
  }, [fetchDashboardData]);

  const dismissAlert = useCallback(async (alertId) => {
    try {
      await dashboardAPI.dismissAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert._id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!refreshing) {
        refreshData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData, refreshData, refreshing]);

  return {
    stats,
    accounts,
    transactions,
    alerts,
    savingsGoals,
    loans,
    loading,
    refreshing,
    error,
    dismissAlert,
    refreshData
  };
};