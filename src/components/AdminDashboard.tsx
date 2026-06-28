/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, BookOpen, FileText, Eye, ToggleLeft, ToggleRight, Edit, 
  Trash, Plus, Upload, Save, Settings, BarChart3, Database, ShieldAlert,
  Search, Check, Trash2, Globe, Sparkles, Filter, Clock, CheckCircle, Image,
  Award
} from 'lucide-react';
import { 
  UserProfile, Course, BlogPost, MediaFile, UserActivity, 
  UserRole, CourseCategory, DifficultyLevel, CoursePurchase, ReceivedEmail 
} from '../types';

interface AdminDashboardProps {
  subRoute: string; // 'overview' | 'users' | 'courses' | 'blogs' | 'media' | 'analytics' | 'settings'
  onNavigateSub: (sub: string) => void;
  currentUser: UserProfile | null;
  capsules: Course[];
  blogs: BlogPost[];
  mediaFiles: MediaFile[];
  userActivities: UserActivity[];
  registeredUsers: UserProfile[];
  onUpdateCapsules: (updated: Course[]) => void;
  onUpdateBlogs: (updated: BlogPost[]) => void;
  onUpdateUsers: (updated: UserProfile[]) => void;
  onUpdateMedia: (updated: MediaFile[]) => void;
  purchases?: CoursePurchase[];
  receivedEmails?: ReceivedEmail[];
}

