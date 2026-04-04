import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaShieldAlt,
  FaHeadset,
  FaChartLine,
  FaFileSignature,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDownload,
  FaUpload,
  FaFilter,
  FaSort,
  FaExchangeAlt,
  FaDatabase,
  FaServer,
  FaSave,
  FaHome,
  FaBan,
  FaFlag,
  FaBullhorn,
  FaFileAlt,
  FaFolderOpen,
  FaTag,
  FaBoxOpen,
  FaCube,
  FaCubes,
  FaChartPie,
  FaChartBar,
  FaChartArea,
  FaGlobe,
  FaLock,
  FaUnlock,
  FaUserCheck,
  FaUserTimes,
  FaUserCog,
  FaUserTie,
  FaUserFriends,
  FaBriefcase,
  FaCreditCard,
  FaPercent,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaReply,
  FaPaperPlane,
  FaCopy,
  FaPrint,
  FaShare,
  FaLink,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaBug,
  FaRocket,
  FaUndo,
  FaRedo,
  FaHistory,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Dashboard Statistics
  const [stats] = useState({
    totalUsers: 15420,
    newUsers: 156,
    activeUsers: 12345,
    totalBanks: 45,
    totalBranches: 328,
    totalEmployees: 2890,
    totalCustomers: 12530,
    totalLoans: 5678,
    pendingLoans: 234,
    approvedLoans: 4567,
    rejectedLoans: 877,
    totalTransactions: 156789,
    transactionVolume: "₹4.56Cr",
    fraudReports: 89,
    pendingFraud: 23,
    resolvedFraud: 66,
    supportTickets: 345,
    openTickets: 78,
    inProgressTickets: 45,
    closedTickets: 222,
    totalKYC: 8920,
    pendingKYC: 156,
    approvedKYC: 8432,
    rejectedKYC: 332,
    systemUptime: "99.98%",
    serverLoad: "42%",
    activeSessions: 2345,
    apiCalls: "4.56L",
    storageUsed: "342 GB",
    totalRevenue: "₹12.3Cr",
    monthlyProfit: "₹2.4Cr",
  });

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "New loan application submitted",
      time: "5 minutes ago",
      status: "pending",
      priority: "high",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "KYC documents uploaded",
      time: "15 minutes ago",
      status: "completed",
      priority: "normal",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Fraud report filed",
      time: "25 minutes ago",
      status: "critical",
      priority: "urgent",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      user: "Sarah Williams",
      action: "Support ticket created",
      time: "35 minutes ago",
      status: "pending",
      priority: "medium",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      user: "Tom Brown",
      action: "Transaction completed",
      time: "45 minutes ago",
      status: "completed",
      priority: "normal",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      id: 6,
      user: "Lisa Davis",
      action: "New account opened",
      time: "55 minutes ago",
      status: "completed",
      priority: "normal",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];

  // System Alerts
  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected (78%)",
      time: "10 minutes ago",
      icon: <FaServer />,
      action: "Optimize",
    },
    {
      id: 2,
      type: "info",
      message: "Database backup completed successfully",
      time: "30 minutes ago",
      icon: <FaDatabase />,
      action: "View",
    },
    {
      id: 3,
      type: "success",
      message: "Security patch v2.4.1 installed",
      time: "1 hour ago",
      icon: <FaShieldAlt />,
      action: "Details",
    },
    {
      id: 4,
      type: "error",
      message: "API rate limit at 85%",
      time: "2 hours ago",
      icon: <FaGlobe />,
      action: "Upgrade",
    },
    {
      id: 5,
      type: "warning",
      message: "Storage space running low (82% used)",
      time: "3 hours ago",
      icon: <FaCloudUploadAlt />,
      action: "Clean up",
    },
  ];

  // Pending Approvals
  const pendingApprovals = [
    {
      id: 1,
      type: "Loan Application",
      user: "Robert Wilson",
      amount: "₹5,00,000",
      date: "2024-03-18",
      priority: "high",
    },
    {
      id: 2,
      type: "KYC Verification",
      user: "Emily Davis",
      documents: 3,
      date: "2024-03-18",
      priority: "normal",
    },
    {
      id: 3,
      type: "New Account",
      user: "Michael Chen",
      accountType: "Business",
      date: "2024-03-17",
      priority: "medium",
    },
    {
      id: 4,
      type: "Fraud Report",
      user: "Anonymous",
      severity: "high",
      date: "2024-03-17",
      priority: "urgent",
    },
    {
      id: 5,
      type: "Support Ticket",
      user: "David Miller",
      issue: "Transaction failed",
      date: "2024-03-17",
      priority: "medium",
    },
  ];

  // Performance Metrics
  const performanceMetrics = [
    {
      id: 1,
      name: "Loan Approval Rate",
      value: "78%",
      trend: "+5%",
      color: "text-emerald-600",
    },
    {
      id: 2,
      name: "Customer Satisfaction",
      value: "4.8/5",
      trend: "+0.3",
      color: "text-emerald-600",
    },
    {
      id: 3,
      name: "Fraud Detection Rate",
      value: "94%",
      trend: "+2%",
      color: "text-emerald-600",
    },
    {
      id: 4,
      name: "Ticket Resolution",
      value: "2.4 hrs",
      trend: "-0.5 hrs",
      color: "text-emerald-600",
    },
    {
      id: 5,
      name: "System Response Time",
      value: "1.2s",
      trend: "-0.3s",
      color: "text-emerald-600",
    },
    {
      id: 6,
      name: "API Success Rate",
      value: "99.2%",
      trend: "+0.1%",
      color: "text-emerald-600",
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      id: 1,
      name: "Add New Bank",
      icon: <FaPlus />,
      color: "from-emerald-500 to-teal-500",
      action: "banks",
    },
    {
      id: 2,
      name: "Create Admin",
      icon: <FaUserCog />,
      color: "from-sky-500 to-blue-500",
      action: "users",
    },
    {
      id: 3,
      name: "Process Loans",
      icon: <FaMoneyBillWave />,
      color: "from-violet-500 to-purple-500",
      action: "loans",
    },
    {
      id: 4,
      name: "Review KYC",
      icon: <FaFileSignature />,
      color: "from-amber-500 to-orange-500",
      action: "kyc",
    },
    {
      id: 5,
      name: "Generate Report",
      icon: <FaFilePdf />,
      color: "from-rose-500 to-pink-500",
      action: "reports",
    },
    {
      id: 6,
      name: "System Backup",
      icon: <FaDatabase />,
      color: "from-cyan-500 to-sky-500",
      action: "backup",
    },
    {
      id: 7,
      name: "Broadcast Message",
      icon: <FaBullhorn />,
      color: "from-indigo-500 to-indigo-600",
      action: "notifications",
    },
    {
      id: 8,
      name: "Security Scan",
      icon: <FaShieldAlt />,
      color: "from-slate-500 to-gray-600",
      action: "security",
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  // Handle backup
  const handleBackup = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("System backup completed successfully");
      setLoading(false);
    }, 2000);
  };

  // Handle security scan
  const handleSecurityScan = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Security scan completed. No threats detected.");
      setLoading(false);
    }, 3000);
  };

  // Handle notifications
  const handleBroadcastMessage = () => {
    toast.success("Broadcast message feature coming soon!");
  };

  // Handle action click
  const handleActionClick = (action) => {
    if (action === "backup") {
      handleBackup();
    } else if (action === "security") {
      handleSecurityScan();
    } else if (action === "notifications") {
      handleBroadcastMessage();
    } else {
      setActiveTab(action);
    }
  };

  // Handle approve
  const handleApprove = (id) => {
    toast.success(`Request #${id} approved successfully`);
  };

  // Handle reject
  const handleReject = (id) => {
    toast.error(`Request #${id} rejected`);
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A2647] via-[#1B3B5C] to-[#2A4B6E] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
            <p className="text-white/90">
              Here's what's happening with Smart Bank today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
              <FaCalendarAlt className="inline mr-2" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 mt-1">↑ 156 new today</p>
            </div>
            <div className="w-12 h-12 bg-[#0A2647] bg-opacity-10 rounded-lg flex items-center justify-center">
              <FaUsers className="text-[#0A2647] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-800">
                {stats.totalTransactions.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Volume: {stats.transactionVolume}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#0A2647] bg-opacity-10 rounded-lg flex items-center justify-center">
              <FaExchangeAlt className="text-[#0A2647] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Loans</p>
              <p className="text-2xl font-bold text-slate-800">
                {stats.approvedLoans.toLocaleString()}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                {stats.pendingLoans} pending approval
              </p>
            </div>
            <div className="w-12 h-12 bg-[#0A2647] bg-opacity-10 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-[#0A2647] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">System Health</p>
              <p className="text-2xl font-bold text-slate-800">
                {stats.systemUptime}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Load: {stats.serverLoad}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#0A2647] bg-opacity-10 rounded-lg flex items-center justify-center">
              <FaServer className="text-[#0A2647] text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {performanceMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-xl shadow-lg p-4 border border-slate-200"
          >
            <p className="text-xs text-slate-500 mb-1">{metric.name}</p>
            <p className="text-lg font-bold text-slate-800">{metric.value}</p>
            <p className={`text-xs ${metric.color}`}>{metric.trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.action)}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform shadow-md`}
              >
                {action.icon}
              </div>
              <span className="text-xs text-slate-600 text-center">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Pending Approvals
            </h3>
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
              {pendingApprovals.length} New
            </span>
          </div>
          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.priority === "urgent"
                        ? "bg-red-500"
                        : item.priority === "high"
                          ? "bg-orange-500"
                          : item.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.type}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.user} • {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                    title="Approve"
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                    title="Reject"
                  >
                    <FaTimesCircle />
                  </button>
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="View"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-[#0A2647] font-semibold hover:text-[#1B3B5C]">
            View All Approvals →
          </button>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            System Alerts
          </h3>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg ${
                  alert.type === "warning"
                    ? "bg-yellow-50 border border-yellow-200"
                    : alert.type === "error"
                      ? "bg-red-50 border border-red-200"
                      : alert.type === "success"
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-sky-50 border border-sky-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <div
                      className={`mt-1 ${
                        alert.type === "warning"
                          ? "text-yellow-600"
                          : alert.type === "error"
                            ? "text-red-600"
                            : alert.type === "success"
                              ? "text-emerald-600"
                              : "text-sky-600"
                      }`}
                    >
                      {alert.icon}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          alert.type === "warning"
                            ? "text-yellow-800"
                            : alert.type === "error"
                              ? "text-red-800"
                              : alert.type === "success"
                                ? "text-emerald-800"
                                : "text-sky-800"
                        }`}
                      >
                        {alert.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`text-xs font-semibold ${
                      alert.type === "warning"
                        ? "text-yellow-600 hover:text-yellow-700"
                        : alert.type === "error"
                          ? "text-red-600 hover:text-red-700"
                          : alert.type === "success"
                            ? "text-emerald-600 hover:text-emerald-700"
                            : "text-sky-600 hover:text-sky-700"
                    }`}
                  >
                    {alert.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Activities
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={activity.avatar}
                  alt={activity.user}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {activity.user}
                  </p>
                  <p className="text-xs text-slate-500">{activity.action}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    activity.priority === "urgent"
                      ? "bg-red-100 text-red-700"
                      : activity.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : activity.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {activity.priority}
                </span>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render User Management Tab
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
        <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-4 py-2 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all flex items-center shadow-md">
          <FaPlus className="mr-2" /> Add New User
        </button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-xl font-bold text-slate-800">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Active Users</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.activeUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">New Today</p>
          <p className="text-xl font-bold text-emerald-600">{stats.newUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Admins</p>
          <p className="text-xl font-bold text-slate-800">24</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]"
          />
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
          <FaFilter className="mr-2" /> Filter
        </button>
        <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
          <FaDownload className="mr-2" /> Export
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] rounded-full flex items-center justify-center text-white font-bold">
                      U{i}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-900">
                        User {i}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  user{i}@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i === 1
                    ? "Super Admin"
                    : i === 2
                      ? "Bank Admin"
                      : "Customer"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i % 2 === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {i % 2 === 0 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-18
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-amber-600 hover:text-amber-800"
                      title="Permissions"
                    >
                      <FaLock />
                    </button>
                    <button
                      className="text-rose-600 hover:text-rose-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Loan Management Tab
  const renderLoanManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Loan Management</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
            <FaDownload className="mr-2" /> Export Report
          </button>
          <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-4 py-2 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all flex items-center shadow-md">
            <FaPlus className="mr-2" /> New Loan
          </button>
        </div>
      </div>

      {/* Loan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Loans</p>
          <p className="text-xl font-bold text-slate-800">{stats.totalLoans}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-xl font-bold text-emerald-600">
            {stats.approvedLoans}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-bold text-amber-600">
            {stats.pendingLoans}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="text-xl font-bold text-rose-600">
            {stats.rejectedLoans}
          </p>
        </div>
      </div>

      {/* Loan Applications Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Loan Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  #L{1000 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  John Doe {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i === 1
                    ? "Personal"
                    : i === 2
                      ? "Home"
                      : i === 3
                        ? "Car"
                        : "Business"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  ₹{i * 250000}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-{10 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i % 3 === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : i % 3 === 1
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {i % 3 === 0
                      ? "Approved"
                      : i % 3 === 1
                        ? "Pending"
                        : "Rejected"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Approve"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="text-rose-600 hover:text-rose-800"
                      title="Reject"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Fraud Reports Tab
  const renderFraudReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Fraud Reports</h2>
        <button className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all flex items-center shadow-md">
          <FaFlag className="mr-2" /> New Report
        </button>
      </div>

      {/* Fraud Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Reports</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.fraudReports}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-bold text-amber-600">
            {stats.pendingFraud}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Resolved</p>
          <p className="text-xl font-bold text-emerald-600">
            {stats.resolvedFraud}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">High Priority</p>
          <p className="text-xl font-bold text-rose-600">12</p>
        </div>
      </div>

      {/* Fraud Reports Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  #F{100 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  User {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i === 1
                    ? "Suspicious Transaction"
                    : i === 2
                      ? "Identity Theft"
                      : "Phishing"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  ₹{i * 50000}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-{10 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i === 1
                        ? "bg-rose-100 text-rose-700"
                        : i === 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {i === 1 ? "High" : i === 2 ? "Medium" : "Low"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i % 2 === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {i % 2 === 0 ? "Resolved" : "Investigating"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Resolve"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="text-amber-600 hover:text-amber-800"
                      title="Flag"
                    >
                      <FaFlag />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Support Tickets Tab
  const renderSupportTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Support Tickets</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
            <FaDownload className="mr-2" /> Export
          </button>
          <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-4 py-2 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all flex items-center shadow-md">
            <FaPlus className="mr-2" /> New Ticket
          </button>
        </div>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Tickets</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.supportTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Open</p>
          <p className="text-xl font-bold text-amber-600">
            {stats.openTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-xl font-bold text-blue-600">
            {stats.inProgressTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Closed</p>
          <p className="text-xl font-bold text-emerald-600">
            {stats.closedTickets}
          </p>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  #T{1000 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  Customer {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i === 1
                    ? "Cannot access account"
                    : i === 2
                      ? "Transaction failed"
                      : "Loan application status"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i === 1
                        ? "bg-rose-100 text-rose-700"
                        : i === 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {i === 1 ? "High" : i === 2 ? "Medium" : "Low"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i % 3 === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : i % 3 === 1
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {i % 3 === 0
                      ? "Closed"
                      : i % 3 === 1
                        ? "Open"
                        : "In Progress"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-{10 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Assign"
                    >
                      <FaUserCheck />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-800"
                      title="Reply"
                    >
                      <FaReply />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render KYC Management Tab
  const renderKYCManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">KYC Applications</h2>
        <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-4 py-2 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all flex items-center shadow-md">
          <FaDownload className="mr-2" /> Export List
        </button>
      </div>

      {/* KYC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="text-xl font-bold text-slate-800">{stats.totalKYC}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-bold text-amber-600">{stats.pendingKYC}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-xl font-bold text-emerald-600">
            {stats.approvedKYC}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="text-xl font-bold text-rose-600">{stats.rejectedKYC}</p>
        </div>
      </div>

      {/* KYC Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  #K{100 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  User {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i % 2 === 0 ? "Individual" : "Business"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i + 2} files
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-{10 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i === 1
                        ? "bg-amber-100 text-amber-700"
                        : i === 2
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {i === 1 ? "Pending" : i === 2 ? "Approved" : "Rejected"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Approve"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="text-rose-600 hover:text-rose-800"
                      title="Reject"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Bank Management Tab
  const renderBankManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Bank Management</h2>
        <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-4 py-2 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all flex items-center shadow-md">
          <FaPlus className="mr-2" /> Add New Bank
        </button>
      </div>

      {/* Bank Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Banks</p>
          <p className="text-xl font-bold text-slate-800">{stats.totalBanks}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Branches</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.totalBranches}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Employees</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.totalEmployees}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Customers</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.totalCustomers}
          </p>
        </div>
      </div>

      {/* Banks Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Bank Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Branches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Employees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Customers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  #{i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  Bank {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i === 1 ? "Headquarters" : i === 2 ? "Regional" : "National"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i * 15}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i * 100}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {i * 1000}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i % 2 === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {i % 2 === 0 ? "Active" : "Maintenance"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-amber-600 hover:text-amber-800"
                      title="Settings"
                    >
                      <FaCog />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Reports Tab
  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Generate Reports</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <FaFilePdf className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Monthly Report</h3>
          <p className="text-sm text-white/90 mb-4">
            Generate comprehensive monthly report
          </p>
          <button className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all w-full">
            Generate PDF
          </button>
        </div>

        <div className="bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl p-6 text-white">
          <FaFileExcel className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Transaction Report</h3>
          <p className="text-sm text-white/90 mb-4">
            Export transaction data to Excel
          </p>
          <button className="bg-white text-sky-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all w-full">
            Generate Excel
          </button>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-6 text-white">
          <FaFileCsv className="text-4xl mb-4" />
          <h3 className="text-xl font-bold mb-2">Analytics Report</h3>
          <p className="text-sm text-white/90 mb-4">
            Download analytics in CSV format
          </p>
          <button className="bg-white text-violet-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all w-full">
            Generate CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Custom Report
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]">
            <option>Select Report Type</option>
            <option>User Report</option>
            <option>Transaction Report</option>
            <option>Loan Report</option>
            <option>Fraud Report</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]">
            <option>Select Date Range</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]">
            <option>Select Format</option>
            <option>PDF</option>
            <option>Excel</option>
            <option>CSV</option>
          </select>
        </div>
        <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-6 py-3 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all font-semibold">
          Generate Custom Report
        </button>
      </div>
    </div>
  );

  // Render Settings Tab
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                System Name
              </label>
              <input
                type="text"
                value="Smart Bank"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value="support@smartbank.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Timezone
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Security Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">
                Two-Factor Authentication
              </span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Session Timeout</span>
              <select className="px-2 py-1 border border-slate-300 rounded">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password Policy
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647]">
                <option>Strong (8+ chars, mixed case, numbers)</option>
                <option>Medium (8+ chars, mixed case)</option>
                <option>Basic (6+ chars)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">
                Email Notifications
              </span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">SMS Alerts</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300">
                <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Push Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] text-white px-6 py-3 rounded-lg hover:from-[#1B3B5C] hover:to-[#2A4B6E] transition-all flex items-center shadow-md">
          <FaSave className="mr-2" /> Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <FaSpinner className="animate-spin text-[#0A2647] text-xl" />
            <span>Processing...</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 w-64`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-[#0A2647] to-[#1B3B5C]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <span className="text-white font-semibold">Smart Bank</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/80 hover:text-white lg:hidden"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">admin@smartbank.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaUsers /> <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab("banks")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "banks"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaBuilding /> <span>Bank Management</span>
          </button>
          <button
            onClick={() => setActiveTab("loans")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "loans"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaMoneyBillWave /> <span>Loan Management</span>
          </button>
          <button
            onClick={() => setActiveTab("fraud")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "fraud"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaShieldAlt /> <span>Fraud Reports</span>
          </button>
          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "support"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaHeadset /> <span>Support Tickets</span>
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "kyc"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaFileSignature /> <span>KYC Applications</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "reports"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaChartLine /> <span>Reports</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-[#0A2647] bg-opacity-10 text-[#0A2647]"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaCog /> <span>Settings</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`${sidebarOpen ? "lg:ml-64" : ""} transition-margin duration-300`}
      >
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <FaBars />
            </button>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2">
                <FaSearch className="text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-64"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative"
                >
                  <FaBell />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                    <div className="p-4 border-b border-slate-200">
                      <h3 className="font-semibold text-slate-800">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 hover:bg-slate-50 border-b border-slate-100"
                        >
                          <p className="text-sm text-slate-800">
                            New fraud report filed
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            5 minutes ago
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-slate-200">
                      <button className="text-sm text-[#0A2647] hover:text-[#1B3B5C]">
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0A2647] to-[#1B3B5C] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-800">
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500">admin@smartbank.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "users" && renderUserManagement()}
          {activeTab === "banks" && renderBankManagement()}
          {activeTab === "loans" && renderLoanManagement()}
          {activeTab === "fraud" && renderFraudReports()}
          {activeTab === "support" && renderSupportTickets()}
          {activeTab === "kyc" && renderKYCManagement()}
          {activeTab === "reports" && renderReports()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
