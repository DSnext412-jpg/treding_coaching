/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, UserProfile, Course, BlogPost, 
  MediaFile, UserActivity, DifficultyLevel, CourseCategory,
  CoursePurchase, ReceivedEmail
} from './types';

// Importing Custom Views and Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicPages from './components/PublicPages';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthPages from './components/AuthPages';
import CheckoutPage from './components/CheckoutPage';

import { dbClient, authClient } from './lib/supabase';
import { Sparkles, Info, Compass, HelpCircle } from 'lucide-react';

export default function App() {
  // Routing States
  // Primary Routes: 'home' | 'about' | 'courses' | 'blogs' | 'contact' | 'login' | 'register' | 'forgot-password' | 'dashboard' | 'admin' | 'buy-course'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [currentSubRoute, setCurrentSubRoute] = useState<string>('overview');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Core Platform States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [purchases, setPurchases] = useState<CoursePurchase[]>([]);
  const [receivedEmails, setReceivedEmails] = useState<ReceivedEmail[]>([]);



  // --- LOAD DATA FROM SUPABASE (or localStorage via simulated client) ---
  useEffect(() => {
    const loadData = async () => {
      const { data: courseData } = await dbClient.from('courses').select('*');
      if (courseData?.length) setCourses(courseData);

      const { data: blogData } = await dbClient.from('blogs').select('*');
      if (blogData?.length) setBlogs(blogData);

      const { data: users } = await dbClient.from('registered_users').select('*');
      if (users?.length) {
        setRegisteredUsers(users);
      } else {
        // Seed a default admin so login with dipaksonwane412@gmail.com works
        const defaultAdmin: UserProfile = {
          id: 'usr-admin',
          email: 'dipaksonwane412@gmail.com',
          name: 'Dipak Sonwane',
          role: UserRole.ADMIN,
          experienceLevel: DifficultyLevel.ADVANCED,
          interests: [CourseCategory.TECHNICAL_ANALYSIS],
          createdAt: new Date().toISOString()
        };
        setRegisteredUsers([defaultAdmin]);
        localStorage.setItem('mw_registered_users', JSON.stringify([defaultAdmin]));
      }

      const { data: media } = await dbClient.from('media_files').select('*');
      if (media?.length) setMediaFiles(media);

      const { data: activities } = await dbClient.from('user_activities').select('*');
      if (activities?.length) setUserActivities(activities);

      const storedBookmarks = localStorage.getItem('mw_bookmarks');
      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));

      const storedCompleted = localStorage.getItem('mw_completed');
      if (storedCompleted) setCompletedCourses(JSON.parse(storedCompleted));

      const { data: purchaseData } = await dbClient.from('purchases').select('*');
      if (purchaseData?.length) setPurchases(purchaseData);

      const { data: emailData } = await dbClient.from('received_emails').select('*');
      if (emailData?.length) setReceivedEmails(emailData);

      // Restore session on refresh
      const { data: sessionData } = await authClient.auth.getSession();
      if (sessionData?.session?.user?.email) {
        const email = sessionData.session.user.email;
        const allUsers = users || [];
        const user = allUsers.find((u: UserProfile) => u.email === email);
        if (user) setCurrentUser(user);
      }
    };
    loadData();
  }, []);

  // Sync helper: saves to localStorage + tries Supabase
  const syncData = async (table: string, data: any[]) => {
    localStorage.setItem(`mw_${table}`, JSON.stringify(data));
    try { await dbClient.from(table).upsert(data, { onConflict: 'id' }); } catch {}
  };

  // Update helper functions that write changes back to database & state
  const handleUpdateCourses = (updated: Course[]) => {
    setCourses(updated);
    syncData('courses', updated);
  };

  const handleUpdateBlogs = (updated: BlogPost[]) => {
    setBlogs(updated);
    syncData('blogs', updated);
  };

  const handleUpdateUsers = (updated: UserProfile[]) => {
    setRegisteredUsers(updated);
    syncData('registered_users', updated);
  };

  const handleUpdateMedia = (updated: MediaFile[]) => {
    setMediaFiles(updated);
    syncData('media_files', updated);
  };

  const handleToggleBookmark = (id: string) => {
    if (!currentUser) {
      alert("Please sign in or switch to Student mode to bookmark courses!");
      setCurrentRoute('login');
      return;
    }
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
      // Log custom activity
      logActivity(currentUser.id, 'Bookmark Added', `Bookmarked lesson ${id}`);
    }
    setBookmarks(updated);
    localStorage.setItem('mw_bookmarks', JSON.stringify(updated));
  };

  const handleToggleComplete = (id: string) => {
    if (!currentUser) {
      alert("Please sign in or switch to Student mode to track progress!");
      setCurrentRoute('login');
      return;
    }
    let updated: string[];
    if (completedCourses.includes(id)) {
      updated = completedCourses.filter(c => c !== id);
    } else {
      updated = [...completedCourses, id];
      logActivity(currentUser.id, 'Completed Course', `Completed course: ${id}`);
    }
    setCompletedCourses(updated);
    localStorage.setItem('mw_completed', JSON.stringify(updated));
  };

  const logActivity = (userId: string, action: string, details: string) => {
    const newAct: UserActivity = {
      id: `act-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [newAct, ...userActivities];
    setUserActivities(updated);
    localStorage.setItem('mw_user_activities', JSON.stringify(updated));
  };


  // --- ROLE SWITCHER LOGIC ---
  const handleRoleChange = (role: UserRole) => {
    if (role === UserRole.STUDENT) {
      const student = registeredUsers.find(u => u.role === UserRole.STUDENT);
      if (student) {
        setCurrentUser(student);
        setCurrentRoute('dashboard');
        setCurrentSubRoute('overview');
      }
    } else if (role === UserRole.ADMIN) {
      const admin = registeredUsers.find(u => u.role === UserRole.ADMIN);
      if (admin) {
        setCurrentUser(admin);
        setCurrentRoute('admin');
        setCurrentSubRoute('overview');
      }
    }
  };


  // --- AUTHENTICATION FLOW ACTIONS ---
  const handleLoginSuccess = (email: string) => {
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      setCurrentUser(existingUser);
      if (existingUser.role === UserRole.ADMIN) {
        setCurrentRoute('admin');
        setCurrentSubRoute('overview');
        logActivity(existingUser.id, 'Signed In', 'Logged in successfully as platform admin');
      } else {
        setCurrentRoute('dashboard');
        setCurrentSubRoute('overview');
        logActivity(existingUser.id, 'Signed In', 'Logged in successfully as user');
      }
    } else {
      const isAdmin = email === 'dipaksonwane412@gmail.com';
      const newUser: UserProfile = {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name: email.split('@')[0],
        role: isAdmin ? UserRole.ADMIN : UserRole.STUDENT,
        experienceLevel: isAdmin ? DifficultyLevel.ADVANCED : undefined,
        interests: isAdmin ? [CourseCategory.TECHNICAL_ANALYSIS] : [],
        createdAt: new Date().toISOString()
      };
      handleUpdateUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      if (isAdmin) {
        setCurrentRoute('admin');
        setCurrentSubRoute('overview');
      } else {
        setCurrentRoute('dashboard');
        setCurrentSubRoute('overview');
      }
      logActivity(newUser.id, 'Signed In', 'Registered and signed in successfully');
    }
  };

  const handleRegisterSuccess = (name: string, email: string) => {
    const newUser: UserProfile = {
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      role: UserRole.STUDENT,
      experienceLevel: DifficultyLevel.BEGINNER,
      interests: [CourseCategory.BASICS],
      createdAt: new Date().toISOString()
    };
    handleUpdateUsers([...registeredUsers, newUser]);
    setCurrentUser(newUser);
    setCurrentRoute('dashboard');
    setCurrentSubRoute('overview');
    logActivity(newUser.id, 'Signed Up', `Registered and signed in as standard user`);
  };

  const handleLogout = () => {
    if (currentUser) {
      logActivity(currentUser.id, 'Logged Out', 'Logged out of account session');
    }
    setCurrentUser(null);
    setCurrentRoute('home');
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedProfile = { ...currentUser, ...updates };
    setCurrentUser(updatedProfile);
    
    // Update in user list database
    const updatedList = registeredUsers.map(u => u.id === currentUser.id ? updatedProfile : u);
    handleUpdateUsers(updatedList);
    logActivity(currentUser.id, 'Updated Profile', 'Edited user study configurations');
  };

  const handlePurchaseSuccess = (purchase: CoursePurchase) => {
    const updatedPurchases = [...purchases, purchase];
    setPurchases(updatedPurchases);
    localStorage.setItem('mw_purchases', JSON.stringify(updatedPurchases));
    dbClient.from('purchases').upsert([purchase], { onConflict: 'id' }).then().catch(() => {});

    // Send mock confirmation email
    const course = courses.find(c => c.id === purchase.courseId);
    const emailSubject = `Order Confirmed: ${course?.title || 'Your Course'} Entry Code`;
    const emailBody = `Hi ${purchase.customerName},

Thank you for enrolling in "${course?.title || 'Your Course'}". Your payment of ₹${purchase.amount} was successfully processed via Razorpay.

Here are your enrollment details:

--- LIVE LECTURE SESSIONS SCHEDULE ---
Time slot: ${course?.lectureTimes || 'Saturdays & Sundays @ 5:00 PM IST'}
Meeting Link: ${course?.liveMeetingLink || 'https://meet.google.com/abc-defg-hij'}

--- COURSE DOCUMENTS & RESOURCES ---
Google Drive link: ${course?.driveLink || 'https://drive.google.com'}

Happy learning!
The Market Wala Team`;

    const newEmail: ReceivedEmail = {
      id: `eml-${Math.random().toString(36).substring(2, 9)}`,
      userId: purchase.userId,
      recipient: purchase.customerEmail,
      subject: emailSubject,
      body: emailBody,
      sentAt: new Date().toISOString()
    };

    const updatedEmails = [newEmail, ...receivedEmails];
    setReceivedEmails(updatedEmails);
    localStorage.setItem('mw_emails', JSON.stringify(updatedEmails));
    dbClient.from('received_emails').upsert([newEmail], { onConflict: 'id' }).then().catch(() => {});

    // Log user activity
    logActivity(purchase.userId, 'Course Enrolled', `Purchased course: ${course?.title} via Razorpay (Ref: ${purchase.razorpayPaymentId})`);
  };

  // Safe navigation triggers
  const handleNavigate = (route: string, slug?: string | null) => {
    setCurrentRoute(route);
    setSelectedSlug(slug || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div id="application-container" className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      


      {/* Main Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
      />

      {/* Primary Workstation */}
      <div className="flex-grow">
        
        {/* PUBLIC WEBPAGES */}
        {['home', 'about', 'courses', 'blogs', 'contact'].includes(currentRoute) && (
          <PublicPages
            currentRoute={currentRoute}
            selectedSlug={selectedSlug}
            onNavigate={handleNavigate}
            capsules={courses}
            blogs={blogs}
            bookmarks={bookmarks}
            completedCapsules={completedCourses}
            onToggleBookmark={handleToggleBookmark}
            onToggleComplete={handleToggleComplete}
            purchases={purchases}
            currentUser={currentUser}
          />
        )}

        {/* AUTH PAGES */}
        {['login', 'register', 'forgot-password'].includes(currentRoute) && (
          <AuthPages
            viewMode={currentRoute as any}
            onSwitchView={(v) => handleNavigate(v)}
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {/* BUY COURSE / CHECKOUT */}
        {currentRoute === 'buy-course' && (
          <CheckoutPage
            course={courses.find(c => c.slug === selectedSlug) || courses[0]}
            currentUser={currentUser}
            onPurchaseSuccess={handlePurchaseSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {/* USER DASHBOARD PAGES */}
        {currentRoute === 'dashboard' && (
          <UserDashboard
            subRoute={currentSubRoute}
            onNavigateSub={setCurrentSubRoute}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            capsules={courses}
            bookmarks={bookmarks}
            completedCapsules={completedCourses}
            onToggleBookmark={handleToggleBookmark}
            onToggleComplete={handleToggleComplete}
            onNavigateToCapsule={(slug) => handleNavigate('courses', slug)}
            purchases={purchases}
            receivedEmails={receivedEmails}
          />
        )}

        {/* ADMIN DASHBOARD PAGES */}
        {currentRoute === 'admin' && currentUser?.role === UserRole.ADMIN && (
          <AdminDashboard
            subRoute={currentSubRoute}
            onNavigateSub={setCurrentSubRoute}
            currentUser={currentUser}
            capsules={courses}
            blogs={blogs}
            mediaFiles={mediaFiles}
            userActivities={userActivities}
            registeredUsers={registeredUsers}
            onUpdateCapsules={handleUpdateCourses}
            onUpdateBlogs={handleUpdateBlogs}
            onUpdateUsers={handleUpdateUsers}
            onUpdateMedia={handleUpdateMedia}
            purchases={purchases}
            receivedEmails={receivedEmails}
          />
        )}

        {/* Guard for admin attempt as standard user */}
        {currentRoute === 'admin' && currentUser?.role !== UserRole.ADMIN && (
          <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
            <ShieldAlert className="mx-auto h-12 w-12 text-rose-500" />
            <h2 className="text-xl font-bold font-display text-slate-900">Administrative Guard</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your profile does not contain administrative access credentials. Toggle <strong>Simulate: ADMIN</strong> in the top navigation bar to access this directory.
            </p>
            <button onClick={() => handleNavigate('home')} className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white">
              Return Home
            </button>
          </div>
        )}
      </div>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

// Inline custom mini representation of Shield Alert
function ShieldAlert(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
