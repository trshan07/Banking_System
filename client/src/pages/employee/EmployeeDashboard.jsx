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
  FaUserCog,      // Use this instead of FaUserGear
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
  FaWallet,
  FaMobile,
  FaQrcode,
  FaFingerprint,
  FaKey,
  FaIdCard,
  FaClipboardList,
  FaTasks,
  FaCheckDouble,
  FaHourglassHalf,
  FaChartPie as FaChartSimple, // Alias FaChartPie as FaChartSimple
  FaHeadphones,     // Alternative for user support
  FaHandsHelping,
  FaAward,
  FaMedal,
  FaTrophy,
  FaExclamationTriangle,
  FaSpinner,
  FaUser,           // Alternative for user profile
  FaUserMd,         // Alternative for user settings
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const EmployeeDashboard = () => {
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

  // Employee Information
  const [employeeInfo] = useState({
    name: "John Smith",
    id: "EMP-2024-0123",
    designation: "Senior Customer Service Representative",
    department: "Customer Support",
    joinDate: "2022-06-15",
    email: "john.smith@smartbank.com",
    phone: "+1 (555) 123-4567",
    location: "New York HQ",
    manager: "Sarah Johnson",
    profileProgress: 85,
    attendance: "95%",
    rating: 4.8,
    achievements: 12,
  });

  // Dashboard Statistics
  const [stats] = useState({
    assignedTickets: 24,
    resolvedToday: 8,
    pendingTasks: 12,
    completedTasks: 156,
    kycPending: 15,
    kycApproved: 89,
    loansProcessed: 34,
    customerSatisfaction: "4.8/5",
    responseTime: "2.4 hrs",
    attendance: "95%",
    leavesRemaining: 12,
    performanceScore: "92%",
    achievements: 8,
  });

  // Daily Tasks
  const dailyTasks = [
    {
      id: 1,
      title: "Review KYC Applications",
      description: "Process 15 pending KYC applications",
      priority: "high",
      status: "in-progress",
      deadline: "Today, 5:00 PM",
      progress: 60,
      assignedBy: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Customer Support Tickets",
      description: "Respond to high-priority support tickets",
      priority: "urgent",
      status: "pending",
      deadline: "Today, 3:00 PM",
      progress: 30,
      assignedBy: "System",
    },
    {
      id: 3,
      title: "Loan Application Review",
      description: "Review 5 new loan applications",
      priority: "medium",
      status: "pending",
      deadline: "Tomorrow, 10:00 AM",
      progress: 0,
      assignedBy: "Michael Chen",
    },
    {
      id: 4,
      title: "Fraud Report Investigation",
      description: "Investigate case #FR-2024-0123",
      priority: "high",
      status: "in-progress",
      deadline: "Today, 4:30 PM",
      progress: 75,
      assignedBy: "Security Team",
    },
    {
      id: 5,
      title: "Customer Callbacks",
      description: "Return calls to 8 customers",
      priority: "medium",
      status: "pending",
      deadline: "Today, 6:00 PM",
      progress: 0,
      assignedBy: "Team Lead",
    },
  ];

  // Assigned Tickets
  const assignedTickets = [
    {
      id: "TK-1001",
      customer: "Robert Wilson",
      subject: "Cannot access online banking",
      priority: "high",
      status: "in-progress",
      created: "2 hours ago",
      lastUpdate: "30 mins ago",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "TK-1002",
      customer: "Emily Davis",
      subject: "Transaction failed - amount deducted",
      priority: "urgent",
      status: "pending",
      created: "1 hour ago",
      lastUpdate: "15 mins ago",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "TK-1003",
      customer: "Michael Chen",
      subject: "Loan application status inquiry",
      priority: "medium",
      status: "resolved",
      created: "3 hours ago",
      lastUpdate: "1 hour ago",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "TK-1004",
      customer: "Sarah Williams",
      subject: "KYC verification pending",
      priority: "high",
      status: "in-progress",
      created: "4 hours ago",
      lastUpdate: "45 mins ago",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: "TK-1005",
      customer: "James Brown",
      subject: "Fraud alert on account",
      priority: "urgent",
      status: "pending",
      created: "30 mins ago",
      lastUpdate: "10 mins ago",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  // KYC Applications
  const kycApplications = [
    {
      id: "KYC-101",
      name: "John Doe",
      type: "Individual",
      documents: 3,
      submitted: "2024-03-18",
      status: "pending",
      priority: "normal",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      id: "KYC-102",
      name: "Jane Smith",
      type: "Individual",
      documents: 4,
      submitted: "2024-03-18",
      status: "in-review",
      priority: "high",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
      id: "KYC-103",
      name: "ABC Corporation",
      type: "Business",
      documents: 6,
      submitted: "2024-03-17",
      status: "pending",
      priority: "medium",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    },
    {
      id: "KYC-104",
      name: "Maria Garcia",
      type: "Individual",
      documents: 3,
      submitted: "2024-03-17",
      status: "approved",
      priority: "normal",
      avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    },
  ];

  // Loan Applications
  const loanApplications = [
    {
      id: "LN-1001",
      applicant: "Robert Wilson",
      type: "Home Loan",
      amount: "₹25,00,000",
      submitted: "2024-03-18",
      status: "under-review",
      priority: "high",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    {
      id: "LN-1002",
      applicant: "Emily Davis",
      type: "Personal Loan",
      amount: "₹5,00,000",
      submitted: "2024-03-18",
      status: "document-verification",
      priority: "medium",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    },
    {
      id: "LN-1003",
      applicant: "Michael Chen",
      type: "Business Loan",
      amount: "₹15,00,000",
      submitted: "2024-03-17",
      status: "pending",
      priority: "high",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: "LN-1004",
      applicant: "Sarah Williams",
      type: "Car Loan",
      amount: "₹8,00,000",
      submitted: "2024-03-17",
      status: "approved",
      priority: "normal",
      avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    },
  ];

  // Performance Metrics
  const performanceMetrics = [
    {
      id: 1,
      name: "Tickets Resolved",
      value: "156",
      target: "200",
      progress: 78,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 2,
      name: "KYC Processed",
      value: "89",
      target: "100",
      progress: 89,
      color: "from-sky-500 to-blue-500",
    },
    {
      id: 3,
      name: "Customer Satisfaction",
      value: "4.8",
      target: "5.0",
      progress: 96,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: 4,
      name: "Response Time",
      value: "2.4h",
      target: "2.0h",
      progress: 83,
      color: "from-amber-500 to-orange-500",
    },
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      action: "Resolved ticket #TK-1001",
      time: "5 minutes ago",
      status: "completed",
      icon: <FaCheckCircle className="text-emerald-500" />,
    },
    {
      id: 2,
      action: "Approved KYC application #KYC-104",
      time: "15 minutes ago",
      status: "completed",
      icon: <FaCheckCircle className="text-emerald-500" />,
    },
    {
      id: 3,
      action: "Assigned to new ticket #TK-1005",
      time: "25 minutes ago",
      status: "pending",
      icon: <FaClock className="text-amber-500" />,
    },
    {
      id: 4,
      action: "Updated loan application #LN-1002",
      time: "35 minutes ago",
      status: "in-progress",
      icon: <FaEdit className="text-blue-500" />,
    },
    {
      id: 5,
      action: "Completed customer callback",
      time: "45 minutes ago",
      status: "completed",
      icon: <FaCheckCircle className="text-emerald-500" />,
    },
    {
      id: 6,
      action: "Submitted daily report",
      time: "55 minutes ago",
      status: "completed",
      icon: <FaCheckCircle className="text-emerald-500" />,
    },
  ];

  // Schedule
  const schedule = [
    { id: 1, time: "09:00 AM", task: "Team Meeting", type: "meeting" },
    { id: 2, time: "10:30 AM", task: "KYC Review Session", type: "task" },
    { id: 3, time: "12:00 PM", task: "Lunch Break", type: "break" },
    { id: 4, time: "02:00 PM", task: "Customer Calls", type: "task" },
    { id: 5, time: "03:30 PM", task: "Loan Processing", type: "task" },
    { id: 6, time: "05:00 PM", task: "End of Day Report", type: "report" },
  ];

  // Quick Actions
  const quickActions = [
    {
      id: 1,
      name: "New Ticket",
      icon: <FaPlus />,
      color: "from-emerald-500 to-teal-500",
      action: "ticket",
    },
    {
      id: 2,
      name: "Process KYC",
      icon: <FaFileSignature />,
      color: "from-sky-500 to-blue-500",
      action: "kyc",
    },
    {
      id: 3,
      name: "Review Loan",
      icon: <FaMoneyBillWave />,
      color: "from-violet-500 to-purple-500",
      action: "loan",
    },
    {
      id: 4,
      name: "Customer Call",
      icon: <FaPhone />,
      color: "from-amber-500 to-orange-500",
      action: "call",
    },
    {
      id: 5,
      name: "Submit Report",
      icon: <FaFileAlt />,
      color: "from-rose-500 to-pink-500",
      action: "report",
    },
    {
      id: 6,
      name: "Request Leave",
      icon: <FaCalendarAlt />,
      color: "from-cyan-500 to-sky-500",
      action: "leave",
    },
  ];

  // Notifications
  const notifications = [
    {
      id: 1,
      message: "New high-priority ticket assigned",
      time: "2 mins ago",
      type: "urgent",
    },
    {
      id: 2,
      message: "KYC application pending for 24 hours",
      time: "15 mins ago",
      type: "warning",
    },
    {
      id: 3,
      message: "Team meeting in 30 minutes",
      time: "25 mins ago",
      type: "info",
    },
    {
      id: 4,
      message: "Performance review scheduled",
      time: "1 hour ago",
      type: "info",
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

  // Handle task completion
  const handleTaskComplete = (id) => {
    toast.success(`Task #${id} marked as completed`);
  };

  // Handle ticket assignment
  const handleTicketAssign = (id) => {
    toast.success(`Ticket #${id} assigned to you`);
  };

  // Handle status update
  const handleStatusUpdate = (id, status) => {
    toast.success(`Status updated to ${status}`);
  };

  // Handle action click for quick actions
  const handleActionClick = (action) => {
    if (action === "call") {
      toast.info("Initiating call feature...");
    } else if (action === "report") {
      toast.success("Opening report generator...");
    } else {
      setActiveTab(action);
    }
  };

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner with Employee Info */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaUserTie className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {employeeInfo.name}!
              </h2>
              <p className="text-white/90">
                {employeeInfo.designation} • {employeeInfo.department}
              </p>
              <p className="text-sm text-white/80 mt-1">
                Employee ID: {employeeInfo.id}
              </p>
            </div>
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
            <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
              <FaClock className="inline mr-2" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/80">Attendance</p>
            <p className="text-xl font-bold">{stats.attendance}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/80">Performance</p>
            <p className="text-xl font-bold">{stats.performanceScore}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/80">Leaves Left</p>
            <p className="text-xl font-bold">{stats.leavesRemaining}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-white/80">Achievements</p>
            <p className="text-xl font-bold">{stats.achievements}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-xl shadow-lg p-4 border border-slate-200"
          >
            <p className="text-sm text-slate-500 mb-1">{metric.name}</p>
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-800">
                {metric.value}
              </p>
              <p className="text-sm text-slate-500">Target: {metric.target}</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${metric.color} h-2 rounded-full`}
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
        {/* Daily Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Daily Tasks
            </h3>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
              {dailyTasks.filter((t) => t.status === "pending").length} Pending
            </span>
          </div>
          <div className="space-y-4">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`mt-1 ${
                        task.priority === "urgent"
                          ? "text-rose-500"
                          : task.priority === "high"
                            ? "text-orange-500"
                            : "text-amber-500"
                      }`}
                    >
                      {task.priority === "urgent" ? (
                        <FaFlag />
                      ) : task.priority === "high" ? (
                        <FaExclamationTriangle />
                      ) : (
                        <FaClock />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {task.title}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {task.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span className="text-slate-500">
                          <FaClock className="inline mr-1" /> {task.deadline}
                        </span>
                        <span className="text-slate-500">
                          <FaUserCircle className="inline mr-1" />{" "}
                          {task.assignedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : task.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-700">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => handleTaskComplete(task.id)}
                    className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    Mark Complete
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Employee Profile Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Profile Overview</h3>
              <FaUserCog className="text-xl" /> {/* Changed from FaUserGear to FaUserCog */}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/80">Attendance</span>
                <span className="font-semibold">{stats.attendance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Rating</span>
                <span className="font-semibold">{employeeInfo.rating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Achievements</span>
                <span className="font-semibold">
                  {employeeInfo.achievements}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Manager</span>
                <span className="font-semibold">{employeeInfo.manager}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile Completion</span>
                <span>{employeeInfo.profileProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: `${employeeInfo.profileProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.type === "meeting"
                        ? "bg-purple-500"
                        : item.type === "task"
                          ? "bg-blue-500"
                          : item.type === "break"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-slate-700 w-20">
                    {item.time}
                  </span>
                  <span className="text-sm text-slate-600">{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg ${
                    notif.type === "urgent"
                      ? "bg-rose-50 border border-rose-200"
                      : notif.type === "warning"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-sky-50 border border-sky-200"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      notif.type === "urgent"
                        ? "text-rose-700"
                        : notif.type === "warning"
                          ? "text-amber-700"
                          : "text-sky-700"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Activities
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-xl">{activity.icon}</div>
                <span className="text-sm text-slate-700">
                  {activity.action}
                </span>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Tickets Tab
  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Support Tickets</h2>
        <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-md">
          <FaPlus className="mr-2" /> Create Ticket
        </button>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Assigned to me</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.assignedTickets}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Resolved Today</p>
          <p className="text-xl font-bold text-emerald-600">
            {stats.resolvedToday}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-bold text-amber-600">
            {stats.pendingTasks}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Avg Response Time</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.responseTime}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
          <FaFilter className="mr-2" /> Filter
        </button>
        <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
          <FaSort className="mr-2" /> Sort
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ticket ID
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
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {assignedTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                  #{ticket.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={ticket.avatar}
                      alt={ticket.customer}
                      className="w-8 h-8 rounded-full mr-2"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    <span className="text-sm text-slate-900">
                      {ticket.customer}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {ticket.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === "urgent"
                        ? "bg-rose-100 text-rose-700"
                        : ticket.priority === "high"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === "resolved"
                        ? "bg-emerald-100 text-emerald-700"
                        : ticket.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {ticket.created}
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
                      onClick={() => handleTicketAssign(ticket.id)}
                      className="text-emerald-600 hover:text-emerald-800"
                      title="Take"
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
        <h2 className="text-2xl font-bold text-slate-800">KYC Applications</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
            <FaFilter className="mr-2" /> Filter
          </button>
          <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-md">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* KYC Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-xl font-bold text-amber-600">{stats.kycPending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-xl font-bold text-emerald-600">
            {stats.kycApproved}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">In Review</p>
          <p className="text-xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="text-xl font-bold text-rose-600">8</p>
        </div>
      </div>

      {/* KYC Applications Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kycApplications.map((kyc) => (
          <div
            key={kyc.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={kyc.avatar}
                  alt={kyc.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-slate-800">{kyc.name}</h3>
                  <p className="text-xs text-slate-500">{kyc.type}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  kyc.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : kyc.status === "in-review"
                      ? "bg-blue-100 text-blue-700"
                      : kyc.status === "rejected"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                }`}
              >
                {kyc.status}
              </span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p className="text-slate-600">Documents: {kyc.documents} files</p>
              <p className="text-slate-600">Submitted: {kyc.submitted}</p>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-semibold ${
                  kyc.priority === "high"
                    ? "text-rose-600"
                    : kyc.priority === "medium"
                      ? "text-amber-600"
                      : "text-emerald-600"
                }`}
              >
                {kyc.priority} priority
              </span>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  title="Approve"
                >
                  <FaCheckCircle />
                </button>
                <button
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Reject"
                >
                  <FaTimesCircle />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Loans Tab
  const renderLoans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Loan Applications</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center">
            <FaFilter className="mr-2" /> Filter
          </button>
          <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-md">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Loan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Processed</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.loansProcessed}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Under Review</p>
          <p className="text-xl font-bold text-amber-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-xl font-bold text-emerald-600">18</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="text-xl font-bold text-rose-600">4</p>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Loan ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Submitted
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
            {loanApplications.map((loan) => (
              <tr key={loan.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                  {loan.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={loan.avatar}
                      alt={loan.applicant}
                      className="w-8 h-8 rounded-full mr-2"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    <span className="text-sm text-slate-900">
                      {loan.applicant}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {loan.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {loan.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {loan.submitted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      loan.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : loan.status === "under-review"
                          ? "bg-blue-100 text-blue-700"
                          : loan.status === "document-verification"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {loan.status}
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
                      title="Process"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="text-amber-600 hover:text-amber-800"
                      title="Request Info"
                    >
                      <FaComment />
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

  // Render Performance Tab
  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">My Performance</h2>

      {/* Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <FaTrophy className="text-3xl mb-3" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm opacity-90">Achievements</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
          <FaMedal className="text-3xl mb-3" />
          <p className="text-2xl font-bold">4</p>
          <p className="text-sm opacity-90">Certifications</p>
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl p-6 text-white">
          <FaAward className="text-3xl mb-3" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm opacity-90">Recognitions</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-6 text-white">
          <FaStar className="text-3xl mb-3" />
          <p className="text-2xl font-bold">4.8</p>
          <p className="text-sm opacity-90">Rating</p>
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Monthly Performance
          </h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <FaChartLine className="text-6xl text-slate-300" />
            <p className="text-slate-400 ml-2">Performance Chart</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Task Completion Rate
          </h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
            <FaChartPie className="text-6xl text-slate-300" />
            <p className="text-slate-400 ml-2">Completion Chart</p>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Feedback
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <FaUserCircle className="text-2xl text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">Customer {i}</p>
                    <p className="text-xs text-slate-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={idx < 4 ? "text-yellow-400" : "text-slate-300"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Great service! Very helpful and professional.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Leave Tab
  const renderLeave = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Leave Management</h2>
        <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-md">
          <FaPlus className="mr-2" /> Apply Leave
        </button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Annual Leave</p>
          <p className="text-2xl font-bold text-slate-800">18</p>
          <p className="text-xs text-emerald-600">12 remaining</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Sick Leave</p>
          <p className="text-2xl font-bold text-slate-800">12</p>
          <p className="text-xs text-emerald-600">8 remaining</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Personal Leave</p>
          <p className="text-2xl font-bold text-slate-800">6</p>
          <p className="text-xs text-emerald-600">4 remaining</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <p className="text-sm text-slate-500">Unpaid Leave</p>
          <p className="text-2xl font-bold text-slate-800">30</p>
          <p className="text-xs text-emerald-600">30 available</p>
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Leave History
        </h3>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  Annual Leave
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-{10 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  2024-03-{12 + i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  3
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      i === 1
                        ? "bg-emerald-100 text-emerald-700"
                        : i === 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {i === 1 ? "Approved" : i === 2 ? "Pending" : "In Review"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">
                    View
                  </button>
                  {i === 2 && (
                    <button className="text-rose-600 hover:text-rose-800">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <FaSpinner className="animate-spin text-emerald-600 text-xl" />
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
        <div className="h-16 flex items-center justify-between px-4 bg-gradient-to-r from-emerald-700 to-teal-700">
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
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                {employeeInfo.name}
              </p>
              <p className="text-xs text-slate-500">
                {employeeInfo.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("ticket")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "ticket"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaHeadset /> <span>Support Tickets</span>
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "kyc"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaFileSignature /> <span>KYC Processing</span>
          </button>
          <button
            onClick={() => setActiveTab("loan")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "loan"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaMoneyBillWave /> <span>Loan Processing</span>
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "performance"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaChartLine /> <span>My Performance</span>
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "leave"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FaCalendarAlt /> <span>Leave Management</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-emerald-50 text-emerald-700"
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
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-4 hover:bg-slate-50 border-b border-slate-100"
                        >
                          <p className="text-sm text-slate-800">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-slate-200">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700">
                        View all
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  E
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-800">
                    {employeeInfo.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {employeeInfo.department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "ticket" && renderTickets()}
          {activeTab === "kyc" && renderKYC()}
          {activeTab === "loan" && renderLoans()}
          {activeTab === "performance" && renderPerformance()}
          {activeTab === "leave" && renderLeave()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;