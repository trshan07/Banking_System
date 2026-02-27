import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  FaUserCheck, 
  FaIdCard, 
  FaPassport, 
  FaFileUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaCamera
} from 'react-icons/fa'

const KYCVerification = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [kycStatus, setKycStatus] = useState(null)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    // Check KYC status - mock API call
    setTimeout(() => {
      setKycStatus('pending') // 'not_started', 'pending', 'verified', 'rejected'
    }, 1000)
  }, [])

  const documentTypes = [
    { id: 'passport', name: 'Passport', icon: FaPassport },
    { id: 'drivers_license', name: "Driver's License", icon: FaIdCard },
    { id: 'national_id', name: 'National ID Card', icon: FaIdCard },
    { id: 'residence_permit', name: 'Residence Permit', icon: FaIdCard }
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('KYC data:', data)
      setLoading(false)
      setStep(3) // Show success
    }, 2000)
  }

  // Show status based on KYC progress
  if (kycStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Verified</h2>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You now have access to all features.
            </p>
            <Link
              to="/dashboard"
              className="btn-primary inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (kycStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserCheck className="text-yellow-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h2>
            <p className="text-gray-600 mb-4">
              Your KYC documents are being reviewed. This usually takes 1-2 business days.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Submitted on:</span> February 23, 2024
              </p>
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Estimated completion:</span> February 25, 2024
              </p>
            </div>
            <Link
              to="/dashboard"
              className="btn-primary inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (kycStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">
              We couldn't verify your identity with the documents provided.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-red-800 mb-2">Reason:</p>
              <p className="text-sm text-red-700">
                The uploaded documents are blurry or incomplete. Please upload clear, legible copies.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="btn-primary"
            >
              Try Again
            </button>
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
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">Verify your identity to unlock all banking features</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2].map((num) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > num ? '✓' : num}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {num === 1 && 'Document Upload'}
                    {num === 2 && 'Verification'}
                  </span>
                </div>
                {num < 2 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > num ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Select Document Type</h2>
                
                {/* Document Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentTypes.map((doc) => {
                    const Icon = doc.icon
                    return (
                      <label
                        key={doc.id}
                        className="border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary-500 transition-colors"
                      >
                        <input
                          type="radio"
                          {...register('documentType', { required: 'Please select document type' })}
                          value={doc.id}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="text-gray-600 text-xl" />
                          </div>
                          <span className="font-medium text-gray-900">{doc.name}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
                {errors.documentType && (
                  <p className="error-text">{errors.documentType.message}</p>
                )}

                {/* Document Upload */}
                <div>
                  <label className="form-label">Upload Document (Front) *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      {...register('documentFront', { required: 'Please upload document' })}
                      className="hidden"
                      id="doc-front"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="doc-front" className="cursor-pointer">
                      <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Click to upload front side</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, PDF (Max 5MB)</p>
                    </label>
                  </div>
                  {errors.documentFront && (
                    <p className="error-text">{errors.documentFront.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Upload Document (Back) *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      {...register('documentBack', { required: 'Please upload document back' })}
                      className="hidden"
                      id="doc-back"
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="doc-back" className="cursor-pointer">
                      <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Click to upload back side</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, PDF (Max 5MB)</p>
                    </label>
                  </div>
                  {errors.documentBack && (
                    <p className="error-text">{errors.documentBack.message}</p>
                  )}
                </div>

                {/* Selfie Upload */}
                <div>
                  <label className="form-label">Take a Selfie *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      {...register('selfie', { required: 'Please upload a selfie' })}
                      className="hidden"
                      id="selfie"
                      accept="image/*"
                      capture="user"
                    />
                    <label htmlFor="selfie" className="cursor-pointer">
                      <FaCamera className="text-4xl text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Click to take/upload selfie</p>
                      <p className="text-sm text-gray-500 mt-1">Clear, well-lit photo</p>
                    </label>
                  </div>
                  {errors.selfie && (
                    <p className="error-text">{errors.selfie.message}</p>
                  )}
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Document Requirements:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Document must be valid and not expired</li>
                    <li>• All four corners should be visible</li>
                    <li>• Information must be clearly readable</li>
                    <li>• No glare or reflections</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary w-full"
                >
                  Continue to Verification
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Verify Information</h2>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    By submitting, you confirm that:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• The documents provided are authentic and belong to you</li>
                    <li>• All information provided is accurate and complete</li>
                    <li>• You understand that false information may result in account suspension</li>
                  </ul>
                </div>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('consent', { required: 'You must agree to continue' })}
                    className="mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I confirm that the information and documents provided are accurate and belong to me.
                  </span>
                </label>
                {errors.consent && (
                  <p className="error-text">{errors.consent.message}</p>
                )}

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
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Verification <FaArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default KYCVerification