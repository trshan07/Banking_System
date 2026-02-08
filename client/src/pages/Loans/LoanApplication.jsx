import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const LoanApplication = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const loanTypes = [
    { id: 'personal', name: 'Personal Loan', interest: '12%', maxAmount: 50000 },
    { id: 'home', name: 'Home Loan', interest: '8.5%', maxAmount: 500000 },
    { id: 'car', name: 'Car Loan', interest: '9.5%', maxAmount: 100000 },
    { id: 'education', name: 'Education Loan', interest: '10%', maxAmount: 200000 },
    { id: 'business', name: 'Business Loan', interest: '11%', maxAmount: 300000 }
  ];

  const employmentTypes = [
    'Salaried',
    'Self-Employed',
    'Business Owner',
    'Freelancer',
    'Student',
    'Unemployed'
  ];

  const onSubmit = (data) => {
    console.log('Loan application submitted:', data);
    // Here you would typically send data to your backend
    setSubmitted(true);
  };

  const selectedLoanType = watch('loanType');
  const selectedLoan = loanTypes.find(loan => loan.id === selectedLoanType);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
              <p className="text-lg">Your loan application has been received and is under review.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
              <div className="text-left space-y-3">
                <p>✅ You will receive a confirmation email shortly</p>
                <p>⏳ Our team will review your application within 24-48 hours</p>
                <p>📞 You may be contacted for additional information</p>
                <p>📊 Check your application status in the Loan Status section</p>
              </div>
              <div className="mt-6 space-x-4">
                <Link to="/loans/status" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Check Status
                </Link>
                <Link to="/dashboard" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply for a Loan</h1>
          <p className="text-gray-600 mt-2">Get the financial support you need with our flexible loan options</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between mb-4">
            <div className={`text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
              <span className="text-sm font-medium">Loan Details</span>
            </div>
            <div className={`text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
              <span className="text-sm font-medium">Personal Info</span>
            </div>
            <div className={`text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
              <span className="text-sm font-medium">Financial Info</span>
            </div>
            <div className={`text-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">4</div>
              <span className="text-sm font-medium">Documents</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Loan Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Loan Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loanTypes.map((loan) => (
                    <label key={loan.id} className="relative">
                      <input
                        type="radio"
                        {...register('loanType', { required: 'Please select a loan type' })}
                        value={loan.id}
                        className="sr-only"
                      />
                      <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50">
                        <div className="font-semibold text-gray-900">{loan.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Interest: {loan.interest} | Max: ${loan.maxAmount.toLocaleString()}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.loanType && (
                  <p className="text-red-500 text-sm mt-1">{errors.loanType.message}</p>
                )}
              </div>

              {selectedLoan && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Loan Details</h3>
                  <p><strong>Type:</strong> {selectedLoan.name}</p>
                  <p><strong>Interest Rate:</strong> {selectedLoan.interest}</p>
                  <p><strong>Maximum Amount:</strong> ${selectedLoan.maxAmount.toLocaleString()}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (USD) *
                </label>
                <input
                  type="number"
                  {...register('loanAmount', { 
                    required: 'Loan amount is required',
                    min: { value: 1000, message: 'Minimum loan amount is $1,000' },
                    max: { value: selectedLoan?.maxAmount || 500000, message: `Maximum amount for this loan is $${selectedLoan?.maxAmount.toLocaleString()}` }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter loan amount"
                />
                {errors.loanAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.loanAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose *
                </label>
                <textarea
                  {...register('loanPurpose', { required: 'Please describe the purpose of this loan' })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what you need the loan for..."
                />
                {errors.loanPurpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.loanPurpose.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Next: Personal Information
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Next: Financial Information
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Financial Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  {...register('employmentType', { required: 'Employment type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employment type</option>
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.employmentType && (
                  <p className="text-red-500 text-sm mt-1">{errors.employmentType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (USD) *
                </label>
                <input
                  type="number"
                  {...register('monthlyIncome', { 
                    required: 'Monthly income is required',
                    min: { value: 0, message: 'Income cannot be negative' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.monthlyIncome && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Income (USD)
                </label>
                <input
                  type="number"
                  {...register('additionalIncome')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>Need help? <Link to="/support" className="text-blue-600 hover:text-blue-700">Contact our support team</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;