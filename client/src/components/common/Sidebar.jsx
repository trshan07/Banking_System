import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
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
    <>
      <div className="border-b border-gray-200 bg-white md:hidden">
        <nav className="overflow-x-auto px-4 py-3">
          <ul className="flex min-w-max gap-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`
                  }
                  end={
                    link.to === '/dashboard' ||
                    link.to === '/super-admin' ||
                    link.to === '/employee'
                  }
                >
                  <link.icon className="text-sm" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white md:block">
        <nav className="p-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  end={
                    link.to === '/dashboard' ||
                    link.to === '/super-admin' ||
                    link.to === '/employee'
                  }
                >
                  <link.icon className="text-lg" />
                  <span className="text-sm font-medium">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
