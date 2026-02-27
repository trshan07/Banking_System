import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  FaExclamationTriangle, 
  FaShieldAlt,
  FaCreditCard,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa'

const ReportFraud = () => {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const fraudTypes = [
    'Unauthorized Transaction',
    'Stolen Card',
    'Phishing Attempt',
    'Identity Theft',
    'Account Takeover',
    'Fake Website/App',
    'Suspicious Call/Message',
    'Other'
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Fraud report:', data)
      setLoading(false)
      setSubmitted(true)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reporting this incident. Our fraud team will investigate and contact you within 24 hours.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Reference ID: FR{Date.now()}
            </p>
            <Link
              to="/dashboard"
              className="btn-primary inline-block"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Report Fraud</h1>
          <p className="text-gray-600 mt-2">Report suspicious activity or unauthorized transactions</p>
        </div>

        {/* Security Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <FaExclamationTriangle className="text-red-600 text-2xl" />
            <div>
              <h3 className="font-semibold text-red-900">Immediate Actions Required</h3>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                <li>• If your card is stolen, lock it immediately in the mobile app</li>
                <li>• Change your online banking password</li>
                <li>• Call our 24/7 fraud hotline: +1 (800) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Fraud Type */}
            <div>
              <label className="form-label">Type of Fraud *</label>
              <select
                {...register('fraudType', { required: 'Please select fraud type' })}
                className="input-field"
              >
                <option value="">Select type</option>
                {fraudTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.fraudType && (
                <p className="error-text">{errors.fraudType.message}</p>
              )}
            </div>

            {/* Date of Incident */}
            <div>
              <label className="form-label">Date of Incident *</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('incidentDate', { required: 'Please select date' })}
                  className="input-field pl-10"
                />
              </div>
              {errors.incidentDate && (
                <p className="error-text">{errors.incidentDate.message}</p>
              )}
            </div>

            {/* Amount Involved */}
            <div>
              <label className="form-label">Amount Involved (if known)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Card/Account Number */}
            <div>
              <label className="form-label">Card/Account Number (last 4 digits) *</label>
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  {...register('cardNumber', { 
                    required: 'Please provide last 4 digits',
                    pattern: {
                      value: /^\d{4}$/,
                      message: 'Please enter the last 4 digits'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter last 4 digits"
                  maxLength="4"
                />
              </div>
              {errors.cardNumber && (
                <p className="error-text">{errors.cardNumber.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description of Incident *</label>
              <textarea
                {...register('description', { 
                  required: 'Please describe the incident',
                  minLength: { value: 20, message: 'Please provide more details' }
                })}
                rows={6}
                className="input-field"
                placeholder="Please describe what happened in detail. Include any suspicious calls, messages, or unauthorized transactions."
              />
              {errors.description && (
                <p className="error-text">{errors.description.message}</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Your Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="error-text">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="input-field"
                  placeholder="+1 234 567 8900"
                />
                {errors.phone && (
                  <p className="error-text">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Police Report (Optional) */}
            <div>
              <label className="form-label">Police Report Number (if filed)</label>
              <input
                type="text"
                {...register('policeReport')}
                className="input-field"
                placeholder="Enter police report number"
              />
            </div>

            {/* Confirmation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register('confirmation', { required: 'You must confirm the information is accurate' })}
                  className="mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I confirm that the information provided is true and accurate to the best of my knowledge. 
                  I understand that filing a false report is a serious offense.
                </span>
              </label>
              {errors.confirmation && (
                <p className="error-text mt-1">{errors.confirmation.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <FaShieldAlt className="mr-2" /> Submit Fraud Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportFraud