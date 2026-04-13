import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaShieldAlt,
  FaTwitter,
} from 'react-icons/fa';

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Register', to: '/auth/register' },
  { label: 'Login', to: '/auth/login' },
];

const productLinks = [
  { label: 'Savings Tracker', to: '/dashboard/savings' },
  { label: 'Loan Application', to: '/dashboard/loans/apply' },
  { label: 'KYC Verification', to: '/dashboard/kyc' },
  { label: 'Support Center', to: '/dashboard/support' },
  { label: 'Report Fraud', to: '/dashboard/fraud/report' },
];

const socialLinks = [
  { label: 'Facebook', href: '#', icon: FaFacebook },
  { label: 'Twitter', href: '#', icon: FaTwitter },
  { label: 'LinkedIn', href: '#', icon: FaLinkedin },
  { label: 'Instagram', href: '#', icon: FaInstagram },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#0f2742] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                <span className="text-sm font-bold text-white">SB</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">Smart Bank</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">
              Secure and modern digital banking built for reliability, compliance, and trusted customer experiences.
            </p>
            <div className="mt-5 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <FaShieldAlt className="mr-2" />
              Bank-grade security
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Navigation</h3>
            <ul className="space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-300 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Platform</h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-300 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-200">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-0.5 shrink-0 text-slate-400" />
                123 Banking Avenue, Financial District, NY 10001
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 shrink-0 text-slate-400" />
                support@smartbank.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 shrink-0 text-slate-400" />
                +1 (555) 123-4567
              </li>
            </ul>

            <div className="mt-5 flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-slate-200 transition hover:bg-white/20 hover:text-white"
                  >
                    <Icon className="text-base" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between border-t border-white/15 pt-6 text-sm text-slate-300 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Smart Bank. All rights reserved.</p>
          <div className="mt-3 flex space-x-5 md:mt-0">
            <Link to="/about" className="transition hover:text-white">Privacy</Link>
            <Link to="/about" className="transition hover:text-white">Terms</Link>
            <Link to="/contact" className="transition hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;