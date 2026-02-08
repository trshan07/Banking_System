import React, { useState, useEffect } from "react";

const LoanCalculatorForm = ({ compact = false }) => {
  const [formData, setFormData] = useState({
    loanAmount: 10000,
    interestRate: 8.5,
    loanTenure: 12,
    loanType: "personal",
  });

  const [calculation, setCalculation] = useState(null);

  const loanTypes = [
    { value: "personal", label: "Personal Loan", rate: 12.5 },
    { value: "home", label: "Home Loan", rate: 8.5 },
    { value: "car", label: "Car Loan", rate: 9.5 },
    { value: "education", label: "Education Loan", rate: 10.0 },
    { value: "business", label: "Business Loan", rate: 11.0 },
  ];

  useEffect(() => {
    calculateEMI();
  }, [formData]);

  const calculateEMI = () => {
    const { loanAmount, interestRate, loanTenure } = formData;

    const monthlyRate = interestRate / 12 / 100;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
      (Math.pow(1 + monthlyRate, loanTenure) - 1);

    const totalPayment = emi * loanTenure;
    const totalInterest = totalPayment - loanAmount;

    setCalculation({
      emi: isNaN(emi) ? 0 : emi,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLoanTypeChange = (type) => {
    const selectedLoan = loanTypes.find((loan) => loan.value === type);
    setFormData((prev) => ({
      ...prev,
      loanType: type,
      interestRate: selectedLoan.rate,
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={compact ? "" : "bg-white rounded-lg shadow p-6"}>
      {!compact && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Loan EMI Calculator
        </h2>
      )}

      <div className="space-y-4">
        {/* Loan Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Type
          </label>
          <select
            value={formData.loanType}
            onChange={(e) => handleLoanTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loanTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.rate}%)
              </option>
            ))}
          </select>
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount: {formatCurrency(formData.loanAmount)}
          </label>
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={formData.loanAmount}
            onChange={(e) =>
              handleInputChange("loanAmount", parseInt(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$1,000</span>
            <span>$1,000,000</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate: {formData.interestRate}%
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="0.1"
            value={formData.interestRate}
            onChange={(e) =>
              handleInputChange("interestRate", parseFloat(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Tenure: {formData.loanTenure} months
          </label>
          <input
            type="range"
            min="6"
            max="360"
            step="6"
            value={formData.loanTenure}
            onChange={(e) =>
              handleInputChange("loanTenure", parseInt(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6 months</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Calculation Results */}
        {calculation && (
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Calculation Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculation.emi)}
                </p>
                <p className="text-sm text-gray-600">Monthly EMI</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculation.totalPayment)}
                </p>
                <p className="text-sm text-gray-600">Total Payment</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(calculation.totalInterest)}
                </p>
                <p className="text-sm text-gray-600">Total Interest</p>
              </div>
            </div>
          </div>
        )}

        {!compact && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 Tips for Better Rates
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Maintain a good credit score above 750</li>
              <li>• Choose shorter tenure for less interest</li>
              <li>• Compare offers from multiple lenders</li>
              <li>• Consider prepayment options</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculatorForm;
