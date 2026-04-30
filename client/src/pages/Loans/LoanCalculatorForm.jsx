import React, { useEffect, useState } from 'react'
import { formatCurrency } from '../../utils/formatters'

const loanTypes = [
  { value: 'personal', label: 'Personal Loan', rate: 10.5 },
  { value: 'home', label: 'Home Loan', rate: 6.5 },
  { value: 'auto', label: 'Auto Loan', rate: 7.5 },
  { value: 'education', label: 'Education Loan', rate: 5.5 },
  { value: 'business', label: 'Business Loan', rate: 8.5 },
]

const LoanCalculatorForm = ({ compact = false }) => {
  const [formData, setFormData] = useState({
    loanAmount: 10000,
    interestRate: 10.5,
    loanTenure: 12,
    loanType: 'personal',
  })
  const [calculation, setCalculation] = useState({
    emi: 0,
    totalPayment: 0,
    totalInterest: 0,
  })

  useEffect(() => {
    const { loanAmount, interestRate, loanTenure } = formData
    const monthlyRate = interestRate / 12 / 100

    if (monthlyRate === 0) {
      const emi = loanTenure > 0 ? loanAmount / loanTenure : 0
      setCalculation({
        emi,
        totalPayment: emi * loanTenure,
        totalInterest: 0,
      })
      return
    }

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
      (Math.pow(1 + monthlyRate, loanTenure) - 1)
    const totalPayment = emi * loanTenure
    const totalInterest = totalPayment - loanAmount

    setCalculation({
      emi: Number.isFinite(emi) ? emi : 0,
      totalPayment: Number.isFinite(totalPayment) ? totalPayment : 0,
      totalInterest: Number.isFinite(totalInterest) ? totalInterest : 0,
    })
  }, [formData])

  const handleInputChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleLoanTypeChange = (type) => {
    const selectedLoan = loanTypes.find((loan) => loan.value === type)
    setFormData((current) => ({
      ...current,
      loanType: type,
      interestRate: selectedLoan?.rate || current.interestRate,
    }))
  }

  return (
    <div className={compact ? '' : 'rounded-lg bg-white p-6 shadow'}>
      {!compact ? <h2 className="mb-6 text-2xl font-bold text-gray-900">Loan EMI Calculator</h2> : null}

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Loan Type</label>
          <select
            value={formData.loanType}
            onChange={(e) => handleLoanTypeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loanTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.rate}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Loan Amount: {formatCurrency(formData.loanAmount)}
          </label>
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={formData.loanAmount}
            onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>$1,000</span>
            <span>$1,000,000</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Interest Rate: {formData.interestRate}%
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="0.1"
            value={formData.interestRate}
            onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Loan Tenure: {formData.loanTenure} months
          </label>
          <input
            type="range"
            min="6"
            max="360"
            step="6"
            value={formData.loanTenure}
            onChange={(e) => handleInputChange('loanTenure', Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>6 months</span>
            <span>30 years</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">Calculation Results</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculation.emi)}</p>
              <p className="text-sm text-gray-600">Monthly EMI</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(calculation.totalPayment)}</p>
              <p className="text-sm text-gray-600">Total Payment</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(calculation.totalInterest)}</p>
              <p className="text-sm text-gray-600">Total Interest</p>
            </div>
          </div>
        </div>

        {!compact ? (
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">Tips for Better Rates</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>Maintain a strong repayment history and credit profile.</li>
              <li>Shorter tenures usually reduce total interest paid.</li>
              <li>Compare repayment comfort, not just the lowest EMI.</li>
              <li>Use the calculator before applying so your loan request is realistic.</li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LoanCalculatorForm
