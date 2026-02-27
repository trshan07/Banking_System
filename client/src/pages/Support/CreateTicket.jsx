import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  FaHeadset, 
  FaExclamationTriangle,
  FaPaperclip,
  FaArrowRight
} from 'react-icons/fa'

const CreateTicket = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const categories = [
    'Technical Issue',
    'Account Access',
    'Transaction Dispute',
    'Loan Inquiry',
    'Card Problem',
    'Fraud Report',
    'General Inquiry'
  ]

  const priorities = [
    { value: 'low', label: 'Low - General question' },
    { value: 'medium', label: 'Medium - Need assistance' },
    { value: 'high', label: 'High - Urgent issue' },
    { value: 'critical', label: 'Critical - System down/Security' }
  ]

  const onSubmit = async (data) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Ticket data:', data)
      setLoading(false)
      navigate('/dashboard/support')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/dashboard/support" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to Tickets
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="text-gray-600 mt-2">We're here to help! Please provide details about your issue.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="form-label">Subject *</label>
              <input
                type="text"
                {...register('subject', { 
                  required: 'Subject is required',
                  minLength: { value: 10, message: 'Please be more descriptive (min 10 characters)' }
                })}
                className="input-field"
                placeholder="Brief summary of your issue"
              />
              {errors.subject && (
                <p className="error-text">{errors.subject.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="form-label">Category *</label>
              <select
                {...register('category', { required: 'Please select a category' })}
                className="input-field"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="error-text">{errors.category.message}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="form-label">Priority *</label>
              {priorities.map(p => (
                <label key={p.value} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    {...register('priority', { required: 'Please select priority' })}
                    value={p.value}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">{p.label}</span>
                </label>
              ))}
              {errors.priority && (
                <p className="error-text">{errors.priority.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description *</label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Please provide more details (min 20 characters)' }
                })}
                rows={6}
                className="input-field"
                placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to accomplish."
              />
              {errors.description && (
                <p className="error-text">{errors.description.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="form-label">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  {...register('attachments')}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FaPaperclip className="text-4xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Click to upload files</p>
                  <p className="text-sm text-gray-500 mt-1">Screenshots, PDFs, or documents (Max 10MB)</p>
                </label>
              </div>
            </div>

            {/* Urgent Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-yellow-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">For urgent issues:</p>
                  <p className="text-sm text-yellow-700">
                    If you're experiencing a security issue or cannot access your account, 
                    please call our 24/7 emergency line: +1 (800) 123-4567
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Ticket <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTicket