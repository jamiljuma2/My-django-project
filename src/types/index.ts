// User Types
export type UserRole = 'student' | 'writer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  wallet: number;
  assignmentCount: number;
}

export interface Writer extends User {
  role: 'writer';
  wallet: number;
  rating: number;
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  completedTasks: number;
  subscription: SubscriptionTier;
  tasksRemaining: number;
  isSubscribed?: boolean;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Subscription Types
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'premium';

export interface Subscription {
  id: string;
  writerId: string;
  tier: SubscriptionTier;
  price: number;
  tasksPerDay: number;
  unlimited: boolean;
  createdAt: Date;
  expiresAt: Date;
}

// Assignment Types
export type AssignmentStatus = 'pending_approval' | 'approved' | 'in_progress' | 'submitted' | 'completed' | 'rejected';

export interface Assignment {
  id: string;
  studentId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: AssignmentStatus;
  files: string[];
  writerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export type TaskStatus = 'available' | 'claimed' | 'in_progress' | 'submitted' | 'completed';

export interface Task {
  id: string;
  assignmentId: string;
  studentId: string;
  writerId?: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: TaskStatus;
  claimedAt?: Date;
  submittedAt?: Date;
  completedAt?: Date;
}

// Submission Types
export interface Submission {
  id: string;
  taskId: string;
  writerId: string;
  files: UploadedFile[];
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: Date;
  approvedAt?: Date;
  rejectionReason?: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PaymentType = 'topup' | 'payout' | 'refund';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  phoneNumber: string;
  reference: string;
  createdAt: Date;
  completedAt?: Date;
}

// File Upload Types
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// Rating Types
export interface Rating {
  id: string;
  taskId: string;
  studentId: string;
  writerId: string;
  score: number;
  comment?: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = 'assignment_approved' | 'task_claimed' | 'submission_uploaded' | 'payment_released' | 'rating_received';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// STK Push Request
export interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference?: string;
  description?: string;
}

export interface STKPushResponse {
  success: boolean;
  checkoutRequestID?: string;
  requestID?: string;
  errorMessage?: string;
}
