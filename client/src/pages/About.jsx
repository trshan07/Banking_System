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
  FaCheckCircle,
  FaAward,
  FaTrophy,
  FaCrown,
  FaGem,
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

  // Company Stats - Updated with navy blue
  const stats = [
    {
      id: 1,
      value: "50K+",
      label: "Active Users",
      icon: <FaUsers className="text-3xl text-[#0A2647]" />,
      bgColor: "bg-[#0A2647] bg-opacity-5",
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
      icon: <FaClock className="text-3xl text-[#0A2647]" />,
      bgColor: "bg-[#0A2647] bg-opacity-5",
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
      icon: <FaShieldAlt className="text-3xl text-[#0A2647]" />,
      bgColor: "bg-[#0A2647] bg-opacity-5",
    },
  ];

  // Core Values - Updated with navy blue
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
      icon: <FaShieldAlt className="text-[#0A2647] text-4xl" />,
      lightBg: "bg-[#0A2647] bg-opacity-5",
      iconBg: "bg-[#0A2647] bg-opacity-10",
      borderColor: "border-[#0A2647] border-opacity-20",
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
      icon: <FaHandshake className="text-[#0A2647] text-4xl" />,
      lightBg: "bg-[#0A2647] bg-opacity-5",
      iconBg: "bg-[#0A2647] bg-opacity-10",
      borderColor: "border-[#0A2647] border-opacity-20",
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

  // Team Members - Updated with navy blue
  const teamMembers = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "15+ years in fintech innovation, passionate about digital banking transformation.",
      color: "#0A2647",
      badge: "bg-[#0A2647]",
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

  // Journey Milestones - New data structure for interactive timeline
  const journeyMilestones = [
    {
      id: 1,
      year: "2023",
      quarter: "Q4",
      title: "The Vision",
      description:
        "Smart Bank was conceived as a revolutionary digital banking platform to bridge the gap between traditional banking and modern financial needs.",
      icon: <FaRocket className="text-2xl" />,
      achievements: [
        "Initial Research",
        "Market Analysis",
        "Concept Validation",
      ],
      impact: "Laid the foundation for next-gen banking",
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: 2,
      year: "2024",
      quarter: "Q1",
      title: "Core Development",
      description:
        "Full-stack development begins with MERN stack, implementing 8 core banking modules including loan management and KYC systems.",
      icon: <FaBuilding className="text-2xl" />,
      achievements: [
        "MERN Stack Setup",
        "8 Modules Development",
        "Database Architecture",
      ],
      impact: "Platform architecture completed",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 3,
      year: "2024",
      quarter: "Q2",
      title: "Security First",
      description:
        "Bank-level security protocols implemented including JWT authentication, encryption, and ML-based fraud detection systems.",
      icon: <FaShieldAlt className="text-2xl" />,
      achievements: [
        "JWT Authentication",
        "End-to-End Encryption",
        "Fraud Detection AI",
      ],
      impact: "Military-grade security achieved",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      year: "2024",
      quarter: "Q3",
      title: "Beta Launch",
      description:
        "First version released with 1000+ beta testers, gathering crucial feedback for optimization and enhancement.",
      icon: <FaUsers className="text-2xl" />,
      achievements: [
        "Beta Testing",
        "User Feedback",
        "Performance Optimization",
      ],
      impact: "1000+ satisfied beta users",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 5,
      year: "2024",
      quarter: "Q4",
      title: "Full Deployment",
      description:
        "Complete platform launch with all modules, real-time features, and 50,000+ active users onboarded.",
      icon: <FaGlobe className="text-2xl" />,
      achievements: ["Global Launch", "50K+ Users", "24/7 Support"],
      impact: "Market leadership established",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  // Features Overview - Updated with navy blue
  const features = [
    {
      id: 1,
      title: "Online Loan Management",
      description:
        "Apply for loans, upload KYC documents, and track approval status.",
      icon: <FaMoneyBillWave className="text-3xl text-[#0A2647]" />,
      bgColor: "bg-[#0A2647] bg-opacity-5",
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
      icon: <FaExchangeAlt className="text-3xl text-[#0A2647]" />,
      bgColor: "bg-[#0A2647] bg-opacity-5",
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
      icon: <FaMapMarkerAlt className="text-3xl text-[#0A2647]" />,
      bgColor: "bg-[#0A2647] bg-opacity-5",
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
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(10, 38, 71, 0.3); }
          50% { border-color: rgba(10, 38, 71, 0.8); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out forwards; }
        .animate-rotate { animation: rotate 20s linear infinite; }
        .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-scale:hover { transform: scale(1.03); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        .hover-lift { transition: transform 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); }
        .stagger-item { opacity: 0; animation: slideInUp 0.5s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .animate-border-glow { animation: borderGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Hero Section */}
      <div
        data-section="hero"
        className="relative bg-[#0A2647] text-white min-h-[600px] flex items-center"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"
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
                className="bg-white text-[#0A2647] px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:shadow-lg hover-scale inline-flex items-center justify-center"
              >
                Contact Us{" "}
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#0A2647] transition-all hover-scale"
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
          <div className="bg-white rounded-xl shadow-xl p-8 border border-[#0A2647] border-opacity-20 hover:shadow-2xl transition-all hover-scale group">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-[#0A2647] rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <FaBullseye className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2647]">Our Mission</h2>
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
          <h2 className="text-3xl font-bold text-center text-[#0A2647] mb-12">
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
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
              Our Story
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Born from the need to transform traditional banking systems
              through contemporary digital solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#0A2647] bg-opacity-5 to-transparent p-6 rounded-xl border-l-4 border-[#0A2647] hover:shadow-lg transition-all">
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
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-[#0A2647] border-opacity-20 hover:border-opacity-100 transition-all"
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
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
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
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
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

      {/* Our Journey - Interactive Roadmap Style */}
      <div
        data-section="journey"
        className={`bg-gradient-to-br from-slate-900 via-[#0A2647] to-slate-900 py-20 transition-all duration-1000 ${
          isVisible.journey
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-6 py-2 mb-4 shadow-lg">
              <FaTrophy className="text-white mr-2 animate-pulse-slow" />
              <span className="text-sm font-semibold text-white">
                Our Roadmap
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Journey of Excellence
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Every milestone marks our commitment to revolutionizing digital
              banking
            </p>
          </div>

          {/* Interactive Timeline */}
          <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-500 via-orange-500 to-red-500 rounded-full hidden lg:block"></div>

            {journeyMilestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`relative flex flex-col lg:flex-row items-center mb-16 last:mb-0 stagger-item`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Left Side Content */}
                <div
                  className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:order-2"}`}
                >
                  <div
                    className={`bg-gradient-to-r ${milestone.color} p-[1px] rounded-2xl hover:shadow-2xl transition-all duration-300`}
                  >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
                      {/* Quarter Badge */}
                      <div className="inline-flex items-center bg-black/50 rounded-full px-3 py-1 mb-3">
                        <FaClock className="text-yellow-400 text-xs mr-1" />
                        <span className="text-xs text-white font-semibold">
                          {milestone.quarter} {milestone.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {milestone.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-300 leading-relaxed mb-4">
                        {milestone.description}
                      </p>

                      {/* Achievements List */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-yellow-400 mb-2">
                          Key Achievements:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.achievements.map((achievement, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white/10 text-white px-2 py-1 rounded-full"
                            >
                              ✓ {achievement}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Impact Statement */}
                      <div className="border-t border-white/20 pt-3 mt-2">
                        <p className="text-sm text-slate-400">
                          <span className="font-semibold text-yellow-400">
                            Impact:
                          </span>{" "}
                          {milestone.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 items-center justify-center z-10 shadow-lg">
                  <div className="text-white text-2xl">{milestone.icon}</div>
                </div>

                {/* Right Side Content - Placeholder */}
                <div className="lg:w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Journey Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover-scale">
              <FaAward className="text-yellow-400 text-3xl mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-slate-400">Major Milestones</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover-scale">
              <FaClock className="text-green-400 text-3xl mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">12</div>
              <div className="text-sm text-slate-400">
                Months of Development
              </div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover-scale">
              <FaUsers className="text-blue-400 text-3xl mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-slate-400">Active Users</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover-scale">
              <FaGem className="text-purple-400 text-3xl mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-sm text-slate-400">
                Customer Satisfaction
              </div>
            </div>
          </div>

          {/* Future Vision Banner */}
          <div className="mt-16">
            <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl p-8 md:p-12 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <FaRocket className="text-4xl text-white animate-pulse-slow" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What's Next in 2025?
                </h3>
                <p className="text-white/90 max-w-2xl mx-auto mb-6 text-lg">
                  The future is bright! We're working on revolutionary features
                  to transform your banking experience.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white backdrop-blur-lg">
                    🤖 AI-Powered Advisor
                  </span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white backdrop-blur-lg">
                    🔗 Blockchain Integration
                  </span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white backdrop-blur-lg">
                    🌍 International Banking
                  </span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white backdrop-blur-lg">
                    📱 Voice Banking
                  </span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm text-white backdrop-blur-lg">
                    💳 Smart Cards
                  </span>
                </div>
              </div>
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
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
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
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-[#0A2647] hover:text-white transition-all hover-scale"
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
        className={`bg-[#0A2647] text-white py-20 overflow-hidden transition-all duration-1000 ${
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
            <div className="flex justify-center mt-8 space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${currentTestimonial === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"}`}
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
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-600 mb-6">
              Have questions about Smart Bank? Our team is here to help you with
              any inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover-scale border border-slate-100">
                <div className="w-12 h-12 bg-[#0A2647] rounded-lg flex items-center justify-center mr-4">
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
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0A2647] hover:bg-[#0A2647] hover:text-white transition-all hover-scale"
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
            <h3 className="text-2xl font-bold text-[#0A2647] mb-6">
              Send us a Message
            </h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0A2647] text-white py-3 rounded-lg hover:bg-[#1B3B5C] transition-all font-semibold shadow-md hover:shadow-lg hover-scale"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div data-section="cta" className="bg-[#0A2647] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Modern Banking?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Smart Bank for their
            financial needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-[#0A2647] px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 hover:shadow-xl transition-all hover-scale inline-flex items-center justify-center"
            >
              Get Started{" "}
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#0A2647] transition-all hover-scale"
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
