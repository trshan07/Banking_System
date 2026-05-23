import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaDownload,
  FaEye,
  FaFileExcel,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const AuditLogs = ({ auditLogs = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredLogs = useMemo(() => auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const logDate = log.timestamp ? new Date(log.timestamp).toISOString().split("T")[0] : "";
    const matchesDate = !filterDate || logDate === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  }), [auditLogs, filterDate, filterStatus, searchTerm]);

  const exportLogs = (format) => {
    toast.success(`Audit logs export for ${format.toUpperCase()} is not configured yet.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Events</p><p className="text-2xl font-bold">{auditLogs.length}</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaEye className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Success Events</p><p className="text-2xl font-bold text-green-600">{auditLogs.filter((log) => log.status === "success").length}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Failed Events</p><p className="text-2xl font-bold text-red-600">{auditLogs.filter((log) => log.status === "failed").length}</p></div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><FaTimesCircle className="text-red-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Warnings</p><p className="text-2xl font-bold text-yellow-600">{auditLogs.filter((log) => log.status === "warning").length}</p></div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><FaExclamationTriangle className="text-yellow-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="failed">Failed</option>
            <option value="info">Info</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => exportLogs("pdf")} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center text-sm">
              <FaFilePdf className="mr-2" /> PDF
            </button>
            <button onClick={() => exportLogs("excel")} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm">
              <FaFileExcel className="mr-2" /> Excel
            </button>
            <button onClick={() => exportLogs("csv")} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm">
              <FaDownload className="mr-2" /> CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{log.time}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{log.action}</td>
                    <td className="px-6 py-4 text-slate-600">{log.user}</td>
                    <td className="px-6 py-4 text-slate-600">{log.target}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">{log.ip}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetailsModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-500">
                    No audit log entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Audit Log Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-slate-500">Action</p><p className="font-medium">{selectedLog.action}</p></div>
                  <div><p className="text-sm text-slate-500">Status</p><p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedLog.status)}`}>{selectedLog.status}</p></div>
                  <div><p className="text-sm text-slate-500">User</p><p className="font-medium">{selectedLog.user}</p></div>
                  <div><p className="text-sm text-slate-500">Target</p><p className="font-medium">{selectedLog.target}</p></div>
                  <div><p className="text-sm text-slate-500">IP Address</p><p className="font-mono">{selectedLog.ip}</p></div>
                  <div><p className="text-sm text-slate-500">Timestamp</p><p className="font-medium">{selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString() : selectedLog.time}</p></div>
                  <div className="col-span-2"><p className="text-sm text-slate-500">Details</p><p className="font-medium">{selectedLog.details || "No additional details available"}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
