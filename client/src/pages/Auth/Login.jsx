import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { FaEnvelope, FaLock } from 'react-icons/fa'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login, getDashboardRoute } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await login(data.email, data.password)
      navigate(getDashboardRoute())
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your Smart Bank account</p>
      </div>

      {/* Demo Credentials Helper */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm">Demo Credentials:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="font-medium text-blue-800">Customer:</p>
            <p className="text-blue-600">customer@example.com</p>
            <p className="text-blue-600">customer123</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">Employee:</p>
            <p className="text-blue-600">employee@example.com</p>
            <p className="text-blue-600">employee123</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">Admin:</p>
            <p className="text-blue-600">admin@example.com</p>
            <p className="text-blue-600">admin123</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">Super Admin:</p>
            <p className="text-blue-600">superadmin@example.com</p>
            <p className="text-blue-600">superadmin123</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="form-label">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input-field pl-10"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label className="form-label">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="input-field pl-10"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex justify-center items-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login