export default function AdminDashboard({
  subRoute,
  onNavigateSub,
  currentUser,
  capsules,
  blogs,
  mediaFiles,
  userActivities,
  registeredUsers,
  onUpdateCapsules,
  onUpdateBlogs,
  onUpdateUsers,
  onUpdateMedia,
  purchases = [],
  receivedEmails = [],
}: AdminDashboardProps) {
  // CMS Create/Edit forms state
  const [isCapsuleModalOpen, setIsCapsuleModalOpen] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState<Course | null>(null);
  const [capsuleForm, setCapsuleForm] = useState({
    title: '', slug: '', description: '', thumbnail: '',
    content: '', category: CourseCategory.BASICS,
    difficulty: DifficultyLevel.BEGINNER, tags: '', readingTime: 5, isPublished: true
  });

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', content: '', featuredImage: '',
    seoTitle: '', seoDescription: '', isPublished: true
  });

  // Media upload simulation
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [mediaBucket, setMediaBucket] = useState<'courses' | 'blogs' | 'avatars' | 'banners'>('courses');

  // Search queries
  const [userSearch, setUserSearch] = useState('');
  const [capsuleSearch, setCapsuleSearch] = useState('');
  const [blogSearch, setBlogSearch] = useState('');

  // Global platform configuration simulation
  const savedConfig = localStorage.getItem('mw_site_config');
  const defaultConfig = {
    siteName: 'The Market Wala',
    maintenanceMode: false,
    allowRegistrations: true,
    emailVerificationRequired: true,
    sessionLabel: 'Cohort Study Session',
    masterclassTitle: 'Interactive Live Masterclass',
    sessionTime: 'Saturdays & Sundays @ 5:00 PM IST'
  };
  const [platformConfig, setPlatformConfig] = useState(savedConfig ? JSON.parse(savedConfig) : defaultConfig);
  const [configSaved, setConfigSaved] = useState(false);

  // Nav items helper
  const sidebarLinks = [
    { label: 'Admin Overview', sub: 'overview', icon: Database },
    { label: 'Manage Users', sub: 'users', icon: Users },
    { label: 'Manage Courses', sub: 'courses', icon: BookOpen },
    { label: 'Manage Blogs', sub: 'blogs', icon: FileText },
    { label: 'Media Storage', sub: 'media', icon: Image },
    { label: 'Analytics Insights', sub: 'analytics', icon: BarChart3 },
    { label: 'Platform Settings', sub: 'settings', icon: Settings },
  ];

  // --- ACTIONS FOR CAPSULES ---
  const handleOpenCreateCapsule = () => {
    setEditingCapsule(null);
    setCapsuleForm({
      title: '', slug: '', description: '',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      content: '', category: CourseCategory.BASICS,
      difficulty: DifficultyLevel.BEGINNER, tags: 'stocks, finance', readingTime: 5, isPublished: true
    });
    setIsCapsuleModalOpen(true);
  };

  const handleOpenEditCapsule = (cap: Course) => {
    setEditingCapsule(cap);
    setCapsuleForm({
      title: cap.title, slug: cap.slug, description: cap.description, thumbnail: cap.thumbnail,
      content: cap.content, category: cap.category,
      difficulty: cap.difficulty, tags: cap.tags.join(', '), readingTime: cap.readingTime, isPublished: cap.isPublished
    });
    setIsCapsuleModalOpen(true);
  };

  const handleSaveCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = capsuleForm.tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingCapsule) {
      const updatedList = capsules.map(c => c.id === editingCapsule.id ? {
        ...c,
        title: capsuleForm.title,
        slug: capsuleForm.slug || capsuleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: capsuleForm.description,
        thumbnail: capsuleForm.thumbnail,
        content: capsuleForm.content,
        category: capsuleForm.category,
        difficulty: capsuleForm.difficulty,
        tags: tagList,
        readingTime: Number(capsuleForm.readingTime),
        isPublished: capsuleForm.isPublished,
        updatedAt: new Date().toISOString()
      } : c);
      onUpdateCapsules(updatedList);
    } else {
      const newCap: Course = {
        id: `cap-${Math.random().toString(36).substring(2, 9)}`,
        title: capsuleForm.title,
        slug: capsuleForm.slug || capsuleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: capsuleForm.description,
        thumbnail: capsuleForm.thumbnail,
        content: capsuleForm.content,
        category: capsuleForm.category,
        difficulty: capsuleForm.difficulty,
        tags: tagList,
        readingTime: Number(capsuleForm.readingTime),
        isPublished: capsuleForm.isPublished,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onUpdateCapsules([newCap, ...capsules]);
    }
    setIsCapsuleModalOpen(false);
  };

  const handleDeleteCapsule = (id: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      onUpdateCapsules(capsules.filter(c => c.id !== id));
    }
  };

  const handleTogglePublishCapsule = (id: string) => {
    const updated = capsules.map(c => c.id === id ? { ...c, isPublished: !c.isPublished } : c);
    onUpdateCapsules(updated);
  };


  // --- ACTIONS FOR BLOGS ---
  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '', slug: '', content: '',
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      seoTitle: '', seoDescription: '', isPublished: true
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title, slug: blog.slug, content: blog.content, featuredImage: blog.featuredImage,
      seoTitle: blog.seoTitle, seoDescription: blog.seoDescription, isPublished: blog.isPublished
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBlog) {
      const updated = blogs.map(b => b.id === editingBlog.id ? {
        ...b,
        title: blogForm.title,
        slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: blogForm.content,
        featuredImage: blogForm.featuredImage,
        seoTitle: blogForm.seoTitle || blogForm.title,
        seoDescription: blogForm.seoDescription || blogForm.title,
        isPublished: blogForm.isPublished
      } : b);
      onUpdateBlogs(updated);
    } else {
      const newBlog: BlogPost = {
        id: `blog-${Math.random().toString(36).substring(2, 9)}`,
        title: blogForm.title,
        slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: blogForm.content,
        featuredImage: blogForm.featuredImage,
        seoTitle: blogForm.seoTitle || blogForm.title,
        seoDescription: blogForm.seoDescription,
        isPublished: blogForm.isPublished,
        createdAt: new Date().toISOString()
      };
      onUpdateBlogs([newBlog, ...blogs]);
    }
    setIsBlogModalOpen(false);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      onUpdateBlogs(blogs.filter(b => b.id !== id));
    }
  };


  // --- ACTIONS FOR USERS ---
  const handleChangeUserRole = (id: string, newRole: UserRole) => {
    const updated = registeredUsers.map(u => u.id === id ? { ...u, role: newRole } : u);
    onUpdateUsers(updated);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own admin account.");
      return;
    }
    if (confirm("Are you sure you want to delete this user? All their learning progress will be cleared.")) {
      onUpdateUsers(registeredUsers.filter(u => u.id !== id));
    }
  };


  // --- ACTIONS FOR MEDIA STORAGE ---
  const handleMediaUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          // Complete Simulation
          const newMedia: MediaFile = {
            id: `med-${Math.random().toString(36).substring(2, 9)}`,
            name: uploadFile.name,
            url: URL.createObjectURL(uploadFile) || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
            size: `${Math.round(uploadFile.size / 1024)} KB`,
            mimeType: uploadFile.type || 'image/png',
            bucket: mediaBucket,
            createdAt: new Date().toISOString()
          };
          onUpdateMedia([newMedia, ...mediaFiles]);
          setUploadFile(null);
          return null;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm("Delete this asset from storage bucket?")) {
      onUpdateMedia(mediaFiles.filter(m => m.id !== id));
    }
  };


  // Calculated Indicators
  const totalUsersCount = registeredUsers.length;
  const totalCapsulesCount = capsules.length;
  const totalBlogsCount = blogs.length;
  const activeUsersCount = registeredUsers.filter(u => u.createdAt.includes('2026')).length;

  return (
    <div id="admin-dashboard-root" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* SIDEBAR */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm border-2 border-emerald-400">
              {(currentUser?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <h3 className="mt-3 font-display text-sm font-bold text-slate-900">{currentUser?.name || 'Dipak Sonwane'}</h3>
            <span className="text-[10px] font-mono text-white bg-slate-900 px-3 py-1 rounded-full inline-block mt-1.5 font-bold tracking-wide border border-emerald-500/20">
              PLATFORM OWNER
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = subRoute === link.sub;
              return (
                <button
                  key={link.sub}
                  id={`admin-sidebar-${link.sub}`}
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

        {/* ADMIN WORKSPACE */}
        <main className="lg:col-span-3 space-y-6">

          {/* 1. OVERVIEW SCREEN */}
          {subRoute === 'overview' && (
            <div id="admin-overview" className="space-y-6">
              {/* Analytics Top Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
                    <Users className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
                  <span className="font-mono text-2xl font-bold text-slate-800">{totalUsersCount} accounts</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Courses</span>
                  <span className="font-mono text-2xl font-bold text-slate-800">{totalCapsulesCount} modules</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200/50">
                    <FileText className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Blogs</span>
                  <span className="font-mono text-2xl font-bold text-slate-800">{totalBlogsCount} articles</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Monthly</span>
                  <span className="font-mono text-2xl font-bold text-emerald-600">{activeUsersCount} users</span>
                </div>
              </div>

              {/* Premium Course Enrollments */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <span>Paid Cohort Enrollments ({purchases.length})</span>
                  </h3>
                  <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                    Total Revenue: ₹{(purchases.reduce((acc, p) => acc + p.amount, 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                {purchases.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No premium student enrollments processed yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                          <th className="py-2.5">Student Details</th>
                          <th className="py-2.5">Program</th>
                          <th className="py-2.5">Profession</th>
                          <th className="py-2.5">Prior Experience</th>
                          <th className="py-2.5">Amount Paid</th>
                          <th className="py-2.5 text-right font-mono">Payment Info</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {purchases.map((purchase) => {
                          const course = capsules.find(c => c.id === purchase.courseId);
                          return (
                            <tr key={purchase.id} className="hover:bg-slate-50/50">
                              <td className="py-3">
                                <div className="font-semibold text-slate-900">{purchase.customerName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{purchase.customerEmail} • {purchase.customerPhone}</div>
                              </td>
                              <td className="py-3">
                                <span className="font-medium text-slate-800">{course?.title || 'Unknown Course'}</span>
                              </td>
                              <td className="py-3">
                                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                                  {purchase.profession || 'Not Specified'}
                                </span>
                              </td>
                              <td className="py-3 text-slate-700">
                                <span className="text-[11px] font-medium">{purchase.experience || 'Not Specified'}</span>
                              </td>
                              <td className="py-3 font-mono text-emerald-600 font-bold">
                                ₹{purchase.amount}
                              </td>
                              <td className="py-3 text-right font-mono text-[10px] text-slate-400">
                                <div className="font-bold text-slate-600">{purchase.razorpayPaymentId}</div>
                                <div>{new Date(purchase.purchasedAt).toLocaleDateString()}</div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* System Audit logs & Recent Events */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-emerald-500" />
                    <span>Real-time System Audit Logs</span>
                  </h3>
                  <span className="font-mono text-[9px] text-slate-400">Auto-synced</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="py-2.5">User</th>
                        <th className="py-2.5">Action Code</th>
                        <th className="py-2.5">Parameters / Details</th>
                        <th className="py-2.5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
                      {userActivities.map((act) => {
                        const actor = registeredUsers.find(u => u.id === act.userId);
                        return (
                          <tr key={act.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-sans font-medium text-slate-900">{actor ? actor.name : 'Unknown'}</td>
                            <td className="py-2.5">
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-bold uppercase">
                                {act.action}
                              </span>
                            </td>
                            <td className="py-2.5 font-sans">{act.details}</td>
                            <td className="py-2.5 text-right text-[10px] text-slate-400">
                              {new Date(act.timestamp).toLocaleTimeString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. MANAGE USERS SCREEN */}
          {subRoute === 'users' && (
            <div id="admin-users-view" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">Registered Accounts</h2>
                  <p className="text-xs text-slate-500">Configure administrative access roles across the platform catalog.</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter user emails..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="p-4">User Details</th>
                        <th className="p-4">Email Account</th>
                        <th className="p-4">Active Role Permission</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registeredUsers
                        .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.name.toLowerCase().includes(userSearch.toLowerCase()))
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/40">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{u.name.charAt(0).toUpperCase()}</div>
                                <span className="font-bold text-slate-900">{u.name}</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[11px] text-slate-500">{u.email}</td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleChangeUserRole(u.id, e.target.value as UserRole)}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 focus:border-emerald-500"
                              >
                                <option value={UserRole.STUDENT}>Student</option>
                                <option value={UserRole.ADMIN}>Admin</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. MANAGE CAPSULES */}
          {subRoute === 'courses' && (
            <div id="admin-capsules-view" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">Course Modules</h2>
                  <p className="text-xs text-slate-500">Add, edit, or toggle draft statuses of learning courses.</p>
                </div>
                <button
                  id="btn-admin-add-capsule"
                  onClick={handleOpenCreateCapsule}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
                >
                  <Plus className="h-4 w-4 text-emerald-400" />
                  <span>Create Course</span>
                </button>
              </div>

              {/* Capsule Modals/Forms */}
              {isCapsuleModalOpen && (
                <div className="rounded-2xl border border-emerald-500 bg-emerald-50/10 p-6 space-y-4 shadow-sm border-dashed">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    {editingCapsule ? `Edit Course: ${editingCapsule.title}` : 'Create New Course'}
                  </h3>

                  <form onSubmit={handleSaveCapsule} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
                        <input
                          type="text" required value={capsuleForm.title}
                          onChange={(e) => setCapsuleForm({ ...capsuleForm, title: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">URL Slug</label>
                        <input
                          type="text" placeholder="auto-generated-if-empty" value={capsuleForm.slug}
                          onChange={(e) => setCapsuleForm({ ...capsuleForm, slug: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Category</label>
                        <select
                          value={capsuleForm.category}
                          onChange={(e) => setCapsuleForm({ ...capsuleForm, category: e.target.value as CourseCategory })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          {Object.values(CourseCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Difficulty</label>
                        <select
                          value={capsuleForm.difficulty}
                          onChange={(e) => setCapsuleForm({ ...capsuleForm, difficulty: e.target.value as DifficultyLevel })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        >
                          {Object.values(DifficultyLevel).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Reading Time (Mins)</label>
                        <input
                          type="number" required value={capsuleForm.readingTime}
                          onChange={(e) => setCapsuleForm({ ...capsuleForm, readingTime: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Brief Description</label>
                      <input
                        type="text" required value={capsuleForm.description}
                        onChange={(e) => setCapsuleForm({ ...capsuleForm, description: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Thumbnail URL</label>
                      <input
                        type="text" required value={capsuleForm.thumbnail}
                        onChange={(e) => setCapsuleForm({ ...capsuleForm, thumbnail: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Tags (comma-separated)</label>
                      <input
                        type="text" value={capsuleForm.tags}
                        onChange={(e) => setCapsuleForm({ ...capsuleForm, tags: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Course Content (supports raw block lines)</label>
                      <textarea
                        required rows={6} value={capsuleForm.content}
                        onChange={(e) => setCapsuleForm({ ...capsuleForm, content: e.target.value })}
                        placeholder="Write educational markdown text lines..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox" id="published-checkbox" checked={capsuleForm.isPublished}
                        onChange={(e) => setCapsuleForm({ ...capsuleForm, isPublished: e.target.checked })}
                      />
                      <label htmlFor="published-checkbox" className="text-xs font-semibold text-slate-700">Publish Immediately</label>
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                        Save Course
                      </button>
                      <button type="button" onClick={() => setIsCapsuleModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Capsules List Table */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/40 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="p-4">Course Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Difficulty</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {capsules.map((cap) => (
                        <tr key={cap.id} className="hover:bg-slate-50/30">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={cap.thumbnail} alt="" className="h-10 w-16 rounded object-cover" />
                              <div>
                                <span className="font-bold text-slate-900 block">{cap.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">Slug: {cap.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">{cap.category}</td>
                          <td className="p-4 font-semibold text-slate-700">{cap.difficulty}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePublishCapsule(cap.id)}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                cap.isPublished 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                                  : 'bg-slate-100 border-slate-300 text-slate-500'
                              }`}
                            >
                              {cap.isPublished ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditCapsule(cap)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCapsule(cap.id)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. MANAGE BLOGS */}
          {subRoute === 'blogs' && (
            <div id="admin-blogs-view" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">Blog Article Database</h2>
                  <p className="text-xs text-slate-500">Edit, author, or schedule analytical educational publications.</p>
                </div>
                <button
                  onClick={handleOpenCreateBlog}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
                >
                  <Plus className="h-4 w-4 text-emerald-400" />
                  <span>Write Blog Article</span>
                </button>
              </div>

              {/* Blog Form */}
              {isBlogModalOpen && (
                <div className="rounded-2xl border border-emerald-500 bg-emerald-50/10 p-6 space-y-4 shadow-sm border-dashed">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    {editingBlog ? 'Edit Blog Article' : 'Write New Blog Article'}
                  </h3>

                  <form onSubmit={handleSaveBlog} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
                      <input
                        type="text" required value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Slug Path</label>
                      <input
                        type="text" value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Featured Image URL</label>
                      <input
                        type="text" required value={blogForm.featuredImage}
                        onChange={(e) => setBlogForm({ ...blogForm, featuredImage: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">SEO Title Accent</label>
                        <input
                          type="text" value={blogForm.seoTitle}
                          onChange={(e) => setBlogForm({ ...blogForm, seoTitle: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">SEO Description Tags</label>
                        <input
                          type="text" value={blogForm.seoDescription}
                          onChange={(e) => setBlogForm({ ...blogForm, seoDescription: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Content (supports raw break lines)</label>
                      <textarea
                        required rows={6} value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                        Save Article
                      </button>
                      <button type="button" onClick={() => setIsBlogModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-600">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Blogs Listing */}
              <div className="grid grid-cols-1 gap-4">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img src={b.featuredImage} alt="" className="h-12 w-16 object-cover rounded" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-900">{b.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400">Published {new Date(b.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditBlog(b)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MEDIA STORAGE SCREEN */}
          {subRoute === 'media' && (
            <div id="admin-media-view" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">Storage Buckets Manager</h2>
                  <p className="text-xs text-slate-500 font-medium">Upload files directly to standard folders (courses, blogs, avatars, banners).</p>
                </div>
              </div>

              {/* Upload Panel */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <form onSubmit={handleMediaUploadSubmit} className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Bucket</label>
                    <select
                      value={mediaBucket}
                      onChange={(e) => setMediaBucket(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 font-semibold"
                    >
                      <option value="courses">courses/</option>
                      <option value="blogs">blogs/</option>
                      <option value="avatars">avatars/</option>
                      <option value="banners">banners/</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select File</label>
                    <input
                      type="file" required
                      onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full text-xs text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border file:border-slate-200 file:bg-slate-50 file:text-xs file:font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 self-end"
                  >
                    <Upload className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Upload Asset</span>
                  </button>
                </form>

                {uploadProgress !== null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-emerald-600 font-bold">
                      <span>UPLOADING TO SUPABASE BUCKET...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Assets Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {mediaFiles.map((m) => (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div className="relative aspect-video bg-slate-100">
                      <img src={m.url} alt="" className="h-full w-full object-cover" />
                      <span className="absolute left-2 top-2 rounded-md bg-slate-900/80 px-2 py-0.5 font-mono text-[8px] text-emerald-400 font-semibold uppercase">
                        {m.bucket}
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold text-slate-800 truncate" title={m.name}>
                          {m.name}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-mono">{m.size}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteMedia(m.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ANALYTICS INSIGHTS SCREEN */}
          {subRoute === 'analytics' && (
            <div id="admin-analytics" className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Platform Analytics Insights</h2>
                <p className="text-xs text-slate-500">Real-time indicators regarding user interaction, course completions, and database hits.</p>
              </div>

              {/* Custom SVG Grid for graphs */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Graph 1: Peak traffic hours */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Sessions Peak Hours (24h)</h4>
                  <div className="relative h-44 w-full">
                    <svg className="h-full w-full" viewBox="0 0 300 120">
                      {/* Bar charts */}
                      <rect x="20" y="40" width="15" height="80" fill="#0f172a" rx="2" />
                      <rect x="55" y="60" width="15" height="60" fill="#0f172a" rx="2" />
                      <rect x="90" y="30" width="15" height="90" fill="#0f172a" rx="2" />
                      <rect x="125" y="10" width="15" height="110" fill="#22c55e" rx="2" /> {/* peak */}
                      <rect x="160" y="50" width="15" height="70" fill="#0f172a" rx="2" />
                      <rect x="195" y="70" width="15" height="50" fill="#0f172a" rx="2" />
                      <rect x="230" y="85" width="15" height="35" fill="#0f172a" rx="2" />
                      <rect x="265" y="95" width="15" height="25" fill="#0f172a" rx="2" />
                    </svg>
                    {/* Time markers */}
                    <div className="flex justify-between text-[8px] font-mono font-bold text-slate-400 px-2 pt-1">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00 (Peak)</span>
                      <span>18:00</span>
                      <span>23:59</span>
                    </div>
                  </div>
                </div>

                {/* Graph 2: Popular Categories */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Completion Categories</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Technical Analysis</span>
                        <span>42%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '42%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Risk Management</span>
                        <span>28%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '28%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Trading Psychology</span>
                        <span>18%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '18%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Fundamental Analysis & Basics</span>
                        <span>12%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-slate-300 h-full" style={{ width: '12%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. SETTINGS */}
          {subRoute === 'settings' && (
            <div id="admin-settings" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Platform Global Config</h2>
                <p className="text-xs text-slate-500">Configure core parameters for the public website and authenticating limits.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Platform Brand Name</label>
                  <input
                    type="text"
                    value={platformConfig.siteName}
                    onChange={(e) => setPlatformConfig({ ...platformConfig, siteName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">System Maintenance Mode</label>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() => setPlatformConfig({ ...platformConfig, maintenanceMode: !platformConfig.maintenanceMode })}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      {platformConfig.maintenanceMode ? '🟢 Turn OFF Maintenance' : '🔴 Activate Maintenance'}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      State: {platformConfig.maintenanceMode ? 'OFFLINE' : 'ONLINE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cohort Session Banner
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Session Label</label>
                    <input type="text" value={platformConfig.sessionLabel}
                      onChange={(e) => setPlatformConfig({ ...platformConfig, sessionLabel: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Masterclass Title</label>
                    <input type="text" value={platformConfig.masterclassTitle}
                      onChange={(e) => setPlatformConfig({ ...platformConfig, masterclassTitle: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Session Time</label>
                    <input type="text" value={platformConfig.sessionTime}
                      onChange={(e) => setPlatformConfig({ ...platformConfig, sessionTime: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-3">
                <h3 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-4 w-4" />
                  <span>Backup & Restore System</span>
                </h3>
                <p className="text-xs text-slate-500">Export active memory schema state (Registered Users, Course CMS, Blogs, and Log trails) into a standalone JSON asset backup.</p>
                <button
                  onClick={() => {
                    const backupData = {
                      capsules,
                      blogs,
                      mediaFiles,
                      registeredUsers,
                      platformConfig,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `market_wala_backup_${Date.now()}.json`;
                    link.click();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Upload className="h-3.5 w-3.5 rotate-180" />
                  <span>Download Complete JSON Backup</span>
                </button>
              </div>

              {configSaved && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 p-3 text-xs font-medium">
                  <Check className="h-4 w-4" />
                  <span>Platform config settings saved successfully.</span>
                </div>
              )}

              <button
                onClick={() => {
                  localStorage.setItem('mw_site_config', JSON.stringify(platformConfig));
                  setConfigSaved(true);
                  setTimeout(() => setConfigSaved(false), 3000);
                }}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Save className="h-4 w-4 text-emerald-400" />
                <span>Save Platform Configurations</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
