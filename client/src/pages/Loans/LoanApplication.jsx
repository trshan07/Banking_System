import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaMoneyBillWave, 
  FaUser, 
  FaBriefcase, 
  FaFileUpload,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaCar,
  FaGraduationCap,
  FaBusinessTime,
  FaHeart,
  FaHeadset,  // ← THIS WAS MISSING
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { loanService } from '../../services/loanService'

const LoanApplication = () => {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
    }
  })

  const loanTypes = [
    { 
      id: 'personal', 
      name: 'Personal Loan', 
      icon: FaHeart,
      interest: '10.99% - 15.99%', 
      minAmount: 1000, 
      maxAmount: 50000,
      tenure: '12 - 60 months',
      description: 'For personal expenses, debt consolidation, or emergencies',
      features: ['No collateral required', 'Quick approval', 'Flexible tenure']
    },
    { 
      id: 'home', 
      name: 'Home Loan', 
      icon: FaHome,
      interest: '8.50% - 11.50%', 
      minAmount: 50000, 
      maxAmount: 1000000,
      tenure: '60 - 360 months',
      description: 'Purchase or renovate your dream home',
      features: ['Low interest rates', 'Long repayment tenure', 'Tax benefits']
    },
    { 
      id: 'car', 
      name: 'Car Loan', 
      icon: FaCar,
      interest: '9.50% - 13.50%', 
      minAmount: 5000, 
      maxAmount: 150000,
      tenure: '12 - 84 months',
      description: 'Finance your new or used vehicle',
      features: ['Quick disbursement', 'Zero foreclosure charges', 'Flexible EMI']
    },
    { 
      id: 'education', 
      name: 'Education Loan', 
      icon: FaGraduationCap,
      interest: '8.75% - 12.50%', 
      minAmount: 2000, 
      maxAmount: 100000,
      tenure: '12 - 120 months',
      description: 'Fund your or your child\'s education',
      features: ['Moratorium period', 'Tax benefits', 'No collateral up to ₹4L']
    },
    { 
      id: 'business', 
      name: 'Business Loan', 
      icon: FaBusinessTime,
      interest: '12.50% - 18.00%', 
      minAmount: 10000, 
      maxAmount: 500000,
      tenure: '12 - 60 months',
      description: 'Expand your business or manage working capital',
      features: ['Unsecured loans', 'Quick processing', 'Minimal documentation']
    }
  ]

  const employmentTypes = [
    { value: 'salaried', label: 'Salaried' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'business', label: 'Business Owner' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'student', label: 'Student' },
    { value: 'retired', label: 'Retired' },
    { value: 'unemployed', label: 'Unemployed' }
  ]

  const selectedLoanType = watch('loanType')
  const selectedLoan = loanTypes.find(loan => loan.id === selectedLoanType)

  const nextStep = async () => {
    let fieldsToValidate = []
    
    if (step === 1) fieldsToValidate = ['loanType', 'loanAmount', 'loanPurpose']
    else if (step === 2) fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'address']
    else if (step === 3) fieldsToValidate = ['employmentType', 'monthlyIncome', 'companyName', 'workExperience']
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid) setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      // Call your loan service
      await loanService.applyForLoan(data)
      setSubmitted(true)
      
      // Show success message
      setTimeout(() => {
        navigate('/dashboard/loans/status')
      }, 3000)
    } catch (error) {
      console.error('Loan application failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your loan application has been received and is being processed. 
              You will receive a confirmation email shortly.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Our team will review your application within 24-48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>You may receive a call for additional information or verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Once approved, funds will be disbursed to your account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>You can track your application status anytime</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard/loans/status"
                className="btn-primary px-6 py-3"
              >
                Track Application Status
              </Link>
              <Link
                to="/dashboard"
                className="btn-secondary px-6 py-3"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Apply for a Loan</h1>
          <p className="text-gray-600 mt-2">Complete the application form below to get started</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > num ? '✓' : num}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {num === 1 && 'Loan Details'}
                    {num === 2 && 'Personal Info'}
                    {num === 3 && 'Financial Info'}
                    {num === 4 && 'Documents'}
                  </span>
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > num ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Loan Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Loan Type</h2>
                
                {/* Loan Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loanTypes.map((loan) => {
                    const Icon = loan.icon
                    return (
                      <label
                        key={loan.id}
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          selectedLoanType === loan.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('loanType', { required: 'Please select a loan type' })}
                          value={loan.id}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${
                            selectedLoanType === loan.id ? 'bg-primary-600' : 'bg-gray-100'
                          }`}>
                            <Icon className={`text-2xl ${
                              selectedLoanType === loan.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{loan.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{loan.description}</p>
                            <div className="mt-3 space-y-1">
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">Interest:</span> {loan.interest}
                              </p>
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">Amount:</span> ${loan.minAmount.toLocaleString()} - ${loan.maxAmount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">Tenure:</span> {loan.tenure}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
                {errors.loanType && (
                  <p className="error-text">{errors.loanType.message}</p>
                )}

                {/* Selected Loan Details */}
                {selectedLoan && (
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                    <h3 className="font-semibold text-primary-900 mb-3">Selected Loan Benefits</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedLoan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-primary-800">
                          <span className="mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Loan Amount */}
                <div>
                  <label className="form-label">Loan Amount (USD) *</label>
                  <input
                    type="number"
                    {...register('loanAmount', { 
                      required: 'Loan amount is required',
                      min: { 
                        value: selectedLoan?.minAmount || 1000, 
                        message: `Minimum amount is $${selectedLoan?.minAmount?.toLocaleString() || '1,000'}`
                      },
                      max: { 
                        value: selectedLoan?.maxAmount || 50000, 
                        message: `Maximum amount is $${selectedLoan?.maxAmount?.toLocaleString() || '50,000'}`
                      }
                    })}
                    className="input-field"
                    placeholder="Enter loan amount"
                  />
                  {errors.loanAmount && (
                    <p className="error-text">{errors.loanAmount.message}</p>
                  )}
                </div>

                {/* Loan Purpose */}
                <div>
                  <label className="form-label">Loan Purpose *</label>
                  <textarea
                    {...register('loanPurpose', { 
                      required: 'Please describe the purpose of this loan',
                      minLength: {
                        value: 20,
                        message: 'Please provide more details (at least 20 characters)'
                      }
                    })}
                    rows={4}
                    className="input-field"
                    placeholder="Describe what you need the loan for..."
                  />
                  {errors.loanPurpose && (
                    <p className="error-text">{errors.loanPurpose.message}</p>
                  )}
                </div>

                {/* Loan Tenure */}
                <div>
                  <label className="form-label">Preferred Tenure (Months) *</label>
                  <select
                    {...register('tenure', { required: 'Please select loan tenure' })}
                    className="input-field"
                  >
                    <option value="">Select tenure</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="84">84 months</option>
                    <option value="120">120 months</option>
                  </select>
                  {errors.tenure && (
                    <p className="error-text">{errors.tenure.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className="input-field"
                    />
                    {errors.firstName && (
                      <p className="error-text">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="input-field"
                    />
                    {errors.lastName && (
                      <p className="error-text">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      className="input-field"
                    />
                    {errors.email && (
                      <p className="error-text">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9+\-\s()]+$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      className="input-field"
                      placeholder="+1 234 567 8900"
                    />
                    {errors.phone && (
                      <p className="error-text">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    {...register('dateOfBirth', { 
                      required: 'Date of birth is required',
                      validate: value => {
                        const age = new Date().getFullYear() - new Date(value).getFullYear()
                        return age >= 18 || 'You must be at least 18 years old'
                      }
                    })}
                    className="input-field"
                  />
                  {errors.dateOfBirth && (
                    <p className="error-text">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Current Address *</label>
                  <textarea
                    {...register('address', { required: 'Address is required' })}
                    rows={3}
                    className="input-field"
                    placeholder="Street address, City, State, ZIP"
                  />
                  {errors.address && (
                    <p className="error-text">{errors.address.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Financial Information */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Employment Type *</label>
                    <select
                      {...register('employmentType', { required: 'Employment type is required' })}
                      className="input-field"
                    >
                      <option value="">Select employment type</option>
                      {employmentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.employmentType && (
                      <p className="error-text">{errors.employmentType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Monthly Income (USD) *</label>
                    <input
                      type="number"
                      {...register('monthlyIncome', { 
                        required: 'Monthly income is required',
                        min: { value: 500, message: 'Minimum monthly income is $500' }
                      })}
                      className="input-field"
                      placeholder="Enter monthly income"
                    />
                    {errors.monthlyIncome && (
                      <p className="error-text">{errors.monthlyIncome.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Company/Employer Name *</label>
                  <input
                    type="text"
                    {...register('companyName', { required: 'Company name is required' })}
                    className="input-field"
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <p className="error-text">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Work Experience (Years) *</label>
                    <input
                      type="number"
                      step="0.5"
                      {...register('workExperience', { 
                        required: 'Work experience is required',
                        min: { value: 0, message: 'Work experience cannot be negative' },
                        max: { value: 50, message: 'Maximum 50 years' }
                      })}
                      className="input-field"
                      placeholder="e.g., 5"
                    />
                    {errors.workExperience && (
                      <p className="error-text">{errors.workExperience.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Existing EMIs (Monthly)</label>
                    <input
                      type="number"
                      {...register('existingEMIs')}
                      className="input-field"
                      placeholder="Enter existing EMI amount"
                      defaultValue={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Additional Income (Optional)</label>
                  <input
                    type="number"
                    {...register('additionalIncome')}
                    className="input-field"
                    placeholder="Enter additional income"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
                
                <div className="space-y-4">
                  {/* Identity Proof */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        {...register('idProof')}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="text-center">
                        <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="font-medium text-gray-900">Identity Proof</p>
                        <p className="text-sm text-gray-500 mt-1">Passport, Driver's License, or National ID</p>
                        <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                    </label>
                  </div>

                  {/* Address Proof */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        {...register('addressProof')}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="text-center">
                        <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="font-medium text-gray-900">Address Proof</p>
                        <p className="text-sm text-gray-500 mt-1">Utility Bill, Bank Statement, or Rental Agreement</p>
                        <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                    </label>
                  </div>

                  {/* Income Proof */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        {...register('incomeProof')}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="text-center">
                        <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="font-medium text-gray-900">Income Proof</p>
                        <p className="text-sm text-gray-500 mt-1">Salary Slips (Last 3 months) or IT Returns</p>
                        <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'You must accept the terms and conditions' })}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I confirm that all information provided is true and accurate. I have read and agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms and Conditions</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>.
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="error-text mt-1">{errors.terms.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center ml-auto"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center ml-auto"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <FaCheckCircle className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaHeadset className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Need help with your application?</h4>
              <p className="text-sm text-blue-800 mt-1">
                Our loan specialists are available 24/7 to assist you. Call us at +1 (800) 123-4567 or 
                <Link to="/dashboard/support/create" className="text-blue-700 font-medium hover:underline ml-1">
                  create a support ticket
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanApplication