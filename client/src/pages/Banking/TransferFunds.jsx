import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  FaUniversity,
  FaUser,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaGlobe
} from 'react-icons/fa'
import { formatCurrency } from '../../utils/formatters'
import { bankingAPI } from '../../services/api'

const BANKS = [
  'Smart Bank',
  'Bank of Ceylon',
  'Commercial Bank',
  'Hatton National Bank',
  'Peoples Bank',
  'Sampath Bank',
  'Seylan Bank',
  'DFCC Bank',
  'National Savings Bank',
  'HSBC Sri Lanka',
  'Standard Chartered',
  'Citi Bank',
  'Nations Trust Bank'
]

const TransferFunds = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetchingAccounts, setFetchingAccounts] = useState(true)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [transferResult, setTransferResult] = useState(null)
  const [accounts, setAccounts] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    reset
  } = useForm({ defaultValues: { transferType: 'own' } })

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await bankingAPI.getAccounts()
        const activeAccounts = (response.data.data || []).filter(acc => acc.status === 'active')
        setAccounts(activeAccounts)
      } catch (error) {
        toast.error('Failed to load accounts')
      } finally {
        setFetchingAccounts(false)
      }
    }
    fetchAccounts()
  }, [])

  const transferType = watch('transferType')
  const fromAccount = watch('fromAccount')
  const toAccount = watch('toAccount')
  const amount = watch('amount')
  const description = watch('description')
  const beneficiaryName = watch('beneficiaryName')
  const beneficiaryAccountNumber = watch('beneficiaryAccountNumber')
  const beneficiaryBank = watch('beneficiaryBank')

  const selectedFromAccount = accounts.find(acc => acc._id === fromAccount)
  const selectedToAccount = accounts.find(acc => acc._id === toAccount)
  const destinationAccounts = accounts.filter(acc => acc._id !== fromAccount)
  const isExternal = transferType === 'external'

  const formatAccountLabel = (acc) => {
    if (!acc) return 'N/A'
    return `${acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} (****${acc.accountNumber.slice(-4)})`
  }

  const handleContinue = async () => {
    const fields = ['fromAccount', 'amount']
    if (isExternal) {
      fields.push('beneficiaryName', 'beneficiaryAccountNumber', 'beneficiaryBank')
    } else {
      fields.push('toAccount')
    }
    const valid = await trigger(fields)
    if (valid) setStep(2)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        fromAccountId: data.fromAccount,
        amount: parseFloat(data.amount),
        description: data.description || '',
        transferType: data.transferType
      }
      if (data.transferType === 'own' || data.transferType === 'internal') {
        payload.toAccountId = data.toAccount
      } else {
        payload.beneficiaryName = data.beneficiaryName
        payload.beneficiaryAccountNumber = data.beneficiaryAccountNumber
        payload.beneficiaryBank = data.beneficiaryBank
      }
      const response = await bankingAPI.transferFunds(payload)
      setTransferResult(response.data.data)
      setTransferSuccess(true)
      toast.success(response.data.message || 'Transfer completed successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Transfer failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (transferSuccess) {
    const txn = transferResult?.transaction
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful!</h2>
            <p className="text-gray-600 mb-6">Your funds have been transferred successfully.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono font-medium text-gray-900">{txn?.reference || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-green-600">{formatCurrency(txn?.amount || 0)}</span>
              </div>
              {txn?.metadata?.beneficiaryName && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Beneficiary:</span>
                    <span className="font-medium">{txn.metadata.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-medium">{txn.metadata.beneficiaryBank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account:</span>
                    <span className="font-mono">{txn.metadata.beneficiaryAccountNumber}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{new Date(txn?.createdAt || Date.now()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2 mt-2">
                <span className="text-gray-500">Remaining Balance:</span>
                <span className="font-bold">{formatCurrency(transferResult?.fromAccountBalance || 0)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setTransferSuccess(false)
                  setTransferResult(null)
                  setStep(1)
                  reset({ transferType: 'own' })
                }}
                className="btn-primary flex-1"
              >
                Make Another Transfer
              </button>
              <Link to="/dashboard/banking/accounts" className="btn-secondary flex-1">
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
              }`}>1</div>
              <span className="text-xs mt-1 block">Details</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 text-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>2</div>
              <span className="text-xs mt-1 block">Confirm</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* ── STEP 1: Transfer Details ── */}
            {step === 1 && (
              <div className="space-y-6">
                {fetchingAccounts ? (
                  <p className="text-center text-gray-500 py-4">Loading accounts...</p>
                ) : accounts.length === 0 ? (
                  <div className="text-center py-4">
                    <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-2" />
                    <p className="text-gray-600">No active accounts found.</p>
                    <Link to="/dashboard/banking/accounts" className="text-primary-600 hover:underline mt-2 inline-block">
                      Go to Accounts
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Transfer Type */}
                    <div>
                      <label className="form-label">Transfer Type *</label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          !isExternal ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input type="radio" {...register('transferType')} value="own" className="sr-only" />
                          <div className="flex items-center space-x-3">
                            <FaExchangeAlt className={`text-xl ${!isExternal ? 'text-primary-600' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-semibold text-sm">Own Account</p>
                              <p className="text-xs text-gray-500">Between your Smart Bank accounts</p>
                            </div>
                          </div>
                        </label>
                        <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          isExternal ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}>
                          <input type="radio" {...register('transferType')} value="external" className="sr-only" />
                          <div className="flex items-center space-x-3">
                            <FaGlobe className={`text-xl ${isExternal ? 'text-primary-600' : 'text-gray-400'}`} />
                            <div>
                              <p className="font-semibold text-sm">Other Bank</p>
                              <p className="text-xs text-gray-500">To another bank's account</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* From Account */}
                    <div>
                      <label className="form-label">From Account *</label>
                      <select
                        {...register('fromAccount', { required: 'Please select a source account' })}
                        className="input-field"
                      >
                        <option value="">Select your account</option>
                        {accounts.map(acc => (
                          <option key={acc._id} value={acc._id}>
                            {formatAccountLabel(acc)} — {formatCurrency(acc.balance)}
                          </option>
                        ))}
                      </select>
                      {errors.fromAccount && <p className="error-text">{errors.fromAccount.message}</p>}
                    </div>

                    {/* Destination: Own accounts OR External beneficiary */}
                    {!isExternal ? (
                      <div>
                        <label className="form-label">To Account *</label>
                        {destinationAccounts.length === 0 ? (
                          <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                            No other accounts available. Switch to "Other Bank" to transfer externally.
                          </p>
                        ) : (
                          <select
                            {...register('toAccount', { required: 'Please select a destination account' })}
                            className="input-field"
                          >
                            <option value="">Select destination account</option>
                            {destinationAccounts.map(acc => (
                              <option key={acc._id} value={acc._id}>
                                {formatAccountLabel(acc)} — {formatCurrency(acc.balance)}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.toAccount && <p className="error-text">{errors.toAccount.message}</p>}
                      </div>
                    ) : (
                      <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <FaUser className="mr-2 text-primary-600" />
                          Beneficiary Details
                        </h4>

                        <div>
                          <label className="form-label">Account Holder Name *</label>
                          <input
                            type="text"
                            {...register('beneficiaryName', { required: 'Account holder name is required' })}
                            className="input-field"
                            placeholder="e.g. John Doe"
                          />
                          {errors.beneficiaryName && <p className="error-text">{errors.beneficiaryName.message}</p>}
                        </div>

                        <div>
                          <label className="form-label">Account Number *</label>
                          <input
                            type="text"
                            {...register('beneficiaryAccountNumber', {
                              required: 'Account number is required',
                              minLength: { value: 6, message: 'Account number must be at least 6 digits' }
                            })}
                            className="input-field"
                            placeholder="e.g. 1234567890"
                          />
                          {errors.beneficiaryAccountNumber && <p className="error-text">{errors.beneficiaryAccountNumber.message}</p>}
                        </div>

                        <div>
                          <label className="form-label">Bank Name *</label>
                          <select
                            {...register('beneficiaryBank', { required: 'Please select a bank' })}
                            className="input-field"
                          >
                            <option value="">Select bank</option>
                            {BANKS.map(bank => (
                              <option key={bank} value={bank}>{bank}</option>
                            ))}
                          </select>
                          {errors.beneficiaryBank && <p className="error-text">{errors.beneficiaryBank.message}</p>}
                        </div>
                      </div>
                    )}

                    {/* Amount */}
                    <div>
                      <label className="form-label">Amount (LKR) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                        <input
                          type="number"
                          step="0.01"
                          {...register('amount', {
                            required: 'Amount is required',
                            min: { value: 1, message: 'Minimum amount is Rs. 1' },
                            max: {
                              value: selectedFromAccount?.balance || 0,
                              message: 'Insufficient balance'
                            }
                          })}
                          className="input-field pl-10"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.amount && <p className="error-text">{errors.amount.message}</p>}
                      {selectedFromAccount && (
                        <p className="text-xs text-gray-500 mt-1">
                          Available: {formatCurrency(selectedFromAccount.balance)}
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
                        placeholder="e.g. Rent payment, Gift, Invoice #123"
                      />
                    </div>

                    <button type="button" onClick={handleContinue} className="btn-primary w-full">
                      Continue to Review
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── STEP 2: Confirm ── */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Review Transfer Details</h3>

                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Transfer Type:</span>
                    <span className="font-medium text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {isExternal ? 'External Bank' : 'Own Account'}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-500">From:</span>
                    <span className="font-medium">{formatAccountLabel(selectedFromAccount)}</span>
                  </div>

                  {!isExternal ? (
                    <div className="flex justify-between">
                      <span className="text-gray-500">To:</span>
                      <span className="font-medium">{formatAccountLabel(selectedToAccount)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Beneficiary:</span>
                        <span className="font-medium">{beneficiaryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account No:</span>
                        <span className="font-mono font-medium">{beneficiaryAccountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank:</span>
                        <span className="font-medium flex items-center">
                          <FaUniversity className="mr-1 text-gray-400" /> {beneficiaryBank}
                        </span>
                      </div>
                    </>
                  )}

                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-xl text-primary-600">{formatCurrency(parseFloat(amount) || 0)}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Description:</span>
                      <span className="font-medium text-sm">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  {isExternal && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing:</span>
                      <span className="text-sm text-orange-600 font-medium">1-2 business days</span>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="text-yellow-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Please verify the details carefully</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Once confirmed, this transfer cannot be reversed.
                        {isExternal && ' External transfers may take 1-2 business days to process.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
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
            <li>• Daily transfer limit applies</li>
            <li>• Free transfers for all account types</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default TransferFunds
