import React, { useState } from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaHeadset,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhone,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const contactCards = [
  {
    title: "Email",
    primary: "support@smartbank.com",
    secondary: "sales@smartbank.com",
    icon: FaEnvelope,
    action: "mailto:support@smartbank.com",
  },
  {
    title: "Phone",
    primary: "+1 (555) 123-4567",
    secondary: "Toll-free: 1-800-SMART-BANK",
    icon: FaPhone,
    action: "tel:+15551234567",
  },
  {
    title: "Head Office",
    primary: "123 Banking Avenue",
    secondary: "Financial District, NY 10001",
    icon: FaMapMarkerAlt,
    action: "https://maps.google.com/?q=123+Banking+Avenue+NY",
  },
];

const supportAreas = [
  { value: "general", label: "General" },
  { value: "account", label: "Account" },
  { value: "loan", label: "Loan" },
  { value: "kyc", label: "KYC" },
  { value: "security", label: "Security" },
  { value: "technical", label: "Technical" },
];

const quickFaq = [
  {
    question: "How quickly can I get a response?",
    answer: "Most requests receive an initial response within 24 hours.",
  },
  {
    question: "How do I report suspicious activity?",
    answer: "Use the Security department in the form or call the emergency support line.",
  },
  {
    question: "Can I contact loan support directly?",
    answer: "Yes, select Loan in the department field for faster routing.",
  },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "general",
    subject: "",
    message: "",
    priority: "normal",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent successfully. Our team will contact you shortly.");

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          department: "general",
          subject: "",
          message: "",
          priority: "normal",
        });
      }, 2500);
    }, 1300);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&display=swap');

        .contact-shell {
          font-family: 'Source Sans 3', sans-serif;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation: fadeUp 0.7s ease-out both;
        }
      `}</style>

      <div className="contact-shell">
        <section className="relative overflow-hidden bg-[#0f2742] text-white">
          <div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-[#2b6cb0]/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#38a169]/25 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="fade-up max-w-3xl">
              <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                Contact Smart Bank
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Professional Support for Every Banking Need
              </h1>
              <p className="mt-6 text-base leading-relaxed text-slate-200 sm:text-lg">
                Reach our team for account help, loan queries, technical support, or security concerns. We route requests by department for faster and clearer responses.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <a
                    key={card.title}
                    href={card.action}
                    target={card.action.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/15"
                  >
                    <div className="mb-3 inline-flex rounded-lg bg-white/20 p-3 text-white">
                      <Icon className="text-base" />
                    </div>
                    <h2 className="text-lg font-bold text-white">{card.title}</h2>
                    <p className="mt-1 text-sm text-slate-100">{card.primary}</p>
                    <p className="text-xs text-slate-300">{card.secondary}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-6 flex items-center">
                <div className="mr-4 inline-flex rounded-lg bg-[#0f2742] p-3 text-white">
                  <FaPaperPlane className="text-base" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0f2742]">Send a Message</h2>
                  <p className="text-sm text-slate-500">We usually respond within one business day.</p>
                </div>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto mb-3 inline-flex rounded-full bg-emerald-100 p-4 text-emerald-700">
                    <FaCheckCircle className="text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800">Message Sent Successfully</h3>
                  <p className="mt-2 text-sm text-emerald-700">
                    Thanks for contacting us. A support specialist will follow up shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {supportAreas.map((area) => (
                      <label
                        key={area.value}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition ${
                          formData.department === area.value
                            ? "border-[#0f2742] bg-[#0f2742]/5 text-[#0f2742]"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="department"
                          value={area.value}
                          checked={formData.department === area.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {area.label}
                      </label>
                    ))}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        <FaUser className="mr-2 inline text-[#0f2742]" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0f2742] focus:ring-2 focus:ring-[#0f2742]/20"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        <FaEnvelope className="mr-2 inline text-[#0f2742]" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0f2742] focus:ring-2 focus:ring-[#0f2742]/20"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        <FaPhone className="mr-2 inline text-[#0f2742]" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0f2742] focus:ring-2 focus:ring-[#0f2742]/20"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0f2742] focus:ring-2 focus:ring-[#0f2742]/20"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0f2742] focus:ring-2 focus:ring-[#0f2742]/20"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0f2742] focus:ring-2 focus:ring-[#0f2742]/20"
                      placeholder="Please describe your request in detail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex w-full items-center justify-center rounded-xl bg-[#0f2742] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#183b61] ${
                      submitting ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    {!submitting && <FaArrowRight className="ml-2" />}
                  </button>
                </form>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-[#132f4f] p-7 text-white shadow-lg sm:p-8">
                <div className="mb-3 inline-flex rounded-lg bg-white/20 p-3 text-white">
                  <FaHeadset className="text-base" />
                </div>
                <h3 className="text-2xl font-extrabold">Need Immediate Help?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">
                  For urgent account or transaction issues, connect directly with our support desk.
                </p>
                <a
                  href="tel:+15551234567"
                  className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#132f4f] transition hover:bg-slate-100"
                >
                  Call Emergency Line
                </a>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                <h3 className="text-xl font-extrabold text-[#0f2742]">Frequently Asked Questions</h3>
                <div className="mt-4 space-y-4">
                  {quickFaq.map((item) => (
                    <div key={item.question} className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-800">{item.question}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/faq"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-[#0f2742] hover:text-[#183b61]"
                >
                  View full help center
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>

              <div className="rounded-3xl border border-red-200 bg-red-50 p-7 shadow-sm sm:p-8">
                <div className="mb-3 inline-flex rounded-lg bg-red-100 p-3 text-red-700">
                  <FaShieldAlt className="text-base" />
                </div>
                <h3 className="text-lg font-extrabold text-red-800">Report Fraud or Suspicious Activity</h3>
                <p className="mt-2 text-sm text-red-700">
                  If you notice suspicious account behavior, contact our security team immediately.
                </p>
                <a
                  href="mailto:security@smartbank.com"
                  className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  security@smartbank.com
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;
