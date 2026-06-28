/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, Search, BookOpen, Star, Clock, AlertTriangle, 
  HelpCircle, CheckCircle, ChevronDown, MessageSquare, 
  Compass, Shield, User, Filter, Award, Sparkles, BookMarked,
  Calendar, Lock, Video, FolderOpen
} from 'lucide-react';
import { Course, BlogPost, CourseCategory, DifficultyLevel, CoursePurchase, UserProfile, UserRole } from '../types';
import { FAQS } from '../data/initialData';

interface PublicPagesProps {
  currentRoute: string; // 'home' | 'about' | 'courses' | 'blogs' | 'contact'
  selectedSlug: string | null;
  onNavigate: (route: string, slug?: string | null) => void;
  capsules: Course[];
  blogs: BlogPost[];
  bookmarks: string[];
  completedCapsules: string[];
  onToggleBookmark: (id: string) => void;
  onToggleComplete: (id: string) => void;
  purchases: CoursePurchase[];
  currentUser: UserProfile | null;
}

export default function PublicPages({
  currentRoute,
  selectedSlug,
  onNavigate,
  capsules,
  blogs,
  bookmarks,
  completedCapsules,
  onToggleBookmark,
  onToggleComplete,
  purchases,
  currentUser,
}: PublicPagesProps) {
  // Search and Filter States for Capsules catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // FAQ interactive state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Cohort banner config from localStorage (set by admin)
  const siteConfig = JSON.parse(localStorage.getItem('mw_site_config') || '{}');

  // Filtered Capsules for the directory
  const filteredCapsules = capsules.filter(cap => {
    const matchesSearch = cap.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cap.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cap.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || cap.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || cap.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty && cap.isPublished;
  });

  // Render Course Detail View (Slug based simulation)
  if (currentRoute === 'courses' && selectedSlug) {
    const capsule = capsules.find(c => c.slug === selectedSlug);
    if (!capsule) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold font-display text-slate-800">Program Not Found</h2>
          <p className="mt-2 text-slate-500">The training course program you are looking for does not exist or has been archived.</p>
          <button onClick={() => onNavigate('courses', null)} className="mt-6 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white">
            Return to Courses
          </button>
        </div>
      );
    }

    const isBookmarked = bookmarks.includes(capsule.id);
    const isCompleted = completedCapsules.includes(capsule.id);
    const isPurchased = purchases.some(p => p.courseId === capsule.id);
    const isUnlocked = isPurchased || currentUser?.role === UserRole.ADMIN;

    return (
      <div id="capsule-detail-view" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('courses', null)}
          className="group mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">&larr;</span> Back to catalog
        </button>

        {/* Hero Meta Header */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img
            src={capsule.thumbnail}
            alt={capsule.title}
            className="h-64 w-full object-cover sm:h-80"
          />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {capsule.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                capsule.difficulty === DifficultyLevel.BEGINNER ? 'bg-emerald-50 text-emerald-700' :
                capsule.difficulty === DifficultyLevel.INTERMEDIATE ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                {capsule.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {capsule.readingTime} min study
              </span>
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {capsule.title}
            </h1>
            <p className="mt-2 text-slate-600 sm:text-lg">
              {capsule.description}
            </p>

            {/* Interactive bookmark & progress triggers */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
              <button
                id={`btn-bookmark-${capsule.id}`}
                onClick={() => onToggleBookmark(capsule.id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                  isBookmarked
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Star className={`h-4 w-4 ${isBookmarked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Program'}</span>
              </button>

              {isUnlocked && (
                <button
                  id={`btn-complete-${capsule.id}`}
                  onClick={() => onToggleComplete(capsule.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{isCompleted ? 'Completed ✔' : 'Mark as Completed'}</span>
                </button>
              )}

              {!isUnlocked && (
                <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" /> Paid Program • ₹{capsule.price || 1499}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {!isUnlocked ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/20 p-6 sm:p-10 shadow-sm text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm border border-amber-100">
              <Lock className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-display text-lg font-bold text-slate-900">
                This Course Program is Locked
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock full lifetime access to this curriculum, including weekly interactive video lectures with active coaches, task spreadsheets, and resource folders.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 max-w-sm mx-auto space-y-3.5 text-left text-xs shadow-sm">
              <div className="flex justify-between font-bold border-b border-slate-100 pb-2 text-slate-900">
                <span>Program Enrollment Fee</span>
                <span className="text-emerald-600 font-mono">₹{capsule.price || 1499}.00</span>
              </div>
              <ul className="space-y-2 text-slate-500 text-[11px] font-medium">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Weekly interactive lecture time: <strong className="text-slate-700">{capsule.lectureTimes}</strong>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Google Drive folder links to worksheets
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Instant payment invoice & email code receipt
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('buy-course', capsule.slug)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Buy Program & Enroll Now</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
            {/* Live Masterclass & Resources Student Toolkit */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active Enrollment Toolkit
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-semibold">You have active lifetime access to this program</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Live Video Lectures Schedule</h4>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100/50 space-y-1">
                    <p className="font-bold text-emerald-950">{capsule.lectureTimes}</p>
                    <a 
                      href={capsule.liveMeetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-[11px] mt-1"
                    >
                      <Video className="h-3.5 w-3.5" /> Join Live Lecture Meeting
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">Course Documents & Worksheets</h4>
                  <div className="p-3 bg-white rounded-lg border border-emerald-100/50 space-y-1">
                    <p className="font-bold text-emerald-950">Google Drive Repository</p>
                    <a 
                      href={capsule.driveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-[11px] mt-1"
                    >
                      <FolderOpen className="h-3.5 w-3.5" /> Open Google Drive Folder
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <article className="prose prose-slate max-w-none text-slate-700">
              {capsule.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="mt-6 font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h4 key={idx} className="mt-4 font-display text-base font-bold text-slate-800">
                      {paragraph.replace('#### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={idx} className="my-4 border-l-4 border-emerald-500 bg-slate-50 p-4 text-xs italic text-slate-600 rounded-r-lg">
                      {paragraph.replace('> ', '')}
                    </blockquote>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={idx} className="list-disc pl-5 my-2 space-y-1 text-sm">
                      {paragraph.split('\n').map((item, itemIdx) => (
                        <li key={itemIdx}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.includes('1. ')) {
                  return (
                    <ol key={idx} className="list-decimal pl-5 my-2 space-y-1 text-sm">
                      {paragraph.split('\n').map((item, itemIdx) => (
                        <li key={itemIdx}>{item.replace(/^\d+\.\s+/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={idx} className="my-4 text-sm leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </article>

            {/* Educational Disclaimer */}
            <div className="mt-10 flex gap-3 rounded-xl bg-slate-50 border border-slate-200/60 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="text-xs text-slate-500 leading-relaxed">
                <strong>Risk Warning:</strong> The concepts taught above are for study analysis purposes. Practice utilizing risk management filters such as stop-losses to protect active capital. Never trade with capital you cannot afford to lose.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Blog Detail View (Slug based simulation)
  if (currentRoute === 'blogs' && selectedSlug) {
    const blog = blogs.find(b => b.slug === selectedSlug);
    if (!blog) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold font-display text-slate-800">Article Not Found</h2>
          <button onClick={() => onNavigate('blogs', null)} className="mt-6 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-white">
            Return to Blogs
          </button>
        </div>
      );
    }

    return (
      <div id="blog-detail-view" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('blogs', null)}
          className="group mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
        >
          <span>&larr;</span> Back to articles
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img src={blog.featuredImage} alt={blog.title} className="h-64 w-full object-cover sm:h-96" />
          <div className="p-6 sm:p-10">
            <span className="text-xs font-mono text-slate-400">
              Published on {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {blog.title}
            </h1>
            <div className="mt-6 border-t border-slate-100 pt-6 prose prose-slate text-slate-700">
              {blog.content.split('\n\n').map((para, idx) => {
                if (para.startsWith('### ')) {
                  return <h3 key={idx} className="mt-6 font-display text-lg font-bold text-slate-900">{para.replace('### ', '')}</h3>;
                }
                if (para.startsWith('#### ')) {
                  return <h4 key={idx} className="mt-4 font-display text-base font-semibold text-slate-800">{para.replace('#### ', '')}</h4>;
                }
                if (para.includes('1. ')) {
                  return (
                    <ol key={idx} className="list-decimal pl-5 my-2 text-sm space-y-1">
                      {para.split('\n').map((item, id) => <li key={id}>{item.replace(/^\d+\.\s+/, '')}</li>)}
                    </ol>
                  );
                }
                return <p key={idx} className="my-4 text-sm leading-relaxed">{para}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING INDIVIDUAL PAGES ---

  // 1. HOME PAGE
  if (currentRoute === 'home') {
    return (
      <div id="public-home-page" className="space-y-20 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950" />
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>The Ultimate Financial Learning Engine</span>
                </div>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                  Democratizing the <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Stock Market
                  </span>
                </h1>
                <p className="max-w-md text-base text-slate-300 leading-relaxed sm:text-lg">
                  Learn technical chart patterns, fundamental values, and risk preservation techniques through modular, zero-jargon training courses.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://chat.whatsapp.com/IWEwUE35YHY68vpcX8LlfZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#20ba5a] transition-all hover:translate-y-[-1px]"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.183-3.666c1.644.976 3.25 1.488 4.793 1.489 5.483 0 9.943-4.437 9.947-9.895.002-2.644-1.024-5.129-2.889-7.001C16.141 3.05 13.658 2.016 11.023 2.016 5.548 2.016 1.09 6.452 1.087 11.91c-.001 1.748.47 3.447 1.365 4.952L1.444 20.93l4.24-1.111c.148.081.299.155.456.215z" />
                    </svg>
                    <span>Join WhatsApp Community</span>
                  </a>
                  <button
                    onClick={() => onNavigate('about')}
                    className="rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
                  >
                    Our Mission
                  </button>
                </div>
              </div>

              {/* Floating Dashboard Preview Card */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-mono text-xs text-slate-400">MARKET COHORT MASTERCLASS</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Live Q&A Included
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">{siteConfig.sessionLabel || 'Cohort Study Session'}</span>
                        <Calendar className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="mt-2 text-sm font-bold text-white">{siteConfig.masterclassTitle || 'Interactive Live Masterclass'}</div>
                      <p className="text-[10px] text-slate-400 mt-1">{siteConfig.sessionTime || 'Saturdays & Sundays @ 5:00 PM IST'}</p>
          </div>
        </div>
            </div>
          </div>
          </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Designed For High-Performance Learning
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Skip the dry textbooks and boring seminars. Master trading and long-term asset building through modern methodology.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">1. Structured Courses</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Short, hyper-focused, bite-sized lessons targeting individual concepts like order types, wicks, ratios, or psychology.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">2. Real Market Outlooks</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Stay updated with premium blogs breaking down active macroeconomic events, interest rates, rotation, and index movements.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">3. Progress Syncing</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Create a free account to track your completed lessons, score XP points, and curate your personalized trading index database.
              </p>
            </div>
          </div>
        </section>

        {/* CAPSULES PREVIEW SECTION */}
        <section className="bg-slate-50 border-y border-slate-200/60 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                  Featured Courses
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Start with our most-recommended entry modules. No finance degree required.
                </p>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <span>View all courses ({capsules.length})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capsules.slice(0, 3).map((cap) => (
                <div
                  key={cap.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <img src={cap.thumbnail} alt={cap.title} className="h-48 w-full object-cover" />
                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {cap.category}
                      </span>
                      <h3 className="mt-1 font-display text-base font-bold text-slate-900 hover:text-emerald-600">
                        <button onClick={() => onNavigate('courses', cap.slug)} className="text-left hover:underline">
                          {cap.title}
                        </button>
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {cap.readingTime} min read
                    </span>
                    <button
                      onClick={() => onNavigate('courses', cap.slug)}
                      className="text-xs font-semibold text-slate-800 hover:text-emerald-600 flex items-center gap-0.5"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST BLOGS SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              The Market Blueprint Blog
            </h2>
            <p className="mx-auto mt-2 text-sm text-slate-500 max-w-lg">
              Macro analysis, industry breakdowns, and mathematical trading systems explained with utmost clarity.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row"
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="h-48 w-full object-cover md:h-auto md:w-48"
                />
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 hover:text-emerald-600">
                      <button onClick={() => onNavigate('blogs', blog.slug)} className="text-left hover:underline">
                        {blog.title}
                      </button>
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-3">
                      {blog.seoDescription}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('blogs', blog.slug)}
                    className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* FAQ SECTION */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Clear, straightforward answers about our platform and learning system.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-display text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-5 text-xs text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // 2. ABOUT PAGE
  if (currentRoute === 'about') {
    return (
      <div id="public-about-page" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Our Mission: Simplifying Stock Market Wisdom
          </h1>
          <p className="mx-auto max-w-2xl text-slate-500 leading-relaxed text-sm sm:text-base">
            The Market Wala was founded to bridge the massive gap between institutional trading groups and retail investors. We teach trading as a disciplined, rule-based business, not as a gambling playground.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Why We Started</h2>
            <p className="text-slate-600 leading-relaxed text-sm mb-4">
              Millions of retail accounts are created every month, yet over 90% lose money in their first year. The core reason isn't complex formulas—it is a lack of structured, foundational logic, risk guidelines, and psychological coaching.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              We replace noise with modular "learning courses" that are easy to understand, beautiful to read, and fully interactive. Our platform helps you take control of your financial destiny using logic, stats, and discipline.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-2">
            <img 
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80" 
              alt="Trading desk illustration" 
              className="rounded-xl h-64 w-full object-cover" 
            />
          </div>
        </div>

        {/* Pillars / Values */}
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 text-center mb-8">Our Core Principles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <span className="text-2xl">🌱</span>
              <h3 className="font-display text-sm font-bold text-slate-900 mt-2">100% Unbiased</h3>
              <p className="text-xs text-slate-500 mt-2">
                We sell no alerts, signal indicators, or brokerage integrations. Our revenue models do not depend on transaction volumes, ensuring absolute objectivity.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <span className="text-2xl">⚡</span>
              <h3 className="font-display text-sm font-bold text-slate-900 mt-2">Actionable Structure</h3>
              <p className="text-xs text-slate-500 mt-2">
                Every course concludes with concrete trade checklists, position sizing calculators, or psychological journaling exercises.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
              <span className="text-2xl">🧠</span>
              <h3 className="font-display text-sm font-bold text-slate-900 mt-2">Psychology Centric</h3>
              <p className="text-xs text-slate-500 mt-2">
                We believe trading is 20% system, 20% risk management, and 60% psychology. Our lessons prioritize mindset over hype.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. COURSES DIRECTORY
  if (currentRoute === 'courses') {
    return (
      <div id="public-capsules-page" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Pro Training Courses
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Unlock premium training programs with weekly live coordinate meetings, Google Drive worksheets, and active support.
          </p>
        </div>

        {/* Filters and Search toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by course title, tags, indicators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                {Object.values(CourseCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500"
            >
              <option value="all">All Difficulties</option>
              {Object.values(DifficultyLevel).map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog grid */}
        {filteredCapsules.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <BookMarked className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-sm font-bold font-display text-slate-700">No courses found</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or searching for keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCapsules.map((cap) => {
              const isSaved = bookmarks.includes(cap.id);
              const isComp = completedCapsules.includes(cap.id);
              const isPurchased = purchases.some(p => p.courseId === cap.id);
              const isUnlocked = isPurchased || currentUser?.role === UserRole.ADMIN;

              return (
                <div
                  key={cap.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative">
                      <img src={cap.thumbnail} alt={cap.title} className="h-48 w-full object-cover" />
                      <div className="absolute right-3 top-3 flex gap-1.5">
                        {isUnlocked && (
                          <span className="rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-bold shadow-sm flex items-center gap-1" title="Enrolled">
                            <CheckCircle className="h-3 w-3" /> Enrolled
                          </span>
                        )}
                        {isSaved && (
                          <span className="rounded-full bg-slate-900/90 text-amber-400 p-1 text-[10px] shadow-sm" title="Saved">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          {cap.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cap.difficulty === DifficultyLevel.BEGINNER ? 'bg-emerald-50 text-emerald-700' :
                          cap.difficulty === DifficultyLevel.INTERMEDIATE ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {cap.difficulty}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        <button onClick={() => onNavigate('courses', cap.slug)} className="text-left hover:underline">
                          {cap.title}
                        </button>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {cap.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 text-[10px] border-t border-slate-100/60 mt-2 text-slate-500">
                        <span>Cohort Slot:</span>
                        <span className="font-semibold text-slate-800">{cap.lectureTimes}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {cap.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-slate-50 text-slate-400 border border-slate-200/40 px-2 py-0.5 rounded-md font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 p-5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      {isUnlocked ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[10px]">
                          <CheckCircle className="h-3.5 w-3.5" /> Study Access
                        </span>
                      ) : (
                        <span className="text-slate-900 font-mono text-[13px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                          ₹{cap.price}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => onNavigate('courses', cap.slug)}
                      className={`text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                        isUnlocked
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/10 hover:bg-emerald-400'
                      }`}
                    >
                      <span>{isUnlocked ? 'Access Classroom' : 'Buy Program'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 4. BLOGS DIRECTORY
  if (currentRoute === 'blogs') {
    return (
      <div id="public-blogs-page" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Market Blueprint Blog
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Timely market trends, technical summaries, and updates straight from our core analysts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row hover:border-slate-300 transition-all"
            >
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="h-48 w-full object-cover sm:h-auto sm:w-48"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">
                    Published {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 hover:text-emerald-600">
                    <button onClick={() => onNavigate('blogs', blog.slug)} className="text-left hover:underline">
                      {blog.title}
                    </button>
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-3">
                    {blog.seoDescription}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('blogs', blog.slug)}
                  className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-600"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. CONTACT PAGE
  if (currentRoute === 'contact') {
    return (
      <div id="public-contact-page" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Info Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                Get In Touch
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Need clarification on any of our learning pathways? Or have feature recommendations for our platform simulator? Drop us a line.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct Support Email</h4>
                  <p className="text-xs text-slate-500">support@marketwala.com</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Compass className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Primary Office Location</h4>
                  <p className="text-xs text-slate-500">12th Floor, Trade Center Building, Bandra Kurla Complex (BKC), Mumbai, MH, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-display text-base font-bold text-slate-900">Connect With Us</h3>
              <p className="text-xs text-slate-500">Follow us on social media or reach out directly.</p>
            </div>

            <a
              href="https://www.instagram.com/the_market_wala_?igsh=NjQ2MnIxZmN6bXo1"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Instagram</h4>
                <p className="text-xs text-slate-500">Follow for daily market insights</p>
              </div>
              <span className="ml-auto text-xs text-emerald-600 font-semibold">@the_market_wala_</span>
            </a>

            <a
              href="https://www.linkedin.com/in/baban-shingare-1581b1403/"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">LinkedIn</h4>
                <p className="text-xs text-slate-500">Connect for professional updates</p>
              </div>
              <span className="ml-auto text-xs text-emerald-600 font-semibold">Baban Shingare</span>
            </a>

            <a
              href="https://wa.me/919999999999"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">WhatsApp</h4>
                <p className="text-xs text-slate-500">Quick chat with our team</p>
              </div>
              <span className="ml-auto text-xs text-emerald-600 font-semibold">+91 99999 99999</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
