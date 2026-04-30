import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaMoneyBillWave,
  FaChartLine,
  FaTicketAlt,
  FaShieldAlt,
  FaDownload,
  FaFilter,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaBan,
  FaTrash,
  FaEdit,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaBell,
  FaCog,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaLock,
  FaPalette,
  FaIdCard,
  FaExchangeAlt,
  FaClock,
  FaExclamationTriangle,
  FaBuilding,
  FaGlobe,
  FaServer,
  FaDatabase,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaSync,
  FaShieldVirus,
  FaKey,
  FaRobot,
  FaMicrochip,
  FaChartPie,
  FaChartBar,
  FaChartArea,
  FaNetworkWired,
  FaWifi,
  FaBug,
  FaClipboardList,
  FaFileInvoice,
  FaBalanceScale,
  FaGavel,
  FaHandHoldingUsd,
  FaUniversity,
  FaLandmark,
  FaPiggyBank,
  FaCreditCard,
  FaBitcoin,
  FaEthereum,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { formatCompactCurrency, formatCurrency } from "../../utils/formatters";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Scatter,
} from "recharts";

// Import modules
import SystemHealth from "../../components/superadmin/SystemHealth";
import AuditLogs from "../../components/superadmin/AuditLogs";
import AdminManagement from "../../components/superadmin/AdminManagement";
import BranchManagement from "../../components/superadmin/BranchManagement";
import SystemSettings from "../../components/superadmin/SystemSettings";

const getFallbackChartData = () => ({
  revenueGrowth: [
    { month: "Jan", revenue: 125000, expenses: 98000, profit: 27000 },
    { month: "Feb", revenue: 145000, expenses: 102000, profit: 43000 },
    { month: "Mar", revenue: 168000, expenses: 110000, profit: 58000 },
    { month: "Apr", revenue: 182000, expenses: 115000, profit: 67000 },
    { month: "May", revenue: 195000, expenses: 120000, profit: 75000 },
    { month: "Jun", revenue: 210000, expenses: 125000, profit: 85000 },
  ],
  userActivity: [
    { hour: "00:00", active: 120 },
    { hour: "04:00", active: 80 },
    { hour: "08:00", active: 450 },
    { hour: "12:00", active: 890 },
    { hour: "16:00", active: 1200 },
    { hour: "20:00", active: 650 },
  ],
  systemMetrics: [
    { metric: "CPU Usage", value: 45 },
    { metric: "Memory Usage", value: 62 },
    { metric: "Disk Usage", value: 58 },
    { metric: "Network Load", value: 35 },
    { metric: "DB Load", value: 72 },
  ],
  branchPerformance: [
    { branch: "NYC", transactions: 12500, revenue: 450000 },
    { branch: "LA", transactions: 9800, revenue: 380000 },
    { branch: "Chicago", transactions: 8700, revenue: 320000 },
    { branch: "Miami", transactions: 6500, revenue: 250000 },
    { branch: "Dallas", transactions: 5400, revenue: 210000 },
  ],
});

const getFallbackStatusSummary = () => ([
  { role: "superadmin", label: "Super Admins", total: 1, active: 1, pending: 0, inactive: 0, suspended: 0 },
  { role: "admin", label: "Admins", total: 12, active: 10, pending: 1, inactive: 1, suspended: 0 },
  { role: "employee", label: "Employees", total: 134, active: 121, pending: 8, inactive: 5, suspended: 0 },
  { role: "customer", label: "Customers", total: 15273, active: 14120, pending: 860, inactive: 233, suspended: 60 },
]);

const getFallbackAdminSummary = () => ({ total: 0, active: 0, pending: 0, inactive: 0, suspended: 0 });

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSuperAdmins: 0,
    totalAdmins: 0,
    totalEmployees: 0,
    totalCustomers: 0,
    totalBranches: 0,
    totalTransactions: 0,
    totalVolume: 0,
    systemUptime: "99.99%",
    activeSessions: 0,
    pendingAudits: 0,
    fraudAlerts: 0,
    revenue: 0,
    expenses: 0,
    profit: 0,
  });

  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    storage: 58,
    database: 72,
    api: 98,
    uptime: 99.99,
  });

  const [recentAudits, setRecentAudits] = useState([]);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [adminSummary, setAdminSummary] = useState(getFallbackAdminSummary());
  const [statusSummary, setStatusSummary] = useState(getFallbackStatusSummary());
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [chartData, setChartData] = useState(getFallbackChartData());

  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Super Admin Profile
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "super.admin@smartbank.com",
    role: "Super Administrator",
    department: "Executive Management",
    employeeId: "SUP-001",
    joinDate: "2019-01-01",
    phone: "+1 (555) 000-0001",
    mobile: "+1 (555) 000-0002",
    address: "Smart Bank Headquarters",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    avatar: "https://randomuser.me/api/portraits/men/100.jpg",
    dateOfBirth: "1980-01-01",
    gender: "Male",
    nationality: "American",
    emergencyContact: {
      name: "Security Team",
      relationship: "Work",
      phone: "+1 (555) 000-0000",
    },
    permissions: ["full_access", "manage_admins", "manage_system", "audit_logs"],
  });

  // System Settings
  const [settings, setSettings] = useState({
    system: {
      maintenanceMode: false,
      debugMode: false,
      apiRateLimit: 1000,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
    },
    security: {
      encryptionLevel: "AES-256",
      passwordPolicy: "strong",
      mfaRequired: true,
      ipWhitelist: ["192.168.1.0/24"],
      auditRetention: 365,
    },
    features: {
      cryptoEnabled: true,
      loanModule: true,
      fraudDetection: true,
      mobileBanking: true,
      internationalTransfers: true,
    },
    integrations: {
      swiftEnabled: true,
      fedwireEnabled: true,
      achEnabled: true,
      cryptoGateway: "coinbase",
    },
  });

  useEffect(() => {
    fetchDashboardData();
    fetchSystemHealth();
    fetchAuditLogs();
    fetchAdmins();
    fetchPerformanceData();
  }, [selectedPeriod, activeTab]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/superadmin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || {};
      setStats((currentStats) => ({ ...currentStats, ...data }));
      setStatusSummary(data.statusSummary || getFallbackStatusSummary());
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalUsers: 15420,
        totalSuperAdmins: 1,
        totalAdmins: 12,
        totalEmployees: 134,
        totalCustomers: 15273,
        totalBranches: 28,
        totalTransactions: 45678,
        totalVolume: 12500000,
        systemUptime: "99.99%",
        activeSessions: 342,
        pendingAudits: 5,
        fraudAlerts: 12,
        revenue: 2450000,
        expenses: 1250000,
        profit: 1200000,
      });
      setStatusSummary(getFallbackStatusSummary());
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/superadmin/system-health", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const health = response.data.data;
      const databaseLoad = health.database?.maxConnections
        ? (health.database.connections / health.database.maxConnections) * 100
        : 72;
      setSystemHealth({
        cpu: health.cpu?.usage || 45,
        memory: health.memory?.percentage || 62,
        storage: health.disk?.percentage || 58,
        database: databaseLoad,
        api: 98,
        uptime: 99.99,
      });
    } catch (error) {
      setSystemHealth({
        cpu: 45,
        memory: 62,
        storage: 58,
        database: 72,
        api: 98,
        uptime: 99.99,
      });
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/superadmin/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentAudits(response.data.data?.logs || []);
    } catch (error) {
      setRecentAudits([
        { id: 1, action: "Admin user created", user: "superadmin", target: "john.admin", time: "5 mins ago", status: "success", ip: "192.168.1.1" },
        { id: 2, action: "System settings updated", user: "superadmin", target: "security config", time: "1 hour ago", status: "success", ip: "192.168.1.1" },
        { id: 3, action: "User role changed", user: "superadmin", target: "jane.smith", time: "2 hours ago", status: "success", ip: "192.168.1.1" },
        { id: 4, action: "Failed login attempt", user: "unknown", target: "admin", time: "3 hours ago", status: "failed", ip: "10.0.0.5" },
        { id: 5, action: "Database backup completed", user: "system", target: "backup", time: "4 hours ago", status: "success", ip: "localhost" },
      ]);
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/superadmin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecentAdmins(response.data.data?.admins || []);
      setAdminSummary(response.data.data?.summary || getFallbackAdminSummary());
    } catch (error) {
      console.error("Error fetching admins:", error);
      setRecentAdmins([]);
      setAdminSummary(getFallbackAdminSummary());
    } finally {
      setAdminsLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/superadmin/performance?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || {};
      setPerformanceData(data.performance || []);
      setChartData({
        revenueGrowth: data.revenueGrowth || getFallbackChartData().revenueGrowth,
        userActivity: data.userActivity || getFallbackChartData().userActivity,
        systemMetrics: data.systemMetrics || getFallbackChartData().systemMetrics,
        branchPerformance: data.branchPerformance || getFallbackChartData().branchPerformance,
      });
    } catch (error) {
      setChartData(getFallbackChartData());
      setPerformanceData([
        { metric: "Response Time", value: 245, target: 300 },
        { metric: "Success Rate", value: 98.5, target: 99 },
        { metric: "Availability", value: 99.99, target: 99.9 },
        { metric: "Error Rate", value: 0.5, target: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSuperAdminData = async () => {
    await Promise.all([fetchDashboardData(), fetchAdmins(), fetchAuditLogs()]);
  };

  const handleCreateAdmin = async (adminData) => {
    const token = localStorage.getItem("token");
    await axios.post("/api/users", {
      ...adminData,
      role: "admin",
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Admin created successfully");
    await refreshSuperAdminData();
  };

  const handleUpdateAdmin = async (adminId, adminData) => {
    const token = localStorage.getItem("token");
    await axios.put(`/api/users/${adminId}`, adminData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Admin updated successfully");
    await refreshSuperAdminData();
  };

  const handleToggleAdminStatus = async (admin) => {
    const token = localStorage.getItem("token");
    const nextStatus = admin.status === "active" ? "inactive" : "active";

    await axios.put(`/api/users/${admin.id}`, { status: nextStatus }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success(`Admin ${nextStatus === "active" ? "activated" : "deactivated"}`);
    await refreshSuperAdminData();
  };

  const handleDeleteAdmin = async (adminId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/users/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Admin deactivated successfully");
    await refreshSuperAdminData();
  };

  const handleUpdateSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/superadmin/settings", settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("System settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const handleMaintenanceMode = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/superadmin/maintenance", {
        mode: !settings.system.maintenanceMode,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings({
        ...settings,
        system: { ...settings.system, maintenanceMode: !settings.system.maintenanceMode }
      });
      toast.success(`Maintenance mode ${!settings.system.maintenanceMode ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to toggle maintenance mode");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const [firstName = "Super", ...lastNameParts] = profile.name.split(" ");
      await axios.put("/api/users/profile", {
        firstName,
        lastName: lastNameParts.join(" ") || "Admin",
        phone: profile.phone,
        address: profile.address,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, suffix = "" }) => {
    // Handle non-numeric values
    const displayValue = typeof value === 'number' ? value.toLocaleString() : (value || 0);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{displayValue}{suffix}</p>
            {trend && (
              <p className={`text-xs mt-2 flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {trendValue} from last month
              </p>
            )}
          </div>
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const formatMoneyTooltip = (value, name) => {
    const metricName = String(name).toLowerCase();
    const isCurrencyMetric =
      metricName.includes("revenue") ||
      metricName.includes("expenses") ||
      metricName.includes("profit");

    return [isCurrencyMetric ? formatCurrency(value) : Number(value || 0).toLocaleString(), name];
  };

  const HealthMetric = ({ title, value, icon: Icon, color, max = 100 }) => {
    const numValue = typeof value === 'number' ? value : 0;
    const percentage = (numValue / max) * 100;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <span className="text-sm font-bold">{numValue.toFixed(1)}{max === 100 ? '%' : ''}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  const StatusSummaryCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="text-2xl font-bold text-slate-800">{item.total}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <FaUsers className="w-5 h-5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-green-50 px-3 py-2 text-green-700">Active: {item.active}</div>
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">Pending: {item.pending}</div>
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">Inactive: {item.inactive}</div>
        <div className="rounded-lg bg-red-50 px-3 py-2 text-red-700">Suspended: {item.suspended}</div>
      </div>
    </div>
  );

  // Navigation Tabs
  const tabs = [
    { id: "dashboard", label: "Overview", icon: <FaTachometerAlt />, superOnly: false },
    { id: "system", label: "System Health", icon: <FaServer />, superOnly: true },
    { id: "admins", label: "Admin Management", icon: <FaUserCircle />, superOnly: true },
    { id: "branches", label: "Branch Management", icon: <FaBuilding />, superOnly: true },
    { id: "audit", label: "Audit Logs", icon: <FaClipboardList />, superOnly: true },
    { id: "settings", label: "System Settings", icon: <FaCog />, superOnly: true },
    { id: "profile", label: "Profile", icon: <FaUserCircle />, superOnly: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const profitMargin = stats.revenue > 0 ? `${((stats.profit / stats.revenue) * 100).toFixed(1)}%` : "0.0%";

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Super Admin Portal</h1>
              <p className="text-purple-200 mt-1">System-wide administration and monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              {settings.system.maintenanceMode && (
                <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-semibold flex items-center">
                  <FaExclamationTriangle className="mr-1" /> Maintenance Mode
                </span>
              )}
              <button className="relative p-2 text-white hover:bg-purple-800 rounded-lg transition-colors">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={handleLogout} className="p-2 text-white hover:bg-purple-800 rounded-lg transition-colors">
                <FaSignOutAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-10 shadow-sm">
        <div className="px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.filter(tab => !tab.superOnly || (tab.superOnly && profile.role === "Super Administrator")).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard Overview Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={stats.totalUsers} icon={FaUsers} color="bg-blue-500" trend="up" trendValue="12%" />
              <StatCard title="Super Admins" value={stats.totalSuperAdmins} icon={FaShieldAlt} color="bg-violet-600" />
              <StatCard title="System Admins" value={stats.totalAdmins} icon={FaUserCheck} color="bg-purple-500" />
              <StatCard title="Employees" value={stats.totalEmployees} icon={FaIdCard} color="bg-sky-500" />
              <StatCard title="Customers" value={stats.totalCustomers} icon={FaUserCircle} color="bg-amber-500" />
              <StatCard title="Total Branches" value={stats.totalBranches} icon={FaBuilding} color="bg-emerald-500" trend="up" trendValue="2" />
              <StatCard title="System Uptime" value={stats.systemUptime} icon={FaServer} color="bg-green-500" />
              <StatCard title="Total Transactions" value={stats.totalTransactions} icon={FaExchangeAlt} color="bg-cyan-500" />
              <StatCard title="Volume" value={formatCompactCurrency(stats.totalVolume)} icon={FaMoneyBillWave} color="bg-emerald-500" trend="up" trendValue="15%" />
              <StatCard title="Active Sessions" value={stats.activeSessions} icon={FaUsers} color="bg-indigo-500" />
              <StatCard title="Profit Margin" value={profitMargin} icon={FaPercent} color="bg-teal-500" trend="up" trendValue="3%" />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaChartPie className="mr-2 text-purple-600" /> User Status Overview</h3>
                <p className="text-sm text-slate-500">Live database counts for super admins, admins, employees, and customers</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {statusSummary.map((item) => (
                  <StatusSummaryCard key={item.role} item={item} />
                ))}
              </div>
            </div>

            {/* System Health Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaServer className="mr-2 text-purple-600" /> System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <HealthMetric title="CPU Usage" value={systemHealth.cpu} icon={FaMicrochip} color="bg-blue-500" />
                <HealthMetric title="Memory Usage" value={systemHealth.memory} icon={FaDatabase} color="bg-green-500" />
                <HealthMetric title="Storage Usage" value={systemHealth.storage} icon={FaCloudUploadAlt} color="bg-yellow-500" />
                <HealthMetric title="Database Load" value={systemHealth.database} icon={FaDatabase} color="bg-red-500" />
                <HealthMetric title="API Response" value={systemHealth.api} icon={FaNetworkWired} color="bg-purple-500" />
                <HealthMetric title="Uptime" value={systemHealth.uptime} icon={FaSync} color="bg-emerald-500" max={100} />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Revenue & Profit Analysis</h3>
                  <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-1 border rounded-lg text-sm">
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData.revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={formatMoneyTooltip} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue (LKR)" />
                    <Bar yAxisId="left" dataKey="expenses" fill="#ef4444" name="Expenses (LKR)" />
                    <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit (LKR)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6">User Activity (24h)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="active" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Branch Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaBuilding className="mr-2 text-purple-600" /> Branch Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.branchPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={formatMoneyTooltip} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="transactions" fill="#3b82f6" name="Transactions" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (LKR)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Audit Logs */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Audit Logs</h3>
                <button className="text-purple-600 hover:text-purple-700 text-sm">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentAudits.map((audit) => (
                      <tr key={audit.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{audit.action}</td>
                        <td className="px-6 py-4">{audit.user}</td>
                        <td className="px-6 py-4">{audit.target}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${audit.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">{audit.ip}</td>
                        <td className="px-6 py-4 text-sm">{audit.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === "system" && <SystemHealth systemHealth={systemHealth} performanceData={performanceData} />}
        
        {/* Admin Management Tab */}
        {activeTab === "admins" && (
          <AdminManagement
            admins={recentAdmins}
            summary={adminSummary}
            loading={adminsLoading}
            onCreateAdmin={handleCreateAdmin}
            onUpdateAdmin={handleUpdateAdmin}
            onToggleAdminStatus={handleToggleAdminStatus}
            onDeleteAdmin={handleDeleteAdmin}
          />
        )}
        
        {/* Branch Management Tab */}
        {activeTab === "branches" && <BranchManagement />}
        
        {/* Audit Logs Tab */}
        {activeTab === "audit" && <AuditLogs auditLogs={recentAudits} />}
        
        {/* System Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* System Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaCog className="mr-2 text-purple-600" /> System Configuration</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <span>Maintenance Mode</span>
                    <button
                      onClick={handleMaintenanceMode}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.system.maintenanceMode ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                      }`}
                    >
                      {settings.system.maintenanceMode ? 'Disable' : 'Enable'}
                    </button>
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <span>Debug Mode</span>
                    <input
                      type="checkbox"
                      checked={settings.system.debugMode}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, debugMode: e.target.checked}})}
                      className="w-4 h-4 text-purple-600"
                    />
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm mb-2">API Rate Limit (requests/min)</label>
                    <input
                      type="number"
                      value={settings.system.apiRateLimit}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, apiRateLimit: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <div className="p-3 bg-gray-50 rounded-lg mb-2">
                    <label className="block text-sm mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.system.sessionTimeout}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, sessionTimeout: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.system.maxLoginAttempts}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, maxLoginAttempts: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaLock className="mr-2 text-purple-600" /> Security Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="p-3 bg-gray-50 rounded-lg mb-2">
                    <label className="block text-sm mb-2">Encryption Level</label>
                    <select
                      value={settings.security.encryptionLevel}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, encryptionLevel: e.target.value}})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option>AES-256</option>
                      <option>AES-128</option>
                      <option>RSA-2048</option>
                    </select>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg mb-2">
                    <label className="block text-sm mb-2">Password Policy</label>
                    <select
                      value={settings.security.passwordPolicy}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, passwordPolicy: e.target.value}})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option>weak</option>
                      <option>medium</option>
                      <option>strong</option>
                      <option>very_strong</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <span>MFA Required for Admins</span>
                    <input
                      type="checkbox"
                      checked={settings.security.mfaRequired}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, mfaRequired: e.target.checked}})}
                      className="w-4 h-4 text-purple-600"
                    />
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm mb-2">Audit Log Retention (days)</label>
                    <input
                      type="number"
                      value={settings.security.auditRetention}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, auditRetention: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaRobot className="mr-2 text-purple-600" /> Feature Toggles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Cryptocurrency Integration</span>
                  <input
                    type="checkbox"
                    checked={settings.features.cryptoEnabled}
                    onChange={(e) => setSettings({...settings, features: {...settings.features, cryptoEnabled: e.target.checked}})}
                    className="w-4 h-4 text-purple-600"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Loan Management Module</span>
                  <input
                    type="checkbox"
                    checked={settings.features.loanModule}
                    onChange={(e) => setSettings({...settings, features: {...settings.features, loanModule: e.target.checked}})}
                    className="w-4 h-4 text-purple-600"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Fraud Detection System</span>
                  <input
                    type="checkbox"
                    checked={settings.features.fraudDetection}
                    onChange={(e) => setSettings({...settings, features: {...settings.features, fraudDetection: e.target.checked}})}
                    className="w-4 h-4 text-purple-600"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Mobile Banking</span>
                  <input
                    type="checkbox"
                    checked={settings.features.mobileBanking}
                    onChange={(e) => setSettings({...settings, features: {...settings.features, mobileBanking: e.target.checked}})}
                    className="w-4 h-4 text-purple-600"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleUpdateSettings} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save All Settings
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full border-4 border-purple-500" />
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-purple-600 font-semibold">{profile.role}</p>
                    <p className="text-sm text-slate-500">Employee ID: {profile.employeeId}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                  <FaEdit className="mr-2" /> {isEditingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaUserCircle className="mr-2 text-purple-600" /> Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Full Name</label>{isEditingProfile ? <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.name}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Email</label>{isEditingProfile ? <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.email}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Phone</label>{isEditingProfile ? <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.phone}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Department</label><p className="text-slate-700">{profile.department}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaKey className="mr-2 text-purple-600" /> Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {profile.permissions.map((perm, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{perm}</span>
                ))}
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsEditingProfile(false)} className="px-6 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={handleUpdateProfile} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
