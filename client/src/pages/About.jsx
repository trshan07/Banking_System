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
  FaGlobe,
  FaRocket,
  FaHeart,
  FaLeaf,
  FaHandshake,
  FaLightbulb,
  FaEye,
  FaBullseye,
  FaStar,
  FaQuoteRight,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
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
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Company Stats - Using only 4 colors
  const stats = [
    {
      id: 1,
      value: "50K+",
      label: "Active Users",
      icon: <FaUsers className="text-3xl text-[#2563eb]" />,
      bgColor: "bg-[#2563eb] bg-opacity-5",
    },
    {
      id: 2,
      value: "8+",
      label: "Core Modules",
      icon: <FaBuilding className="text-3xl text-[#10b981]" />,
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 3,
      value: "99.9%",
      label: "System Uptime",
      icon: <FaClock className="text-3xl text-[#2563eb]" />,
      bgColor: "bg-[#2563eb] bg-opacity-5",
    },
    {
      id: 4,
      value: "24/7",
      label: "Customer Support",
      icon: <FaHeadset className="text-3xl text-[#f59e0b]" />,
      bgColor: "bg-[#f59e0b] bg-opacity-5",
    },
    {
      id: 5,
      value: "₹10Cr+",
      label: "Transactions",
      icon: <FaExchangeAlt className="text-3xl text-[#10b981]" />,
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 6,
      value: "100%",
      label: "Secure",
      icon: <FaShieldAlt className="text-3xl text-[#2563eb]" />,
      bgColor: "bg-[#2563eb] bg-opacity-5",
    },
  ];

  // Core Values - Using only 4 colors
  const coreValues = [
    {
      id: 1,
      title: "Innovation",
      description:
        "Continuously evolving with cutting-edge technology to provide modern banking solutions.",
      icon: <FaLightbulb className="text-[#f59e0b] text-4xl" />,
      lightBg: "bg-[#f59e0b] bg-opacity-5",
      iconBg: "bg-[#f59e0b] bg-opacity-10",
      borderColor: "border-[#f59e0b] border-opacity-20",
    },
    {
      id: 2,
      title: "Security",
      description:
        "Implementing best-in-class security measures to protect user data and transactions.",
      icon: <FaShieldAlt className="text-[#2563eb] text-4xl" />,
      lightBg: "bg-[#2563eb] bg-opacity-5",
      iconBg: "bg-[#2563eb] bg-opacity-10",
      borderColor: "border-[#2563eb] border-opacity-20",
    },
    {
      id: 3,
      title: "Transparency",
      description:
        "Clear and honest communication about processes, fees, and status updates.",
      icon: <FaEye className="text-[#10b981] text-4xl" />,
      lightBg: "bg-[#10b981] bg-opacity-5",
      iconBg: "bg-[#10b981] bg-opacity-10",
      borderColor: "border-[#10b981] border-opacity-20",
    },
    {
      id: 4,
      title: "Customer-Centric",
      description:
        "Putting users first with intuitive interfaces and responsive support.",
      icon: <FaHeart className="text-[#ef4444] text-4xl" />,
      lightBg: "bg-[#ef4444] bg-opacity-5",
      iconBg: "bg-[#ef4444] bg-opacity-10",
      borderColor: "border-[#ef4444] border-opacity-20",
    },
    {
      id: 5,
      title: "Integrity",
      description:
        "Maintaining ethical practices in all banking operations and decisions.",
      icon: <FaHandshake className="text-[#2563eb] text-4xl" />,
      lightBg: "bg-[#2563eb] bg-opacity-5",
      iconBg: "bg-[#2563eb] bg-opacity-10",
      borderColor: "border-[#2563eb] border-opacity-20",
    },
    {
      id: 6,
      title: "Sustainability",
      description:
        "Promoting digital transformation to reduce environmental impact.",
      icon: <FaLeaf className="text-[#10b981] text-4xl" />,
      lightBg: "bg-[#10b981] bg-opacity-5",
      iconBg: "bg-[#10b981] bg-opacity-10",
      borderColor: "border-[#10b981] border-opacity-20",
    },
  ];

  // Team Members - Using only 4 colors
  const teamMembers = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "15+ years in fintech innovation, passionate about digital banking transformation.",
      color: "#2563eb",
      badge: "bg-[#2563eb]",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "CTO",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Full-stack expert specializing in secure banking applications and cloud architecture.",
      color: "#10b981",
      badge: "bg-[#10b981]",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Head of Security",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Cybersecurity specialist ensuring robust protection for all banking operations.",
      color: "#f59e0b",
      badge: "bg-[#f59e0b]",
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "Customer Experience Lead",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      bio: "Dedicated to creating seamless and intuitive user experiences for all customers.",
      color: "#ef4444",
      badge: "bg-[#ef4444]",
    },
  ];

  // Timeline Milestones - Using only 4 colors
  const milestones = [
    {
      id: 1,
      year: "2023",
      title: "Project Conception",
      description:
        "Smart Bank envisioned as a modern banking solution for digital-first economy.",
      color: "bg-[#2563eb]",
      lightBg: "bg-[#2563eb] bg-opacity-5",
    },
    {
      id: 2,
      year: "Q1 2024",
      title: "Core Development",
      description: "MERN stack implementation with 8 core banking modules.",
      color: "bg-[#10b981]",
      lightBg: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 3,
      year: "Q2 2024",
      title: "Security Integration",
      description:
        "JWT authentication, encryption, and fraud detection systems implemented.",
      color: "bg-[#f59e0b]",
      lightBg: "bg-[#f59e0b] bg-opacity-5",
    },
    {
      id: 4,
      year: "Q3 2024",
      title: "Beta Launch",
      description:
        "First version released with loan management, KYC, and support systems.",
      color: "bg-[#ef4444]",
      lightBg: "bg-[#ef4444] bg-opacity-5",
    },
    {
      id: 5,
      year: "Q4 2024",
      title: "Full Deployment",
      description:
        "Complete platform launch with all modules and real-time features.",
      color: "bg-[#2563eb]",
      lightBg: "bg-[#2563eb] bg-opacity-5",
    },
  ];

  // Features Overview - Using only 4 colors
  const features = [
    {
      id: 1,
      title: "Online Loan Management",
      description:
        "Apply for loans, upload KYC documents, and track approval status.",
      icon: <FaMoneyBillWave className="text-3xl text-[#2563eb]" />,
      bgColor: "bg-[#2563eb] bg-opacity-5",
    },
    {
      id: 2,
      title: "Customer Support System",
      description: "24/7 ticket-based support with live chat and analytics.",
      icon: <FaHeadset className="text-3xl text-[#10b981]" />,
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 3,
      title: "Secure Banking Portal",
      description:
        "Account management, balance checks, and secure fund transfers.",
      icon: <FaExchangeAlt className="text-3xl text-[#2563eb]" />,
      bgColor: "bg-[#2563eb] bg-opacity-5",
    },
    {
      id: 4,
      title: "Fraud Detection",
      description: "Advanced reporting system with pattern analysis.",
      icon: <FaShieldAlt className="text-3xl text-[#ef4444]" />,
      bgColor: "bg-[#ef4444] bg-opacity-5",
    },
    {
      id: 5,
      title: "Digital KYC",
      description: "Online account opening with document verification.",
      icon: <FaFileSignature className="text-3xl text-[#f59e0b]" />,
      bgColor: "bg-[#f59e0b] bg-opacity-5",
    },
    {
      id: 6,
      title: "Investment Tracker",
      description: "Set financial goals and track savings with charts.",
      icon: <FaChartLine className="text-3xl text-[#10b981]" />,
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 7,
      title: "Branch Locator",
      description: "Find nearby ATMs and branches with maps.",
      icon: <FaMapMarkerAlt className="text-3xl text-[#2563eb]" />,
      bgColor: "bg-[#2563eb] bg-opacity-5",
    },
    {
      id: 8,
      title: "Employee Management",
      description: "Automated HR activities and task assignment.",
      icon: <FaUsers className="text-3xl text-[#f59e0b]" />,
      bgColor: "bg-[#f59e0b] bg-opacity-5",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Custom CSS Animations */}
      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-rotate {
          animation: rotate 20s linear infinite;
        }

        .hover-scale {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .hover-lift {
          transition: transform 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-3px);
        }

        .stagger-item {
          opacity: 0;
          animation: slideInUp 0.5s ease-out forwards;
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
      `}</style>

      {/* Hero Section - Fixed visibility */}
      <div
        data-section="hero"
        className="relative bg-[#2563eb] text-white min-h-[600px] flex items-center"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/30 hover-scale">
              <div className="animate-rotate mr-2">
                <FaRocket className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                Welcome to Smart Bank
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              About Smart Bank
            </h1>

            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Revolutionizing digital banking with a secure, modular, and
              feature-rich platform that brings modern financial services to
              everyone.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-[#2563eb] px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:shadow-lg hover-scale inline-flex items-center justify-center"
              >
                Contact Us
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#2563eb] transition-all hover-scale"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div
        data-section="mission"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 transition-all duration-1000 ${
          isVisible.mission
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-xl p-8 border border-[#2563eb] border-opacity-20 hover:shadow-2xl transition-all hover-scale group">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-[#2563eb] rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <FaBullseye className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#2563eb]">Our Mission</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              To create and develop a secure, modular, and feature-rich Smart
              Bank Web Application that consolidates innovative banking features
              in a single digital platform. We aim to maximize digital user
              experience, administrative productivity, and operational
              transparency through cutting-edge technology.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 border border-[#10b981] border-opacity-20 hover:shadow-2xl transition-all hover-scale group">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-[#10b981] rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <FaEye className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#10b981]">Our Vision</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              To become the leading digital banking platform that transforms
              traditional banking through innovative solutions, setting new
              standards for security, accessibility, and user experience in the
              fintech industry.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        data-section="stats"
        className={`py-20 transition-all duration-1000 ${
          isVisible.stats
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#2563eb] mb-12">
            Smart Bank in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`${stat.bgColor} rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover-scale stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div
        data-section="story"
        className={`bg-white py-20 transition-all duration-1000 ${
          isVisible.story
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
              Our Story
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Born from the need to transform traditional banking systems
              through contemporary digital solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#2563eb] bg-opacity-5 to-transparent p-6 rounded-xl border-l-4 border-[#2563eb] hover:shadow-lg transition-all">
                <p className="text-slate-700 leading-relaxed">
                  With the digital-first economy of today, the banking industry
                  is rapidly transforming to offer safe, efficient, and
                  user-friendly online services. Legacy systems are usually
                  inflexible, archaic, or in dismembered form, leaving user
                  experience gaps.
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#10b981] bg-opacity-5 to-transparent p-6 rounded-xl border-l-4 border-[#10b981] hover:shadow-lg transition-all">
                <p className="text-slate-700 leading-relaxed">
                  In response to such shortfalls, Smart Bank was conceived as an
                  end-to-end web application based on the MERN stack that mimics
                  actual-world banking features in multiple domains.
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#f59e0b] bg-opacity-5 to-transparent p-6 rounded-xl border-l-4 border-[#f59e0b] hover:shadow-lg transition-all">
                <p className="text-slate-700 leading-relaxed">
                  With the rising cyber threats and customer expectations, Smart
                  Bank fills this space with 8 chief modules including loan
                  management, fraud management, customer care, and digital KYC.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Banking"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-[#2563eb] border-opacity-20 hover:border-opacity-100 transition-all"
                />
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Finance"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-[#10b981] border-opacity-20 hover:border-opacity-100 transition-all"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Digital Banking"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-[#f59e0b] border-opacity-20 hover:border-opacity-100 transition-all"
                />
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Business"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-[#ef4444] border-opacity-20 hover:border-opacity-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div
        data-section="values"
        className={`bg-gradient-to-b from-slate-50 to-white py-20 transition-all duration-1000 ${
          isVisible.values
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Smart Bank
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={value.id}
                className={`${value.lightBg} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover-scale border ${value.borderColor} group stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`w-20 h-20 ${value.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div
        data-section="features"
        className={`bg-white py-20 transition-all duration-1000 ${
          isVisible.features
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive banking solutions in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`${feature.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover-scale border border-slate-200 group stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline - Fixed visibility */}
      <div
        data-section="timeline"
        className={`bg-gradient-to-b from-slate-50 to-white py-20 transition-all duration-1000 ${
          isVisible.timeline
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Key milestones in the development of Smart Bank
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line - Hidden on mobile */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#2563eb] via-[#10b981] to-[#ef4444] rounded-full hidden md:block"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`flex flex-col md:flex-row items-start md:items-center stagger-item`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Mobile timeline dot */}
                  <div className="flex md:hidden items-center mb-2">
                    <div
                      className={`w-8 h-8 ${milestone.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-white mr-3`}
                    >
                      {milestone.id}
                    </div>
                    <span
                      className={`${milestone.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}
                    >
                      {milestone.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 md:px-8 ${index % 2 === 0 ? "md:text-right" : ""}`}
                  >
                    <div
                      className={`${milestone.lightBg} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover-scale ml-12 md:ml-0`}
                    >
                      {/* Desktop year badge */}
                      <span
                        className={`hidden md:inline-block ${milestone.color} text-white px-3 py-1 rounded-full text-sm font-bold mb-2 shadow-md`}
                      >
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Desktop timeline dot */}
                  <div
                    className={`hidden md:flex w-10 h-10 ${milestone.color} rounded-full items-center justify-center text-white font-bold z-10 shadow-lg ring-4 ring-white hover-scale`}
                  >
                    {milestone.id}
                  </div>

                  <div className="flex-1 md:px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div
        data-section="team"
        className={`bg-white py-20 transition-all duration-1000 ${
          isVisible.team
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Passionate experts dedicated to revolutionizing digital banking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover-scale border border-slate-200 group stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: member.color }}
                  ></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {member.name}
                  </h3>
                  <p
                    className={`${member.badge} text-white inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 shadow-md`}
                  >
                    {member.role}
                  </p>
                  <p className="text-slate-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a
                      href="#"
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-[#2563eb] hover:text-white transition-all hover-scale"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-[#10b981] hover:text-white transition-all hover-scale"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-[#ef4444] hover:text-white transition-all hover-scale"
                    >
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div
        data-section="testimonials"
        className={`bg-[#2563eb] text-white py-20 overflow-hidden transition-all duration-1000 ${
          isVisible.testimonials
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real feedback from customers who trust Smart Bank
            </p>
          </div>

          <div className="relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {[1, 2, 3].map((i, index) => (
                <div key={i} className="w-full flex-shrink-0 px-3">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all border border-white/20 max-w-2xl mx-auto">
                    <FaQuoteRight className="text-3xl text-white/60 mb-4" />
                    <p className="mb-4 italic text-white/90">
                      "Smart Bank has completely transformed how I manage my
                      finances. The loan application process was seamless and
                      the customer support is exceptional."
                    </p>
                    <div className="flex items-center">
                      <img
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 10}.jpg`}
                        alt="User"
                        className="w-12 h-12 rounded-full mr-4 border-2 border-white"
                      />
                      <div>
                        <p className="font-semibold text-white">John Doe</p>
                        <p className="text-sm text-white/70">
                          Customer since 2024
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
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

      {/* Contact Section */}
      <div
        data-section="contact"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${
          isVisible.contact
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 shadow-xl">
            <h2 className="text-3xl font-bold text-[#2563eb] mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-600 mb-6">
              Have questions about Smart Bank? Our team is here to help you with
              any inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover-scale border border-slate-100">
                <div className="w-12 h-12 bg-[#2563eb] rounded-lg flex items-center justify-center mr-4">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-slate-800 font-medium">
                    support@smartbank.com
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover-scale border border-slate-100">
                <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center mr-4">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-slate-800 font-medium">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover-scale border border-slate-100">
                <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center mr-4">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Headquarters</p>
                  <p className="text-slate-800 font-medium">
                    123 Banking Avenue, NY 10001
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#2563eb] hover:bg-[#2563eb] hover:text-white transition-all hover-scale"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all hover-scale"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white transition-all hover-scale"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all hover-scale"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-[#2563eb] mb-6">
              Send us a Message
            </h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2563eb] text-white py-3 rounded-lg hover:bg-[#1d4ed8] transition-all font-semibold shadow-md hover:shadow-lg hover-scale"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        data-section="cta"
        className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Modern Banking?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Smart Bank for their
            financial needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-[#2563eb] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] hover:shadow-xl transition-all hover-scale inline-flex items-center justify-center"
            >
              Get Started
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-all hover-scale"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
