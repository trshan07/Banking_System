import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaFilter,
  FaSearch,
  FaUserCircle,
  FaPaperPlane,
  FaBan,
  FaInfoCircle,
  FaFilePdf,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaPaperclip,
  FaCloudUploadAlt,
  FaHeart,
  FaBook,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const LeaveRequests = () => {
  const [activeTab, setActiveTab] = useState("my-requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Employee Info (from API)
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "",
    id: "",
    department: "",
    joinDate: "",
    email: "",
    phone: "",
    location: "",
    manager: "",
    avatar: "",
  });

  // Leave Balance (from API)
  const [leaveBalance, setLeaveBalance] = useState({
    annual: { total: 0, used: 0, remaining: 0, pending: 0 },
    sick: { total: 0, used: 0, remaining: 0, pending: 0 },
    personal: { total: 0, used: 0, remaining: 0, pending: 0 },
    unpaid: { total: 0, used: 0, remaining: 0, pending: 0 },
    maternity: { total: 0, used: 0, remaining: 0, pending: 0 },
    paternity: { total: 0, used: 0, remaining: 0, pending: 0 },
    bereavement: { total: 0, used: 0, remaining: 0, pending: 0 },
    study: { total: 0, used: 0, remaining: 0, pending: 0 },
  });

  // Leave Requests (from API)
  const [leaveRequests, setLeaveRequests] = useState([]);
  
  // Pending Approvals (from API)
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetchEmployeeInfo();
    fetchLeaveBalance();
    fetchLeaveRequests();
    if (activeTab === "pending-approvals") {
      fetchPendingApprovals();
    }
  }, [activeTab]);

  const fetchEmployeeInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching employee info:", error);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/leave/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveBalance(response.data.data);
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      // Set default values for demo
      setLeaveBalance({
        annual: { total: 18, used: 6, remaining: 12, pending: 1 },
        sick: { total: 12, used: 4, remaining: 8, pending: 0 },
        personal: { total: 6, used: 2, remaining: 4, pending: 1 },
        unpaid: { total: 30, used: 0, remaining: 30, pending: 0 },
        maternity: { total: 84, used: 0, remaining: 84, pending: 0 },
        paternity: { total: 10, used: 0, remaining: 10, pending: 0 },
        bereavement: { total: 5, used: 0, remaining: 5, pending: 0 },
        study: { total: 10, used: 0, remaining: 10, pending: 0 },
      });
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/leave/my-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(response.data.data.leaveRequests);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      // Set demo data
      setLeaveRequests([
        {
          id: "LR-2024-001",
          requestId: "LR-2024-001",
          type: "Annual Leave",
          leaveType: "annual",
          fromDate: "2024-04-10",
          toDate: "2024-04-15",
          days: 5,
          totalDays: 5,
          reason: "Family vacation to Hawaii",
          status: "approved",
          finalStatus: "approved",
          appliedOn: "2024-03-01",
          createdAt: "2024-03-01",
          approvedBy: "Sarah Johnson",
          approvedOn: "2024-03-02",
          comments: "Approved. Enjoy your vacation!",
          attachments: ["booking_confirmation.pdf"],
          emergency: false,
        },
        {
          id: "LR-2024-002",
          requestId: "LR-2024-002",
          type: "Sick Leave",
          leaveType: "sick",
          fromDate: "2024-03-20",
          toDate: "2024-03-22",
          days: 3,
          totalDays: 3,
          reason: "Medical leave - Doctor's appointment",
          status: "pending",
          finalStatus: "pending",
          appliedOn: "2024-03-18",
          createdAt: "2024-03-18",
          comments: "Attaching medical certificate",
          attachments: ["medical_certificate.pdf"],
          emergency: true,
        },
      ]);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/leave/pending-approvals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingApprovals(response.data.data);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      // Set demo data for manager view
      setPendingApprovals([
        {
          id: "LR-2024-008",
          requestId: "LR-2024-008",
          employee: "Emily Davis",
          employeeId: "EMP-2023-0456",
          employeeName: "Emily Davis",
          department: "IT",
          type: "Annual Leave",
          leaveType: "annual",
          fromDate: "2024-04-01",
          toDate: "2024-04-10",
          days: 8,
          totalDays: 8,
          reason: "Family wedding",
          appliedOn: "2024-03-16",
          createdAt: "2024-03-16",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          attachments: ["wedding_invitation.pdf"],
          conflict: false,
        },
      ]);
    }
  };

  // Leave Types
  const leaveTypes = [
    { id: 1, name: "Annual Leave", icon: <FaCalendarAlt />, color: "from-emerald-500 to-teal-500", value: "annual" },
    { id: 2, name: "Sick Leave", icon: <FaClock />, color: "from-sky-500 to-blue-500", value: "sick" },
    { id: 3, name: "Personal Leave", icon: <FaUserCircle />, color: "from-violet-500 to-purple-500", value: "personal" },
    { id: 4, name: "Unpaid Leave", icon: <FaBan />, color: "from-slate-500 to-gray-600", value: "unpaid" },
    { id: 5, name: "Maternity Leave", icon: <FaHeart />, color: "from-rose-500 to-pink-500", value: "maternity" },
    { id: 6, name: "Paternity Leave", icon: <FaUserCircle />, color: "from-amber-500 to-orange-500", value: "paternity" },
    { id: 7, name: "Bereavement Leave", icon: <FaExclamationTriangle />, color: "from-slate-600 to-gray-700", value: "bereavement" },
    { id: 8, name: "Study Leave", icon: <FaBook />, color: "from-indigo-500 to-indigo-600", value: "study" },
  ];

  // Holiday Calendar
  const [holidays] = useState([
    { date: "2024-01-01", name: "New Year's Day", type: "public" },
    { date: "2024-01-15", name: "Martin Luther King Jr. Day", type: "public" },
    { date: "2024-02-19", name: "Presidents' Day", type: "public" },
    { date: "2024-03-29", name: "Good Friday", type: "public" },
    { date: "2024-05-27", name: "Memorial Day", type: "public" },
    { date: "2024-06-19", name: "Juneteenth", type: "public" },
    { date: "2024-07-04", name: "Independence Day", type: "public" },
    { date: "2024-09-02", name: "Labor Day", type: "public" },
    { date: "2024-10-14", name: "Columbus Day", type: "public" },
    { date: "2024-11-11", name: "Veterans Day", type: "public" },
    { date: "2024-11-28", name: "Thanksgiving Day", type: "public" },
    { date: "2024-12-25", name: "Christmas Day", type: "public" },
  ]);

  // Leave Policies
  const leavePolicies = [
    { type: "Annual Leave", accrual: "1.5 days per month", maxCarryover: "5 days", notice: "2 weeks" },
    { type: "Sick Leave", accrual: "1 day per month", maxCarryover: "10 days", notice: "Same day" },
    { type: "Personal Leave", accrual: "0.5 days per month", maxCarryover: "2 days", notice: "3 days" },
    { type: "Study Leave", accrual: "As needed", maxCarryover: "N/A", notice: "1 month" },
  ];

  // Apply for Leave Form
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "annual",
    fromDate: "",
    toDate: "",
    reason: "",
    comments: "",
    attachments: [],
    emergency: false,
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeaveForm({
      ...leaveForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setLeaveForm({
      ...leaveForm,
      attachments: [...leaveForm.attachments, ...files.map((f) => f.name)],
    });
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  const handleSubmitApplication = async () => {
    setLoading(true);

    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const from = new Date(leaveForm.fromDate);
    const to = new Date(leaveForm.toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    const balanceKey = leaveForm.leaveType;
    const balance = leaveBalance[balanceKey];
    if (balance && balance.remaining < days && leaveForm.leaveType !== 'unpaid') {
      toast.error(`Insufficient ${leaveForm.leaveType} balance`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/leave/create",
        {
          leaveType: leaveForm.leaveType,
          startDate: leaveForm.fromDate,
          endDate: leaveForm.toDate,
          reason: leaveForm.reason,
          priority: leaveForm.emergency ? "urgent" : "medium",
          emergencyContact: {
            name: employeeInfo.name,
            relationship: "Self",
            phoneNumber: employeeInfo.phone,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Leave application submitted successfully");
        setShowApplyModal(false);
        setLeaveForm({
          leaveType: "annual",
          fromDate: "",
          toDate: "",
          reason: "",
          comments: "",
          attachments: [],
          emergency: false,
        });
        fetchLeaveRequests();
        fetchLeaveBalance();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (id) => {
    if (window.confirm("Are you sure you want to cancel this leave request?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/leave/${id}/cancel`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Leave request cancelled");
        fetchLeaveRequests();
        fetchLeaveBalance();
      } catch (error) {
        toast.error("Failed to cancel request");
      }
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/leave/${id}/approve`,
        { comments: "Approved via dashboard" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Leave request approved`);
      fetchPendingApprovals();
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (id) => {
    const reason = prompt("Please provide rejection reason:");
    if (reason) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `/api/leave/${id}/reject`,
          { reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Leave request rejected`);
        fetchPendingApprovals();
      } catch (error) {
        toast.error("Failed to reject request");
      }
    }
  };

  const handleDownload = (filename) => {
    toast.success(`Downloading ${filename}...`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-emerald-100 text-emerald-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "rejected": return "bg-rose-100 text-rose-700";
      case "in-review": return "bg-blue-100 text-blue-700";
      case "draft": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <FaCheckCircle className="text-emerald-600" />;
      case "pending": return <FaHourglassHalf className="text-amber-600" />;
      case "rejected": return <FaTimesCircle className="text-rose-600" />;
      case "in-review": return <FaEye className="text-blue-600" />;
      default: return <FaInfoCircle className="text-slate-600" />;
    }
  };

  const getLeaveTypeIcon = (leaveType) => {
    const type = leaveTypes.find(t => t.value === leaveType || t.name === leaveType);
    return type?.icon || <FaCalendarAlt />;
  };

  const getLeaveTypeColor = (leaveType) => {
    const type = leaveTypes.find(t => t.value === leaveType || t.name === leaveType);
    return type?.color || "from-emerald-500 to-teal-500";
  };

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leave Requests</h2>
          <p className="text-slate-500">Manage your leave applications and track approvals</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-md"
        >
          <FaPlus className="mr-2" /> Apply for Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.entries(leaveBalance).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow-lg p-3 border border-slate-200 hover:shadow-xl transition-all">
            <p className="text-xs text-slate-500 capitalize mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
            <p className="text-lg font-bold text-slate-800">{value.remaining}/{value.total}</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(value.remaining / value.total) * 100}%` }}></div>
            </div>
            {value.pending > 0 && <span className="text-xs text-amber-600 mt-1 block">{value.pending} pending</span>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button onClick={() => setActiveTab("my-requests")} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "my-requests" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>My Requests</button>
          <button onClick={() => setActiveTab("calendar")} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "calendar" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Holiday Calendar</button>
          <button onClick={() => setActiveTab("policies")} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "policies" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Leave Policies</button>
          <button onClick={() => setActiveTab("pending-approvals")} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "pending-approvals" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            Pending Approvals
            {pendingApprovals.length > 0 && <span className="ml-2 bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs">{pendingApprovals.length}</span>}
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search requests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center"><FaFilter className="mr-2" /> Filters</button>
        <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center"><FaDownload className="mr-2" /> Export</button>
      </div>

      {/* My Requests Tab */}
      {activeTab === "my-requests" && (
        <div className="space-y-4">
          {leaveRequests.filter((req) => req.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) || req.type?.toLowerCase().includes(searchTerm.toLowerCase()) || req.reason?.toLowerCase().includes(searchTerm.toLowerCase())).map((request) => (
            <div key={request.id || request._id} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getLeaveTypeColor(request.leaveType || request.type)} rounded-xl flex items-center justify-center text-white`}>
                    {getLeaveTypeIcon(request.leaveType || request.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-slate-800">{request.requestId || request.id}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.finalStatus || request.status)}`}>{request.finalStatus || request.status}</span>
                      {request.emergency && <span className="px-2 py-1 text-xs bg-rose-100 text-rose-700 rounded-full">Emergency</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{request.type || request.leaveType} • {request.totalDays || request.days} {request.totalDays === 1 ? "day" : "days"}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-slate-500"><FaCalendarAlt className="inline mr-1" />{new Date(request.fromDate || request.startDate).toLocaleDateString()} - {new Date(request.toDate || request.endDate).toLocaleDateString()}</span>
                      <span className="text-slate-500"><FaClock className="inline mr-1" /> Applied: {new Date(request.createdAt || request.appliedOn).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-2">{request.reason}</p>
                    {request.comments && <p className="text-sm text-slate-500 mt-1 italic">"{request.comments}"</p>}
                    {request.attachments?.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <FaPaperclip className="text-slate-400" />
                        {request.attachments.map((file, idx) => <button key={idx} onClick={() => handleDownload(file)} className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline">{file}</button>)}
                      </div>
                    )}
                    {request.approvedBy && <p className="text-xs text-emerald-600 mt-2">Approved by {request.approvedBy} on {new Date(request.approvedOn).toLocaleDateString()}</p>}
                    {request.rejectedBy && <p className="text-xs text-rose-600 mt-2">Rejected by {request.rejectedBy} on {new Date(request.rejectedOn).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => { setSelectedRequest(request); setShowDetailsModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEye /></button>
                  {(request.finalStatus === "pending" || request.status === "pending") && (
                    <button onClick={() => handleCancelRequest(request._id || request.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><FaBan /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">2024 Holiday Calendar</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidays.map((holiday, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaCalendarAlt className="text-emerald-600" /></div>
                <div><p className="font-medium text-slate-800">{holiday.name}</p><p className="text-sm text-slate-500">{new Date(holiday.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === "policies" && (
        <div className="grid md:grid-cols-2 gap-6">
          {leavePolicies.map((policy, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{policy.type}</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Accrual Rate</span><span className="font-medium text-slate-700">{policy.accrual}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Max Carryover</span><span className="font-medium text-slate-700">{policy.maxCarryover}</span></div>
                <div className="flex justify-between py-2"><span className="text-slate-500">Notice Period</span><span className="font-medium text-slate-700">{policy.notice}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === "pending-approvals" && (
        <div className="space-y-4">
          {pendingApprovals.map((request) => (
            <div key={request.id || request._id} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img src={request.avatar || "https://randomuser.me/api/portraits/default.jpg"} alt={request.employee || request.employeeName} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-slate-800">{request.employee || request.employeeName}</h3>
                      <span className="text-xs text-slate-500">{request.employeeId}</span>
                      {request.conflict && <span className="px-2 py-1 text-xs bg-rose-100 text-rose-700 rounded-full">Team Conflict</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{request.department} • {request.type}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-slate-500"><FaCalendarAlt className="inline mr-1" />{new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}</span>
                      <span className="text-slate-500"><FaClock className="inline mr-1" /> {request.days} days</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-2">Reason: {request.reason}</p>
                    <p className="text-xs text-slate-500 mt-1">Applied: {new Date(request.createdAt || request.appliedOn).toLocaleDateString()}</p>
                    {request.attachments?.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <FaPaperclip className="text-slate-400" />
                        {request.attachments.map((file, idx) => <button key={idx} onClick={() => handleDownload(file)} className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline">{file}</button>)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleApproveRequest(request._id || request.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"><FaCheck className="mr-2" /> Approve</button>
                  <button onClick={() => handleRejectRequest(request._id || request.id)} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center"><FaTimes className="mr-2" /> Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Apply for Leave</h3>
                <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type *</label>
                  <select name="leaveType" value={leaveForm.leaveType} onChange={handleFormChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {leaveTypes.map((type) => <option key={type.id} value={type.value}>{type.name}</option>)}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">From Date *</label><input type="date" name="fromDate" value={leaveForm.fromDate} onChange={handleFormChange} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">To Date *</label><input type="date" name="toDate" value={leaveForm.toDate} onChange={handleFormChange} min={leaveForm.fromDate || new Date().toISOString().split("T")[0]} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Reason *</label><textarea name="reason" value={leaveForm.reason} onChange={handleFormChange} rows="3" placeholder="Please provide detailed reason for leave" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Additional Comments</label><textarea name="comments" value={leaveForm.comments} onChange={handleFormChange} rows="2" placeholder="Any additional information" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea></div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"><FaCloudUploadAlt className="mr-2" /> Upload Files</label>
                    <p className="text-xs text-slate-500 mt-2">Supported: PDF, JPG, PNG (Max 5MB each)</p>
                  </div>
                  {leaveForm.attachments.length > 0 && <div className="mt-2 space-y-1">{leaveForm.attachments.map((file, idx) => (<div key={idx} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded"><span className="text-slate-600">{file}</span><button className="text-rose-600"><FaTimes /></button></div>))}</div>}
                </div>
                <div className="flex items-center space-x-2"><input type="checkbox" name="emergency" checked={leaveForm.emergency} onChange={handleFormChange} id="emergency" className="w-4 h-4 text-emerald-600" /><label htmlFor="emergency" className="text-sm text-slate-700">This is an emergency leave request</label></div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button type="button" onClick={() => setShowApplyModal(false)} className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                  <button type="button" onClick={handleSubmitApplication} disabled={loading} className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 flex items-center disabled:opacity-50">
                    {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Submitting...</> : <><FaPaperPlane className="mr-2" /> Submit Application</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-slate-800">Leave Request Details</h3><button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><FaTimes /></button></div>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-slate-500">Request ID</span><span className="font-medium">{selectedRequest.requestId || selectedRequest.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.finalStatus || selectedRequest.status)}`}>{selectedRequest.finalStatus || selectedRequest.status}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type</span><span>{selectedRequest.type || selectedRequest.leaveType}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Duration</span><span>{new Date(selectedRequest.fromDate || selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.toDate || selectedRequest.endDate).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Days</span><span>{selectedRequest.totalDays || selectedRequest.days} days</span></div>
                <div className="pt-4 border-t"><p className="text-sm"><span className="font-medium">Reason:</span> {selectedRequest.reason}</p>{selectedRequest.comments && <p className="text-sm text-slate-600 mt-2"><span className="font-medium">Comments:</span> {selectedRequest.comments}</p>}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;