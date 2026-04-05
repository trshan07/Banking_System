import React from "react";
import { FaServer, FaDatabase, FaCloud, FaShieldAlt, FaMicrochip, FaNetworkWired } from "react-icons/fa";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const SystemHealth = ({ systemHealth, performanceData }) => {
  // Default values if props not provided
  const healthData = systemHealth || {
    cpu: 45,
    memory: 62,
    storage: 58,
    database: 72,
    api: 98,
    uptime: 99.99
  };

  // Ensure performanceData is an array in the correct format
  const isValidPerfData = Array.isArray(performanceData) && performanceData.length > 0 && performanceData[0].metric;
  const perfData = isValidPerfData ? performanceData : [
    { metric: "Response Time", value: 245, target: 300 },
    { metric: "Success Rate", value: 98.5, target: 99 },
    { metric: "Availability", value: 99.99, target: 99.9 },
    { metric: "Error Rate", value: 0.5, target: 1 }
  ];

  const radarData = [
    { metric: "CPU", value: healthData.cpu, fullMark: 100 },
    { metric: "Memory", value: healthData.memory, fullMark: 100 },
    { metric: "Storage", value: healthData.storage, fullMark: 100 },
    { metric: "Database", value: healthData.database, fullMark: 100 },
    { metric: "API", value: healthData.api, fullMark: 100 },
  ];

  const historicalData = [
    { time: "00:00", cpu: 42, memory: 58, latency: 120 },
    { time: "04:00", cpu: 38, memory: 55, latency: 115 },
    { time: "08:00", cpu: 65, memory: 72, latency: 180 },
    { time: "12:00", cpu: 78, memory: 82, latency: 220 },
    { time: "16:00", cpu: 72, memory: 78, latency: 200 },
    { time: "20:00", cpu: 55, memory: 65, latency: 160 },
  ];

  const HealthMetric = ({ title, value, icon: Icon, color, max = 100 }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className="text-sm font-bold">{value}{max === 100 ? '%' : ''}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color.replace('text', 'bg')} h-2 rounded-full transition-all duration-500`} style={{ width: `${(value / max) * 100}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <HealthMetric title="CPU Usage" value={healthData.cpu} icon={FaMicrochip} color="text-blue-500" />
        <HealthMetric title="Memory Usage" value={healthData.memory} icon={FaDatabase} color="text-green-500" />
        <HealthMetric title="Storage Usage" value={healthData.storage} icon={FaCloud} color="text-yellow-500" />
        <HealthMetric title="Database Load" value={healthData.database} icon={FaDatabase} color="text-red-500" />
        <HealthMetric title="API Response" value={healthData.api} icon={FaNetworkWired} color="text-purple-500" />
        <HealthMetric title="System Uptime" value={healthData.uptime} icon={FaServer} color="text-emerald-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
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

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {perfData.map((metric, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{metric.metric || 'Unknown'}</span>
                  <span className="text-sm font-bold">
                    {metric.value || 0}{(metric.metric && metric.metric.includes("Rate")) ? '%' : (metric.metric && metric.metric.includes("Time")) ? 'ms' : '%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(((metric.value || 0) / (metric.target || 100)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Target: {metric.target || 100}{(metric.metric && metric.metric.includes("Rate")) ? '%' : (metric.metric && metric.metric.includes("Time")) ? 'ms' : '%'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Trends */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">System Load Trends (24 hours)</h3>
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
            <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#f59e0b" name="Latency (ms)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">All Systems Operational</p>
              <p className="text-2xl font-bold text-green-800 mt-1">99.99%</p>
            </div>
            <FaServer className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Active Services</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">24/24</p>
            </div>
            <FaCloud className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Database Connections</p>
              <p className="text-2xl font-bold text-purple-800 mt-1">156</p>
            </div>
            <FaDatabase className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;