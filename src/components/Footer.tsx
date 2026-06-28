/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Instagram, Linkedin, Mail, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="app-footer" className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <button
              id="footer-logo"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left font-display text-lg font-bold tracking-tight text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                <img src={logoImg} alt="The Market Wala" className="h-full w-full object-cover" />
              </div>
              <span>
                The Market <span className="text-emerald-400">Wala</span>
              </span>
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering individuals with institutional-grade stock market learning. Simplified courses, actionable wisdom, and zero-jargon analysis.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.instagram.com/the_market_wala_?igsh=NjQ2MnIxZmN6bXo1" target="_blank" rel="noopener noreferrer" className="rounded-md bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-emerald-400 transition-all">
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.linkedin.com/in/baban-shingare-1581b1403/" target="_blank" rel="noopener noreferrer" className="rounded-md bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-emerald-400 transition-all">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">Platform</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 hover:underline">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 hover:underline">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 hover:underline">
                  Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blogs')} className="hover:text-emerald-400 hover:underline">
                  Blogs & Market Outlook
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 hover:underline">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">Categories</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 hover:underline">
                  Basics of Finance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 hover:underline">
                  Technical Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 hover:underline">
                  Fundamental Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 hover:underline">
                  Risk Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 hover:underline">
                  Trading Psychology
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">Weekly Market Digest</h3>
            <p className="text-xs text-slate-400">
              Get raw, unfiltered insights and new educational courses delivered directly to your inbox. No spam.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 p-3 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Thank you! You have been subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-lg bg-emerald-500 px-3 text-slate-900 hover:bg-emerald-400"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Disclaimer and copyright */}
        <div className="mt-12 border-t border-slate-800 pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-[10px] text-slate-500 text-left md:max-w-xl leading-relaxed">
            <strong>Disclaimer:</strong> All content, learning courses, blogs, and analyses on The Market Wala are strictly for educational purposes only. They do not constitute financial advice, buy/sell recommendations, or investment advisory services. Investing in the stock market carries high risk. Past performance does not guarantee future returns.
          </p>
          <p className="mt-4 md:mt-0 text-xs text-slate-500 font-medium">
            &copy; 2026 The Market Wala. Made with precision for financial growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
