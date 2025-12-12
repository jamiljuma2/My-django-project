import { Student, Writer, Assignment, Task, Submission, Payment, Notification, Subscription, Rating } from '@/types';

// Mock Writers
export const mockWriters: Writer[] = [
  {
    id: 'w1',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'writer',
    phone: '254712345678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    wallet: 12500,
    rating: 4.8,
    badge: 'Gold',
    completedTasks: 67,
    subscription: 'pro',
    tasksRemaining: 5,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'w2',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
    role: 'writer',
    phone: '254723456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    wallet: 8300,
    rating: 4.5,
    badge: 'Silver',
    completedTasks: 45,
    subscription: 'basic',
    tasksRemaining: 3,
    createdAt: new Date('2023-03-20'),
  },
  {
    id: 'w3',
    email: 'charlie@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    role: 'writer',
    phone: '254734567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    wallet: 5200,
    rating: 4.2,
    badge: 'Bronze',
    completedTasks: 12,
    subscription: 'free',
    tasksRemaining: 0,
    createdAt: new Date('2023-06-10'),
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 's1',
    email: 'student1@example.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    role: 'student',
    phone: '254745678901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    wallet: 3500,
    assignmentCount: 8,
    createdAt: new Date('2023-02-01'),
  },
  {
    id: 's2',
    email: 'student2@example.com',
    firstName: 'James',
    lastName: 'Davis',
    role: 'student',
    phone: '254756789012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    wallet: 1200,
    assignmentCount: 3,
    createdAt: new Date('2023-04-15'),
  },
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    studentId: 's1',
    title: 'Research Paper on Climate Change',
    description: 'Write a comprehensive research paper analyzing the impact of climate change on global economy',
    budget: 2500,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    files: ['assignment_brief.pdf'],
    writerId: 'w1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'a2',
    studentId: 's1',
    title: 'Machine Learning Project Implementation',
    description: 'Implement a machine learning model for image classification',
    budget: 3000,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'approved',
    files: ['project_requirements.pdf', 'dataset_info.txt'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'a3',
    studentId: 's1',
    title: 'Business Analysis Report',
    description: 'Analyze a chosen company and provide strategic recommendations',
    budget: 1800,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'pending_approval',
    files: ['company_profile.pdf'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'a4',
    studentId: 's2',
    title: 'Web Development Project',
    description: 'Build a responsive web application with React and Node.js',
    budget: 4000,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    status: 'completed',
    files: ['requirements.docx'],
    writerId: 'w2',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Mock Tasks (available for writers)
export const mockTasks: Task[] = [
  {
    id: 't1',
    assignmentId: 'a2',
    studentId: 's1',
    title: 'Python ML Model Development',
    description: 'Build and train a neural network for image classification',
    budget: 2800,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'available',
  },
  {
    id: 't2',
    assignmentId: 'a3',
    studentId: 's1',
    title: 'Strategic Business Analysis',
    description: 'Perform SWOT analysis and provide recommendations',
    budget: 1600,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'available',
  },
  {
    id: 't3',
    assignmentId: 'a1',
    studentId: 's1',
    title: 'Climate Impact Economic Analysis',
    description: 'Research and compile economic impacts of climate change',
    budget: 2000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    writerId: 'w1',
    claimedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: 'sub1',
    taskId: 't3',
    writerId: 'w1',
    files: [
      {
        id: 'f1',
        name: 'Climate_Research_Paper.pdf',
        url: '/files/climate_research.pdf',
        size: 2500000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
    status: 'submitted',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'p1',
    userId: 's1',
    amount: 3000,
    type: 'topup',
    status: 'completed',
    phoneNumber: '254745678901',
    reference: 'MPI1234567890',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'p2',
    userId: 'w1',
    amount: 2300,
    type: 'payout',
    status: 'completed',
    phoneNumber: '254712345678',
    reference: 'MPI0987654321',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 's1',
    type: 'assignment_approved',
    title: 'Assignment Approved',
    message: 'Your assignment "Machine Learning Project" has been approved',
    read: false,
    relatedId: 'a2',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'n2',
    userId: 's1',
    type: 'task_claimed',
    title: 'Task Claimed',
    message: 'Alice Johnson has claimed your task',
    read: false,
    relatedId: 't1',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'n3',
    userId: 's1',
    type: 'submission_uploaded',
    title: 'Submission Received',
    message: 'Alice Johnson has uploaded submission for your task',
    read: true,
    relatedId: 'sub1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'n4',
    userId: 'w1',
    type: 'payment_released',
    title: 'Payment Released',
    message: 'You have received payment of KES 2,300',
    read: true,
    relatedId: 'p2',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-basic',
    writerId: 'w1',
    tier: 'basic',
    price: 200,
    tasksPerDay: 5,
    unlimited: false,
    createdAt: new Date('2023-01-15'),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'sub-pro',
    writerId: 'w1',
    tier: 'pro',
    price: 500,
    tasksPerDay: 9,
    unlimited: false,
    createdAt: new Date('2023-06-20'),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'sub-premium',
    writerId: 'w1',
    tier: 'premium',
    price: 1000,
    tasksPerDay: 999,
    unlimited: true,
    createdAt: new Date('2023-09-10'),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
];

// Mock Ratings
export const mockRatings: Rating[] = [
  {
    id: 'r1',
    taskId: 't3',
    studentId: 's1',
    writerId: 'w1',
    score: 5,
    comment: 'Excellent work! Very thorough research and well-written.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'r2',
    taskId: 't1',
    studentId: 's1',
    writerId: 'w2',
    score: 4,
    comment: 'Good work, met all requirements.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
];

// Subscription Tiers for Payment
export const subscriptionTiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 200,
    tasksPerDay: 5,
    description: 'Access 5 tasks per day',
    features: ['5 tasks/day', 'Basic support', 'Weekly earnings'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 500,
    tasksPerDay: 9,
    description: 'Access 9 tasks per day',
    features: ['9 tasks/day', 'Priority support', 'Daily earnings', 'Featured profile'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1000,
    tasksPerDay: -1,
    description: 'Unlimited tasks per day',
    features: ['Unlimited tasks', '24/7 support', 'Real-time notifications', 'Premium badge', 'Bonus earnings'],
  },
];
