import React from "react";

const SupportStats = ({ tickets }) => {
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
    highPriority: tickets.filter(
      (t) => t.priority === "High" || t.priority === "Critical"
    ).length,
    avgResponseTime: "2.5 hours", // This would come from API
  };

  const getPercentage = (count) => {
    return tickets.length > 0 ? ((count / tickets.length) * 100).toFixed(1) : 0;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Tickets</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-red-600">{stats.open}</div>
        <div className="text-sm text-gray-600">Open</div>
        <div className="text-xs text-gray-500">
          {getPercentage(stats.open)}%
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {stats.inProgress}
        </div>
        <div className="text-sm text-gray-600">In Progress</div>
        <div className="text-xs text-gray-500">
          {getPercentage(stats.inProgress)}%
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          {stats.resolved}
        </div>
        <div className="text-sm text-gray-600">Resolved</div>
        <div className="text-xs text-gray-500">
          {getPercentage(stats.resolved)}%
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
        <div className="text-sm text-gray-600">Closed</div>
        <div className="text-xs text-gray-500">
          {getPercentage(stats.closed)}%
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-orange-600">
          {stats.highPriority}
        </div>
        <div className="text-sm text-gray-600">High Priority</div>
        <div className="text-xs text-gray-500">
          {getPercentage(stats.highPriority)}%
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <div className="text-2xl font-bold text-purple-600">
          {stats.avgResponseTime}
        </div>
        <div className="text-sm text-gray-600">Avg Response</div>
        <div className="text-xs text-gray-500">Last 7 days</div>
      </div>
    </div>
  );
};

export default SupportStats;
