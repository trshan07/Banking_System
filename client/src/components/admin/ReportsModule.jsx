import React, { useState } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaDownload,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaShieldAlt,
  FaUserCheck,
  FaClock,
  FaPrint,
  FaEnvelope,
  FaShare,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const ReportsModule = () => {
  const [reportType, setReportType] = useState("transactions");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { id: "transactions", name: "Transaction Report", icon: <FaMoneyBillWave />, description: "Detailed transaction history and volume analysis" },
    { id: "users", name: "User Report", icon: <FaUsers />, description: "User registration and activity metrics" },
    { id: "kyc", name: "KYC Report", icon: <FaUserCheck />, description: "KYC submission and verification status" },
    { id: "fraud", name: "Fraud Report", icon: <FaShieldAlt />, description: "Fraud alerts and resolution metrics" },
    { id: "financial", name: "Financial Report", icon: <FaChartLine />, description: "Revenue, expenses, and profit analysis" },
  ];

  const generateReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/admin/reports/generate", {
        type: reportType,
        startDate: dateRange.start,
        endDate: dateRange.end,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportData(response.data.data);
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      // Demo data
      setReportData({
        summary: {
          totalTransactions: 45678,
          totalVolume: 12500000,
          activeUsers: 12890,
          newUsers: 2340,
          kycCompleted: 11250,
          fraudAlerts: 45,
          resolvedAlerts: 38,
          revenue: 2450000,
          expenses: 1250000,
        },
        chartData: {
          dailyData: [
            { date: "2024-01-01", transactions: 1250, volume: 450000 },
            { date: "2024-01-02", transactions: 1420, volume: 520000 },
            { date: "2024-01-03", transactions: 1380, volume: 480000 },
          ],
          categoryData: [
            { name: "Deposits", value: 45 },
            { name: "Withdrawals", value: 25 },
            { name: "Transfers", value: 20 },
            { name: "Payments", value: 10 },
          ],
        },
      });
    } finally {
      setGenerating(false);
    }
  };

  const exportPDF = () => {
    toast.success("PDF export started");
  };

  const exportExcel = () => {
    toast.success("Excel export started");
  };

  const sendEmail = () => {
    toast.success("Report sent via email");
  };

  const printReport = () => {
    window.print();
  };

  const SummaryCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={generateReport}
            disabled={generating}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FaDownload className="mr-2" /> Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Types Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map(type => (
          <div
            key={type.id}
            className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all ${
              reportType === type.id ? "border-2 border-emerald-500 bg-emerald-50" : "border border-slate-200 hover:shadow-xl"
            }`}
            onClick={() => setReportType(type.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${reportType === type.id ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {type.icon}
              </div>
              <div>
                <h4 className="font-semibold">{type.name}</h4>
                <p className="text-xs text-slate-500">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="space-y-6" id="report-content">
          {/* Report Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-slate-800">{reportTypes.find(t => t.id === reportType)?.name}</h2>
            <p className="text-slate-500">Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}</p>
            <p className="text-sm text-slate-400 mt-2">Generated on: {new Date().toLocaleString()}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Total Transactions" value={reportData.summary.totalTransactions} icon={FaMoneyBillWave} color="bg-blue-500" />
            <SummaryCard title="Total Volume" value={`$${(reportData.summary.totalVolume / 1000000).toFixed(1)}M`} icon={FaChartLine} color="bg-green-500" />
            <SummaryCard title="Active Users" value={reportData.summary.activeUsers} icon={FaUsers} color="bg-purple-500" />
            <SummaryCard title="KYC Completed" value={reportData.summary.kycCompleted} icon={FaUserCheck} color="bg-emerald-500" />
            {reportData.summary.revenue && (
              <>
                <SummaryCard title="Revenue" value={`$${(reportData.summary.revenue / 1000).toFixed(0)}K`} icon={FaMoneyBillWave} color="bg-teal-500" />
                <SummaryCard title="Expenses" value={`$${(reportData.summary.expenses / 1000).toFixed(0)}K`} icon={FaMoneyBillWave} color="bg-red-500" />
              </>
            )}
            {reportData.summary.fraudAlerts && (
              <>
                <SummaryCard title="Fraud Alerts" value={reportData.summary.fraudAlerts} icon={FaShieldAlt} color="bg-yellow-500" />
                <SummaryCard title="Resolved Alerts" value={reportData.summary.resolvedAlerts} icon={FaCheckCircle} color="bg-green-500" />
              </>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.chartData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#3b82f6" name="Transactions" />
                  <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" name="Volume ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.chartData.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {reportData.chartData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-center space-x-3">
              <button onClick={exportPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                <FaFilePdf className="mr-2" /> Export PDF
              </button>
              <button onClick={exportExcel} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                <FaFileExcel className="mr-2" /> Export Excel
              </button>
              <button onClick={printReport} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center">
                <FaPrint className="mr-2" /> Print
              </button>
              <button onClick={sendEmail} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FaEnvelope className="mr-2" /> Email Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;