import React from "react";
import {
  FaShieldAlt,
  FaHeadset,
  FaMoneyBillWave,
  FaChartLine,
  FaFileSignature,
  FaBuilding,
  FaUsers,
  FaExchangeAlt,
  FaClock,
  FaMobile,
  FaGlobe,
  FaRocket,
  FaCheckCircle,
  FaHandshake,
  FaLightbulb,
  FaEye,
  FaArrowRight,
  FaStar,
  FaQuoteRight,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaQrcode,
  FaFingerprint,
  FaCloudUploadAlt,
  FaRobot,
  FaComments,
  FaUserTie,
  FaCreditCard,
  FaWallet,
  FaPiggyBank,
  FaLandmark,
  FaChartPie,
  FaBell,
  FaDownload,
  FaUpload,
  FaLock,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Hero Stats
  const heroStats = [
    {
      id: 1,
      value: "50K+",
      label: "Active Users",
      icon: <FaUsers className="text-white text-2xl" />,
    },
    {
      id: 2,
      value: "₹10Cr+",
      label: "Transactions",
      icon: <FaExchangeAlt className="text-white text-2xl" />,
    },
    {
      id: 3,
      value: "99.9%",
      label: "Uptime",
      icon: <FaClock className="text-white text-2xl" />,
    },
    {
      id: 4,
      value: "24/7",
      label: "Support",
      icon: <FaHeadset className="text-white text-2xl" />,
    },
  ];

  // Core Features from Proposal
  const features = [
    {
      id: 1,
      title: "Online Loan Management",
      description:
        "Apply for loans, upload KYC documents, and track approval status in real-time with our streamlined loan processing system.",
      icon: <FaMoneyBillWave className="text-white text-3xl" />,
      color: "from-emerald-500 to-teal-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      features: [
        "Personal Loans",
        "Home Loans",
        "Business Loans",
        "Education Loans",
      ],
    },
    {
      id: 2,
      title: "Customer Support System",
      description:
        "24/7 ticket-based support with live chat, instant responses, and comprehensive support analytics.",
      icon: <FaHeadset className="text-white text-3xl" />,
      color: "from-sky-500 to-blue-500",
      lightBg: "bg-sky-50",
      textColor: "text-sky-600",
      iconBg: "bg-gradient-to-r from-sky-500 to-blue-500",
      features: [
        "Live Chat",
        "Ticket System",
        "Support Analytics",
        "Priority Queue",
      ],
    },
    {
      id: 3,
      title: "Secure Banking Portal",
      description:
        "Account management, balance checks, transaction tracking, and secure fund transfers with bank-level encryption.",
      icon: <FaLock className="text-white text-3xl" />,
      color: "from-violet-500 to-purple-500",
      lightBg: "bg-violet-50",
      textColor: "text-violet-600",
      iconBg: "bg-gradient-to-r from-violet-500 to-purple-500",
      features: [
        "Balance Check",
        "Fund Transfer",
        "Transaction History",
        "Account Statements",
      ],
    },
    {
      id: 4,
      title: "Fraud Detection",
      description:
        "Advanced reporting system with ML-based pattern analysis and real-time fraud alerts.",
      icon: <FaShieldAlt className="text-white text-3xl" />,
      color: "from-rose-500 to-pink-500",
      lightBg: "bg-rose-50",
      textColor: "text-rose-600",
      iconBg: "bg-gradient-to-r from-rose-500 to-pink-500",
      features: [
        "Fraud Reports",
        "Pattern Analysis",
        "Security Alerts",
        "Investigation Tools",
      ],
    },
    {
      id: 5,
      title: "Digital KYC Portal",
      description:
        "Online account opening with document verification, real-time status updates, and instant approval.",
      icon: <FaFileSignature className="text-white text-3xl" />,
      color: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
      iconBg: "bg-gradient-to-r from-amber-500 to-orange-500",
      features: [
        "Document Upload",
        "Identity Verification",
        "Status Tracking",
        "Digital Signatures",
      ],
    },
    {
      id: 6,
      title: "Investment Tracker",
      description:
        "Set financial goals, track savings, and monitor investments with interactive charts and reminders.",
      icon: <FaChartLine className="text-white text-3xl" />,
      color: "from-indigo-500 to-indigo-600",
      lightBg: "bg-indigo-50",
      textColor: "text-indigo-600",
      iconBg: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      features: [
        "Goal Setting",
        "Progress Tracking",
        "Investment Analytics",
        "Smart Reminders",
      ],
    },
    {
      id: 7,
      title: "Branch Locator",
      description:
        "Find nearby ATMs and branches with Google Maps integration and live chat assistance.",
      icon: <FaMapMarkerAlt className="text-white text-3xl" />,
      color: "from-cyan-500 to-sky-500",
      lightBg: "bg-cyan-50",
      textColor: "text-cyan-600",
      iconBg: "bg-gradient-to-r from-cyan-500 to-sky-500",
      features: ["ATM Locator", "Branch Finder", "Live Chat", "Directions"],
    },
    {
      id: 8,
      title: "Employee Management",
      description:
        "Automated HR activities including employee records, task assignments, and leave tracking.",
      icon: <FaUsers className="text-white text-3xl" />,
      color: "from-slate-500 to-gray-600",
      lightBg: "bg-slate-50",
      textColor: "text-slate-600",
      iconBg: "bg-gradient-to-r from-slate-500 to-gray-600",
      features: [
        "Employee Records",
        "Task Management",
        "Leave Tracking",
        "Performance Reports",
      ],
    },
  ];

  // Banking Services
  const bankingServices = [
    {
      id: 1,
      title: "Savings Account",
      description: "High-interest savings accounts with zero maintenance fees",
      icon: <FaPiggyBank className="text-emerald-600 text-3xl" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      id: 2,
      title: "Current Account",
      description: "Business accounts with unlimited transactions",
      icon: <FaWallet className="text-sky-600 text-3xl" />,
      color: "text-sky-600",
      bgColor: "bg-sky-100",
    },
    {
      id: 3,
      title: "Credit Cards",
      description: "Premium credit cards with exclusive rewards",
      icon: <FaCreditCard className="text-violet-600 text-3xl" />,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      id: 4,
      title: "Fixed Deposits",
      description: "High-return fixed deposit schemes",
      icon: <FaLandmark className="text-amber-600 text-3xl" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  // Technology Stack
  const techStack = [
    {
      id: 1,
      name: "MongoDB",
      icon: "🍃",
      description: "Flexible document database",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      id: 2,
      name: "Express.js",
      icon: "⚡",
      description: "Fast, unopinionated web framework",
      bgColor: "bg-sky-100",
      textColor: "text-sky-700",
    },
    {
      id: 3,
      name: "React.js",
      icon: "⚛️",
      description: "Dynamic user interfaces",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      id: 4,
      name: "Node.js",
      icon: "🟢",
      description: "Scalable server-side runtime",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      id: 5,
      name: "Socket.io",
      icon: "🔌",
      description: "Real-time communication",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
    },
    {
      id: 6,
      name: "JWT",
      icon: "🔐",
      description: "Secure authentication",
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
    },
    {
      id: 7,
      name: "Cloudinary",
      icon: "☁️",
      description: "Cloud file storage",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-700",
    },
    {
      id: 8,
      name: "Chart.js",
      icon: "📊",
      description: "Interactive data visualization",
      bgColor: "bg-rose-100",
      textColor: "text-rose-700",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Robert Johnson",
      role: "Small Business Owner",
      content:
        "Smart Bank's loan management system helped me get funding for my business in just 48 hours. The digital KYC process was seamless!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Emily Davis",
      role: "Freelancer",
      content:
        "The investment tracker has transformed how I manage my finances. I can set goals and track my progress with beautiful charts.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Corporate Executive",
      content:
        "The fraud detection system gives me peace of mind. I get instant alerts for any suspicious activity on my account.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
  ];

  // Statistics
  const statistics = [
    {
      id: 1,
      value: "50,000+",
      label: "Happy Customers",
      icon: <FaUsers className="text-emerald-600 text-3xl" />,
      bgColor: "bg-emerald-100",
    },
    {
      id: 2,
      value: "100,000+",
      label: "Transactions",
      icon: <FaExchangeAlt className="text-sky-600 text-3xl" />,
      bgColor: "bg-sky-100",
    },
    {
      id: 3,
      value: "8+",
      label: "Core Modules",
      icon: <FaBuilding className="text-violet-600 text-3xl" />,
      bgColor: "bg-violet-100",
    },
    {
      id: 4,
      value: "24/7",
      label: "Support",
      icon: <FaHeadset className="text-amber-600 text-3xl" />,
      bgColor: "bg-amber-100",
    },
    {
      id: 5,
      value: "99.9%",
      label: "Security",
      icon: <FaShieldAlt className="text-rose-600 text-3xl" />,
      bgColor: "bg-rose-100",
    },
    {
      id: 6,
      value: "₹10Cr+",
      label: "Assets",
      icon: <FaMoneyBillWave className="text-indigo-600 text-3xl" />,
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/30">
                <FaRocket className="text-white mr-2" />
                <span className="text-sm font-semibold text-white">
                  Welcome to the Future of Banking
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Smart Bank: Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">
                  Digital Banking
                </span>{" "}
                Partner
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg">
                Experience modern banking with 8 integrated modules including
                loan management, fraud detection, digital KYC, and real-time
                customer support.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/register"
                  className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center"
                >
                  Open Account{" "}
                  <FaArrowRight className="ml-2 text-emerald-700" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-700 transition-all hover:-translate-y-1"
                >
                  Learn More
                </Link>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20"
                  >
                    <div className="text-2xl mb-2 flex justify-center text-white">
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="hidden lg:block relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-emerald-400 rounded-lg mb-3"></div>
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-sky-400 rounded-lg mb-3"></div>
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-violet-400 rounded-lg mb-3"></div>
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-amber-400 rounded-lg mb-3"></div>
                    <div className="h-4 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 h-24 bg-white/20 rounded-lg"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-sky-400 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistics.map((stat) => (
              <div key={stat.id} className="text-center group">
                <div
                  className={`w-20 h-20 mx-auto ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg`}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700 mb-4">
              8 Core Banking Modules
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive banking solutions integrated into one powerful
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${feature.lightBg} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200 group`}
              >
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                  {feature.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {feature.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-slate-600"
                    >
                      <FaCheckCircle
                        className={`${feature.textColor} mr-2 text-xs`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/services`}
                  className={`${feature.textColor} font-semibold flex items-center hover:underline`}
                >
                  Learn More <FaArrowRight className="ml-2 text-sm" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banking Services */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-700 mb-4">
                Complete Banking Solutions
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                From everyday banking to specialized financial products, we've
                got you covered.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {bankingServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div
                      className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-3`}
                    >
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="user"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="user"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/45.jpg"
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="user"
                  />
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-bold text-slate-800">10,000+</span>{" "}
                  happy customers
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                  <FaMobile className="text-white text-4xl mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Mobile Banking
                  </h3>
                  <p className="text-sm text-white/90">
                    Bank on the go with our mobile app
                  </p>
                </div>
                <div className="bg-gradient-to-br from-sky-500 to-blue-500 rounded-2xl p-6 text-white">
                  <FaQrcode className="text-white text-4xl mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-white">
                    QR Payments
                  </h3>
                  <p className="text-sm text-white/90">
                    Instant payments with QR code
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-6 text-white">
                  <FaFingerprint className="text-white text-4xl mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Biometric Login
                  </h3>
                  <p className="text-sm text-white/90">
                    Secure fingerprint access
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                  <FaBell className="text-white text-4xl mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Smart Alerts
                  </h3>
                  <p className="text-sm text-white/90">
                    Real-time notifications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700 mb-4">
              Built With Modern Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powered by the MERN stack and cutting-edge technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech) => (
              <div
                key={tech.id}
                className={`${tech.bgColor} rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200`}
              >
                <div className="text-5xl mb-3">{tech.icon}</div>
                <h3 className={`font-bold ${tech.textColor} mb-1`}>
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started with Smart Bank in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Create Account
              </h3>
              <p className="text-slate-600">
                Sign up in minutes with our digital KYC process. Upload your
                documents and verify instantly.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Explore Features
              </h3>
              <p className="text-slate-600">
                Access all 8 core modules including loans, investments, fraud
                protection, and more.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Start Banking
              </h3>
              <p className="text-slate-600">
                Enjoy seamless banking with real-time updates, 24/7 support, and
                complete security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Trusted by thousands of customers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all hover:-translate-y-1 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg mr-1" />
                  ))}
                </div>
                <FaQuoteRight className="text-white/40 text-4xl mb-4" />
                <p className="mb-6 text-white/90">{testimonial.content}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Download the Smart Bank App
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Bank on the go with our mobile app. Available for iOS and
                  Android.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-all hover:-translate-y-1">
                    <FaMobile className="text-white mr-2" />
                    App Store
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-all hover:-translate-y-1">
                    <FaMobile className="text-white mr-2" />
                    Google Play
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Mobile App"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the future of
            banking today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Open Account Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-1"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SB</span>
                </div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700">
                  Smart Bank
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Revolutionizing digital banking with secure, modular, and
                feature-rich solutions.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4">Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/loans"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Loans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cards"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Credit Cards
                  </Link>
                </li>
                <li>
                  <Link
                    to="/investments"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Investments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/savings"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Savings
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/press"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/help"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-slate-600 hover:text-emerald-600"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-600 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Smart Bank. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
