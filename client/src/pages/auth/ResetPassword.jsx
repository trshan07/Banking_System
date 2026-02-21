import React from 'react'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-600 mt-2">Enter your new password</p>
      </div>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Reset Password
        </button>

        <p className="text-center text-gray-600">
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default ResetPassword