import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, STKPushRequest, STKPushResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      // Required for Django session + CSRF cookies over CORS
      withCredentials: true,
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
    });

    // Add interceptor to include auth token (supports legacy `auth_token` and new `access` key)
    this.client.interceptors.request.use((config) => {
      const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
      const legacy = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const token = access || legacy;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Global error interceptor to surface correlation ID
    this.client.interceptors.response.use(
      (response) => {
        try {
          const cid = response?.headers?.["x-correlation-id"] || null;
          const detail = response?.data || null;
          const evt = new CustomEvent("api-success", {
            detail: {
              message: detail?.message || "Success",
              status: response?.status,
              cid,
              bodyCid: detail?.data?.cid || null,
              url: response?.config?.url || null,
              method: response?.config?.method || null,
            },
          });
          if (typeof window !== "undefined") window.dispatchEvent(evt);
        } catch {}
        return response;
      },
      (error) => {
        try {
          const cid = error?.response?.headers?.["x-correlation-id"] || null;
          const detail = error?.response?.data || null;
          const message = detail?.message || error?.message || "Request failed";
          const evt = new CustomEvent("api-error", {
            detail: {
              message,
              status: error?.response?.status,
              cid,
              bodyCid: detail?.data?.cid || null,
              error: detail?.error || null,
              url: error?.config?.url || null,
              method: error?.config?.method || null,
            },
          });
          if (typeof window !== "undefined") window.dispatchEvent(evt);
        } catch {}
        return Promise.reject(error);
      }
    );
  }

  // Normalized response/error handling helpers
  handleResponse<T>(res: { data: T }) {
    return res.data;
  }

  handleError(err: any) {
    const message = err?.response?.data?.message || err?.message || 'Request failed';
    return Promise.reject({
      status: 'error',
      message,
      error: err?.response?.data?.error || null,
    });
  }
  }

  // ============ AUTH ENDPOINTS ============
  async login(username: string, password: string) {
    const response = await this.post<any>('/api/drf-auth/login/', { username, password });
    // Store token in localStorage for subsequent requests
    if (response.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access', response.data.token);
      }
    }
    return response;
  }

  async register(username: string, password: string, email: string) {
    const response = await this.post<any>('/api/drf-auth/register/', { username, password, email });
    // Store token in localStorage for subsequent requests
    if (response.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('access', response.data.token);
      }
    }
    return response;
  }

  async logout() {
    const response = await this.post<any>('/api/drf-auth/logout/', {});
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access');
      localStorage.removeItem('auth_token');
    }
    return response;
  }

  async getCurrentUser() {
    return this.get<any>('/api/drf-auth/user/');
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
  private async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    const axiosError = error as AxiosError<any>;
    console.error('API Error:', axiosError);
    return {
      success: false,
      error: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message || 'An error occurred',
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



