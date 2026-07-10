import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaBars,
  FaChevronRight,
  FaHome,
  FaMoneyBillWave,
  FaHeadset,
  FaUniversity,
  FaPiggyBank,
  FaExclamationTriangle,
  FaUserCheck,
  FaTasks,
  FaUserCog,
  FaShieldAlt,
  FaChartBar,
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const userRoleLabel = user?.role
    ? user.role.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Customer";

  const customerLinks = [
    { to: "/dashboard", icon: FaHome, label: "Dashboard" },
    {
      to: "/dashboard/loans/apply",
      icon: FaMoneyBillWave,
      label: "Apply for Loan",
    },
    { to: "/dashboard/loans/status", icon: FaTasks, label: "Loan Status" },
    {
      to: "/dashboard/banking/accounts",
      icon: FaUniversity,
      label: "Accounts",
    },
    {
      to: "/dashboard/banking/transfer",
      icon: FaMoneyBillWave,
      label: "Transfer Funds",
    },
    { to: "/dashboard/banking/transactions", icon: FaChartBar, label: "Transactions" },
    { to: "/dashboard/savings", icon: FaPiggyBank, label: "Savings Tracker" },
    { to: "/dashboard/support", icon: FaHeadset, label: "Support Tickets" },
    {
      to: "/dashboard/fraud/report",
      icon: FaExclamationTriangle,
      label: "Report Fraud",
    },
    { to: "/dashboard/kyc", icon: FaUserCheck, label: "KYC Verification" },
  ];

  const superAdminLinks = [
    { to: "/super-admin", icon: FaHome, label: "Dashboard" },
    { to: "/super-admin/admins", icon: FaUserCog, label: "Admin Management" },
    { to: "/super-admin/system", icon: FaShieldAlt, label: "System Config" },
    { to: "/super-admin/audit", icon: FaTasks, label: "Audit Trail" },
    { to: "/super-admin/security", icon: FaShieldAlt, label: "Security" },
  ];

  const employeeLinks = [
    { to: "/employee", icon: FaHome, label: "Dashboard" },
    { to: "/employee/tasks", icon: FaTasks, label: "Tasks" },
    { to: "/employee/leaves", icon: FaTasks, label: "Leave Requests" },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case "super_admin":
      case "superadmin":
        return superAdminLinks;

      case "employee":
        return employeeLinks;
      default:
        return customerLinks;
    }
  };

  const links = getLinks();

  return (
    <aside className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center justify-between gap-4 lg:w-52 lg:shrink-0">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {userRoleLabel} Menu
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                Banking workspace
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 lg:hidden">
              <FaBars />
            </span>
          </div>

          <nav className="min-w-0 flex-1 overflow-x-auto" aria-label="Dashboard navigation">
            <ul className="flex min-w-max gap-2 pb-1 lg:pb-0">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `group flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'border-[#173d61] bg-[#173d61] text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-[#173d61]'
                      }`
                    }
                    end={
                      link.to === '/dashboard' ||
                      link.to === '/super-admin' ||
                      link.to === '/employee'
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon className="shrink-0 text-sm" />
                        <span className="whitespace-nowrap">{link.label}</span>
                        <FaChevronRight
                          className={`text-[10px] transition ${isActive ? 'opacity-90' : 'opacity-0 group-hover:opacity-60'}`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
