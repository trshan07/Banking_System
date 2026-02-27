import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaGoogle,
  FaFacebook,
  FaGithub,
  FaShieldAlt,
  FaHeadset,
  FaCoins,
  FaCreditCard,
  FaMobile,
  FaChartLine,
  FaWallet,
  FaArrowLeft
} from 'react-icons/fa'

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [focusedField, setFocusedField] = useState(null)

  const password = watch('password')
  const firstName = watch('firstName')
  const email = watch('email')
  const confirmPassword = watch('confirmPassword')

  // Calculate password strength
  const calculateStrength = (pass) => {
    if (!pass) return 0
    let strength = 0
    if (pass.length >= 8) strength += 25
    if (pass.match(/[a-z]+/)) strength += 25
    if (pass.match(/[A-Z]+/)) strength += 25
    if (pass.match(/[0-9]+/)) strength += 25
    return strength
  }

  useEffect(() => {
    setPasswordStrength(calculateStrength(password))
  }, [password])

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500'
    if (passwordStrength <= 50) return 'bg-orange-500'
    if (passwordStrength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak'
    if (passwordStrength <= 50) return 'Fair'
    if (passwordStrength <= 75) return 'Good'
    return 'Strong'
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await registerUser(data)
      navigate('/auth/login')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      {/* Main Container - Much Wider */}
      <div className="min-w-svh mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Enhanced Branding with More Content */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-40 -mt-40"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full"></div>
              
              <div className="relative z-10">
                {/* Logo with Enhanced Design */}
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                    <span className="text-white font-bold text-3xl">SB</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold">Smart Bank</span>
                    <span className="block text-sm text-blue-200 mt-1">Next Generation Digital Banking</span>
                  </div>
                </div>

                {/* Welcome Message with More Text */}
                <h2 className="text-4xl font-bold mb-4">Join the Future of Banking! 🚀</h2>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Experience banking like never before with our cutting-edge digital platform. 
                  Join over 1 million satisfied customers worldwide.
                </p>

                {/* Enhanced Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaShieldAlt className="text-3xl mb-2 text-yellow-300" />
                    <h3 className="font-semibold">Bank-Grade Security</h3>
                    <p className="text-xs text-blue-200 mt-1">256-bit encryption</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaMobile className="text-3xl mb-2 text-green-300" />
                    <h3 className="font-semibold">Mobile First</h3>
                    <p className="text-xs text-blue-200 mt-1">Bank anywhere, anytime</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaChartLine className="text-3xl mb-2 text-purple-300" />
                    <h3 className="font-semibold">Smart Analytics</h3>
                    <p className="text-xs text-blue-200 mt-1">Track your spending</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaWallet className="text-3xl mb-2 text-pink-300" />
                    <h3 className="font-semibold">Digital Wallet</h3>
                    <p className="text-xs text-blue-200 mt-1">Contactless payments</p>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1M+</div>
                    <div className="text-xs text-blue-200">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">$50B+</div>
                    <div className="text-xs text-blue-200">Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-xs text-blue-200">Support</div>
                  </div>
                </div>

                {/* Testimonial Carousel */}
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20 mb-8">
                  <p className="text-sm italic text-blue-100">
                    "The best banking experience I've ever had. The registration was smooth, 
                    and the features are incredible. My finances have never been better organized!"
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      JD
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">John Doe</p>
                      <p className="text-xs text-blue-200">Customer since 2024</p>
                      <div className="flex text-yellow-300 mt-1">
                        {'★★★★★'.split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Login Link */}
                <div className="pt-6 border-t border-white/20">
                  <p className="text-blue-200 text-sm mb-2">Already have an account?</p>
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center text-white font-semibold hover:text-blue-200 transition-colors group text-lg"
                  >
                    Sign in to your account 
                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Expanded Registration Form */}
            <div className="lg:w-3/5 p-10 bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900">Create Your Account</h2>
                <p className="text-gray-600 mt-3 text-lg">Join Smart Bank and start your financial journey</p>
              </div>

              {/* Social Registration - Larger Buttons */}
              <div className="flex justify-center space-x-6 mb-8">
                <button className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200">
                  <FaGoogle className="text-gray-700 text-2xl" />
                </button>
                <button className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200">
                  <FaFacebook className="text-gray-700 text-2xl" />
                </button>
                <button className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200">
                  <FaGithub className="text-gray-700 text-2xl" />
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-gradient-to-br from-gray-50 to-white text-gray-500 text-base">Or register with email</span>
                </div>
              </div>

              {/* Form - Two Columns Layout */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'firstName' ? 'transform scale-105' : ''}`}>
                      <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === 'firstName' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                          ${errors.firstName ? 'border-red-500' : focusedField === 'firstName' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="John"
                      />
                      {firstName && !errors.firstName && (
                        <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-bounce" />
                      )}
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                        ${errors.lastName ? 'border-red-500' : focusedField === 'lastName' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Email - Full Width in Grid */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
                      <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                          ${errors.email ? 'border-red-500' : focusedField === 'email' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="john.doe@example.com"
                      />
                      {email && !errors.email && (
                        <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-bounce" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'phone' ? 'transform scale-105' : ''}`}>
                      <FaPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === 'phone' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <input
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: 'Invalid phone number'
                          }
                        })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                          ${errors.phone ? 'border-red-500' : focusedField === 'phone' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="+1 (234) 567-8900"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'address' ? 'transform scale-105' : ''}`}>
                      <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === 'address' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        {...register('address', { required: 'Address is required' })}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                          ${errors.address ? 'border-red-500' : focusedField === 'address' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="123 Main St, City, State, ZIP"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                      <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Must contain uppercase, lowercase and number'
                          }
                        })}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                          ${errors.password ? 'border-red-500' : focusedField === 'password' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-3 animate-fadeIn">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Password strength:</span>
                          <span className={`text-sm font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor()} rounded-full transition-all duration-500`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        
                        {/* Password Requirements */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className={`text-sm flex items-center ${password?.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${password?.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            Minimum 8 characters
                          </div>
                          <div className={`text-sm flex items-center ${password?.match(/[a-z]/) ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${password?.match(/[a-z]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            Lowercase letter
                          </div>
                          <div className={`text-sm flex items-center ${password?.match(/[A-Z]/) ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${password?.match(/[A-Z]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            Uppercase letter
                          </div>
                          <div className={`text-sm flex items-center ${password?.match(/[0-9]/) ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${password?.match(/[0-9]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            At least one number
                          </div>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-105' : ''}`}>
                      <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        focusedField === 'confirmPassword' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all duration-300 text-lg
                          ${errors.confirmPassword ? 'border-red-500' : focusedField === 'confirmPassword' ? 'border-blue-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                      </button>
                      {password && confirmPassword === password && (
                        <FaCheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500 animate-bounce" />
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaTimesCircle className="mr-1" /> {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start mt-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'You must accept the terms' })}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-3 text-base text-gray-600 group-hover:text-gray-900 transition-colors">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-sm flex items-center">
                    <FaTimesCircle className="mr-1" /> {errors.terms.message}
                  </p>
                )}

                {/* Submit Button - Larger */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center group mt-6"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Your Account
                      <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Additional Info */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  By creating an account, you agree to receive important account notifications via email.
                </p>
              </form>

              {/* Mobile Login Link */}
              <div className="mt-8 text-center lg:hidden">
                <p className="text-base text-gray-600">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-lg">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Smart Bank. All rights reserved. | <Link to="/privacy" className="hover:text-blue-600">Privacy</Link> | <Link to="/terms" className="hover:text-blue-600">Terms</Link> | <Link to="/security" className="hover:text-blue-600">Security</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register