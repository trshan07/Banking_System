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
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
  // Company Stats
  const stats = [
    {
      id: 1,
      value: "50K+",
      label: "Active Users",
      icon: <FaUsers className="text-3xl text-emerald-600" />,
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
    {
      id: 2,
      value: "8+",
      label: "Core Modules",
      icon: <FaBuilding className="text-3xl text-sky-600" />,
      bgColor: "bg-gradient-to-br from-sky-50 to-blue-50",
    },
    {
      id: 3,
      value: "99.9%",
      label: "System Uptime",
      icon: <FaClock className="text-3xl text-violet-600" />,
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
    },
    {
      id: 4,
      value: "24/7",
      label: "Customer Support",
      icon: <FaHeadset className="text-3xl text-amber-600" />,
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      id: 5,
      value: "₹10Cr+",
      label: "Transactions",
      icon: <FaExchangeAlt className="text-3xl text-rose-600" />,
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
    {
      id: 6,
      value: "100%",
      label: "Secure",
      icon: <FaShieldAlt className="text-3xl text-indigo-600" />,
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    },
  ];

  // Core Values
  const coreValues = [
    {
      id: 1,
      title: "Innovation",
      description:
        "Continuously evolving with cutting-edge technology to provide modern banking solutions.",
      icon: <FaLightbulb className="text-amber-600 text-4xl" />,
      lightBg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      iconBg: "bg-amber-100",
      borderColor: "border-amber-200",
    },
    {
      id: 2,
      title: "Security",
      description:
        "Implementing best-in-class security measures to protect user data and transactions.",
      icon: <FaShieldAlt className="text-sky-600 text-4xl" />,
      lightBg: "bg-gradient-to-br from-sky-50 to-blue-50",
      iconBg: "bg-sky-100",
      borderColor: "border-sky-200",
    },
    {
      id: 3,
      title: "Transparency",
      description:
        "Clear and honest communication about processes, fees, and status updates.",
      icon: <FaEye className="text-violet-600 text-4xl" />,
      lightBg: "bg-gradient-to-br from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
      borderColor: "border-violet-200",
    },
    {
      id: 4,
      title: "Customer-Centric",
      description:
        "Putting users first with intuitive interfaces and responsive support.",
      icon: <FaHeart className="text-rose-600 text-4xl" />,
      lightBg: "bg-gradient-to-br from-rose-50 to-pink-50",
      iconBg: "bg-rose-100",
      borderColor: "border-rose-200",
    },
    {
      id: 5,
      title: "Integrity",
      description:
        "Maintaining ethical practices in all banking operations and decisions.",
      icon: <FaHandshake className="text-emerald-600 text-4xl" />,
      lightBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      id: 6,
      title: "Sustainability",
      description:
        "Promoting digital transformation to reduce environmental impact.",
      icon: <FaLeaf className="text-teal-600 text-4xl" />,
      lightBg: "bg-gradient-to-br from-teal-50 to-emerald-50",
      iconBg: "bg-teal-100",
      borderColor: "border-teal-200",
    },
  ];

  // Team Members
  const teamMembers = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "CEO & Founder",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "15+ years in fintech innovation, passionate about digital banking transformation.",
      gradient: "from-emerald-500 to-teal-500",
      badge: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "CTO",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Full-stack expert specializing in secure banking applications and cloud architecture.",
      gradient: "from-sky-500 to-blue-500",
      badge: "bg-gradient-to-r from-sky-500 to-blue-500",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Head of Security",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Cybersecurity specialist ensuring robust protection for all banking operations.",
      gradient: "from-violet-500 to-purple-500",
      badge: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "Customer Experience Lead",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      bio: "Dedicated to creating seamless and intuitive user experiences for all customers.",
      gradient: "from-amber-500 to-orange-500",
      badge: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
  ];

  // Timeline Milestones
  const milestones = [
    {
      id: 1,
      year: "2023",
      title: "Project Conception",
      description:
        "Smart Bank envisioned as a modern banking solution for digital-first economy.",
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
      lightBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
    {
      id: 2,
      year: "Q1 2024",
      title: "Core Development",
      description: "MERN stack implementation with 8 core banking modules.",
      color: "bg-gradient-to-r from-sky-500 to-blue-500",
      lightBg: "bg-gradient-to-br from-sky-50 to-blue-50",
    },
    {
      id: 3,
      year: "Q2 2024",
      title: "Security Integration",
      description:
        "JWT authentication, encryption, and fraud detection systems implemented.",
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
      lightBg: "bg-gradient-to-br from-violet-50 to-purple-50",
    },
    {
      id: 4,
      year: "Q3 2024",
      title: "Beta Launch",
      description:
        "First version released with loan management, KYC, and support systems.",
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      lightBg: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      id: 5,
      year: "Q4 2024",
      title: "Full Deployment",
      description:
        "Complete platform launch with all modules and real-time features.",
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
      lightBg: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
  ];

  // Features Overview
  const features = [
    {
      id: 1,
      title: "Online Loan Management",
      description:
        "Apply for loans, upload KYC documents, and track approval status.",
      icon: <FaMoneyBillWave className="text-3xl text-emerald-600" />,
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    },
    {
      id: 2,
      title: "Customer Support System",
      description: "24/7 ticket-based support with live chat and analytics.",
      icon: <FaHeadset className="text-3xl text-sky-600" />,
      bgColor: "bg-gradient-to-br from-sky-50 to-blue-50",
    },
    {
      id: 3,
      title: "Secure Banking Portal",
      description:
        "Account management, balance checks, and secure fund transfers.",
      icon: <FaExchangeAlt className="text-3xl text-violet-600" />,
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50",
    },
    {
      id: 4,
      title: "Fraud Detection",
      description: "Advanced reporting system with pattern analysis.",
      icon: <FaShieldAlt className="text-3xl text-rose-600" />,
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
    {
      id: 5,
      title: "Digital KYC",
      description: "Online account opening with document verification.",
      icon: <FaFileSignature className="text-3xl text-amber-600" />,
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      id: 6,
      title: "Investment Tracker",
      description: "Set financial goals and track savings with charts.",
      icon: <FaChartLine className="text-3xl text-indigo-600" />,
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    },
    {
      id: 7,
      title: "Branch Locator",
      description: "Find nearby ATMs and branches with maps.",
      icon: <FaMapMarkerAlt className="text-3xl text-cyan-600" />,
      bgColor: "bg-gradient-to-br from-cyan-50 to-sky-50",
    },
    {
      id: 8,
      title: "Employee Management",
      description: "Automated HR activities and task assignment.",
      icon: <FaUsers className="text-3xl text-slate-600" />,
      bgColor: "bg-gradient-to-br from-slate-50 to-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Smart Bank
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Revolutionizing digital banking with a secure, modular, and
              feature-rich platform that brings modern financial services to
              everyone.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/contact"
                className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                Contact Us
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-700 transition-all hover:-translate-y-1"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-xl p-8 border border-emerald-200 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <FaBullseye className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700">
                Our Mission
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              To create and develop a secure, modular, and feature-rich Smart
              Bank Web Application that consolidates innovative banking features
              in a single digital platform. We aim to maximize digital user
              experience, administrative productivity, and operational
              transparency through cutting-edge technology.
            </p>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl shadow-xl p-8 border border-sky-200 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                <FaEye className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-700">
                Our Vision
              </h2>
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
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700 mb-12">
            Smart Bank in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`${stat.bgColor} rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border border-white/50`}
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
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-700 mb-4">
              Our Story
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Born from the need to transform traditional banking systems
              through contemporary digital solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 rounded-xl border-l-4 border-emerald-500 hover:shadow-lg transition-all">
                <p className="text-slate-700 leading-relaxed">
                  With the digital-first economy of today, the banking industry
                  is rapidly transforming to offer safe, efficient, and
                  user-friendly online services. Legacy systems are usually
                  inflexible, archaic, or in dismembered form, leaving user
                  experience gaps.
                </p>
              </div>
              <div className="bg-gradient-to-r from-sky-50 to-transparent p-6 rounded-xl border-l-4 border-sky-500 hover:shadow-lg transition-all">
                <p className="text-slate-700 leading-relaxed">
                  In response to such shortfalls, Smart Bank was conceived as an
                  end-to-end web application based on the MERN stack that mimics
                  actual-world banking features in multiple domains.
                </p>
              </div>
              <div className="bg-gradient-to-r from-violet-50 to-transparent p-6 rounded-xl border-l-4 border-violet-500 hover:shadow-lg transition-all">
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
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-emerald-200 hover:border-emerald-400 transition-all"
                />
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Finance"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-sky-200 hover:border-sky-400 transition-all"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Digital Banking"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-violet-200 hover:border-violet-400 transition-all"
                />
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Business"
                  className="rounded-lg shadow-xl w-full h-48 object-cover border-4 border-amber-200 hover:border-amber-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Smart Bank
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => (
              <div
                key={value.id}
                className={`${value.lightBg} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-2 border ${value.borderColor} group`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`w-20 h-20 ${value.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}
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
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive banking solutions in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${feature.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200 group`}
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

      {/* Timeline */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-700 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Key milestones in the development of Smart Bank
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 via-sky-400 to-rose-400 rounded-full hidden md:block"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 md:px-8">
                    <div
                      className={`${milestone.lightBg} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-white/50`}
                    >
                      <span
                        className={`${milestone.color} text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-2 shadow-md`}
                      >
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-slate-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center text-white font-bold z-10 my-4 md:my-0 shadow-lg ring-4 ring-white hover:scale-110 transition-transform`}
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
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Passionate experts dedicated to revolutionizing digital banking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-b from-white to-slate-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-0 hover:opacity-70 transition-opacity`}
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
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-emerald-500 hover:text-white transition-all hover:scale-110"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-all hover:scale-110"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href="#"
                      className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-rose-500 hover:text-white transition-all hover:scale-110"
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
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Real feedback from customers who trust Smart Bank
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all border border-white/20 hover:scale-105 hover:-translate-y-1"
              >
                <FaQuoteRight className="text-3xl text-white/60 mb-4" />
                <p className="mb-4 italic text-white/90">
                  "Smart Bank has completely transformed how I manage my
                  finances. The loan application process was seamless and the
                  customer support is exceptional."
                </p>
                <div className="flex items-center">
                  <img
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 10}.jpg`}
                    alt="User"
                    className="w-12 h-12 rounded-full mr-4 border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-white">John Doe</p>
                    <p className="text-sm text-white/70">Customer since 2024</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-8 border border-slate-200 shadow-xl">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700 mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-600 mb-6">
              Have questions about Smart Bank? Our team is here to help you with
              any inquiries.
            </p>
            <div className="space-y-4">
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="text-slate-800 font-medium">
                    support@smartbank.com
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-slate-800 font-medium">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
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
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-md hover:shadow-lg hover:scale-110"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-sky-600 hover:bg-sky-500 hover:text-white transition-all shadow-md hover:shadow-lg hover:scale-110"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-violet-600 hover:bg-violet-500 hover:text-white transition-all shadow-md hover:shadow-lg hover:scale-110"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-md hover:shadow-lg hover:scale-110"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-blue-700 mb-6">
              Send us a Message
            </h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-semibold shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Modern Banking?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Smart Bank for their
            financial needs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-all hover:-translate-y-1"
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
