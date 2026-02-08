import React from "react";
import { Link } from "react-router-dom";
import LoanProgress from "./LoanProgress";

const LoanCard = ({ loan }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "closed":
        return "Closed";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getLoanIcon = (type) => {
    switch (type.toLowerCase()) {
      case "personal loan":
        return "👤";
      case "home loan":
        return "🏠";
      case "car loan":
        return "🚗";
      case "education loan":
        return "🎓";
      case "business loan":
        return "💼";
      default:
        return "💰";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getLoanIcon(loan.type)}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                <Link to={`/loans/${loan.id}`} className="hover:text-blue-600">
                  {loan.type}
                </Link>
              </h3>
              <p className="text-sm text-gray-600">ID: {loan.id}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              loan.status
            )}`}
          >
            {getStatusText(loan.status)}
          </span>
        </div>

        {/* Loan Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Loan Amount</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(loan.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Interest Rate</p>
            <p className="font-semibold text-gray-900">{loan.interestRate}%</p>
          </div>
          {loan.remainingAmount !== undefined && (
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(loan.remainingAmount)}
              </p>
            </div>
          )}
          {loan.emi && (
            <div>
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(loan.emi)}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar for Active Loans */}
        {loan.status === "active" && loan.progress !== undefined && (
          <div className="mb-4">
            <LoanProgress progress={loan.progress} />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Repayment Progress</span>
              <span>{loan.progress}%</span>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
          <div className="space-x-4">
            {loan.disbursedDate && (
              <span>Disbursed: {formatDate(loan.disbursedDate)}</span>
            )}
            {loan.tenure && <span>Tenure: {loan.tenure} months</span>}
            {loan.nextDueDate && (
              <span className="text-orange-600 font-medium">
                Next Due: {formatDate(loan.nextDueDate)}
              </span>
            )}
          </div>

          <div className="flex space-x-2 mt-2 md:mt-0">
            <Link
              to={`/loans/${loan.id}`}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
            {loan.status === "active" && (
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                Pay EMI
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
