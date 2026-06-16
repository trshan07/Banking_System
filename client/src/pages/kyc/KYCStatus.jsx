import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import api from '../../services/api'

const KYCStatus = () => {
  const [loading, setLoading] = useState(true)
  const [kyc, setKyc] = useState(null)

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await api.get('/kyc')
        setKyc(response.data?.data || null)
      } catch (error) {
        console.error('Failed to load KYC status:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <FaSpinner className="animate-spin text-3xl text-primary-600" />
        </div>
      </div>
    )
  }

  const status = kyc?.status || 'not_started'
  const statusLabel = status.replace(/_/g, ' ')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">KYC Status</h1>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                status === 'approved' || status === 'verified'
                  ? 'bg-green-100'
                  : status === 'rejected'
                    ? 'bg-red-100'
                    : 'bg-yellow-100'
              }`}
            >
              {status === 'approved' || status === 'verified' ? (
                <FaCheckCircle className="text-green-600 text-xl" />
              ) : status === 'rejected' ? (
                <FaExclamationTriangle className="text-red-600 text-xl" />
              ) : (
                <FaClock className="text-yellow-600 text-xl" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Current status</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{statusLabel}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-gray-700">
              {status === 'not_started'
                ? 'You have not submitted a KYC request yet.'
                : status === 'approved' || status === 'verified'
                ? 'Your KYC has been approved.'
                : status === 'rejected'
                  ? `Your submission was rejected.${kyc?.verification?.rejectionReason ? ` Reason: ${kyc.verification.rejectionReason}` : ''}`
                  : 'Your KYC submission is waiting for admin review.'}
            </p>
          </div>

          <div className="mt-6">
            <Link to="/dashboard/kyc" className="btn-primary">
              Update KYC
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KYCStatus
