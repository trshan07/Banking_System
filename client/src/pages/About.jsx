import React from "react";
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaHeadset,
  FaLock,
  FaMoneyBillWave,
  FaShieldAlt,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const metrics = [
  { label: "Active Customers", value: "50K+" },
  { label: "Monthly Transactions", value: "1.2M+" },
  { label: "Uptime", value: "99.9%" },
  { label: "Support", value: "24/7" },
];

const values = [
  {
    title: "Security",
    description:
      "Every feature is built with strong access controls, encryption, and fraud-aware workflows.",
    icon: FaShieldAlt,
  },
  {
    title: "Transparency",
    description:
      "Customers and teams get clear status updates, traceable actions, and readable decision paths.",
    icon: FaCheckCircle,
  },
  {
    title: "Reliability",
    description:
      "The platform supports mission-critical banking operations with high availability and stable performance.",
    icon: FaLock,
  },
  {
    title: "Customer Focus",
    description:
      "From onboarding to service support, each journey is designed to reduce effort and increase trust.",
    icon: FaHeadset,
  },
];

const capabilities = [
  {
    title: "Digital Banking Core",
    detail: "Accounts, transfers, statements, and daily banking workflows in one system.",
    icon: FaUniversity,
  },
  {
    title: "Lending and KYC",
    detail: "Structured loan flows with digital document checks and approval visibility.",
    icon: FaMoneyBillWave,
  },
  {
    title: "Fraud and Risk Controls",
    detail: "Automated alerts and monitoring tools for proactive risk response.",
    icon: FaChartLine,
  },
  {
    title: "Customer Operations",
    detail: "Ticketing and service support designed for response speed and continuity.",
    icon: FaUsers,
  },
];

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&display=swap');

        .about-shell {
          font-family: 'Source Sans 3', sans-serif;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
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

      <div className="about-shell">
        <section className="relative overflow-hidden bg-[#0f2742] text-white">
          <div className="absolute -top-28 -right-16 h-80 w-80 rounded-full bg-[#2b6cb0]/35 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#38a169]/25 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="fade-up">
                <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                  About Smart Bank
                </p>
                <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                  Professional Digital Banking Built for Modern Institutions
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                  Smart Bank is a secure, modular platform that helps financial teams deliver dependable customer experiences across onboarding, lending, support, and risk operations.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0f2742] transition hover:bg-slate-100"
                  >
                    Get Started
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Contact Team
                  </Link>
                </div>
              </div>

              <aside className="fade-up rounded-3xl border border-white/20 bg-white/95 p-7 text-slate-900 shadow-2xl sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f2742]">
                  Platform Highlights
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {metrics.map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xl font-extrabold text-[#0f2742]">{item.value}</p>
                      <p className="text-xs text-slate-600">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-slate-900 p-4 text-slate-200">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Risk Monitoring</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-[95%] rounded-full bg-emerald-400" />
                  </div>
                  <p className="mt-2 text-sm">95% of suspicious patterns flagged before manual review.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-3xl font-extrabold text-[#0f2742]">Our Mission</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                To deliver a secure and user-friendly banking platform that improves operational efficiency while keeping trust, compliance, and customer outcomes at the center.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-3xl font-extrabold text-[#0f2742]">Our Vision</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                To set a new standard for digital banking by making complex banking workflows more transparent, reliable, and accessible for every user role.
              </p>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2b6cb0]">Core Capabilities</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#0f2742]">How Smart Bank Delivers Value</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <article
                    key={capability.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#2b6cb0]/40 hover:bg-white"
                  >
                    <div className="mb-3 inline-flex rounded-lg bg-[#0f2742] p-3 text-white">
                      <Icon className="text-base" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0f2742]">{capability.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{capability.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#132f4f] p-8 text-white shadow-lg sm:p-10">
            <h2 className="text-3xl font-extrabold">Our Values in Practice</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
              These principles guide decisions across product design, security engineering, and daily customer service operations.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <article
                    key={value.title}
                    className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
                  >
                    <div className="mb-3 inline-flex rounded-lg bg-white/20 p-3 text-white">
                      <Icon className="text-base" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2b6cb0]">Next Step</p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#0f2742]">Partner with a Banking Platform Built for Trust</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Whether you are scaling digital onboarding, improving loan operations, or strengthening risk controls, Smart Bank provides the structure and reliability needed for long-term growth.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0f2742] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#183b61]"
                >
                  Create Account
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;
