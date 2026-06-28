/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, LogOut, LayoutDashboard, Shield, User, Menu, X, Key } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import logoImg from '../assets/logo.jpg';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  currentUser: UserProfile | null;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}

export default function Navbar({
  currentRoute,
  onNavigate,
  currentUser,
  onRoleChange,
  onLogout,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'About', route: 'about' },
    { label: 'Courses', route: 'courses' },
    { label: 'Blogs', route: 'blogs' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-slate-900 hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-sm overflow-hidden border border-slate-200">
              <img src={logoImg} alt="The Market Wala" className="h-full w-full object-cover" />
            </div>
            <span>
              The Market <span className="text-emerald-500">Wala</span>
            </span>
          </button>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.route}
                id={`nav-link-${link.route}`}
                onClick={() => handleLinkClick(link.route)}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  currentRoute === link.route ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions: Role Swapper, Auth buttons */}
          <div className="hidden md:flex items-center gap-4">


            {/* Dashboard and Login CTAs */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-go-to-dashboard"
                  onClick={() => handleLinkClick(currentUser.role === UserRole.ADMIN ? 'admin' : 'dashboard')}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </button>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-login"
                  onClick={() => handleLinkClick('login')}
                  className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  Sign In
                </button>
                <button
                  id="btn-nav-register"
                  onClick={() => handleLinkClick('register')}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 transition-all"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="btn-mobile-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>



      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleLinkClick(link.route)}
              className={`block w-full text-left rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-50 ${
                currentRoute === link.route ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <hr className="border-slate-100" />
          {currentUser ? (
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleLinkClick(currentUser.role === UserRole.ADMIN ? 'admin' : 'dashboard')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleLinkClick('login')}
                className="rounded-lg border border-slate-200 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </button>
              <button
                onClick={() => handleLinkClick('register')}
                className="rounded-lg bg-emerald-500 py-2 text-center text-xs font-semibold text-white hover:bg-emerald-600"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
