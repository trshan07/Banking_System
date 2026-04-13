import React from "react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaHeadset,
  FaLock,
  FaMoneyCheckAlt,
  FaShieldAlt,
  FaUniversity,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const corePillars = [
  {
    title: "Unified Banking Operations",
    description:
      "Manage accounts, transfers, statements, and service workflows in one consistent platform.",
    icon: FaUniversity,
  },
  {
    title: "Fast Digital Lending",
    description:
      "Reduce approval cycles with structured loan journeys, document checks, and transparent case tracking.",
    icon: FaMoneyCheckAlt,
  },
  {
    title: "Intelligent Risk Controls",
    description:
      "Use automated fraud signals, alerts, and secure access policies to protect customer trust.",
    icon: FaShieldAlt,
  },
  {
    title: "Actionable Financial Insights",
    description:
      "Monitor growth, savings goals, and customer behavior with easy-to-read analytics.",
    icon: FaChartLine,
  },
];

const trustItems = [
  "99.9% service uptime with stable transaction processing",
  "Role-based permissions across customer and employee journeys",
  "End-to-end encrypted sessions and protected data flow",
  "24/7 support escalation for high-priority service requests",
];

const highlights = [
  { label: "Customers", value: "50K+" },
  { label: "Monthly Transactions", value: "1.2M+" },
  { label: "Average Loan Turnaround", value: "< 24h" },
  { label: "Support Availability", value: "24/7" },
];

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap');

        .home-shell {
          font-family: 'Public Sans', sans-serif;
        }

        .paper-grid {
          background-image:
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rise-in {
          animation: riseIn 0.7s ease-out both;
        }
      `}</style>

      <div className="home-shell paper-grid">
        <section className="relative overflow-hidden border-b border-[#d8d2c8] bg-[#1f3a5f] text-white">
          <div className="absolute -top-24 -right-20 h-96 w-96 rounded-full bg-[#f0b86a]/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#7fb0d9]/25 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="rise-in">
                <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f8f1e4]">
                  Smart Bank Platform
                </p>

                <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                  A Different Banking Experience, Built for Clarity.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                  Designed for real banking operations with readable workflows, faster decisions,
                  and dependable controls across onboarding, lending, and support.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-xl bg-[#f0b86a] px-6 py-3 text-sm font-bold text-[#1f3a5f] transition hover:bg-[#f4c480]"
                  >
                    Open an Account
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>

              <aside className="rise-in rounded-3xl border border-white/20 bg-white/95 p-6 text-slate-900 shadow-2xl sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f3a5f]">
                  Performance Snapshot
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {highlights.map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-lg font-extrabold text-[#1f3a5f]">{item.value}</p>
                      <p className="mt-1 text-xs text-slate-600">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-slate-900 p-4 text-slate-200">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Security Index</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-[96%] rounded-full bg-emerald-400" />
                  </div>
                  <p className="mt-2 text-sm">96% automated risk-pattern identification.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#d8d2c8] bg-white p-7 shadow-sm sm:p-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9c5f2c]">
                  Core Solutions
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#1f3a5f]">
                  Readable, role-focused workflows
                </h2>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center text-sm font-bold text-[#1f3a5f] hover:text-[#9c5f2c]"
              >
                Talk to our team
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {corePillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className="rounded-2xl border border-slate-200 bg-[#f9f7f3] p-5 transition hover:border-[#7fb0d9]/60 hover:bg-white"
                  >
                    <div className="mb-3 inline-flex rounded-lg bg-[#1f3a5f] p-3 text-white">
                      <Icon className="text-base" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1f3a5f]">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-3xl border border-[#d8d2c8] bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-4 inline-flex rounded-xl bg-[#1f3a5f] p-3 text-white">
              <FaLock className="text-lg" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1f3a5f]">Compliance-First Architecture</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              Every workflow is built with audit visibility, controlled permissions, and secure operations to match the standards expected in modern banking.
            </p>

            <ul className="mt-6 space-y-3">
              {trustItems.map((item) => (
                <li key={item} className="flex items-start text-sm text-slate-700">
                  <FaCheckCircle className="mr-3 mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-[#9c5f2c] p-8 text-white shadow-lg sm:p-10">
            <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 text-white">
              <FaHeadset className="text-lg" />
            </div>
            <h3 className="text-3xl font-extrabold">Start with Confidence</h3>
            <p className="mt-4 text-sm leading-relaxed text-orange-100 sm:text-base">
              Launch quickly with account onboarding, then expand into digital lending, fraud control, and support operations without adding workflow complexity.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#9c5f2c] transition hover:bg-orange-50"
              >
                Create Account
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Request Demo
              </Link>
            </div>

            <div className="mt-7 rounded-xl border border-white/30 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-orange-100">Support Promise</p>
              <p className="mt-2 text-sm text-white">
                Dedicated service specialists for onboarding, migration, and day-to-day operational guidance.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
