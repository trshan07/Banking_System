import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { login, completeOAuthLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const googleAuthUrl = `${import.meta.env.VITE_API_URL || "/api"}/auth/google`;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getDashboardRoute = (role) => {
    switch (role) {
      case "superadmin":
        return "/super-admin";
      case "admin":
        return "/admin";
      case "employee":
        return "/employee";
      default:
        return "/dashboard";
    }
  };

  useEffect(() => {
    try {
      const registeredEmail = localStorage.getItem("registeredEmail");
      if (registeredEmail) {
        setValue("email", registeredEmail);
        localStorage.removeItem("registeredEmail");
        toast.success("Registration successful! Please login.");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [setValue]);

  useEffect(() => {
    if (location.state?.email) {
      setValue("email", location.state.email);
      toast.success("Email verified successfully! Please login.");
    }
  }, [location.state, setValue]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (!token && !error) {
      return;
    }

    if (error) {
      toast.error(error);
      navigate("/auth/login", { replace: true });
      setLoading(false);
      return;
    }

    let isMounted = true;

    const finalizeOAuthLogin = async () => {
      try {
        setLoading(true);
        const response = await completeOAuthLogin(token, refreshToken);

        if (!isMounted) {
          return;
        }

        const dashboardRoute = getDashboardRoute(response.user?.role);
        window.location.replace(dashboardRoute);
      } catch (oauthError) {
        if (!isMounted) {
          return;
        }

        navigate("/auth/login", { replace: true });
        setLoading(false);
      }
    };

    finalizeOAuthLogin();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, completeOAuthLogin]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await login(data.email, data.password);

      if (response?.success) {
        toast.success("Welcome back! Redirecting...");
        const dashboardRoute = getDashboardRoute(response.user?.role);

        setTimeout(() => {
          navigate(dashboardRoute, { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);

      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.");
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server. Please make sure the backend is running.");
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response?.status === 403) {
        toast.error("Your account is locked or inactive. Please contact support.");
      } else if (error.response?.status === 423) {
        toast.error(error.response?.data?.message || "Account is locked. Please try again later.");
      } else {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    if (loading) return;
    setValue("email", email);
    setValue("password", password);
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 100);
  };

  const handleGoogleLogin = () => {
    if (loading) return;
    setLoading(true);
    window.location.assign(googleAuthUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          disabled={loading}
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">SB</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Access your Smart Bank account</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <FaCheckCircle className="text-blue-500 mr-2" />
            Demo Accounts
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin("customer@example.com", "customer123")}
              disabled={loading}
              className="bg-white hover:bg-blue-100 border border-blue-200 rounded-lg p-2 text-center transition-colors text-sm"
            >
              <div className="font-medium text-blue-800">Customer</div>
            </button>
            <button
              onClick={() => handleDemoLogin("employee@example.com", "employee123")}
              disabled={loading}
              className="bg-white hover:bg-green-100 border border-green-200 rounded-lg p-2 text-center transition-colors text-sm"
            >
              <div className="font-medium text-green-800">Employee</div>
            </button>
            <button
              onClick={() => handleDemoLogin("admin@example.com", "admin123")}
              disabled={loading}
              className="bg-white hover:bg-purple-100 border border-purple-200 rounded-lg p-2 text-center transition-colors text-sm"
            >
              <div className="font-medium text-purple-800">Admin</div>
            </button>
            <button
              onClick={() => handleDemoLogin("superadmin@example.com", "superadmin123")}
              disabled={loading}
              className="bg-white hover:bg-red-100 border border-red-200 rounded-lg p-2 text-center transition-colors text-sm"
            >
              <div className="font-medium text-red-800">Super Admin</div>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Redirecting to Google...
              </>
            ) : (
              <>
                <FaGoogle className="mr-3 text-lg text-red-500" />
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500">
              Or sign in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimesCircle className="mr-1 text-xs" /> {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <FaTimesCircle className="mr-1 text-xs" /> {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Create Account
          </Link>
        </p>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-start">
            <FaShieldAlt className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">Secure Login</p>
              <p>Your connection is encrypted and secure.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>
            © 2024 Smart Bank. All rights reserved. |{" "}
            <Link to="/privacy" className="hover:text-blue-600">
              Privacy
            </Link>{" "}
            |{" "}
            <Link to="/terms" className="hover:text-blue-600">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
