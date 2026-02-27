import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaGithub,
  FaShieldAlt,
  FaMobile,
  FaChartLine,
  FaWallet,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { login, getDashboardRoute } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const email = watch('email');

  // Check for pre-filled email from registration
  useEffect(() => {
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (registeredEmail) {
      setValue('email', registeredEmail);
      localStorage.removeItem('registeredEmail');
    }
  }, [setValue]);

  // Check for redirect after email verification
  useEffect(() => {
    if (location.state?.email) {
      setValue('email', location.state.email);
      toast.success('Email verified successfully! Please login.', {
        duration: 5000,
        icon: '✅'
      });
    }
  }, [location, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const response = await login(data.email, data.password);
      
      if (response?.success) {
        // Show success message
        toast.success(`Welcome back! Redirecting to dashboard...`, {
          duration: 3000,
          icon: '👋'
        });
        
        // Get user's dashboard route based on role
        const dashboardRoute = getDashboardRoute();
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate(dashboardRoute);
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check if the server is running.', {
          duration: 5000,
          icon: '🌐'
        });
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.', {
          duration: 4000,
          icon: '🔐'
        });
      } else if (error.response?.status === 403) {
        toast.error('Your account is locked. Please contact support.', {
          duration: 5000,
          icon: '⚠️'
        });
      } else if (error.response?.status === 423) {
        toast.error('Account temporarily locked. Too many failed attempts.', {
          duration: 5000,
          icon: '🔒'
        });
      } else if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please try again later.', {
          duration: 5000,
          icon: '⏳'
        });
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
          duration: 4000,
          icon: '❌'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo login handlers
  const handleDemoLogin = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 500);
  };

  // Social login handlers
  const handleSocialLogin = (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
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

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-40 -mt-40"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                    <span className="text-white font-bold text-3xl">SB</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold">Smart Bank</span>
                    <span className="block text-sm text-blue-200 mt-1">Secure Digital Banking</span>
                  </div>
                </div>

                {/* Welcome Message */}
                <h2 className="text-4xl font-bold mb-4">Welcome Back! 👋</h2>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Access your account securely and manage your finances with our advanced banking platform.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaShieldAlt className="text-3xl mb-2 text-yellow-300" />
                    <h3 className="font-semibold">Bank-Grade Security</h3>
                    <p className="text-xs text-blue-200 mt-1">256-bit encryption</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaMobile className="text-3xl mb-2 text-green-300" />
                    <h3 className="font-semibold">Mobile Access</h3>
                    <p className="text-xs text-blue-200 mt-1">Bank anywhere, anytime</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaChartLine className="text-3xl mb-2 text-purple-300" />
                    <h3 className="font-semibold">Real-time Updates</h3>
                    <p className="text-xs text-blue-200 mt-1">Instant notifications</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <FaWallet className="text-3xl mb-2 text-pink-300" />
                    <h3 className="font-semibold">Smart Analytics</h3>
                    <p className="text-xs text-blue-200 mt-1">Track spending</p>
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

                {/* Register Link */}
                <div className="pt-6 border-t border-white/20">
                  <p className="text-blue-200 text-sm mb-2">Don't have an account?</p>
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center text-white font-semibold hover:text-blue-200 transition-colors group text-lg"
                  >
                    Create your account 
                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-3/5 p-10 bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900">Sign In</h2>
                <p className="text-gray-600 mt-3 text-lg">Access your Smart Bank account</p>
              </div>

              {/* Demo Accounts Quick Login */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2" />
                  Demo Accounts (Quick Login)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleDemoLogin('customer@example.com', 'customer123')}
                    className="bg-white hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-center transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <div className="font-medium text-blue-800">Customer</div>
                    <div className="text-xs text-blue-600 mt-1">Click to login</div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('employee@example.com', 'employee123')}
                    className="bg-white hover:bg-green-100 border border-green-200 rounded-lg p-3 text-center transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <div className="font-medium text-green-800">Employee</div>
                    <div className="text-xs text-green-600 mt-1">Click to login</div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('admin@example.com', 'admin123')}
                    className="bg-white hover:bg-purple-100 border border-purple-200 rounded-lg p-3 text-center transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <div className="font-medium text-purple-800">Admin</div>
                    <div className="text-xs text-purple-600 mt-1">Click to login</div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('superadmin@example.com', 'superadmin123')}
                    className="bg-white hover:bg-red-100 border border-red-200 rounded-lg p-3 text-center transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <div className="font-medium text-red-800">Super Admin</div>
                    <div className="text-xs text-red-600 mt-1">Click to login</div>
                  </button>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center space-x-6 mb-8">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200 group"
                >
                  <FaGoogle className="text-gray-700 text-2xl group-hover:text-blue-600 transition-colors" />
                </button>
                <button
                  onClick={() => handleSocialLogin('facebook')}
                  className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200 group"
                >
                  <FaFacebook className="text-gray-700 text-2xl group-hover:text-blue-600 transition-colors" />
                </button>
                <button
                  onClick={() => handleSocialLogin('github')}
                  className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200 group"
                >
                  <FaGithub className="text-gray-700 text-2xl group-hover:text-blue-600 transition-colors" />
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-gradient-to-br from-gray-50 to-white text-gray-500 text-base">
                    Or sign in with email
                  </span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'email' ? 'transform scale-105' : ''
                  }`}>
                    <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-lg
                        ${errors.email ? 'border-red-500 bg-red-50' : 
                          focusedField === 'email' ? 'border-blue-600 shadow-lg bg-blue-50' : 
                          'border-gray-200 hover:border-gray-300 bg-white'}`}
                      placeholder="john.doe@example.com"
                      disabled={loading}
                    />
                    {email && !errors.email && (
                      <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 animate-pulse" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <FaTimesCircle className="mr-1" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'password' ? 'transform scale-105' : ''
                  }`}>
                    <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 text-lg
                        ${errors.password ? 'border-red-500 bg-red-50' : 
                          focusedField === 'password' ? 'border-blue-600 shadow-lg bg-blue-50' : 
                          'border-gray-200 hover:border-gray-300 bg-white'}`}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <FaTimesCircle className="mr-1" /> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link 
                    to="/auth/forgot-password" 
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center group mt-8"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </button>

                {/* Register Link for Mobile */}
                <p className="text-center text-gray-600 lg:hidden">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Create Account
                  </Link>
                </p>
              </form>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-gray-100 rounded-xl">
                <div className="flex items-start">
                  <FaShieldAlt className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">Secure Login</p>
                    <p>Your connection is encrypted and secure. We'll never ask for your password outside of this login page.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            © 2024 Smart Bank. All rights reserved. |{' '}
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link> |{' '}
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link> |{' '}
            <Link to="/security" className="hover:text-blue-600 transition-colors">Security</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;