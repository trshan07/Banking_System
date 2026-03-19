import React, { useState, useEffect } from "react";
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.2 },
    );

    document
      .querySelectorAll("[data-section]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      color: "#2563eb",
      lightBg: "bg-[#2563eb] bg-opacity-5",
      textColor: "text-[#2563eb]",
      iconBg: "bg-[#2563eb]",
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
      color: "#10b981",
      lightBg: "bg-[#10b981] bg-opacity-5",
      textColor: "text-[#10b981]",
      iconBg: "bg-[#10b981]",
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
      color: "#2563eb",
      lightBg: "bg-[#2563eb] bg-opacity-5",
      textColor: "text-[#2563eb]",
      iconBg: "bg-[#2563eb]",
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
      color: "#ef4444",
      lightBg: "bg-[#ef4444] bg-opacity-5",
      textColor: "text-[#ef4444]",
      iconBg: "bg-[#ef4444]",
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
      color: "#f59e0b",
      lightBg: "bg-[#f59e0b] bg-opacity-5",
      textColor: "text-[#f59e0b]",
      iconBg: "bg-[#f59e0b]",
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
      color: "#10b981",
      lightBg: "bg-[#10b981] bg-opacity-5",
      textColor: "text-[#10b981]",
      iconBg: "bg-[#10b981]",
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
      color: "#2563eb",
      lightBg: "bg-[#2563eb] bg-opacity-5",
      textColor: "text-[#2563eb]",
      iconBg: "bg-[#2563eb]",
      features: ["ATM Locator", "Branch Finder", "Live Chat", "Directions"],
    },
    {
      id: 8,
      title: "Employee Management",
      description:
        "Automated HR activities including employee records, task assignments, and leave tracking.",
      icon: <FaUsers className="text-white text-3xl" />,
      color: "#f59e0b",
      lightBg: "bg-[#f59e0b] bg-opacity-5",
      textColor: "text-[#f59e0b]",
      iconBg: "bg-[#f59e0b]",
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
      icon: <FaPiggyBank className="text-[#2563eb] text-3xl" />,
      color: "text-[#2563eb]",
      bgColor: "bg-[#2563eb] bg-opacity-10",
    },
    {
      id: 2,
      title: "Current Account",
      description: "Business accounts with unlimited transactions",
      icon: <FaWallet className="text-[#10b981] text-3xl" />,
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981] bg-opacity-10",
    },
    {
      id: 3,
      title: "Credit Cards",
      description: "Premium credit cards with exclusive rewards",
      icon: <FaCreditCard className="text-[#f59e0b] text-3xl" />,
      color: "text-[#f59e0b]",
      bgColor: "bg-[#f59e0b] bg-opacity-10",
    },
    {
      id: 4,
      title: "Fixed Deposits",
      description: "High-return fixed deposit schemes",
      icon: <FaLandmark className="text-[#ef4444] text-3xl" />,
      color: "text-[#ef4444]",
      bgColor: "bg-[#ef4444] bg-opacity-10",
    },
  ];

  // Technology Stack
  const techStack = [
    {
      id: 1,
      name: "MongoDB",
      icon: "🍃",
      description: "Flexible document database",
      bgColor: "bg-[#2563eb] bg-opacity-10",
      textColor: "text-[#2563eb]",
    },
    {
      id: 2,
      name: "Express.js",
      icon: "⚡",
      description: "Fast, unopinionated web framework",
      bgColor: "bg-[#10b981] bg-opacity-10",
      textColor: "text-[#10b981]",
    },
    {
      id: 3,
      name: "React.js",
      icon: "⚛️",
      description: "Dynamic user interfaces",
      bgColor: "bg-[#2563eb] bg-opacity-10",
      textColor: "text-[#2563eb]",
    },
    {
      id: 4,
      name: "Node.js",
      icon: "🟢",
      description: "Scalable server-side runtime",
      bgColor: "bg-[#10b981] bg-opacity-10",
      textColor: "text-[#10b981]",
    },
    {
      id: 5,
      name: "Socket.io",
      icon: "🔌",
      description: "Real-time communication",
      bgColor: "bg-[#f59e0b] bg-opacity-10",
      textColor: "text-[#f59e0b]",
    },
    {
      id: 6,
      name: "JWT",
      icon: "🔐",
      description: "Secure authentication",
      bgColor: "bg-[#2563eb] bg-opacity-10",
      textColor: "text-[#2563eb]",
    },
    {
      id: 7,
      name: "Cloudinary",
      icon: "☁️",
      description: "Cloud file storage",
      bgColor: "bg-[#10b981] bg-opacity-10",
      textColor: "text-[#10b981]",
    },
    {
      id: 8,
      name: "Chart.js",
      icon: "📊",
      description: "Interactive data visualization",
      bgColor: "bg-[#ef4444] bg-opacity-10",
      textColor: "text-[#ef4444]",
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
      icon: <FaUsers className="text-[#2563eb] text-3xl" />,
      bgColor: "bg-[#2563eb] bg-opacity-10",
    },
    {
      id: 2,
      value: "100,000+",
      label: "Transactions",
      icon: <FaExchangeAlt className="text-[#10b981] text-3xl" />,
      bgColor: "bg-[#10b981] bg-opacity-10",
    },
    {
      id: 3,
      value: "8+",
      label: "Core Modules",
      icon: <FaBuilding className="text-[#2563eb] text-3xl" />,
      bgColor: "bg-[#2563eb] bg-opacity-10",
    },
    {
      id: 4,
      value: "24/7",
      label: "Support",
      icon: <FaHeadset className="text-[#f59e0b] text-3xl" />,
      bgColor: "bg-[#f59e0b] bg-opacity-10",
    },
    {
      id: 5,
      value: "99.9%",
      label: "Security",
      icon: <FaShieldAlt className="text-[#ef4444] text-3xl" />,
      bgColor: "bg-[#ef4444] bg-opacity-10",
    },
    {
      id: 6,
      value: "₹10Cr+",
      label: "Assets",
      icon: <FaMoneyBillWave className="text-[#10b981] text-3xl" />,
      bgColor: "bg-[#10b981] bg-opacity-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .animate-rotate {
          animation: rotate 20s linear infinite;
        }

        .animate-rotate-slow {
          animation: rotate 30s linear infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }

        .hover-scale {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .hover-lift {
          transition: transform 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .hover-rotate {
          transition: transform 0.5s ease;
        }

        .hover-rotate:hover {
          transform: rotate(360deg);
        }

        .hover-glow {
          transition: box-shadow 0.3s ease;
        }

        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
        }

        .stagger-item {
          opacity: 0;
          animation: slideInUp 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }

        .parallax-bg {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          position: relative;
          overflow: hidden;
        }

        .parallax-bg::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 50px 50px;
          animation: rotate 60s linear infinite;
          pointer-events: none;
        }

        .card-3d {
          transition: transform 0.3s ease;
          transform-style: preserve-3d;
        }

        .card-3d:hover {
          transform: rotateY(10deg) rotateX(5deg);
        }

        .progress-bar {
          position: relative;
          overflow: hidden;
        }

        .progress-bar::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .typewriter {
          overflow: hidden;
          border-right: 3px solid white;
          white-space: nowrap;
          animation:
            typing 3.5s steps(40, end),
            blink-caret 0.75s step-end infinite;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: white;
          }
        }

        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      {/* Hero Section with Parallax Effect */}
      <div className="relative parallax-bg text-white overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-float"
              style={{
                width: `${Math.random() * 100 + 20}px`,
                height: `${Math.random() * 100 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              data-section="hero"
              className={`transition-all duration-1000 ${
                isVisible.hero
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="inline-flex items-center bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/30 hover-scale cursor-pointer">
                <div className="animate-rotate mr-2">
                  <FaRocket className="text-white" />
                </div>
                <span className="text-sm font-semibold text-white">
                  Welcome to the Future of Banking
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Smart Bank: Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 animate-pulse-slow">
                  Digital Banking
                </span>{" "}
                Partner
              </h1>

              <p className="text-xl mb-8 text-white/90 max-w-lg animate-slideInUp">
                Experience modern banking with 8 integrated modules including
                loan management, fraud detection, digital KYC, and real-time
                customer support.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/register"
                  className="bg-white text-[#2563eb] px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:shadow-xl hover-scale flex items-center group"
                >
                  Open Account
                  <FaArrowRight className="ml-2 text-[#2563eb] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/about"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#2563eb] transition-all hover-scale"
                >
                  Learn More
                </Link>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {heroStats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className={`bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20 hover-scale cursor-pointer stagger-item delay-${index * 100}`}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className="text-2xl mb-2 flex justify-center text-white animate-float">
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

            {/* Right Content - Animated Dashboard Preview */}
            <div
              data-section="hero-right"
              className={`hidden lg:block relative transition-all duration-1000 delay-300 ${
                isVisible["hero-right"]
                  ? "opacity-100 translate-x-0"
                  : "opacity-10 translate-x-10"
              }`}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-float">
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`bg-${i === 0 ? "[#2563eb]" : i === 1 ? "[#10b981]" : i === 2 ? "[#f59e0b]" : "[#ef4444]"} bg-opacity-30 rounded-lg p-4 hover-scale`}
                    >
                      <div
                        className={`w-8 h-8 bg-${i === 0 ? "[#2563eb]" : i === 1 ? "[#10b981]" : i === 2 ? "[#f59e0b]" : "[#ef4444]"} rounded-lg mb-3 animate-rotate-slow`}
                      ></div>
                      <div className="h-4 bg-white/30 rounded w-3/4 mb-2 progress-bar"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-24 bg-white/20 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#2563eb] rounded-full animate-pulse-slow"></div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#10b981] rounded-full animate-pulse-slow"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Animated Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 animate-wave">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Statistics Section with Scroll Animation */}
      <div
        data-section="stats"
        className={`py-16 bg-white transition-all duration-1000 ${
          isVisible.stats
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistics.map((stat, index) => (
              <div
                key={stat.id}
                className={`text-center group stagger-item delay-${index * 100}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-20 h-20 mx-auto ${stat.bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg relative overflow-hidden hover-scale cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800 animate-pulse-slow">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with Stagger Animation */}
      <div
        data-section="features"
        className={`py-20 transition-all duration-1000 ${
          isVisible.features
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideInUp">
            <h2 className="text-4xl font-bold text-[#2563eb] mb-4 animate-pulse-slow">
              8 Core Banking Modules
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive banking solutions integrated into one powerful
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`${feature.lightBg} rounded-xl shadow-lg p-6 border border-slate-200 hover-scale cursor-pointer stagger-item delay-${index * 100}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg relative overflow-hidden hover-rotate`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#2563eb] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                  {feature.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {feature.features.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-slate-600 hover-lift"
                      style={{ transitionDelay: `${idx * 0.05}s` }}
                    >
                      <FaCheckCircle
                        className={`${feature.textColor} mr-2 text-xs`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div
                  className={`${feature.textColor} font-semibold flex items-center cursor-pointer hover-lift`}
                >
                  Learn More{" "}
                  <FaArrowRight className="ml-2 text-sm group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banking Services with Parallax */}
      <div
        data-section="services"
        className={`bg-gradient-to-b from-slate-50 to-white py-20 relative overflow-hidden transition-all duration-1000 ${
          isVisible.services
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Animated Background */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2563eb] opacity-5 rounded-full animate-rotate-slow"></div>
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#10b981] opacity-5 rounded-full animate-rotate-slow"
          style={{ animationDirection: "reverse" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-4xl font-bold text-[#2563eb] mb-4 animate-pulse-slow">
                Complete Banking Solutions
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                From everyday banking to specialized financial products, we've
                got you covered.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {bankingServices.map((service, index) => (
                  <div
                    key={service.id}
                    className={`bg-white rounded-xl p-4 shadow-md hover-scale cursor-pointer stagger-item delay-${index * 100}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-14 h-14 ${service.bgColor} rounded-xl flex items-center justify-center mb-3 hover-rotate`}
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

              <div className="mt-8 flex items-center space-x-4 animate-slideInUp">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 10}.jpg`}
                      className="w-10 h-10 rounded-full border-2 border-white hover-scale cursor-pointer"
                      alt="user"
                      style={{ zIndex: i }}
                    />
                  ))}
                </div>
                <div className="text-sm text-slate-600 animate-pulse-slow">
                  <span className="font-bold text-slate-800">10,000+</span>{" "}
                  happy customers
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slideInRight">
              <div className="space-y-4">
                <div className="bg-[#2563eb] rounded-2xl p-6 text-white hover-scale cursor-pointer">
                  <div className="animate-float">
                    <FaMobile className="text-white text-4xl mb-4" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Mobile Banking
                  </h3>
                  <p className="text-sm text-white/90">
                    Bank on the go with our mobile app
                  </p>
                </div>

                <div className="bg-[#10b981] rounded-2xl p-6 text-white hover-scale cursor-pointer">
                  <div className="animate-rotate-slow">
                    <FaQrcode className="text-white text-4xl mb-4" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">
                    QR Payments
                  </h3>
                  <p className="text-sm text-white/90">
                    Instant payments with QR code
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <div className="bg-[#f59e0b] rounded-2xl p-6 text-white hover-scale cursor-pointer">
                  <div className="animate-pulse-slow">
                    <FaFingerprint className="text-white text-4xl mb-4" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">
                    Biometric Login
                  </h3>
                  <p className="text-sm text-white/90">
                    Secure fingerprint access
                  </p>
                </div>

                <div className="bg-[#ef4444] rounded-2xl p-6 text-white hover-scale cursor-pointer">
                  <div className="animate-wave">
                    <FaBell className="text-white text-4xl mb-4" />
                  </div>
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

      {/* Technology Stack with 3D Effect */}
      <div
        data-section="tech"
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.tech
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideInUp">
            <h2 className="text-4xl font-bold text-[#2563eb] mb-4 animate-pulse-slow">
              Built With Modern Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powered by the MERN stack and cutting-edge technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 perspective-1000">
            {techStack.map((tech, index) => (
              <div
                key={tech.id}
                className={`${tech.bgColor} rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all border border-slate-200 card-3d cursor-pointer stagger-item delay-${index * 100}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="text-5xl mb-3 animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {tech.icon}
                </div>
                <h3 className={`font-bold ${tech.textColor} mb-1`}>
                  {tech.name}
                </h3>
                <p className="text-xs text-slate-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works with Progress Animation */}
      <div
        data-section="howitworks"
        className={`bg-gradient-to-b from-slate-50 to-white py-20 transition-all duration-1000 ${
          isVisible.howitworks
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideInUp">
            <h2 className="text-4xl font-bold text-[#2563eb] mb-4 animate-pulse-slow">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started with Smart Bank in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#2563eb] via-[#10b981] to-[#f59e0b] hidden md:block progress-bar"></div>

            {[1, 2, 3].map((step, index) => (
              <div
                key={step}
                className={`text-center group stagger-item delay-${index * 200}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-20 h-20 mx-auto bg-[#2563eb] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg relative hover-scale">
                  {step}
                  <div className="absolute inset-0 bg-[#2563eb] rounded-2xl animate-pulse-slow opacity-50"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#2563eb] transition-colors">
                  {step === 1
                    ? "Create Account"
                    : step === 2
                      ? "Explore Features"
                      : "Start Banking"}
                </h3>
                <p className="text-slate-600">
                  {step === 1
                    ? "Sign up in minutes with our digital KYC process. Upload your documents and verify instantly."
                    : step === 2
                      ? "Access all 8 core modules including loans, investments, fraud protection, and more."
                      : "Enjoy seamless banking with real-time updates, 24/7 support, and complete security."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials with Carousel Effect */}
      <div
        data-section="testimonials"
        className={`bg-[#2563eb] text-white py-20 overflow-hidden transition-all duration-1000 ${
          isVisible.testimonials
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideInUp">
            <h2 className="text-4xl font-bold text-white mb-4 animate-pulse-slow">
              What Our Customers Say
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Trusted by thousands of customers worldwide
            </p>
          </div>

          <div className="relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentTestimonial * 33.333}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover-scale cursor-pointer">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="text-yellow-400 text-lg mr-1 animate-pulse-slow"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <FaQuoteRight className="text-white/40 text-4xl mb-4" />
                    <p className="mb-6 text-white/90">{testimonial.content}</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 border-2 border-white hover-scale cursor-pointer"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-white/70">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentTestimonial === index
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section with Floating Animation */}
      <div
        data-section="download"
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.download
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2563eb] rounded-3xl p-12 text-white relative overflow-hidden hover-scale">
            <div className="absolute inset-0 opacity-10 animate-rotate-slow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slideInLeft">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-pulse-slow">
                  Download the Smart Bank App
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Bank on the go with our mobile app. Available for iOS and
                  Android.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-all hover-scale">
                    <FaMobile className="text-white mr-2" />
                    App Store
                  </button>
                  <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-all hover-scale">
                    <FaMobile className="text-white mr-2" />
                    Google Play
                  </button>
                </div>
              </div>

              <div className="hidden lg:block animate-float">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Mobile App"
                  className="rounded-2xl shadow-2xl hover-scale"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Particle Effect */}
      <div
        data-section="cta"
        className={`bg-gradient-to-r from-slate-800 to-slate-900 text-white py-20 relative overflow-hidden transition-all duration-1000 ${
          isVisible.cta
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Animated Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 3}s`,
              opacity: 0.3,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slideInUp">
            Ready to Get Started?
          </h2>

          <p
            className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Join thousands of satisfied customers and experience the future of
            banking today.
          </p>

          <div
            className="flex justify-center space-x-4 animate-slideInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/register"
              className="bg-[#2563eb] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1d4ed8] hover:shadow-xl transition-all hover-scale inline-flex items-center group"
            >
              Open Account Now
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-all hover-scale"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer with Fade In */}
      <footer
        data-section="footer"
        className={`bg-white border-t border-slate-200 py-12 transition-all duration-1000 ${
          isVisible.footer
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div
              className="animate-slideInLeft"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center hover-rotate cursor-pointer">
                  <span className="text-white font-bold text-lg">SB</span>
                </div>
                <span className="text-xl font-bold text-[#2563eb]">
                  Smart Bank
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Revolutionizing digital banking with secure, modular, and
                feature-rich solutions.
              </p>
              <div className="flex space-x-4">
                {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-slate-400 hover:text-[#2563eb] transition-colors hover-scale inline-block"
                    >
                      <Icon className="text-xl" />
                    </a>
                  ),
                )}
              </div>
            </div>

            {["Products", "Company", "Support"].map((section, sectionIndex) => (
              <div
                key={section}
                className={`animate-slideInLeft`}
                style={{ animationDelay: `${0.2 + sectionIndex * 0.1}s` }}
              >
                <h3 className="font-bold text-slate-800 mb-4">{section}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-600 hover:text-[#2563eb] transition-colors hover-lift inline-block"
                      >
                        {section === "Products"
                          ? ["Loans", "Credit Cards", "Investments", "Savings"][
                              item - 1
                            ]
                          : section === "Company"
                            ? ["About Us", "Careers", "Press", "Blog"][item - 1]
                            : [
                                "Help Center",
                                "Contact Us",
                                "Privacy Policy",
                                "Terms of Service",
                              ][item - 1]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-600 text-sm animate-slideInUp">
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
