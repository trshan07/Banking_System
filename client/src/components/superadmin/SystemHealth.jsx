import React from "react";
import { FaServer, FaDatabase, FaCloud, FaMicrochip, FaNetworkWired } from "react-icons/fa";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const SystemHealth = ({
  systemHealth,
  performanceData,
  activityData = [],
  maintenanceMode = false,
  databaseConnections = 0,
}) => {
  const healthData = systemHealth || {
    cpu: 0,
    memory: 0,
    storage: 0,
    database: 0,
    api: 0,
    uptime: 0,
  };

  const perfData = Array.isArray(performanceData) ? performanceData : [];
  const historicalData = Array.isArray(activityData) && activityData.length > 0
    ? activityData.map((entry) => ({
        time: entry.hour,
        cpu: healthData.cpu,
        memory: healthData.memory,
        latency: entry.active,
      }))
    : [];

  const radarData = [
    { metric: "CPU", value: healthData.cpu, fullMark: 100 },
    { metric: "Memory", value: healthData.memory, fullMark: 100 },
    { metric: "Storage", value: healthData.storage, fullMark: 100 },
    { metric: "Database", value: healthData.database, fullMark: 100 },
    { metric: "API", value: healthData.api, fullMark: 100 },
  ];

  const HealthMetric = ({ title, value, icon: Icon, color, suffix = "%" }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className="text-sm font-bold">{Number(value || 0).toFixed(1)}{suffix}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color.replace("text", "bg")} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(Number(value || 0), 100)}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <HealthMetric title="CPU Usage" value={healthData.cpu} icon={FaMicrochip} color="text-blue-500" />
        <HealthMetric title="Memory Usage" value={healthData.memory} icon={FaDatabase} color="text-green-500" />
        <HealthMetric title="Storage Usage" value={healthData.storage} icon={FaCloud} color="text-yellow-500" />
        <HealthMetric title="Database Load" value={healthData.database} icon={FaDatabase} color="text-red-500" />
        <HealthMetric title="API Health" value={healthData.api} icon={FaNetworkWired} color="text-purple-500" />
        <HealthMetric title="System Uptime" value={healthData.uptime} icon={FaServer} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">System Performance Radar</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Current Load" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          {perfData.length > 0 ? (
            <div className="space-y-4">
              {perfData.map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{metric.metric || "Unknown"}</span>
                    <span className="text-sm font-bold">{metric.value || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((metric.value || 0) / (metric.target || 100)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Target: {metric.target || 100}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No performance metrics are available yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
        {historicalData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="memory" stroke="#10b981" name="Memory %" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#f59e0b" name="Active Events" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            Activity data will appear here once the system records enough events.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${maintenanceMode ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"} rounded-xl p-6 border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${maintenanceMode ? "text-amber-700" : "text-green-700"}`}>Maintenance Mode</p>
              <p className={`text-2xl font-bold mt-1 ${maintenanceMode ? "text-amber-800" : "text-green-800"}`}>{maintenanceMode ? "Enabled" : "Disabled"}</p>
            </div>
            <FaServer className={`w-12 h-12 opacity-50 ${maintenanceMode ? "text-amber-600" : "text-green-600"}`} />
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Current API Health</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{Number(healthData.api || 0).toFixed(1)}%</p>
            </div>
            <FaCloud className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Database Connections</p>
              <p className="text-2xl font-bold text-purple-800 mt-1">{databaseConnections}</p>
            </div>
            <FaDatabase className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
