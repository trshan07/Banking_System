import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import {
  FaUserCheck,
  FaIdCard,
  FaPassport,
  FaFileUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaCamera,
  FaSpinner,
} from 'react-icons/fa'

const documentTypes = [
  { id: 'passport', name: 'Passport', icon: FaPassport },
  { id: 'driving_license', name: "Driver's License", icon: FaIdCard },
  { id: 'national_id', name: 'National ID Card', icon: FaIdCard },
]

const fileLabels = ['ID Front', 'ID Back', 'Selfie']

const KYCVerification = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [kycStatus, setKycStatus] = useState('loading')
  const [application, setApplication] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      nationality: '',
      idType: 'national_id',
      idNumber: '',
      idExpiryDate: '',
      address: '',
      occupation: '',
      sourceOfFunds: '',
      email: '',
      phoneNumber: '',
      consent: false,
    },
  })

  const documentFront = watch('documentFront')
  const documentBack = watch('documentBack')
  const selfie = watch('selfie')

  useEffect(() => {
    if (user) {
      setValue('fullName', `${user.firstName || ''} ${user.lastName || ''}`.trim())
      setValue('email', user.email || '')
      setValue('phoneNumber', user.phone || '')
      setValue('address', user.address || '')
      setValue('nationality', user.country || '')
    }
  }, [user, setValue])

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await api.get('/kyc')
        const current = response.data?.data

        if (!current) {
          setKycStatus('not_started')
          return
        }

        setApplication(current)
        setKycStatus(current.status || 'pending')
      } catch (error) {
        console.error('Failed to load KYC status:', error)
        setKycStatus('not_started')
      }
    }

    loadStatus()
  }, [])

  const submitApplication = async (data) => {
    if (!user) {
      toast.error('Please log in again to submit KYC.')
      navigate('/auth/login')
      return
    }

    setLoading(true)

    try {
      const applyResponse = await api.post('/kyc/apply', {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        idType: data.idType,
        idNumber: data.idNumber,
        idExpiryDate: data.idExpiryDate,
        address: data.address,
        occupation: data.occupation,
        sourceOfFunds: data.sourceOfFunds,
        email: data.email || user.email,
        phoneNumber: data.phoneNumber || user.phone,
      })

      const kycApplicationId = applyResponse.data?.data?._id
      if (!kycApplicationId) {
        throw new Error('KYC application was not created.')
      }

      const formData = new FormData()
      formData.append('documentType', 'kyc_document')
      formData.append('kycApplicationId', kycApplicationId)
      formData.append('documentLabels', JSON.stringify(fileLabels))

      const files = [data.documentFront?.[0], data.documentBack?.[0], data.selfie?.[0]]
      files.forEach((file) => {
        if (file) {
          formData.append('documents', file)
        }
      })

      const uploadResponse = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      })

      setApplication(applyResponse.data?.data || null)
      setKycStatus('submitted')
      setStep(3)
      toast.success('KYC submitted successfully. It is now waiting for admin approval.')
    } catch (error) {
      console.error('KYC submission error:', error)
      toast.error(error.response?.data?.message || error.message || 'Failed to submit KYC')
    } finally {
      setLoading(false)
    }
  }

  if (kycStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <FaSpinner className="mx-auto mb-4 animate-spin text-3xl text-primary-600" />
            <p className="text-gray-600">Loading KYC status...</p>
          </div>
        </div>
      </div>
    )
  }

  if (kycStatus === 'approved' || kycStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KYC Approved</h2>
            <p className="text-gray-600 mb-6">
              Your identity has been verified. You now have access to all features.
            </p>
            <Link to="/dashboard" className="btn-primary inline-block">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (kycStatus === 'submitted' || kycStatus === 'pending' || kycStatus === 'under_review') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserCheck className="text-yellow-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h2>
            <p className="text-gray-600 mb-4">
              Your KYC documents have been sent to the admin dashboard for review.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Status:</span> {kycStatus.replace(/_/g, ' ')}
              </p>
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Submitted:</span>{' '}
                {application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Just now'}
              </p>
            </div>
            <Link to="/dashboard" className="btn-primary inline-block">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Rejected</h2>
            <p className="text-gray-600 mb-4">
              Please update your documents and submit a new KYC request.
            </p>
            <button onClick={() => setKycStatus('not_started')} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-2">Verify your identity so the admin team can review it.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2].map((num) => (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > num ? '✓' : num}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {num === 1 ? 'Document Details' : 'Review & Submit'}
                  </span>
                </div>
                {num < 2 && <div className={`flex-1 h-1 mx-2 ${step > num ? 'bg-primary-600' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit(submitApplication)}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Applicant Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input {...register('fullName', { required: 'Full name is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Date of Birth *</label>
                    <input type="date" {...register('dateOfBirth', { required: 'Date of birth is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Nationality *</label>
                    <input {...register('nationality', { required: 'Nationality is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.nationality && <p className="error-text">{errors.nationality.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">ID Type *</label>
                    <select {...register('idType', { required: 'ID type is required' })} className="w-full rounded-lg border px-3 py-2">
                      {documentTypes.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                    {errors.idType && <p className="error-text">{errors.idType.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">ID Number *</label>
                    <input {...register('idNumber', { required: 'ID number is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.idNumber && <p className="error-text">{errors.idNumber.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Expiry Date *</label>
                    <input type="date" {...register('idExpiryDate', { required: 'Expiry date is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.idExpiryDate && <p className="error-text">{errors.idExpiryDate.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">Address *</label>
                  <textarea {...register('address', { required: 'Address is required' })} rows="3" className="w-full rounded-lg border px-3 py-2" />
                  {errors.address && <p className="error-text">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Occupation *</label>
                    <input {...register('occupation', { required: 'Occupation is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.occupation && <p className="error-text">{errors.occupation.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Source of Funds *</label>
                    <input {...register('sourceOfFunds', { required: 'Source of funds is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.sourceOfFunds && <p className="error-text">{errors.sourceOfFunds.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input type="email" {...register('email', { required: 'Email is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input {...register('phoneNumber', { required: 'Phone number is required' })} className="w-full rounded-lg border px-3 py-2" />
                    {errors.phoneNumber && <p className="error-text">{errors.phoneNumber.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Upload Document Front *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                      <input
                        type="file"
                        {...register('documentFront', { required: 'Please upload the front side' })}
                        className="hidden"
                        id="doc-front"
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="doc-front" className="cursor-pointer">
                        <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">{documentFront?.[0]?.name || 'Click to upload front side'}</p>
                      </label>
                    </div>
                    {errors.documentFront && <p className="error-text">{errors.documentFront.message}</p>}
                  </div>

                  <div>
                    <label className="form-label">Upload Document Back *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                      <input
                        type="file"
                        {...register('documentBack', { required: 'Please upload the back side' })}
                        className="hidden"
                        id="doc-back"
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="doc-back" className="cursor-pointer">
                        <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">{documentBack?.[0]?.name || 'Click to upload back side'}</p>
                      </label>
                    </div>
                    {errors.documentBack && <p className="error-text">{errors.documentBack.message}</p>}
                  </div>

                  <div>
                    <label className="form-label">Selfie *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
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
                        <p className="text-gray-600">{selfie?.[0]?.name || 'Click to take/upload selfie'}</p>
                      </label>
                    </div>
                    {errors.selfie && <p className="error-text">{errors.selfie.message}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Document Requirements:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>- Documents must be clear and readable</li>
                    <li>- All corners should be visible</li>
                    <li>- Selfie should be well lit</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const isValid = await trigger([
                      'fullName',
                      'dateOfBirth',
                      'nationality',
                      'idType',
                      'idNumber',
                      'idExpiryDate',
                      'address',
                      'occupation',
                      'sourceOfFunds',
                      'email',
                      'phoneNumber',
                      'documentFront',
                      'documentBack',
                      'selfie',
                    ])

                    if (isValid) {
                      setStep(2)
                    }
                  }}
                  className="btn-primary w-full"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Review Information</h2>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
                  <p>Please confirm that the submitted information is accurate and belongs to you.</p>
                  <p>The admin team will receive this submission for approval once you submit it.</p>
                </div>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('consent', { required: 'You must agree to continue' })}
                    className="mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I confirm the information and documents provided are accurate and belong to me.
                  </span>
                </label>
                {errors.consent && <p className="error-text">{errors.consent.message}</p>}

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
                        <FaSpinner className="mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Approval <FaArrowRight className="ml-2" />
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
