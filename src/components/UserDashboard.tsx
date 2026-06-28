/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Star, CheckCircle, Award, Clock, ArrowRight, User, 
  Settings, Key, Save, Play, ChevronRight, HelpCircle, Activity,
  Lock, RefreshCw, Eye, EyeOff, Check, AlertCircle, CheckCircle2,
  Mail
} from 'lucide-react';
import { UserProfile, Course, DifficultyLevel, CourseCategory, CoursePurchase, ReceivedEmail } from '../types';

interface UserDashboardProps {
  subRoute: string; // 'overview' | 'learning' | 'bookmarks' | 'profile' | 'settings'
  onNavigateSub: (sub: string) => void;
  currentUser: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  capsules: Course[];
  bookmarks: string[];
  completedCapsules: string[];
  onToggleBookmark: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onNavigateToCapsule: (slug: string) => void;
  purchases: CoursePurchase[];
  receivedEmails: ReceivedEmail[];
}

export default function UserDashboard({
  subRoute,
  onNavigateSub,
  currentUser,
  onUpdateProfile,
  capsules,
  bookmarks,
  completedCapsules,
  onToggleBookmark,
  onToggleComplete,
  onNavigateToCapsule,
  purchases,
  receivedEmails,
}: UserDashboardProps) {
  // Local profile form states
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileExp, setProfileExp] = useState<DifficultyLevel>(currentUser?.experienceLevel || DifficultyLevel.BEGINNER);
  const [profileInterests, setProfileInterests] = useState<CourseCategory[]>(currentUser?.interests || []);
  const [profileSaved, setProfileSaved] = useState(false);

  // Mini stock market quiz state for interactive learning
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResetTrigger, setQuizResetTrigger] = useState(false);

  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  // Settings states
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const quizQuestions = [
    {
      question: "What does the 2% rule dictate regarding capital risk?",
      options: [
        "Invest 2% of your cash in every single stock purchase.",
        "Ensure your maximum loss on a single trade is capped at 2% of total account value.",
        "Your broker takes a 2% fee on standard transactions.",
        "Stock prices drop 2% on average before bouncing back."
      ],
      correctIndex: 1,
      explanation: "The 2% Rule caps your absolute downside at 2% of total capital on any single trade using protective stop-losses."
    },
    {
      question: "Which of the following is an indicator of a bullish hammer candlestick pattern?",
      options: [
        "A long lower shadow/wick at least twice the size of the body.",
        "A large body with no shadows/wicks on either side.",
        "A long upper wick with a small lower body.",
        "A candlestick with identical opening and closing prices."
      ],
      correctIndex: 0,
      explanation: "A long lower wick signifies that sellers drove prices low, but strong buyers entered the market to force a close near the highs."
    },
    {
      question: "If a Support level is broken downward by the price, it historically turns into what?",
      options: [
        "A dynamic exponential moving average line.",
        "An active Resistance ceiling level.",
        "A stock split announcement.",
        "A volume gap order limit."
      ],
      correctIndex: 1,
      explanation: "The Role Reversal principle dictates that broken support frequently becomes active resistance when prices try to rally back."
    }
  ];

  // Calculated Stats
  const totalCapsulesCount = capsules.length;
  const completedCount = completedCapsules.length;
  const progressPercent = totalCapsulesCount > 0 ? Math.round((completedCount / totalCapsulesCount) * 100) : 0;
  const savedCount = bookmarks.length;

  const handleInterestToggle = (category: CourseCategory) => {
    if (profileInterests.includes(category)) {
      setProfileInterests(profileInterests.filter(i => i !== category));
    } else {
      setProfileInterests([...profileInterests, category]);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profileName,
      experienceLevel: profileExp,
      interests: profileInterests,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null || quizSubmitted) return;
    if (selectedAnswer === quizQuestions[currentQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizResetTrigger(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizResetTrigger(false);
  };

  const handleGenerateApiKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      setApiKey(`mw_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`);
      setIsGeneratingKey(false);
    }, 1000);
  };

  // Nav helper
  const sidebarLinks = [
    { label: 'Overview', sub: 'overview', icon: Award },
    { label: 'Learning Progress', sub: 'learning', icon: BookOpen },
    { label: 'Saved Bookmarks', sub: 'bookmarks', icon: Star },
    { label: 'My Study Profile', sub: 'profile', icon: User },
    { label: 'Account Settings', sub: 'settings', icon: Settings },
  ];

  return (
    <div id="user-dashboard-root" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
              {(currentUser?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <h3 className="mt-3 font-display text-sm font-bold text-slate-900">{currentUser?.name || 'Sanket Shinde'}</h3>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 font-semibold uppercase">
              STUDENT PROFILE
            </span>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Programs</span>
                <span className="font-mono font-bold text-slate-800">{purchases.filter(p => p.userId === currentUser?.id).length} Enrolled</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Status</span>
                <span className="font-mono font-bold text-slate-800 text-[10px]">
                  {purchases.filter(p => p.userId === currentUser?.id).length > 0 ? 'Premium Member' : 'Free Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav link block */}
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = subRoute === link.sub;
              return (
                <button
                  key={link.sub}
                  id={`dashboard-sidebar-${link.sub}`}
                  onClick={() => onNavigateSub(link.sub)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN WORKSPACE RENDER */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* 1. OVERVIEW PAGE */}
          {subRoute === 'overview' && (
            <div id="dashboard-overview" className="space-y-6">
              {/* Stats Card Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
                    <BookOpen className="h-5 w-5 text-slate-500" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Courses</span>
                  <span className="font-mono text-2xl font-bold text-slate-800">{totalCapsulesCount} Available</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Lessons</span>
                  <span className="font-mono text-2xl font-bold text-slate-800">{completedCount} / {totalCapsulesCount}</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
                    <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved Bookmarks</span>
                  <span className="font-mono text-2xl font-bold text-slate-800">{savedCount} Courses</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/50">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Learning Progress</span>
                  <span className="font-mono text-2xl font-bold text-indigo-700">{progressPercent}% Done</span>
                </div>
              </div>

              {/* Vector Mock Chart of Study Habits & Quiz */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      <span>Weekly Learning Minutes</span>
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400">Past 5 Weeks</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="relative h-44 w-full">
                    <svg className="h-full w-full" viewBox="0 0 400 150">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="75" x2="400" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area Under Curve */}
                      <path
                        d="M 20,130 Q 100,60 180,80 T 340,30 L 380,10 L 380,140 L 20,140 Z"
                        fill="url(#chart-grad)"
                        opacity="0.15"
                      />

                      {/* Line Path */}
                      <path
                        d="M 20,130 Q 100,60 180,80 T 340,30 L 380,10"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data Points */}
                      <circle cx="20" cy="130" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                      <circle cx="110" cy="72" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                      <circle cx="200" cy="81" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                      <circle cx="290" cy="45" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                      <circle cx="380" cy="10" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />

                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Floating Labels */}
                    <div className="absolute bottom-1 left-2 text-[8px] font-mono font-bold text-slate-400">Wk 1 (10m)</div>
                    <div className="absolute bottom-1 left-[25%] text-[8px] font-mono font-bold text-slate-400">Wk 2 (35m)</div>
                    <div className="absolute bottom-1 left-[50%] text-[8px] font-mono font-bold text-slate-400">Wk 3 (25m)</div>
                    <div className="absolute bottom-1 left-[73%] text-[8px] font-mono font-bold text-slate-400">Wk 4 (45m)</div>
                    <div className="absolute bottom-1 right-2 text-[8px] font-mono font-bold text-slate-400">Wk 5 (60m)</div>
                  </div>
                </div>

                {/* Interactive Quiz Module */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <HelpCircle className="h-4 w-4 text-emerald-500" />
                    <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">Market Trivia</h3>
                  </div>

                  {quizResetTrigger ? (
                    <div className="text-center py-6 space-y-3">
                      <Award className="mx-auto h-12 w-12 text-emerald-500" />
                      <h4 className="text-sm font-bold text-slate-800">Quiz Completed!</h4>
                      <p className="text-[11px] text-slate-500">
                        You scored <strong>{quizScore} out of {quizQuestions.length}</strong> points. Keep studying to score perfect.
                      </p>
                      <button
                        onClick={handleResetQuiz}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400">
                        <span>QUESTION {currentQuizIndex + 1} OF {quizQuestions.length}</span>
                        <span>SCORE: {quizScore}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {quizQuestions[currentQuizIndex].question}
                      </p>

                      <div className="space-y-1.5">
                        {quizQuestions[currentQuizIndex].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            disabled={quizSubmitted}
                            className={`w-full rounded-xl border p-2.5 text-left text-xs transition-all ${
                              selectedAnswer === idx
                                ? quizSubmitted
                                  ? idx === quizQuestions[currentQuizIndex].correctIndex
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-medium'
                                    : 'border-rose-300 bg-rose-50 text-rose-800 font-medium'
                                  : 'border-emerald-400 bg-slate-50 font-medium'
                                : quizSubmitted && idx === quizQuestions[currentQuizIndex].correctIndex
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-medium'
                                : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      {quizSubmitted && (
                        <div className="rounded-lg bg-slate-50 p-2.5 text-[10px] text-slate-500 border border-slate-100 leading-relaxed">
                          <strong>Rationale:</strong> {quizQuestions[currentQuizIndex].explanation}
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        {!quizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={selectedAnswer === null}
                            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-40"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuiz}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                          >
                            <span>{currentQuizIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Learning Capsule Recommendation Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">Next Recommended Course</h3>
                {capsules.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={capsules[2]?.thumbnail || capsules[0]?.thumbnail} 
                        alt="Thumbnail" 
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                          {capsules[2]?.category || capsules[0]?.category}
                        </span>
                        <h4 className="font-display text-sm font-bold text-slate-900">
                          {capsules[2]?.title || capsules[0]?.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {capsules[2]?.description || capsules[0]?.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateToCapsule(capsules[2]?.slug || capsules[0]?.slug)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Resume Study</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Enrolled programs and dynamic inbox list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* ENROLLED PROGRAMS */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">My Active Cohort Schedules</h3>
                  </div>

                  {purchases.filter(p => p.userId === currentUser?.id).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <Lock className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="text-xs">No active paid enrollments yet.</p>
                      <p className="text-[10px] text-slate-400 font-medium">Unlock live cohort courses from the catalog directory.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {purchases.filter(p => p.userId === currentUser?.id).map((p) => {
                        const course = capsules.find(c => c.id === p.courseId);
                        return (
                          <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 line-clamp-1">{course?.title}</h4>
                              <span className="font-mono text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">Paid</span>
                            </div>
                            <div className="text-[11px] text-slate-500 space-y-1 font-medium">
                              <p>🕒 Time: <strong className="text-slate-700">{course?.lectureTimes}</strong></p>
                              <p>🔑 Order Ref: <code className="font-mono bg-slate-200/60 px-1 rounded text-slate-700">{p.razorpayOrderId}</code></p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <a 
                                href={course?.liveMeetingLink || "https://meet.google.com"} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center justify-center gap-1 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-[10px] transition-colors"
                              >
                                Join Video
                              </a>
                              <a 
                                href={course?.driveLink || "https://drive.google.com"} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center justify-center gap-1 text-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-2 rounded-lg text-[10px] transition-colors"
                              >
                                Drive Files
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* MY TRANSACTION EMAIL COPIES */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Mail className="h-4 w-4 text-emerald-500" />
                    <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">Mail Notifications Inbox</h3>
                  </div>

                  {receivedEmails.filter(e => e.userId === currentUser?.id).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <Mail className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="text-xs text-slate-500">Your notification inbox is empty.</p>
                      <p className="text-[10px] text-slate-400 font-medium">Lending invoices and schedules appear instantly on enrollment.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {receivedEmails.filter(e => e.userId === currentUser?.id).map((email) => (
                        <div key={email.id} className="rounded-xl border border-slate-100 p-3 text-xs space-y-1.5 bg-slate-50/50">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                            <span className="font-bold text-slate-800 line-clamp-1">{email.subject}</span>
                            <span className="text-[9px] font-mono text-slate-400">{new Date(email.sentAt).toLocaleDateString()}</span>
                          </div>
                          <p className={`text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap ${expandedEmailId === email.id ? '' : 'line-clamp-2'}`}>
                            {email.body}
                          </p>
                          <div className="pt-1">
                            <button 
                              onClick={() => setExpandedEmailId(expandedEmailId === email.id ? null : email.id)}
                              className="text-[10px] text-emerald-600 hover:text-emerald-700 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              {expandedEmailId === email.id ? 'Collapse Message &larr;' : 'Read Full Mail Message &rarr;'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. LEARNING DIRECTORY */}
          {subRoute === 'learning' && (
            <div id="dashboard-learning" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-950">Learning Index</h2>
                  <p className="text-xs text-slate-500">Track study metrics, toggling completion boxes as you review material.</p>
                </div>
                <span className="font-mono text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                  {completedCount} of {totalCapsulesCount} Complete
                </span>
              </div>

              <div className="space-y-3">
                {capsules.map((cap) => {
                  const isCompleted = completedCapsules.includes(cap.id);
                  const isSaved = bookmarks.includes(cap.id);
                  return (
                    <div
                      key={cap.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {/* Custom Completion toggle button */}
                        <button
                          onClick={() => onToggleComplete(cap.id)}
                          className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-all ${
                            isCompleted 
                              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm' 
                              : 'border-slate-300 hover:border-emerald-500'
                          }`}
                        >
                          {isCompleted && <Check className="h-4 w-4" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">{cap.category}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[9px] font-medium text-slate-400">{cap.difficulty}</span>
                          </div>
                          <h4 className="font-display text-sm font-bold text-slate-900">{cap.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Bookmark quick toggle */}
                        <button
                          onClick={() => onToggleBookmark(cap.id)}
                          className={`rounded-lg p-2 border transition-all ${
                            isSaved 
                              ? 'bg-slate-50 border-emerald-200 text-amber-500' 
                              : 'border-slate-200 hover:bg-slate-50 text-slate-400'
                          }`}
                        >
                          <Star className={`h-4 w-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => onNavigateToCapsule(cap.slug)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <span>Study</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. BOOKMARKS */}
          {subRoute === 'bookmarks' && (
            <div id="dashboard-bookmarks" className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-950">Saved Bookmarks</h2>
                <p className="text-xs text-slate-500 font-medium">Instantly access your customized reference library of courses.</p>
              </div>

              {savedCount === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-12 text-center">
                  <Star className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-sm font-bold font-display text-slate-700">No bookmarks saved yet</h3>
                  <p className="mt-1 text-xs text-slate-500">Go to Courses Catalog to bookmark important lessons.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {capsules
                    .filter(c => bookmarks.includes(c.id))
                    .map((cap) => (
                      <div
                        key={cap.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">{cap.category}</span>
                          <h4 className="font-display text-sm font-bold text-slate-900 mt-1">{cap.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cap.description}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <button
                            onClick={() => onToggleBookmark(cap.id)}
                            className="text-xs font-medium text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => onNavigateToCapsule(cap.slug)}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-emerald-600"
                          >
                            <span>Study Course</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 4. PROFILE SETTINGS */}
          {subRoute === 'profile' && (
            <div id="dashboard-profile" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">My Study Profile</h2>
                <p className="text-xs text-slate-500">Customize experience metrics to receive tailored learning pathways.</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">My Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Registered Email</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || 'student@marketwala.com'}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Trading Experience Level</label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {Object.values(DifficultyLevel).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setProfileExp(lvl)}
                        className={`rounded-xl border p-3 text-center text-xs font-semibold transition-all ${
                          profileExp === lvl
                            ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Academic Interests</label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {Object.values(CourseCategory).map((cat) => {
                      const isSelected = profileInterests.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleInterestToggle(cat)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {profileSaved && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 p-3 text-xs font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Your study profile has been updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Save className="h-4 w-4 text-emerald-400" />
                  <span>Save Profile Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* 5. SETTINGS / API KEYS */}
          {subRoute === 'settings' && (
            <div id="dashboard-settings" className="space-y-6">


              {/* Password simulation block */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">Security & Sign In</h3>
                  <p className="text-xs text-slate-500 font-medium">Update account login codes.</p>
                </div>

                <div className="space-y-3 max-w-sm">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Current Password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">New Password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
                  </div>
                  <button
                    onClick={() => alert("Simulation Notice: Password changed successfully.")}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Update Security Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
