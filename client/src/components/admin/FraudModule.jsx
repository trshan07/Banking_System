import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaFlag,
  FaBan,
  FaLock,
  FaUserSecret,
  FaChartLine,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { formatCurrency } from "../../utils/formatters";
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
} from "recharts";

const FraudModule = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0,
  });
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetchAlerts();
    fetchStats();
    fetchTrendData();
  }, [filterPriority, filterStatus]);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/fraud/alerts", {
        params: { priority: filterPriority, status: filterStatus },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(response.data.data);
    } catch (error) {
      console.error("Error fetching fraud alerts:", error);
      setAlerts([
        {
          id: "FRD-2024-001",
          type: "Unauthorized Transaction",
          priority: "high",
          status: "pending",
          user: "John Doe",
          userId: "USR-001",
          amount: 15000,
          date: "2024-01-15T14:30:00",
          location: "New York, NY",
          device: "Unknown Device",
          ipAddress: "192.168.1.1",
          description: "Large withdrawal from unusual location",
          actions: ["Account Frozen", "Customer Notified"],
          riskScore: 95,
        },
        {
          id: "FRD-2024-002",
          type: "Suspicious Login",
          priority: "medium",
          status: "investigating",
          user: "Jane Smith",
          userId: "USR-002",
          amount: 0,
          date: "2024-01-15T09:15:00",
          location: "Los Angeles, CA",
          device: "New Device",
          ipAddress: "192.168.1.2",
          description: "Multiple failed login attempts",
          actions: ["2FA Enabled"],
          riskScore: 65,
        },
        {
          id: "FRD-2024-003",
          type: "Identity Theft",
          priority: "high",
          status: "pending",
          user: "Bob Johnson",
          userId: "USR-003",
          amount: 25000,
          date: "2024-01-14T11:45:00",
          location: "Chicago, IL",
          device: "Unknown",
          ipAddress: "192.168.1.3",
          description: "New account opened with stolen identity",
          actions: ["Account Locked", "Identity Verification Required"],
          riskScore: 98,
        },
        {
          id: "FRD-2024-004",
          type: "Phishing Attempt",
          priority: "high",
          status: "resolved",
          user: "Alice Brown",
          userId: "USR-004",
          amount: 5000,
          date: "2024-01-13T16:20:00",
          location: "Miami, FL",
          device: "Mobile",
          ipAddress: "192.168.1.4",
          description: "User clicked on phishing link",
          actions: ["Password Reset", "Security Questions Updated"],
          riskScore: 85,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/fraud/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.data);
    } catch (error) {
      setStats({ total: 45, high: 12, medium: 18, low: 15, resolved: 20 });
    }
  };

  const fetchTrendData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/fraud/trends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrendData(response.data.data);
    } catch (error) {
      setTrendData([
        { week: "Week 1", alerts: 12, resolved: 8 },
        { week: "Week 2", alerts: 15, resolved: 10 },
        { week: "Week 3", alerts: 10, resolved: 7 },
        { week: "Week 4", alerts: 8, resolved: 6 },
      ]);
    }
  };

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/fraud/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Alert marked as resolved");
      fetchAlerts();
      fetchStats();
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const handleEscalate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/fraud/${id}/escalate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Alert escalated to higher authority");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to escalate alert");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-700";
      case "investigating": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading fraud alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Alerts</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><FaExclamationTriangle className="text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">High Priority</p><p className="text-2xl font-bold text-red-600">{stats.high}</p></div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><FaFlag className="text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Medium Priority</p><p className="text-2xl font-bold text-yellow-600">{stats.medium}</p></div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><FaClock className="text-yellow-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Resolved</p><p className="text-2xl font-bold text-green-600">{stats.resolved}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Resolution Rate</p><p className="text-2xl font-bold">{((stats.resolved / stats.total) * 100).toFixed(1)}%</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaChartLine className="text-blue-600" /></div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Fraud Alert Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Alert ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {alerts
                .filter(alert => alert.user.toLowerCase().includes(searchTerm.toLowerCase()) || alert.id.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm">{alert.id}</td>
                    <td className="px-6 py-4">{alert.type}</td>
                    <td className="px-6 py-4 font-medium">{alert.user}</td>
                    <td className="px-6 py-4">{formatCurrency(alert.amount)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(alert.priority)}`}>{alert.priority}</span></td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(alert.status)}`}>{alert.status}</span></td>
                    <td className="px-6 py-4"><span className={`font-bold ${getRiskScoreColor(alert.riskScore)}`}>{alert.riskScore}</span></td>
                    <td className="px-6 py-4 text-sm">{new Date(alert.date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button onClick={() => { setSelectedAlert(alert); setShowDetailsModal(true); }} className="text-blue-600"><FaEye /></button>
                        {alert.status !== "resolved" && <button onClick={() => handleResolve(alert.id)} className="text-green-600"><FaCheckCircle /></button>}
                        {alert.priority === "high" && <button onClick={() => handleEscalate(alert.id)} className="text-red-600"><FaExclamationTriangle /></button>}
                      </div>
                    </td>
                   </tr>
                ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Fraud Alert Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><FaTimesCircle /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-slate-500">Alert ID</p><p className="font-medium">{selectedAlert.id}</p></div>
                  <div><p className="text-sm text-slate-500">Type</p><p className="font-medium">{selectedAlert.type}</p></div>
                  <div><p className="text-sm text-slate-500">User</p><p className="font-medium">{selectedAlert.user}</p></div>
                  <div><p className="text-sm text-slate-500">User ID</p><p className="font-medium">{selectedAlert.userId}</p></div>
                  <div><p className="text-sm text-slate-500">Amount</p><p className="font-medium">{formatCurrency(selectedAlert.amount)}</p></div>
                  <div><p className="text-sm text-slate-500">Risk Score</p><p className={`font-bold ${getRiskScoreColor(selectedAlert.riskScore)}`}>{selectedAlert.riskScore}</p></div>
                  <div><p className="text-sm text-slate-500">Date & Time</p><p className="font-medium">{new Date(selectedAlert.date).toLocaleString()}</p></div>
                  <div><p className="text-sm text-slate-500">Location</p><p className="font-medium">{selectedAlert.location}</p></div>
                  <div><p className="text-sm text-slate-500">IP Address</p><p className="font-medium">{selectedAlert.ipAddress}</p></div>
                  <div><p className="text-sm text-slate-500">Device</p><p className="font-medium">{selectedAlert.device}</p></div>
                  <div className="col-span-2"><p className="text-sm text-slate-500">Description</p><p className="font-medium">{selectedAlert.description}</p></div>
                  <div className="col-span-2"><p className="text-sm text-slate-500">Actions Taken</p><ul className="list-disc list-inside">{selectedAlert.actions.map((action, idx) => <li key={idx}>{action}</li>)}</ul></div>
                </div>
              </div>
              {selectedAlert.status !== "resolved" && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button onClick={() => handleResolve(selectedAlert.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Mark as Resolved</button>
                  <button onClick={() => handleEscalate(selectedAlert.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Escalate</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudModule;
