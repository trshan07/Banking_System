import React from "react";
import { Link } from "react-router-dom";

const TicketCard = ({ ticket }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessagePreview = () => {
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    return lastMessage.message.length > 100
      ? lastMessage.message.substring(0, 100) + "..."
      : lastMessage.message;
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  <Link to={`/support/ticket/${ticket.id}`}>
                    {ticket.subject}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm">Ticket ID: {ticket.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {getStatusText(ticket.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Category:
                </span>
                <span className="text-sm text-gray-900 ml-2">
                  {ticket.category}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Assigned To:
                </span>
                <span className="text-sm text-gray-900 ml-2">
                  {ticket.assignedTo}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Last Updated:
                </span>
                <span className="text-sm text-gray-900 ml-2">
                  {formatDate(ticket.lastUpdate)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3">
              {getLastMessagePreview()}
            </p>

            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {ticket.messages.length} messages
              </span>
              <span className="mx-3">•</span>
              <span>Created: {formatDate(ticket.createdDate)}</span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col space-y-2">
            <Link
              to={`/support/ticket/${ticket.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm text-center transition-colors"
            >
              View Details
            </Link>
            {ticket.status === "open" && (
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm transition-colors">
                Add Update
              </button>
            )}
            {(ticket.status === "resolved" || ticket.status === "closed") && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm transition-colors">
                Reopen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
