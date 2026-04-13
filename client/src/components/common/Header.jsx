import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import {
  FaBars,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from 'react-icons/fa';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';

    switch (user.role) {
      case 'super_admin':
        return '/super-admin';
      case 'admin':
        return '/admin';
      case 'employee':
        return '/employee';
      default:
        return '/dashboard';
    }
  };

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  if (isAuthenticated) {
    navItems.push({ label: 'Dashboard', to: getDashboardLink() });
  }

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-[#0f2742] text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f2742]'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2742] text-sm font-bold text-white shadow-sm">
              SB
            </div>
            <div>
              <p className="text-base font-extrabold leading-tight text-slate-900">Smart Bank</p>
              <p className="text-xs font-medium tracking-wide text-slate-500">Digital Banking Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotificationsOpen((prev) => !prev);
                      if (!isNotificationsOpen) markAllAsRead();
                    }}
                    className="relative rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-[#0f2742]"
                    aria-label="Notifications"
                  >
                    <FaBell className="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      <div className="border-b border-slate-200 px-4 py-2">
                        <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="py-5 text-center text-sm text-slate-500">No notifications</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`cursor-pointer px-4 py-3 transition hover:bg-slate-50 ${
                                !notif.read ? 'bg-slate-50' : ''
                              }`}
                            >
                              <p className="text-sm text-slate-800">{notif.message}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {new Date(notif.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2742]/10 text-sm font-semibold text-[#0f2742]">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      <div className="border-b border-slate-200 px-4 py-2">
                        <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaUser className="mr-2 inline" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaCog className="mr-2 inline" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-slate-50"
                      >
                        <FaSignOutAlt className="mr-2 inline" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0f2742]"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-lg bg-[#0f2742] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#183b61]"
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navClass}
                  end={item.to === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {!isAuthenticated && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg bg-[#0f2742] px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
