import React from 'react'
import { Link } from 'react-router-dom'
import LoanCalculatorForm from './LoanCalculatorForm'

const LoanCalculator = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard/loans" className="mb-4 inline-block text-blue-600 hover:text-blue-700">
            Back to Loans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Loan EMI Calculator</h1>
          <p className="mt-2 text-gray-600">
            Estimate monthly repayments using loan types and base rates aligned with the customer loan flow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LoanCalculatorForm />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Current Loan Types</h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="font-semibold text-green-900">Personal Loan</h4>
                  <p className="text-sm text-green-700">Base rate: 10.5%</p>
                  <p className="text-xs text-green-600">Good for flexible personal borrowing.</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-900">Home Loan</h4>
                  <p className="text-sm text-blue-700">Base rate: 6.5%</p>
                  <p className="text-xs text-blue-600">Built for larger and longer repayments.</p>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <h4 className="font-semibold text-purple-900">Education Loan</h4>
                  <p className="text-sm text-purple-700">Base rate: 5.5%</p>
                  <p className="text-xs text-purple-600">Helpful for study-related expenses and planning.</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow">
              <h3 className="mb-2 text-lg font-semibold">Ready to Apply?</h3>
              <p className="mb-4 text-blue-100">
                Once the numbers feel right, continue to the real customer loan application flow.
              </p>
              <Link
                to="/dashboard/loans/apply"
                className="block w-full rounded-lg bg-white px-4 py-2 text-center font-semibold text-blue-600 transition-colors hover:bg-gray-100"
              >
                Apply Now
              </Link>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Understanding EMI</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>EMI</strong> means Equated Monthly Installment.</p>
                <p>It combines principal and interest into a fixed monthly amount.</p>
                <p>Longer terms often reduce EMI but increase total interest.</p>
                <p>This calculator is a planning tool and your final approved rate may differ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculator
