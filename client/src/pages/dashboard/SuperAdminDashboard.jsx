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
  FaWallet,
  FaMobile,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaChartPie,
  FaChartBar,
  FaExclamationTriangle,
  FaLock,
  FaUnlock,
  FaUserCheck,
  FaUserTimes,
  FaUserCog,
  FaUserTie,
  FaUserFriends,
  FaBriefcase,
  FaCreditCard,
  FaExchangeAlt,
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
  FaDatabase,
  FaServer,
  FaBug,
  FaRocket,
  FaSave,
  FaUndo,
  FaRedo,
  FaHome,
  FaHistory,
  FaBan,
  FaFlag,
  FaBullhorn,
  FaEnvelopeOpenText,
  FaFileContract,
  FaFileInvoice,
  FaFileAlt,
  FaFolderOpen,
  FaFolder,
  FaTag,
  FaTags,
  FaBoxOpen,
  FaCube,
  FaCubes,
  FaLayerGroup,
  FaChartArea,
  FaChartScatter,
  FaGlobe,
  FaLockOpen,
  FaKey,
  FaFingerprint,
  FaQrcode,
  FaBarcode,
  FaMicrochip,
  FaCloud,
  FaWifi,
  FaBluetooth,
  FaRss,
  FaSync,
  FaSyncAlt,
  FaSpinner,
  FaCircleNotch,
  FaDotCircle,
  FaCircle,
  FaSquare,
  FaToggleOn,
  FaToggleOff,
  FaCheckSquare,
  FaSquareFull,
  FaMinusSquare,
  FaPlusSquare,
  FaRegSquare,
  FaRegCheckSquare,
  FaRegMinusSquare,
  FaRegPlusSquare,
  FaRegCircle,
  FaRegDotCircle,
  FaCheck,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaAngleUp,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const SuperAdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dashboard Stats
  const [stats] = useState({
    totalUsers: 15420,
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
    totalAmount: 4567890123,
    fraudReports: 89,
    pendingFraudReports: 23,
    resolvedFraudReports: 66,
    supportTickets: 345,
    openTickets: 78,
    closedTickets: 267,
    totalKYC: 8920,
    pendingKYC: 156,
    approvedKYC: 8432,
    rejectedKYC: 332,
    totalSavings: 234567890,
    totalInvestments: 123456789,
    systemUptime: 99.98,
    serverLoad: 42,
    activeSessions: 2345,
    apiCalls: 456789,
  });

  // Chart Data
  const userGrowthData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "User Growth",
        data: [
          8500, 9200, 10100, 11200, 12300, 13500, 14200, 14800, 15200, 15420,
          15600, 15800,
        ],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const transactionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Transactions",
        data: [23456, 24567, 25678, 26789, 28901, 21012, 23123],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  const loanDistributionData = {
    labels: [
      "Personal Loans",
      "Home Loans",
      "Car Loans",
      "Business Loans",
      "Education Loans",
    ],
    datasets: [
      {
        data: [2345, 1567, 1234, 345, 187],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
      },
    ],
  };

  const revenueData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Revenue (Millions)",
        data: [45.6, 52.3, 58.9, 63.4],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Profit (Millions)",
        data: [12.3, 15.6, 18.9, 22.4],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "New loan application",
      time: "5 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "KYC document uploaded",
      time: "15 minutes ago",
      status: "completed",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Fraud report filed",
      time: "25 minutes ago",
      status: "critical",
    },
    {
      id: 4,
      user: "Sarah Williams",
      action: "Support ticket created",
      time: "35 minutes ago",
      status: "pending",
    },
    {
      id: 5,
      user: "Tom Brown",
      action: "Transaction completed",
      time: "45 minutes ago",
      status: "completed",
    },
    {
      id: 6,
      user: "Lisa Davis",
      action: "New account opened",
      time: "55 minutes ago",
      status: "completed",
    },
    {
      id: 7,
      user: "Robert Wilson",
      action: "Loan approved",
      time: "1 hour ago",
      status: "approved",
    },
  ];

  // System Alerts
  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "info",
      message: "Database backup completed",
      time: "30 minutes ago",
    },
    {
      id: 3,
      type: "success",
      message: "Security update installed",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "error",
      message: "API rate limit approaching",
      time: "2 hours ago",
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      id: 1,
      name: "Add New Bank",
      icon: <FaPlus />,
      color: "bg-blue-500",
      action: () => setActiveTab("banks"),
    },
    {
      id: 2,
      name: "Create Admin",
      icon: <FaUserCog />,
      color: "bg-green-500",
      action: () => setActiveTab("users"),
    },
    {
      id: 3,
      name: "System Backup",
      icon: <FaDatabase />,
      color: "bg-purple-500",
      action: () => handleBackup(),
    },
    {
      id: 4,
      name: "Generate Report",
      icon: <FaFilePdf />,
      color: "bg-orange-500",
      action: () => handleGenerateReport(),
    },
    {
      id: 5,
      name: "Broadcast Message",
      icon: <FaBullhorn />,
      color: "bg-red-500",
      action: () => setActiveTab("notifications"),
    },
    {
      id: 6,
      name: "Security Scan",
      icon: <FaShieldAlt />,
      color: "bg-indigo-500",
      action: () => handleSecurityScan(),
    },
  ];

  // Bank List
  const [banks] = useState([
    {
      id: 1,
      name: "Smart Bank HQ",
      type: "Headquarters",
      branches: 45,
      employees: 890,
      customers: 12530,
      status: "active",
    },
    {
      id: 2,
      name: "City Bank",
      type: "Regional",
      branches: 12,
      employees: 234,
      customers: 3456,
      status: "active",
    },
    {
      id: 3,
      name: "Metro Finance",
      type: "Regional",
      branches: 8,
      employees: 167,
      customers: 2345,
      status: "active",
    },
    {
      id: 4,
      name: "National Trust",
      type: "National",
      branches: 156,
      employees: 2345,
      customers: 34567,
      status: "active",
    },
    {
      id: 5,
      name: "Global Bank",
      type: "International",
      branches: 89,
      employees: 1234,
      customers: 23456,
      status: "inactive",
    },
  ]);

  // Admin Users
  const [admins] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@smartbank.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "2024-03-15",
    },
    {
      id: 2,
      name: "John Manager",
      email: "john@smartbank.com",
      role: "Bank Admin",
      status: "active",
      lastLogin: "2024-03-14",
    },
    {
      id: 3,
      name: "Sarah Admin",
      email: "sarah@smartbank.com",
      role: "System Admin",
      status: "active",
      lastLogin: "2024-03-15",
    },
    {
      id: 4,
      name: "Mike Super",
      email: "mike@smartbank.com",
      role: "Super Admin",
      status: "inactive",
      lastLogin: "2024-03-10",
    },
  ]);

  // Fraud Reports
  const [fraudReports] = useState([
    {
      id: 1,
      user: "John Doe",
      type: "Suspicious Transaction",
      amount: 5000,
      date: "2024-03-15",
      status: "pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      type: "Identity Theft",
      amount: 0,
      date: "2024-03-14",
      status: "investigating",
    },
    {
      id: 3,
      user: "Mike Johnson",
      type: "Phishing Attempt",
      amount: 0,
      date: "2024-03-14",
      status: "resolved",
    },
    {
      id: 4,
      user: "Sarah Williams",
      type: "Unauthorized Access",
      amount: 0,
      date: "2024-03-13",
      status: "pending",
    },
  ]);

  // Support Tickets
  const [supportTickets] = useState([
    {
      id: 1,
      user: "John Doe",
      subject: "Cannot access account",
      priority: "high",
      status: "open",
      date: "2024-03-15",
    },
    {
      id: 2,
      user: "Jane Smith",
      subject: "Transaction failed",
      priority: "medium",
      status: "in-progress",
      date: "2024-03-14",
    },
    {
      id: 3,
      user: "Mike Johnson",
      subject: "Loan application status",
      priority: "low",
      status: "closed",
      date: "2024-03-14",
    },
    {
      id: 4,
      user: "Sarah Williams",
      subject: "KYC verification issue",
      priority: "high",
      status: "open",
      date: "2024-03-13",
    },
  ]);

  // KYC Applications
  const [kycApplications] = useState([
    {
      id: 1,
      user: "John Doe",
      type: "Individual",
      documents: 3,
      date: "2024-03-15",
      status: "pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      type: "Business",
      documents: 5,
      date: "2024-03-14",
      status: "approved",
    },
    {
      id: 3,
      user: "Mike Johnson",
      type: "Individual",
      documents: 3,
      date: "2024-03-14",
      status: "rejected",
    },
    {
      id: 4,
      user: "Sarah Williams",
      type: "Individual",
      documents: 4,
      date: "2024-03-13",
      status: "pending",
    },
  ]);

  // System Logs
  const [systemLogs] = useState([
    {
      id: 1,
      timestamp: "2024-03-15 10:30:25",
      level: "info",
      message: "System backup completed",
      user: "system",
    },
    {
      id: 2,
      timestamp: "2024-03-15 10:15:12",
      level: "warning",
      message: "High CPU usage detected",
      user: "system",
    },
    {
      id: 3,
      timestamp: "2024-03-15 09:45:33",
      level: "error",
      message: "Database connection timeout",
      user: "system",
    },
    {
      id: 4,
      timestamp: "2024-03-15 09:20:18",
      level: "info",
      message: "User login successful",
      user: "admin@smartbank.com",
    },
  ]);

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

  // Handle generate report
  const handleGenerateReport = () => {
    toast.success(
      "Report generation started. You will be notified when ready.",
    );
  };

  // Handle security scan
  const handleSecurityScan = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Security scan completed. No threats detected.");
      setLoading(false);
    }, 3000);
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTransactions.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 8% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaExchangeAlt className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approvedLoans.toLocaleString()}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                ↑ 5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">System Uptime</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.systemUptime}%
              </p>
              <p className="text-xs text-green-600 mt-1">
                Server load: {stats.serverLoad}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaServer className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Growth
          </h3>
          <Line
            data={userGrowthData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
            }}
            height={200}
          />
        </div>

        {/* Transaction Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Transactions
          </h3>
          <Bar
            data={transactionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
            }}
            height={200}
          />
        </div>

        {/* Loan Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Distribution
          </h3>
          <div className="h-64">
            <Pie
              data={loanDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue & Profit
          </h3>
          <Line
            data={revenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
            height={200}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div
                className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>
              <span className="text-xs text-gray-600 text-center">
                {action.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : activity.status === "pending"
                          ? "bg-yellow-500"
                          : activity.status === "critical"
                            ? "bg-red-500"
                            : "bg-blue-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Alerts
          </h3>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg ${
                  alert.type === "warning"
                    ? "bg-yellow-50 border border-yellow-200"
                    : alert.type === "error"
                      ? "bg-red-50 border border-red-200"
                      : alert.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        alert.type === "warning"
                          ? "text-yellow-800"
                          : alert.type === "error"
                            ? "text-red-800"
                            : alert.type === "success"
                              ? "text-green-800"
                              : "text-blue-800"
                      }`}
                    >
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Banks Tab
  const renderBanks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bank Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaPlus className="mr-2" /> Add New Bank
        </button>
      </div>

      {/* Bank Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Banks</p>
          <p className="text-xl font-bold text-gray-900">{stats.totalBanks}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Branches</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.totalBranches}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Active Banks</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.totalBanks - 2}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Inactive Banks</p>
          <p className="text-xl font-bold text-gray-900">2</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
          <FaFilter className="mr-2" /> Filter
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
          <FaDownload className="mr-2" /> Export
        </button>
      </div>

      {/* Banks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banks.map((bank) => (
              <tr key={bank.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{bank.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bank.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bank.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bank.branches}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bank.employees}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bank.customers.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      bank.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bank.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
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

  // Render Users Tab
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaPlus className="mr-2" /> Add New User
        </button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-xl font-bold text-gray-900">{stats.activeUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-xl font-bold text-gray-900">{admins.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">New Today</p>
          <p className="text-xl font-bold text-gray-900">156</p>
        </div>
      </div>

      {/* User Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button className="py-4 px-1 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
            All Users
          </button>
          <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
            Admins
          </button>
          <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
            Employees
          </button>
          <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
            Customers
          </button>
        </nav>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-gray-500 text-2xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      admin.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-800"
                      title="Permissions"
                    >
                      <FaLock />
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
        <h2 className="text-2xl font-bold text-gray-900">Fraud Reports</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>

      {/* Fraud Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.fraudReports}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {stats.pendingFraudReports}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-xl font-bold text-green-600">
            {stats.resolvedFraudReports}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-xl font-bold text-red-600">12</p>
        </div>
      </div>

      {/* Fraud Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fraudReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{report.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${report.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : report.status === "investigating"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Mark as Resolved"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Flag as Urgent"
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
        <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          View All Tickets
        </button>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Tickets</p>
          <p className="text-xl font-bold text-gray-900">
            {stats.supportTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-xl font-bold text-yellow-600">
            {stats.openTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Closed</p>
          <p className="text-xl font-bold text-green-600">
            {stats.closedTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-xl font-bold text-red-600">23</p>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supportTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{ticket.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ticket.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : ticket.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === "closed"
                        ? "bg-gray-100 text-gray-800"
                        : ticket.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
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

  // Render KYC Tab
  const renderKYC = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">KYC Applications</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export List
        </button>
      </div>

      {/* KYC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-xl font-bold text-gray-900">{stats.totalKYC}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">
            {stats.pendingKYC}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-xl font-bold text-green-600">
            {stats.approvedKYC}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-xl font-bold text-red-600">{stats.rejectedKYC}</p>
        </div>
      </div>

      {/* KYC Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kycApplications.map((kyc) => (
              <tr key={kyc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{kyc.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {kyc.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kyc.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kyc.documents} files
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kyc.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      kyc.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : kyc.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {kyc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="View Documents"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Approve"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
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

  // Render System Logs Tab
  const renderSystemLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Logs</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <FaDownload className="mr-2" /> Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <FaSync className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Log Filters */}
      <div className="flex flex-wrap gap-4">
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Levels</option>
          <option>Info</option>
          <option>Warning</option>
          <option>Error</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Custom Range</option>
        </select>
        <input
          type="text"
          placeholder="Search logs..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {systemLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      log.level === "error"
                        ? "bg-red-100 text-red-800"
                        : log.level === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {log.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.user}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render Settings Tab
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Name
              </label>
              <input
                type="text"
                value="Smart Bank"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value="support@smartbank.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>UTC</option>
                <option>EST</option>
                <option>PST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Security Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Two-Factor Authentication
              </span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Session Timeout</span>
              <select className="px-2 py-1 border border-gray-300 rounded">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Policy
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Strong (8+ chars, mixed case, numbers)</option>
                <option>Medium (8+ chars, mixed case)</option>
                <option>Basic (6+ chars)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SMS Alerts</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notifications</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaSave className="mr-2" /> Save Changes
        </button>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-2xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-30 w-64`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
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
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              SA
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Super Admin</p>
              <p className="text-xs text-gray-500">admin@smartbank.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("banks")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "banks"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaBuilding />
            <span>Bank Management</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaUsers />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab("loans")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "loans"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaMoneyBillWave />
            <span>Loan Management</span>
          </button>

          <button
            onClick={() => setActiveTab("fraud")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "fraud"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaShieldAlt />
            <span>Fraud Reports</span>
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "support"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaHeadset />
            <span>Support Tickets</span>
          </button>

          <button
            onClick={() => setActiveTab("kyc")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "kyc"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaFileSignature />
            <span>KYC Applications</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "logs"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaDatabase />
            <span>System Logs</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaCog />
            <span>Settings</span>
          </button>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
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
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <FaBars />
            </button>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <FaSearch className="text-gray-400 mr-2" />
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
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative"
                >
                  <FaBell />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 hover:bg-gray-50 border-b border-gray-100"
                        >
                          <p className="text-sm text-gray-900">
                            New fraud report filed
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            5 minutes ago
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  SA
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    Super Admin
                  </p>
                  <p className="text-xs text-gray-500">admin@smartbank.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "banks" && renderBanks()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "fraud" && renderFraudReports()}
          {activeTab === "support" && renderSupportTickets()}
          {activeTab === "kyc" && renderKYC()}
          {activeTab === "logs" && renderSystemLogs()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
