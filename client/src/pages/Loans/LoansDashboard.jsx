import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoanCard from "./LoanCard";
import LoanCalculatorForm from "./LoanCalculatorForm";

const LoansDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLoans = [
      {
        id: "LN-2024-001",
        type: "Personal Loan",
        amount: 15000,
        remainingAmount: 14250,
        interestRate: 12.5,
        tenure: 36,
        emi: 475.8,
        nextDueDate: "2024-02-15",
        status: "active",
        disbursedDate: "2024-01-15",
        totalPaid: 951.6,
        progress: 6.3,
      },
      {
        id: "LN-2024-002",
        type: "Home Loan",
        amount: 250000,
        remainingAmount: 248500,
        interestRate: 8.5,
        tenure: 240,
        emi: 2150.5,
        nextDueDate: "2024-02-10",
        status: "active",
        disbursedDate: "2024-01-10",
        totalPaid: 2150.5,
        progress: 0.9,
      },
      {
        id: "LN-2023-045",
        type: "Car Loan",
        amount: 35000,
        remainingAmount: 0,
        interestRate: 9.5,
        tenure: 60,
        emi: 735.2,
        status: "closed",
        disbursedDate: "2023-06-15",
        closedDate: "2023-12-15",
        totalPaid: 35000,
        progress: 100,
      },
      {
        id: "LN-2024-003",
        type: "Education Loan",
        amount: 45000,
        remainingAmount: 45000,
        interestRate: 10.0,
        tenure: 84,
        status: "approved",
        disbursedDate: "2024-01-20",
        progress: 0,
      },
    ];

    setTimeout(() => {
      setLoans(mockLoans);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusCount = (status) => {
    return loans.filter((loan) => loan.status === status).length;
  };

  const filteredLoans = loans.filter((loan) => {
    if (activeTab === "all") return true;
    return loan.status === activeTab;
  });

  const totalActiveLoans = loans.filter(
    (loan) => loan.status === "active"
  ).length;
  const totalLoanAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalOutstanding = loans
    .filter((loan) => loan.status === "active")
    .reduce((sum, loan) => sum + loan.remainingAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your loans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Loan Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your loans and track payments
              </p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/loans/calculator"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Loan Calculator
              </Link>
              <Link
                to="/loans/apply"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for Loan
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loans.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Loans
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalActiveLoans}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-orange-600 text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Borrowed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalLoanAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <span className="text-red-600 text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalOutstanding.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loans List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    {
                      key: "active",
                      label: "Active Loans",
                      count: getStatusCount("active"),
                    },
                    {
                      key: "approved",
                      label: "Approved",
                      count: getStatusCount("approved"),
                    },
                    {
                      key: "pending",
                      label: "Pending",
                      count: getStatusCount("pending"),
                    },
                    {
                      key: "closed",
                      label: "Closed",
                      count: getStatusCount("closed"),
                    },
                    { key: "all", label: "All Loans", count: loans.length },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </nav>
              </div>

              {/* Loans List */}
              <div className="p-6">
                {filteredLoans.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No {activeTab !== "all" ? activeTab : ""} Loans
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === "all"
                        ? "You don't have any loans yet."
                        : `You don't have any ${activeTab} loans.`}
                    </p>
                    <Link
                      to="/loans/apply"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply for Your First Loan
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLoans.map((loan) => (
                      <LoanCard key={loan.id} loan={loan} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Actions & Calculator */}
          <div className="space-y-6">
            {/* Quick EMI Calculator */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick EMI Calculator
              </h3>
              <LoanCalculatorForm compact={true} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/loans/apply"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                >
                  Apply for New Loan
                </Link>
                <Link
                  to="/loans/status"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block"
                >
                  Check Application Status
                </Link>
                <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  Make Payment
                </button>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Download Statement
                </button>
              </div>
            </div>

            {/* Loan Offers */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Special Offer!</h3>
              <p className="text-blue-100 mb-4">
                Get pre-approved for a personal loan with 10.9% interest rate.
              </p>
              <Link
                to="/loans/apply"
                className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-center block font-semibold"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansDashboard;
