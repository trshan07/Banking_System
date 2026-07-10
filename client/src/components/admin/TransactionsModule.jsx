import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaPrint,
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { formatCompactCurrency, formatCurrency } from "../../utils/formatters";
import api from "../../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const TransactionsModule = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [chartData, setChartData] = useState({
    dailyVolume: [],
    transactionTypes: [],
    successRate: [],
    summary: {
      totalTransactions: 0,
      totalVolume: 0,
      successRate: 0,
      pendingTransactions: 0,
    },
  });

  useEffect(() => {
    fetchTransactions();
    fetchChartData();
  }, [filterType, filterStatus, dateRange, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/admin/transactions", {
        params: {
          type: filterType,
          status: filterStatus,
          startDate: dateRange.start,
          endDate: dateRange.end,
          page: currentPage,
        },
      });
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      toast.error(error.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await api.get("/admin/transactions/charts");
      setChartData(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch transaction charts");
      setChartData({
        dailyVolume: [],
        transactionTypes: [],
        successRate: [],
        summary: {
          totalTransactions: 0,
          totalVolume: 0,
          successRate: 0,
          pendingTransactions: 0,
        },
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-600" />;
      case "pending":
        return <FaClock className="text-yellow-600" />;
      case "failed":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "deposit":
        return <FaArrowDown className="text-green-600" />;
      case "withdrawal":
        return <FaArrowUp className="text-red-600" />;
      case "transfer":
        return <FaExchangeAlt className="text-blue-600" />;
      case "payment":
        return <FaCreditCard className="text-purple-600" />;
      default:
        return <FaMoneyBillWave className="text-gray-600" />;
    }
  };

  const formatAmount = (amount, type) => {
    const formatted = formatCurrency(amount);
    return type === "withdrawal" || type === "payment" ? `-${formatted}` : `+${formatted}`;
  };

  const formatVolumeTooltip = (value, name) => {
    if (String(name).toLowerCase().includes("volume")) {
      return [formatCurrency(value), name];
    }

    return [Number(value || 0).toLocaleString(), name];
  };

  const exportToCSV = () => {
    const headers = ["Transaction ID", "User", "Amount", "Type", "Status", "Date", "Reference"];
    const data = transactions.map(t => [
      t.id,
      t.user,
      t.amount,
      t.type,
      t.status,
      new Date(t.date).toLocaleString(),
      t.reference,
    ]);
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started");
  };

  const printTransactions = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Volume</p>
              <p className="text-2xl font-bold text-slate-800">{formatCompactCurrency(chartData.summary?.totalVolume || 0)}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-800">{Number(chartData.summary?.totalTransactions || 0).toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaExchangeAlt className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{chartData.summary?.successRate || 0}%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{Number(chartData.summary?.pendingTransactions || 0).toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={formatVolumeTooltip} />
              <Legend />
              <Bar dataKey="volume" fill="#3b82f6" name="Volume (LKR)" />
              <Bar dataKey="count" fill="#10b981" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.transactionTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {chartData.transactionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer">Transfers</option>
            <option value="payment">Payments</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <div className="flex space-x-2">
            <button onClick={exportToCSV} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center">
              <FaDownload className="mr-2" /> Export
            </button>
            <button onClick={printTransactions} className="px-4 py-2 border rounded-lg hover:bg-slate-50 flex items-center">
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions
                .filter(t => String(t.user || "").toLowerCase().includes(searchTerm.toLowerCase()) || String(t.id || "").toLowerCase().includes(searchTerm.toLowerCase()))
                .map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm">{transaction.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{transaction.user}</p>
                        <p className="text-xs text-slate-500">{transaction.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={transaction.type === "withdrawal" || transaction.type === "payment" ? "text-red-600" : "text-green-600"}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(transaction.date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Transaction Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <FaTimesCircle />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-slate-500">Transaction ID</p><p className="font-medium">{selectedTransaction.id}</p></div>
                  <div><p className="text-sm text-slate-500">Reference</p><p className="font-medium">{selectedTransaction.reference}</p></div>
                  <div><p className="text-sm text-slate-500">User</p><p className="font-medium">{selectedTransaction.user}</p></div>
                  <div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{selectedTransaction.userEmail}</p></div>
                  <div><p className="text-sm text-slate-500">Amount</p><p className="font-medium text-lg">{formatAmount(selectedTransaction.amount, selectedTransaction.type)}</p></div>
                  <div><p className="text-sm text-slate-500">Type</p><p className="font-medium capitalize">{selectedTransaction.type}</p></div>
                  <div><p className="text-sm text-slate-500">Status</p><p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTransaction.status)}`}>{selectedTransaction.status}</p></div>
                  <div><p className="text-sm text-slate-500">Payment Method</p><p className="font-medium">{selectedTransaction.paymentMethod}</p></div>
                  <div className="col-span-2"><p className="text-sm text-slate-500">Description</p><p className="font-medium">{selectedTransaction.description}</p></div>
                  <div className="col-span-2"><p className="text-sm text-slate-500">Date</p><p className="font-medium">{new Date(selectedTransaction.date).toLocaleString()}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsModule;
