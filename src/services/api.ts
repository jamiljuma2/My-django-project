import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, STKPushRequest, STKPushResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ============ AUTH ENDPOINTS ============
  async login(email: string, password: string) {
    return this.post<any>('/auth/login', { email, password });
  }

  async register(email: string, password: string, firstName: string, lastName: string, role: string) {
    return this.post<any>('/auth/register', { email, password, firstName, lastName, role });
  }

  async forgotPassword(email: string) {
    return this.post<any>('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.post<any>('/auth/reset-password', { token, newPassword });
  }

  async verifyEmail(token: string) {
    return this.post<any>('/auth/verify-email', { token });
  }

  async logout() {
    return this.post<any>('/auth/logout', {});
  }

  // ============ ASSIGNMENTS ENDPOINTS ============
  async getAssignments(status?: string) {
    return this.get<any>('/assignments', { params: { status } });
  }

  async getAssignment(id: string) {
    return this.get<any>(`/assignments/${id}`);
  }

  async createAssignment(data: any) {
    return this.post<any>('/assignments', data);
  }

  async updateAssignment(id: string, data: any) {
    return this.put<any>(`/assignments/${id}`, data);
  }

  async deleteAssignment(id: string) {
    return this.delete<any>(`/assignments/${id}`);
  }

  async approveAssignment(id: string) {
    return this.post<any>(`/assignments/${id}/approve`, {});
  }

  async rejectAssignment(id: string, reason: string) {
    return this.post<any>(`/assignments/${id}/reject`, { reason });
  }

  // ============ TASKS ENDPOINTS ============
  async getAvailableTasks() {
    return this.get<any>('/tasks/available');
  }

  async getMyTasks(status?: string) {
    return this.get<any>('/tasks/my-tasks', { params: { status } });
  }

  async claimTask(taskId: string) {
    return this.post<any>(`/tasks/${taskId}/claim`, {});
  }

  async submitTask(taskId: string, files: UploadedFile[]) {
    return this.post<any>(`/tasks/${taskId}/submit`, { files });
  }

  async getTask(id: string) {
    return this.get<any>(`/tasks/${id}`);
  }

  // ============ SUBMISSIONS ENDPOINTS ============
  async getSubmissions(status?: string) {
    return this.get<any>('/submissions', { params: { status } });
  }

  async getSubmission(id: string) {
    return this.get<any>(`/submissions/${id}`);
  }

  async approveSubmission(id: string) {
    return this.post<any>(`/submissions/${id}/approve`, {});
  }

  async rejectSubmission(id: string, reason: string) {
    return this.post<any>(`/submissions/${id}/reject`, { reason });
  }

  // ============ PAYMENTS ENDPOINTS ============
  async triggerLipanaSTK(data: STKPushRequest): Promise<ApiResponse<STKPushResponse>> {
    return this.post<STKPushResponse>('/payments/push-stk', data);
  }

  async getPayments(type?: string) {
    return this.get<any>('/payments', { params: { type } });
  }

  async getPaymentStatus(reference: string) {
    return this.get<any>(`/payments/${reference}/status`);
  }

  async releasePayment(submissionId: string) {
    return this.post<any>(`/payments/release/${submissionId}`, {});
  }

  // ============ USER ENDPOINTS ============
  async getCurrentUser() {
    return this.get<any>('/users/me');
  }

  async updateProfile(data: any) {
    return this.put<any>('/users/profile', data);
  }

  async getProfile(userId: string) {
    return this.get<any>(`/users/${userId}`);
  }

  async getWriterStats(writerId: string) {
    return this.get<any>(`/users/${writerId}/stats`);
  }

  // ============ SUBSCRIPTIONS ENDPOINTS ============
  async getSubscriptions() {
    return this.get<any>('/subscriptions');
  }

  async getMySubscription() {
    return this.get<any>('/subscriptions/my-subscription');
  }

  async upgradeSubscription(tier: string) {
    return this.post<any>('/subscriptions/upgrade', { tier });
  }

  // ============ UPLOADS ENDPOINTS ============
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post<any>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteFile(fileId: string) {
    return this.delete<any>(`/uploads/${fileId}`);
  }

  // ============ RATINGS ENDPOINTS ============
  async getRatings(userId: string) {
    return this.get<any>(`/ratings/user/${userId}`);
  }

  async createRating(taskId: string, score: number, comment?: string) {
    return this.post<any>('/ratings', { taskId, score, comment });
  }

  async getBadgeProgress(writerId: string) {
    return this.get<any>(`/ratings/${writerId}/badge-progress`);
  }

  // ============ NOTIFICATIONS ENDPOINTS ============
  async getNotifications() {
    return this.get<any>('/notifications');
  }

  async markAsRead(notificationId: string) {
    return this.put<any>(`/notifications/${notificationId}/read`, {});
  }

  async deleteNotification(notificationId: string) {
    return this.delete<any>(`/notifications/${notificationId}`);
  }

  // ============ ADMIN ENDPOINTS ============
  async getStats() {
    return this.get<any>('/admin/stats');
  }

  async getUsers(role?: string) {
    return this.get<any>('/admin/users', { params: { role } });
  }

  async getReports() {
    return this.get<any>('/admin/reports');
  }

  // ============ Helper Methods ============
  private async get<T>(url: string, config?: any) {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async post<T>(url: string, data?: any, config?: any) {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async put<T>(url: string, data?: any, config?: any) {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async delete<T>(url: string, config?: any) {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    const axiosError = error as AxiosError<any>;
    return {
      success: false,
      error: axiosError.response?.data?.error || 'An error occurred',
      message: axiosError.message,
    };
  }
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export const apiClient = new ApiClient();

