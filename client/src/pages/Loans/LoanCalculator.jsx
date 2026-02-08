import React from "react";
import { Link } from "react-router-dom";
import LoanCalculatorForm from "./LoanCalculatorForm";

const LoanCalculator = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/loans"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Loans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan EMI Calculator
          </h1>
          <p className="text-gray-600 mt-2">
            Calculate your monthly EMI and choose the best loan option for your
            needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <LoanCalculatorForm />
          </div>

          {/* Loan Offers & Information */}
          <div className="space-y-6">
            {/* Current Offers */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Offers
              </h3>
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900">
                    Personal Loan
                  </h4>
                  <p className="text-green-700 text-sm">
                    Starting at 10.9% interest
                  </p>
                  <p className="text-green-600 text-xs">
                    Pre-approved for existing customers
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900">Home Loan</h4>
                  <p className="text-blue-700 text-sm">
                    8.25% fixed for 5 years
                  </p>
                  <p className="text-blue-600 text-xs">Zero processing fee</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900">
                    Education Loan
                  </h4>
                  <p className="text-purple-700 text-sm">
                    9.5% with moratorium period
                  </p>
                  <p className="text-purple-600 text-xs">Pay after placement</p>
                </div>
              </div>
            </div>

            {/* Quick Apply */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Ready to Apply?</h3>
              <p className="text-blue-100 mb-4">
                Get instant approval with our quick application process.
              </p>
              <Link
                to="/loans/apply"
                className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-center block font-semibold"
              >
                Apply Now
              </Link>
            </div>

            {/* EMI Breakdown Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Understanding EMI
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>EMI</strong> - Equated Monthly Installment
                </p>
                <p>Includes both principal and interest components</p>
                <p>Remains constant throughout the loan tenure</p>
                <p>Interest component decreases over time</p>
                <p>Principal component increases over time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
