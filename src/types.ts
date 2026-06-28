/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export enum CourseCategory {
  BASICS = 'Basics',
  TECHNICAL_ANALYSIS = 'Technical Analysis',
  FUNDAMENTAL_ANALYSIS = 'Fundamental Analysis',
  RISK_MANAGEMENT = 'Risk Management',
  TRADING_PSYCHOLOGY = 'Trading Psychology',
}

export enum DifficultyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  experienceLevel?: DifficultyLevel;
  interests?: CourseCategory[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  content: string; // Markdown or rich text
  category: CourseCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  readingTime: number; // in minutes
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Paid Course fields
  price?: number; // e.g. 1499
  lectureTimes?: string; // e.g. "Saturdays & Sundays @ 5:00 PM IST"
  driveLink?: string; // Google Drive document folder link
  liveMeetingLink?: string; // Zoom or Google Meet link
}

export interface CoursePurchase {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  profession?: string;
  experience?: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  status: 'completed' | 'failed';
  purchasedAt: string;
}

export interface ReceivedEmail {
  id: string;
  userId: string;
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
}


export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Bookmark {
  userId: string;
  courseId: string;
  savedAt: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  lastReadAt: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  mimeType: string;
  bucket: 'courses' | 'blogs' | 'avatars' | 'banners';
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AppState {
  currentUser: UserProfile | null;
  courses: Course[];
  blogs: BlogPost[];
  bookmarks: string[]; // List of courseIds
  completedCourses: string[]; // List of courseIds
  mediaFiles: MediaFile[];
  userActivities: UserActivity[];
  registeredUsers: UserProfile[];
}
