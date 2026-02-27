import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  FaUniversity, 
  FaUser, 
  FaMoneyBillWave,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa'
import { formatCurrency } from '../../utils/formatters'

const TransferFunds = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  // Mock accounts - replace with real data from API
  const accounts = [
    { id: 1, name: 'Main Checking', number: '****1234', balance: 8450.50 },
    { id: 2, name: 'Savings Account', number: '****5678', balance: 12500.75 },
  ]

  const savedBeneficiaries = [
    { id: 1, name: 'John Doe', accountNumber: '****9012', bank: 'Smart Bank' },
    { id: 2, name: 'Jane Smith', accountNumber: '****3456', bank: 'Smart Bank' },
    { id: 3, name: 'Mike Johnson', accountNumber: '****7890', bank: 'Other Bank' },
  ]

  const fromAccount = watch('fromAccount')
  const selectedAccount = accounts.find(acc => acc.id === parseInt(fromAccount))

  const onSubmit = async (data) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Transfer data:', data)
      setTransferSuccess(true)
      setLoading(false)
    }, 2000)
  }

  if (transferSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful!</h2>
            <p className="text-gray-600 mb-6">Your funds have been transferred successfully.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">Transaction ID: TRX{Date.now()}</p>
              <p className="text-sm text-gray-600">Date: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setTransferSuccess(false)
                  setStep(1)
                }}
                className="btn-primary flex-1"
              >
                Make Another Transfer
              </button>
              <Link
                to="/dashboard/banking/accounts"
                className="btn-secondary flex-1"
              >
                Back to Accounts
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard/banking/accounts" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Accounts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Transfer Funds</h1>
          <p className="text-gray-600 mt-2">Send money to your accounts or other beneficiaries</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-xs mt-1 block">Details</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 text-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-xs mt-1 block">Confirm</span>
            </div>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-6">
                {/* From Account */}
                <div>
                  <label className="form-label">From Account *</label>
                  <select
                    {...register('fromAccount', { required: 'Please select an account' })}
                    className="input-field"
                  >
                    <option value="">Select account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.number}) - {formatCurrency(acc.balance)}
                      </option>
                    ))}
                  </select>
                  {errors.fromAccount && (
                    <p className="error-text">{errors.fromAccount.message}</p>
                  )}
                </div>

                {/* Transfer Type */}
                <div>
                  <label className="form-label">Transfer Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('transferType')}
                        value="own"
                        className="mr-2"
                      />
                      <span>Own Account</span>
                    </label>
                    <label className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('transferType')}
                        value="other"
                        className="mr-2"
                      />
                      <span>Other Bank</span>
                    </label>
                  </div>
                </div>

                {/* To Account / Beneficiary */}
                <div>
                  <label className="form-label">To Account *</label>
                  <select
                    {...register('toAccount', { required: 'Please select beneficiary' })}
                    className="input-field"
                  >
                    <option value="">Select beneficiary</option>
                    {savedBeneficiaries.map(ben => (
                      <option key={ben.id} value={ben.id}>
                        {ben.name} - {ben.accountNumber} ({ben.bank})
                      </option>
                    ))}
                    <option value="new">+ Add New Beneficiary</option>
                  </select>
                  {errors.toAccount && (
                    <p className="error-text">{errors.toAccount.message}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="form-label">Amount (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      {...register('amount', { 
                        required: 'Amount is required',
                        min: { value: 1, message: 'Minimum amount is $1' },
                        max: { 
                          value: selectedAccount?.balance || 0, 
                          message: 'Insufficient balance' 
                        }
                      })}
                      className="input-field pl-8"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && (
                    <p className="error-text">{errors.amount.message}</p>
                  )}
                  {selectedAccount && (
                    <p className="text-xs text-gray-500 mt-1">
                      Available balance: {formatCurrency(selectedAccount.balance)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">Description (Optional)</label>
                  <input
                    type="text"
                    {...register('description')}
                    className="input-field"
                    placeholder="Enter description"
                  />
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary w-full"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Transfer Details</h3>
                
                {/* Transfer Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">Main Checking (****1234)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">John Doe - ****9012</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-lg text-primary-600">$1,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="text-yellow-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Please verify the details</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Once confirmed, this transfer cannot be cancelled.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Transfer <FaArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Transfer Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Transfers between Smart Bank accounts are instant</li>
            <li>• External transfers may take 1-2 business days</li>
            <li>• Daily transfer limit: $10,000</li>
            <li>• Free transfers for all account types</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TransferFunds