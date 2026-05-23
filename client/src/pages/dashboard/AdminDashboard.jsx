import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaMoneyBillWave,
  FaChartLine,
  FaTicketAlt,
  FaShieldAlt,
  FaFilter,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaBell,
  FaCog,
  FaTachometerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaLock,
  FaPalette,
  FaIdCard,
  FaExchangeAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { formatCompactCurrency } from "../../utils/formatters";
import api from "../../services/api";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TransactionsModule from "../../components/admin/TransactionsModule";
import KYCModule from "../../components/admin/KYCModule";
import FraudModule from "../../components/admin/FraudModule";
import ReportsModule from "../../components/admin/ReportsModule";

const initialProfile = {
  name: "",
  email: "",
  role: "Admin",
  department: "",
  employeeId: "",
  joinDate: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  avatar: "",
  dateOfBirth: "",
};

const initialSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
    dailyDigest: true,
    weeklyReport: true,
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceManagement: true,
  },
  appearance: {
    theme: "light",
    compactMode: false,
    animations: true,
    sidebarCollapsed: false,
  },
  preferences: {
    language: "en",
    timezone: "Asia/Colombo",
    dateFormat: "YYYY-MM-DD",
    numberFormat: "en-US",
  },
  system: {
    backupSchedule: "daily",
    autoUpdate: true,
    maintenanceMode: false,
    logRetention: 90,
  },
};

const emptyUserForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  role: "customer",
  status: "active",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingKYC: 0,
    totalTransactions: 0,
    totalVolume: 0,
    pendingTickets: 0,
    fraudAlerts: 0,
    totalEmployees: 0,
    branches: 0,
    loanApplications: 0,
    approvalRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [chartData, setChartData] = useState({
    userGrowth: [],
    transactionVolume: [],
    kycStatus: [],
    revenue: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [settings, setSettings] = useState(initialSettings);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create");
  const [userForm, setUserForm] = useState(emptyUserForm);

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, chartsResponse, activitiesResponse, approvalsResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get(`/admin/charts?period=${selectedPeriod}`),
        api.get("/admin/activities"),
        api.get("/admin/pending-approvals"),
      ]);

      setStats(statsResponse.data.data);
      setChartData(chartsResponse.data.data);
      setRecentActivities(activitiesResponse.data.data || []);
      setRecentUsers(activitiesResponse.data.users || []);
      setPendingApprovals(approvalsResponse.data.data || []);
    } catch (error) {
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("/admin/profile");
      setProfile((prev) => ({ ...prev, ...(response.data.data || {}) }));
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/settings");
      setSettings((prev) => ({ ...prev, ...(response.data.data?.settings || {}) }));
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await api.get("/users");
      const mappedUsers = (response.data.data?.users || []).map((user) => ({
        id: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status,
      }));
      setAllUsers(mappedUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handlePendingApproval = async (approval, action) => {
    const reason =
      action === "reject"
        ? window.prompt(`Enter a reason to reject this ${approval.type} request:`) || ""
        : "";

    if (action === "reject" && !reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      await api.put(`/admin/pending-approvals/${approval.type}/${approval.id}`, {
        action,
        reason,
      });
      toast.success(`${approval.type.toUpperCase()} request ${action}d`);
      fetchDashboardData();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await api.put("/admin/profile", profile);
      setProfile((prev) => ({ ...prev, ...(response.data.data || {}) }));
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const response = await api.put("/admin/settings", { settings });
      setSettings(response.data.data?.settings || settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const openCreateUserModal = () => {
    setUserModalMode("create");
    setUserForm(emptyUserForm);
    setShowUserModal(true);
  };

  const openEditUserModal = (user) => {
    const [firstName = "", ...lastNameParts] = (user.name || "").split(" ");
    setUserModalMode("edit");
    setUserForm({
      id: user.id,
      firstName,
      lastName: lastNameParts.join(" "),
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "customer",
      status: user.status || "active",
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    setSavingUser(true);
    try {
      if (userModalMode === "create") {
        await api.post("/users", userForm);
        toast.success("User created successfully");
      } else {
        await api.put(`/users/${userForm.id}`, {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          email: userForm.email,
          phone: userForm.phone,
          address: userForm.address,
          role: userForm.role,
          status: userForm.status,
        });
        toast.success("User updated successfully");
      }

      setShowUserModal(false);
      fetchUsers();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeactivateUser = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}?`)) {
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);
      toast.success("User deactivated successfully");
      fetchUsers();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const filteredUsers = allUsers.filter((user) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      String(user.role).toLowerCase().includes(term)
    );
  });

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "completed":
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
      case "inactive":
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "users", label: "Users Management", icon: <FaUsers /> },
    { id: "transactions", label: "Transactions", icon: <FaExchangeAlt /> },
    { id: "kyc", label: "KYC Verification", icon: <FaIdCard /> },
    { id: "fraud", label: "Fraud Monitoring", icon: <FaShieldAlt /> },
    { id: "reports", label: "Reports", icon: <FaChartLine /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
    { id: "profile", label: "Profile", icon: <FaUserCircle /> },
  ];

  if (loading && activeTab === "dashboard") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
              <p className="text-slate-500 mt-1">Welcome back, {profile.name || "Admin"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={handleLogout} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <FaSignOutAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-10">
        <div className="px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600"
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
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={stats.totalUsers} icon={FaUsers} color="bg-blue-500" trend="up" trendValue="12%" />
              <StatCard title="Active Users" value={stats.activeUsers} icon={FaUserCheck} color="bg-green-500" trend="up" trendValue="8%" />
              <StatCard title="Pending KYC" value={stats.pendingKYC} icon={FaUserClock} color="bg-yellow-500" trend="down" trendValue="5%" />
              <StatCard title="Fraud Alerts" value={stats.fraudAlerts} icon={FaShieldAlt} color="bg-red-500" trend="up" trendValue="2%" />
              <StatCard title="Total Transactions" value={stats.totalTransactions} icon={FaExchangeAlt} color="bg-purple-500" />
              <StatCard title="Transaction Volume" value={formatCompactCurrency(stats.totalVolume)} icon={FaMoneyBillWave} color="bg-emerald-500" trend="up" trendValue="15%" />
              <StatCard title="Pending Tickets" value={stats.pendingTickets} icon={FaTicketAlt} color="bg-orange-500" trend="down" trendValue="3%" />
              <StatCard title="Approval Rate" value={`${stats.approvalRate}%`} icon={FaPercent} color="bg-teal-500" trend="up" trendValue="2%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">User Growth</h3>
                  <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-1 border rounded-lg text-sm">
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6">KYC Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData.kycStatus} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                      {chartData.kycStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b"><h3 className="text-lg font-semibold">Recent Activities</h3></div>
                <div className="divide-y">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === "user" ? "bg-blue-100" : activity.type === "kyc" ? "bg-green-100" : "bg-red-100"}`}>
                          {activity.type === "user" && <FaUserPlus className="text-blue-600" />}
                          {activity.type === "kyc" && <FaCheckCircle className="text-green-600" />}
                          {activity.type !== "user" && activity.type !== "kyc" && <FaExclamationTriangle className="text-red-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-slate-500">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                      <button className="text-blue-600"><FaEye /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Pending Approvals</h3>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">{pendingApprovals.length} pending</span>
                </div>
                <div className="divide-y">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{approval.type.toUpperCase()} Request</p>
                          <p className="text-sm text-slate-600">From: {approval.user}</p>
                          <p className="text-xs text-slate-500">Date: {approval.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${approval.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{approval.priority}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handlePendingApproval(approval, "approve")} className="flex-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"><FaCheckCircle className="mr-1" /> Approve</button>
                        <button onClick={() => handlePendingApproval(approval, "reject")} className="flex-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center justify-center"><FaTimesCircle className="mr-1" /> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Users Management</h3>
              <button onClick={openCreateUserModal} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"><FaPlus className="mr-2" /> Add User</button>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4 gap-4">
                <div className="relative flex-1 max-w-md">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 border rounded-lg hover:bg-slate-50 flex items-center"><FaFilter className="mr-2" /> Filters</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(usersLoading ? [] : filteredUsers).map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4 capitalize">{user.role}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>{user.status}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button onClick={() => openEditUserModal(user)} className="text-blue-600"><FaEdit /></button>
                            <button onClick={() => handleDeactivateUser(user)} className="text-red-600"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usersLoading && <p className="p-6 text-slate-500">Loading users...</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && <TransactionsModule />}
        {activeTab === "kyc" && <KYCModule />}
        {activeTab === "fraud" && <FraudModule />}
        {activeTab === "reports" && <ReportsModule />}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaBell className="mr-2 text-emerald-600" /> Notification Settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.notifications.email} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, email: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>Email Notifications</span></label>
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.notifications.push} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, push: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>Push Notifications</span></label>
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.notifications.sms} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, sms: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>SMS Alerts</span></label>
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.notifications.dailyDigest} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, dailyDigest: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>Daily Digest</span></label>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaLock className="mr-2 text-emerald-600" /> Security Settings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.security.twoFactorAuth} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, twoFactorAuth: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>Two-Factor Authentication</span></label>
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.security.loginAlerts} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, loginAlerts: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>Login Alerts</span></label>
                <div>
                  <label className="block text-sm mb-2">Session Timeout (minutes)</label>
                  <input type="number" value={settings.security.sessionTimeout} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: parseInt(e.target.value || "0", 10) } })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaPalette className="mr-2 text-emerald-600" /> Appearance</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Theme</label>
                  <select value={settings.appearance.theme} onChange={(e) => setSettings({ ...settings, appearance: { ...settings.appearance, theme: e.target.value } })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <label className="flex items-center space-x-3"><input type="checkbox" checked={settings.appearance.compactMode} onChange={(e) => setSettings({ ...settings, appearance: { ...settings.appearance, compactMode: e.target.checked } })} className="w-4 h-4 text-emerald-600" /><span>Compact Mode</span></label>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleUpdateSettings} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save All Settings</button>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 overflow-hidden">
                    {profile.avatar ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" /> : (profile.name || "A").split(" ").map((part) => part[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-slate-500">{profile.role} • {profile.department || "Administration"}</p>
                    <p className="text-sm text-slate-400">Employee ID: {profile.employeeId || "N/A"}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center">
                  <FaEdit className="mr-2" /> {isEditingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center"><FaUserCircle className="mr-2 text-emerald-600" /> Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Full Name</label>{isEditingProfile ? <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.name}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Email</label>{isEditingProfile ? <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.email}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Phone</label>{isEditingProfile ? <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.phone}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Date of Birth</label>{isEditingProfile ? <input type="date" value={profile.dateOfBirth || ""} onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.dateOfBirth || "N/A"}</p>}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address</label>{isEditingProfile ? <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.address}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">City</label>{isEditingProfile ? <input type="text" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.city || "N/A"}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">State</label>{isEditingProfile ? <input type="text" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.state || "N/A"}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Zip Code</label>{isEditingProfile ? <input type="text" value={profile.zipCode} onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.zipCode || "N/A"}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Country</label>{isEditingProfile ? <input type="text" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /> : <p className="text-slate-700">{profile.country || "N/A"}</p>}</div>
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsEditingProfile(false)} className="px-6 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={handleUpdateProfile} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
              </div>
            )}
          </div>
        )}
      </div>

      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{userModalMode === "create" ? "Add User" : "Edit User"}</h3>
              <button onClick={() => setShowUserModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><FaTimesCircle /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">First Name</label><input value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">Last Name</label><input value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">Email</label><input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">Phone</label><input value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div className="md:col-span-2"><label className="block text-sm mb-1">Address</label><input value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              {userModalMode === "create" && <div><label className="block text-sm mb-1">Password</label><input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>}
              <div><label className="block text-sm mb-1">Role</label><select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="customer">Customer</option><option value="employee">Employee</option><option value="admin">Admin</option></select></div>
              {userModalMode === "edit" && <div><label className="block text-sm mb-1">Status</label><select value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option></select></div>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={handleSaveUser} disabled={savingUser} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {savingUser ? "Saving..." : userModalMode === "create" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
