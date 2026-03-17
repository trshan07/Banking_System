import React, { useState } from "react";
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

  // Contact Information
  const contactInfo = [
    {
      id: 1,
      title: "Email Us",
      description: "support@smartbank.com",
      subText: "sales@smartbank.com",
      icon: <FaEnvelope className="text-2xl" />,
      bgGradient: "bg-gradient-to-r from-blue-600 to-blue-700",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      action: "mailto:support@smartbank.com",
    },
    {
      id: 2,
      title: "Call Us",
      description: "+1 (555) 123-4567",
      subText: "Toll-free: 1-800-SMART-BANK",
      icon: <FaPhone className="text-2xl" />,
      bgGradient: "bg-gradient-to-r from-green-600 to-green-700",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      action: "tel:+15551234567",
    },
    {
      id: 3,
      title: "Visit Us",
      description: "123 Banking Avenue",
      subText: "Financial District, NY 10001",
      icon: <FaMapMarkerAlt className="text-2xl" />,
      bgGradient: "bg-gradient-to-r from-purple-600 to-purple-700",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      action: "https://maps.google.com/?q=123+Banking+Avenue+NY",
    },
    {
      id: 4,
      title: "Business Hours",
      description: "Mon-Fri: 9:00 AM - 6:00 PM",
      subText: "Sat-Sun: 10:00 AM - 2:00 PM",
      icon: <FaClock className="text-2xl" />,
      bgGradient: "bg-gradient-to-r from-orange-600 to-orange-700",
      lightBg: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
      action: "#",
    },
  ];

  // Support Departments
  const departments = [
    {
      id: 1,
      name: "General",
      value: "general",
      icon: <FaHeadset />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-300",
      selectedBorder: "border-blue-600",
    },
    {
      id: 2,
      name: "Technical",
      value: "technical",
      icon: <FaRocket />,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      borderColor: "border-purple-300",
      selectedBorder: "border-purple-600",
    },
    {
      id: 3,
      name: "Account",
      value: "account",
      icon: <FaUsers />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-green-300",
      selectedBorder: "border-green-600",
    },
    {
      id: 4,
      name: "Loan",
      value: "loan",
      icon: <FaMoneyBillWave />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-300",
      selectedBorder: "border-yellow-600",
    },
    {
      id: 5,
      name: "KYC",
      value: "kyc",
      icon: <FaFileAlt />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-300",
      selectedBorder: "border-indigo-600",
    },
    {
      id: 6,
      name: "Security",
      value: "security",
      icon: <FaShieldAlt />,
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      borderColor: "border-red-300",
      selectedBorder: "border-red-600",
    },
  ];

  // Office Locations
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
      gradient: "from-blue-600 to-indigo-700",
      lightBg: "bg-blue-50",
      badge: "bg-blue-600",
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
      gradient: "from-purple-600 to-pink-600",
      lightBg: "bg-purple-50",
      badge: "bg-purple-600",
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
      gradient: "from-green-600 to-teal-600",
      lightBg: "bg-green-50",
      badge: "bg-green-600",
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
      gradient: "from-orange-600 to-red-600",
      lightBg: "bg-orange-50",
      badge: "bg-orange-600",
    },
  ];

  // FAQ Items
  const faqs = [
    {
      id: 1,
      question: "How do I open an account?",
      answer:
        "You can open an account online through our Digital KYC portal. Simply click on 'Register' and follow the verification process with your documents.",
      icon: <FaQuestionCircle className="text-2xl" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      question: "What documents are needed for KYC?",
      answer:
        "You'll need a valid government ID (Passport/Driver's License), proof of address, and a recent photograph.",
      icon: <FaFileAlt className="text-2xl" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      question: "How long does loan approval take?",
      answer:
        "Loan approval typically takes 24-48 hours after document verification.",
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      question: "Is my money safe with Smart Bank?",
      answer:
        "Yes, we use bank-level 256-bit encryption and two-factor authentication.",
      icon: <FaShieldAlt className="text-2xl" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 5,
      question: "How do I report suspicious activity?",
      answer:
        "You can report fraud directly through your dashboard or contact our security team.",
      icon: <FaHeadset className="text-2xl" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 6,
      question: "What are the transaction limits?",
      answer: "Standard accounts have daily limits of $10,000 for transfers.",
      icon: <FaChartLine className="text-2xl" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  // Social Media Links
  const socialMedia = [
    {
      id: 1,
      name: "Facebook",
      icon: <FaFacebook className="text-3xl" />,
      bgColor: "bg-blue-600",
      link: "#",
      followers: "50K+",
    },
    {
      id: 2,
      name: "Twitter",
      icon: <FaTwitter className="text-3xl" />,
      bgColor: "bg-blue-400",
      link: "#",
      followers: "35K+",
    },
    {
      id: 3,
      name: "LinkedIn",
      icon: <FaLinkedin className="text-3xl" />,
      bgColor: "bg-blue-700",
      link: "#",
      followers: "45K+",
    },
    {
      id: 4,
      name: "Instagram",
      icon: <FaInstagram className="text-3xl" />,
      bgColor: "bg-pink-600",
      link: "#",
      followers: "30K+",
    },
    {
      id: 5,
      name: "YouTube",
      icon: <FaYoutube className="text-3xl" />,
      bgColor: "bg-red-600",
      link: "#",
      followers: "25K+",
    },
    {
      id: 6,
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-3xl" />,
      bgColor: "bg-green-600",
      link: "#",
      followers: "20K+",
    },
  ];

  // Map Features
  const mapFeatures = [
    {
      id: 1,
      icon: <FaBus />,
      label: "Bus Stop (2 min walk)",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      icon: <FaTrain />,
      label: "Metro Station (5 min walk)",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 3,
      icon: <FaParking />,
      label: "Paid Parking",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 4,
      icon: <FaWifi />,
      label: "Free WiFi",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: 5,
      icon: <FaCoffee />,
      label: "Coffee Shop",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 6,
      icon: <FaAccessibleIcon />,
      label: "Wheelchair Accessible",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  // Achievements
  const achievements = [
    {
      id: 1,
      icon: <FaStar className="text-2xl" />,
      count: "4.8/5",
      label: "Customer Rating",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      id: 2,
      icon: <FaThumbsUp className="text-2xl" />,
      count: "98%",
      label: "Satisfaction",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      id: 3,
      icon: <FaAward className="text-2xl" />,
      count: "15+",
      label: "Awards",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: 4,
      icon: <FaTrophy className="text-2xl" />,
      count: "5 Years",
      label: "Excellence",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
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
                  className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
                >
                  <div className={`${item.textColor} mb-2 flex justify-center`}>
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
          {contactInfo.map((info) => (
            <a
              key={info.id}
              href={info.action}
              target={info.action.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`${info.lightBg} rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border ${info.borderColor} group`}
            >
              <div
                className={`w-14 h-14 ${info.bgGradient} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}
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
                className={`mt-4 ${info.textColor} text-sm font-semibold group-hover:underline`}
              >
                Contact Now →
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
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-green-600 text-4xl" />
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
                        className={`cursor-pointer ${dept.bgColor} rounded-lg p-3 text-center border-2 transition-all ${
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
                        <FaUser className="inline mr-2 text-blue-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2 text-blue-600" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline mr-2 text-blue-600" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+9476 9956 938"
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please describe your inquiry in detail..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 ${
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
                        <FaPaperPlane />
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
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
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
              <button className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Start Live Chat
              </button>
            </div>

            {/* AI Assistant Card */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <FaRobot className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Assistant</h3>
                  <p className="text-purple-100">Get instant answers</p>
                </div>
              </div>
              <p className="mb-4 text-purple-50">
                Use our AI-powered assistant for quick answers to common
                questions.
              </p>
              <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Ask AI Assistant
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link
                  to="/faq"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <FaQuestionCircle className="text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-blue-600">
                    FAQ & Help Center
                  </span>
                </Link>
                <Link
                  to="/support"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <FaHeadset className="text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-purple-600">
                    Support Tickets
                  </span>
                </Link>
                <Link
                  to="/feedback"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <FaStar className="text-yellow-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-yellow-600">
                    Give Feedback
                  </span>
                </Link>
                <Link
                  to="/report"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <FaShieldAlt className="text-red-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 group-hover:text-red-600">
                    Report Fraud
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Global Offices
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Serving customers worldwide with local presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`${location.lightBg} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`h-2 bg-gradient-to-r ${location.gradient}`}
                ></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${location.gradient} rounded-lg flex items-center justify-center text-white mr-3`}
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about Smart Bank
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`${faq.bgColor} rounded-xl p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start mb-3">
                  <div className={`${faq.color} mr-3`}>{faq.icon}</div>
                  <h3 className="font-bold text-gray-900">{faq.question}</h3>
                </div>
                <p className="text-sm text-gray-600 ml-9">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8"></div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow us on social media for updates and news
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div
                  className={`${social.bgColor} rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center`}
                >
                  <div className="mb-2 flex justify-center group-hover:scale-110 transition-transform">
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
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 sticky bottom-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <FaShieldAlt className="text-2xl mr-3" />
              <span className="font-semibold">24/7 Emergency Support:</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="tel:+15551234567"
                className="flex items-center hover:underline"
              >
                <FaPhone className="mr-2" /> +1 (555) 123-4567
              </a>
              <span className="hidden md:inline">|</span>
              <a
                href="mailto:emergency@smartbank.com"
                className="flex items-center hover:underline"
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
