import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaComment,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaHeadset,
  FaQuestionCircle,
  FaFileAlt,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaBuilding,
  FaUsers,
  FaMoneyBillWave,
  FaComments,
  FaRobot,
  FaWhatsapp,
  FaMapMarkedAlt,
  FaBus,
  FaTrain,
  FaCar,
  FaParking,
  FaWifi,
  FaCoffee,
  FaAccessibleIcon,
  FaStar,
  FaThumbsUp,
  FaAward,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: "general",
    priority: "normal",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          department: "general",
          priority: "normal",
        });
      }, 3000);
    }, 1500);
  };

  // Contact Information - Updated with navy blue
  const contactInfo = [
    {
      id: 1,
      title: "Email Us",
      description: "support@smartbank.com",
      subText: "sales@smartbank.com",
      icon: <FaEnvelope className="text-2xl" />,
      bgGradient: "bg-[#0A2647]",
      lightBg: "bg-[#0A2647] bg-opacity-5",
      textColor: "text-[#0A2647]",
      borderColor: "border-[#0A2647] border-opacity-20",
      action: "mailto:support@smartbank.com",
    },
    {
      id: 2,
      title: "Call Us",
      description: "+1 (555) 123-4567",
      subText: "Toll-free: 1-800-SMART-BANK",
      icon: <FaPhone className="text-2xl" />,
      bgGradient: "bg-[#10b981]",
      lightBg: "bg-[#10b981] bg-opacity-5",
      textColor: "text-[#10b981]",
      borderColor: "border-[#10b981] border-opacity-20",
      action: "tel:+15551234567",
    },
    {
      id: 3,
      title: "Visit Us",
      description: "123 Banking Avenue",
      subText: "Financial District, NY 10001",
      icon: <FaMapMarkerAlt className="text-2xl" />,
      bgGradient: "bg-[#f59e0b]",
      lightBg: "bg-[#f59e0b] bg-opacity-5",
      textColor: "text-[#f59e0b]",
      borderColor: "border-[#f59e0b] border-opacity-20",
      action: "https://maps.google.com/?q=123+Banking+Avenue+NY",
    },
    {
      id: 4,
      title: "Business Hours",
      description: "Mon-Fri: 9:00 AM - 6:00 PM",
      subText: "Sat-Sun: 10:00 AM - 2:00 PM",
      icon: <FaClock className="text-2xl" />,
      bgGradient: "bg-[#ef4444]",
      lightBg: "bg-[#ef4444] bg-opacity-5",
      textColor: "text-[#ef4444]",
      borderColor: "border-[#ef4444] border-opacity-20",
      action: "#",
    },
  ];

  // Support Departments - Updated with navy blue
  const departments = [
    {
      id: 1,
      name: "General",
      value: "general",
      icon: <FaHeadset />,
      bgColor: "bg-[#0A2647] bg-opacity-10",
      textColor: "text-[#0A2647]",
      borderColor: "border-[#0A2647] border-opacity-30",
      selectedBorder: "border-[#0A2647]",
    },
    {
      id: 2,
      name: "Technical",
      value: "technical",
      icon: <FaRocket />,
      bgColor: "bg-[#10b981] bg-opacity-10",
      textColor: "text-[#10b981]",
      borderColor: "border-[#10b981] border-opacity-30",
      selectedBorder: "border-[#10b981]",
    },
    {
      id: 3,
      name: "Account",
      value: "account",
      icon: <FaUsers />,
      bgColor: "bg-[#0A2647] bg-opacity-10",
      textColor: "text-[#0A2647]",
      borderColor: "border-[#0A2647] border-opacity-30",
      selectedBorder: "border-[#0A2647]",
    },
    {
      id: 4,
      name: "Loan",
      value: "loan",
      icon: <FaMoneyBillWave />,
      bgColor: "bg-[#f59e0b] bg-opacity-10",
      textColor: "text-[#f59e0b]",
      borderColor: "border-[#f59e0b] border-opacity-30",
      selectedBorder: "border-[#f59e0b]",
    },
    {
      id: 5,
      name: "KYC",
      value: "kyc",
      icon: <FaFileAlt />,
      bgColor: "bg-[#10b981] bg-opacity-10",
      textColor: "text-[#10b981]",
      borderColor: "border-[#10b981] border-opacity-30",
      selectedBorder: "border-[#10b981]",
    },
    {
      id: 6,
      name: "Security",
      value: "security",
      icon: <FaShieldAlt />,
      bgColor: "bg-[#ef4444] bg-opacity-10",
      textColor: "text-[#ef4444]",
      borderColor: "border-[#ef4444] border-opacity-30",
      selectedBorder: "border-[#ef4444]",
    },
  ];

  // Office Locations - Updated with navy blue
  const locations = [
    {
      id: 1,
      city: "New York",
      address: "123 Banking Avenue, Financial District, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "nyc@smartbank.com",
      manager: "Robert Johnson",
      employees: "250+",
      icon: <FaBuilding />,
      gradient: "from-[#0A2647] to-[#0A2647]",
      lightBg: "bg-[#0A2647] bg-opacity-5",
      badge: "bg-[#0A2647]",
    },
    {
      id: 2,
      city: "London",
      address: "45 Finance Street, Canary Wharf, London E14 5AB",
      phone: "+44 20 7946 0138",
      email: "london@smartbank.com",
      manager: "Emma Thompson",
      employees: "180+",
      icon: <FaBuilding />,
      gradient: "from-[#10b981] to-[#10b981]",
      lightBg: "bg-[#10b981] bg-opacity-5",
      badge: "bg-[#10b981]",
    },
    {
      id: 3,
      city: "Singapore",
      address: "78 Raffles Place, #30-01, Singapore 048612",
      phone: "+65 6321 8765",
      email: "singapore@smartbank.com",
      manager: "David Chen",
      employees: "120+",
      icon: <FaBuilding />,
      gradient: "from-[#f59e0b] to-[#f59e0b]",
      lightBg: "bg-[#f59e0b] bg-opacity-5",
      badge: "bg-[#f59e0b]",
    },
    {
      id: 4,
      city: "Dubai",
      address: "24 Sheikh Zayed Road, DIFC, Dubai 12345",
      phone: "+971 4 567 8901",
      email: "dubai@smartbank.com",
      manager: "Mohammed Al-Rashid",
      employees: "90+",
      icon: <FaBuilding />,
      gradient: "from-[#ef4444] to-[#ef4444]",
      lightBg: "bg-[#ef4444] bg-opacity-5",
      badge: "bg-[#ef4444]",
    },
  ];

  // FAQ Items - Updated with navy blue
  const faqs = [
    {
      id: 1,
      question: "How do I open an account?",
      answer:
        "You can open an account online through our Digital KYC portal. Simply click on 'Register' and follow the verification process with your documents.",
      icon: <FaQuestionCircle className="text-2xl" />,
      color: "text-[#0A2647]",
      bgColor: "bg-[#0A2647] bg-opacity-5",
    },
    {
      id: 2,
      question: "What documents are needed for KYC?",
      answer:
        "You'll need a valid government ID (Passport/Driver's License), proof of address, and a recent photograph.",
      icon: <FaFileAlt className="text-2xl" />,
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 3,
      question: "How long does loan approval take?",
      answer:
        "Loan approval typically takes 24-48 hours after document verification.",
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: "text-[#f59e0b]",
      bgColor: "bg-[#f59e0b] bg-opacity-5",
    },
    {
      id: 4,
      question: "Is my money safe with Smart Bank?",
      answer:
        "Yes, we use bank-level 256-bit encryption and two-factor authentication.",
      icon: <FaShieldAlt className="text-2xl" />,
      color: "text-[#ef4444]",
      bgColor: "bg-[#ef4444] bg-opacity-5",
    },
    {
      id: 5,
      question: "How do I report suspicious activity?",
      answer:
        "You can report fraud directly through your dashboard or contact our security team.",
      icon: <FaHeadset className="text-2xl" />,
      color: "text-[#0A2647]",
      bgColor: "bg-[#0A2647] bg-opacity-5",
    },
    {
      id: 6,
      question: "What are the transaction limits?",
      answer: "Standard accounts have daily limits of $10,000 for transfers.",
      icon: <FaChartLine className="text-2xl" />,
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
  ];

  // Social Media Links - Updated with navy blue
  const socialMedia = [
    {
      id: 1,
      name: "Facebook",
      icon: <FaFacebook className="text-3xl" />,
      bgColor: "bg-[#0A2647]",
      link: "#",
      followers: "50K+",
    },
    {
      id: 2,
      name: "Twitter",
      icon: <FaTwitter className="text-3xl" />,
      bgColor: "bg-[#10b981]",
      link: "#",
      followers: "35K+",
    },
    {
      id: 3,
      name: "LinkedIn",
      icon: <FaLinkedin className="text-3xl" />,
      bgColor: "bg-[#0A2647]",
      link: "#",
      followers: "45K+",
    },
    {
      id: 4,
      name: "Instagram",
      icon: <FaInstagram className="text-3xl" />,
      bgColor: "bg-[#f59e0b]",
      link: "#",
      followers: "30K+",
    },
    {
      id: 5,
      name: "YouTube",
      icon: <FaYoutube className="text-3xl" />,
      bgColor: "bg-[#ef4444]",
      link: "#",
      followers: "25K+",
    },
    {
      id: 6,
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-3xl" />,
      bgColor: "bg-[#10b981]",
      link: "#",
      followers: "20K+",
    },
  ];

  // Map Features - Updated with navy blue
  const mapFeatures = [
    {
      id: 1,
      icon: <FaBus />,
      label: "Bus Stop (2 min walk)",
      color: "text-[#0A2647]",
      bgColor: "bg-[#0A2647] bg-opacity-5",
    },
    {
      id: 2,
      icon: <FaTrain />,
      label: "Metro Station (5 min walk)",
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 3,
      icon: <FaParking />,
      label: "Paid Parking",
      color: "text-[#f59e0b]",
      bgColor: "bg-[#f59e0b] bg-opacity-5",
    },
    {
      id: 4,
      icon: <FaWifi />,
      label: "Free WiFi",
      color: "text-[#0A2647]",
      bgColor: "bg-[#0A2647] bg-opacity-5",
    },
    {
      id: 5,
      icon: <FaCoffee />,
      label: "Coffee Shop",
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981] bg-opacity-5",
    },
    {
      id: 6,
      icon: <FaAccessibleIcon />,
      label: "Wheelchair Accessible",
      color: "text-[#ef4444]",
      bgColor: "bg-[#ef4444] bg-opacity-5",
    },
  ];

  // Achievements - Updated with navy blue
  const achievements = [
    {
      id: 1,
      icon: <FaStar className="text-2xl" />,
      count: "4.8/5",
      label: "Customer Rating",
      bgColor: "bg-[#0A2647] bg-opacity-10",
      textColor: "text-[#0A2647]",
    },
    {
      id: 2,
      icon: <FaThumbsUp className="text-2xl" />,
      count: "98%",
      label: "Satisfaction",
      bgColor: "bg-[#10b981] bg-opacity-10",
      textColor: "text-[#10b981]",
    },
    {
      id: 3,
      icon: <FaAward className="text-2xl" />,
      count: "15+",
      label: "Awards",
      bgColor: "bg-[#f59e0b] bg-opacity-10",
      textColor: "text-[#f59e0b]",
    },
    {
      id: 4,
      icon: <FaTrophy className="text-2xl" />,
      count: "5 Years",
      label: "Excellence",
      bgColor: "bg-[#ef4444] bg-opacity-10",
      textColor: "text-[#ef4444]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Custom CSS Animations */}
      <style>{`
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

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
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

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        .hover-scale {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 25px -5px rgba(10, 38, 71, 0.1);
        }

        .hover-lift {
          transition: transform 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-3px);
        }

        .hover-rotate {
          transition: transform 0.5s ease;
        }

        .hover-rotate:hover {
          transform: rotate(360deg);
        }
      `}</style>

      {/* Hero Section - Updated with navy blue */}
      <div className="relative bg-[#0A2647] text-white py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/30 hover-scale">
              <div className="animate-rotate mr-2">
                <FaHeadset className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                24/7 Customer Support
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>

            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Have questions about Smart Bank? Our dedicated team is here to
              help you 24/7 with any inquiries, support, or feedback.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 hover-scale"
                >
                  <div
                    className={`${item.textColor} mb-2 flex justify-center animate-bounce`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-xl font-bold text-white">
                    {item.count}
                  </div>
                  <div className="text-xs text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <a
              key={info.id}
              href={info.action}
              target={info.action.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`${info.lightBg} rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${info.borderColor} group`}
            >
              <div
                className={`w-14 h-14 ${info.bgGradient} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg animate-float`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {info.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {info.title}
              </h3>
              <p className={`font-medium ${info.textColor} mb-1`}>
                {info.description}
              </p>
              <p className="text-sm text-gray-500">{info.subText}</p>
              <div
                className={`mt-4 ${info.textColor} text-sm font-semibold group-hover:underline flex items-center`}
              >
                Contact Now{" "}
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#0A2647] rounded-lg flex items-center justify-center mr-4 animate-float">
                  <FaComment className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-gray-500">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-[#10b981] bg-opacity-10 border border-[#10b981] rounded-lg p-8 text-center">
                  <div className="w-20 h-20 bg-[#10b981] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <FaCheckCircle className="text-[#10b981] text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. We'll respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Department Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    {departments.map((dept) => (
                      <label
                        key={dept.id}
                        className={`cursor-pointer ${dept.bgColor} rounded-lg p-3 text-center border-2 transition-all hover-scale ${
                          formData.department === dept.value
                            ? `${dept.selectedBorder} shadow-md`
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="department"
                          value={dept.value}
                          checked={formData.department === dept.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div
                          className={`text-xl ${dept.textColor} mb-1 flex justify-center`}
                        >
                          {dept.icon}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {dept.name}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline mr-2 text-[#0A2647]" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all hover-scale"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2 text-[#0A2647]" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all hover-scale"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline mr-2 text-[#0A2647]" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all hover-scale"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all hover-scale"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all hover-scale"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2647] focus:border-transparent transition-all hover-scale"
                      placeholder="Please describe your inquiry in detail..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-[#0A2647] text-white py-4 rounded-lg font-semibold hover:bg-[#1B3B5C] transition-all duration-300 flex items-center justify-center space-x-2 hover-scale ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Chat Card */}
            <div className="bg-[#10b981] rounded-2xl shadow-xl p-6 text-white hover-scale">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 animate-bounce">
                  <FaComments className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Live Chat</h3>
                  <p className="text-green-100">Available 24/7</p>
                </div>
              </div>
              <p className="mb-4 text-green-50">
                Chat instantly with our support team for immediate assistance.
              </p>
              <button className="w-full bg-white text-[#10b981] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover-scale">
                Start Live Chat
              </button>
            </div>

            {/* AI Assistant Card */}
            <div className="bg-[#f59e0b] rounded-2xl shadow-xl p-6 text-white hover-scale">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 animate-rotate">
                  <FaRobot className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Assistant</h3>
                  <p className="text-yellow-100">Get instant answers</p>
                </div>
              </div>
              <p className="mb-4 text-yellow-50">
                Use our AI-powered assistant for quick answers to common
                questions.
              </p>
              <button className="w-full bg-white text-[#f59e0b] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover-scale">
                Ask AI Assistant
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link
                  to="/faq"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-[#0A2647] hover:bg-opacity-10 transition-all group hover-scale"
                >
                  <FaQuestionCircle className="text-[#0A2647] mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-[#0A2647]">
                    FAQ & Help Center
                  </span>
                </Link>
                <Link
                  to="/support"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-[#10b981] hover:bg-opacity-10 transition-all group hover-scale"
                >
                  <FaHeadset className="text-[#10b981] mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-[#10b981]">
                    Support Tickets
                  </span>
                </Link>
                <Link
                  to="/feedback"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-[#f59e0b] hover:bg-opacity-10 transition-all group hover-scale"
                >
                  <FaStar className="text-[#f59e0b] mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-[#f59e0b]">
                    Give Feedback
                  </span>
                </Link>
                <Link
                  to="/report"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-[#ef4444] hover:bg-opacity-10 transition-all group hover-scale"
                >
                  <FaShieldAlt className="text-[#ef4444] mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-[#ef4444]">
                    Report Fraud
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
              Find Us Here
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit our headquarters or any of our regional offices
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-200 rounded-2xl h-96 mb-8 relative overflow-hidden hover-scale">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A2647]/20 to-[#10b981]/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkedAlt className="text-6xl text-[#0A2647] mx-auto mb-4 animate-float" />
                <p className="text-gray-700 text-lg">
                  Interactive Map Loading...
                </p>
                <p className="text-gray-500">
                  123 Banking Avenue, Financial District, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Map Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mapFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`${feature.bgColor} rounded-lg p-4 text-center hover:shadow-md transition-all hover-scale`}
              >
                <div
                  className={`text-2xl ${feature.color} mb-2 flex justify-center animate-bounce`}
                >
                  {feature.icon}
                </div>
                <p className="text-xs text-gray-600">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
              Our Global Offices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Serving customers worldwide with local presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className={`${location.lightBg} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div
                  className={`h-2 bg-gradient-to-r ${location.gradient}`}
                ></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${location.gradient} rounded-lg flex items-center justify-center text-white mr-3 animate-float`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {location.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {location.city}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-start">
                    <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <span>{location.address}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <FaPhone className="text-gray-400 mr-2 flex-shrink-0" />
                    <span>{location.phone}</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4 flex items-center">
                    <FaEnvelope className="text-gray-400 mr-2 flex-shrink-0" />
                    <span>{location.email}</span>
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <span>Mgr: {location.manager}</span>
                    <span>{location.employees} staff</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about Smart Bank
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`${faq.bgColor} rounded-xl p-6 hover:shadow-lg transition-all hover-scale`}
              >
                <div className="flex items-start mb-3">
                  <div
                    className={`${faq.color} mr-3 animate-float`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {faq.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{faq.question}</h3>
                </div>
                <p className="text-sm text-gray-600 ml-9">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center text-[#0A2647] hover:text-[#1B3B5C] font-semibold hover-scale"
            >
              View All FAQs
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2647] mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow us on social media for updates and news
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialMedia.map((social, index) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div
                  className={`${social.bgColor} rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center hover-scale`}
                >
                  <div
                    className="mb-2 flex justify-center group-hover:scale-110 transition-transform animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {social.icon}
                  </div>
                  <div className="font-semibold">{social.name}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {social.followers}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact Bar */}
      <div className="bg-gradient-to-r from-[#ef4444] to-[#ef4444] text-white py-4 sticky bottom-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <FaShieldAlt className="text-2xl mr-3 animate-pulse-slow" />
              <span className="font-semibold">24/7 Emergency Support:</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="tel:+15551234567"
                className="flex items-center hover:underline hover-scale"
              >
                <FaPhone className="mr-2" /> +1 (555) 123-4567
              </a>
              <span className="hidden md:inline">|</span>
              <a
                href="mailto:emergency@smartbank.com"
                className="flex items-center hover:underline hover-scale"
              >
                <FaEnvelope className="mr-2" /> emergency@smartbank.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
