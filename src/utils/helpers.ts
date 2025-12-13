// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Simple validation for Kenyan phone numbers
  const phoneRegex = /^254\d{9}$|^\+254\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 100000;
};

// File validation
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-rar-compressed',
  'image/jpeg',
  'image/png',
  'text/plain',
  'text/csv',
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }
  return { valid: true };
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDaysUntil = (date: Date | string): number => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const timeDiff = d.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const isOverdue = (date: Date | string): boolean => {
  return getDaysUntil(date) < 0;
};

// Currency utilities
export const formatCurrency = (amount: number, currency: string = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Status badges
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    // Assignment statuses
    pending_approval: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    submitted: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',

    // Task statuses
    available: 'bg-blue-100 text-blue-800',
    claimed: 'bg-orange-100 text-orange-800',

    // Payment statuses
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    completed: 'Completed',
    rejected: 'Rejected',
    available: 'Available',
    claimed: 'Claimed',
    pending: 'Pending',
    processing: 'Processing',
    failed: 'Failed',
  };

  return labels[status] || status;
};

// Badge determination
export const getBadgeForCompletedTasks = (count: number): string => {
  if (count >= 100) return 'Platinum';
  if (count >= 50) return 'Gold';
  if (count >= 20) return 'Silver';
  return 'Bronze';
};

export const getProgressToNextBadge = (count: number): { current: string; next: string; progress: number; needed: number } => {
  if (count >= 100) {
    return { current: 'Platinum', next: 'Platinum', progress: 100, needed: 0 };
  }
  if (count >= 50) {
    return { current: 'Gold', next: 'Platinum', progress: (count - 50) / 50, needed: 100 - count };
  }
  if (count >= 20) {
    return { current: 'Silver', next: 'Gold', progress: (count - 20) / 30, needed: 50 - count };
  }
  return { current: 'Bronze', next: 'Silver', progress: count / 20, needed: 20 - count };
};

// String utilities
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getInitials = (firstName: string, lastName: string): string => {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

// Mock M-Pesa STK Push
export const mockLipanaSTKPush = async (phoneNumber: string, amount: number): Promise<{ success: boolean; message: string; checkoutRequestID?: string }> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      if (success) {
        resolve({
          success: true,
          message: 'STK Push sent successfully',
          checkoutRequestID: `CID${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        });
      } else {
        resolve({
          success: false,
          message: 'Failed to send STK Push. Please try again.',
        });
      }
    }, 1500);
  });
};

// Generate mock ID
export const generateMockId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
