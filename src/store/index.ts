import { create } from 'zustand';
import { User, UserRole, Notification } from '@/types';
import { mockNotifications, mockWriters, mockStudents } from '@/utils/mockData';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSubscribed: (subscribed: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setSubscribed: (subscribed: boolean) =>
    set((state) => {
      const currentUser = state.user;
      if (currentUser?.email && typeof window !== 'undefined') {
        try {
          const existing = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const updatedList = existing.map((u: any) =>
            u.email === currentUser.email ? { ...u, isSubscribed: subscribed } : u
          );
          localStorage.setItem('registeredUsers', JSON.stringify(updatedList));
        } catch (_) {}
      }

      return {
        user: currentUser ? { ...currentUser, isSubscribed: subscribed } : null,
      };
    }),
}));

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: mockNotifications,
  addNotification: (notification: Notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
  markAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  setNotifications: (notifications: Notification[]) =>
    set({ notifications }),
}));

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// Get initial sidebar state from localStorage or default to true
const getInitialSidebarState = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem('sidebarOpen');
    return stored !== null ? JSON.parse(stored) : true;
  } catch {
    return true;
  }
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: getInitialSidebarState(),
  toggleSidebar: () =>
    set((state) => {
      const newState = !state.sidebarOpen;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sidebarOpen', JSON.stringify(newState));
        } catch {}
      }
      return { sidebarOpen: newState };
    }),
  setSidebarOpen: (open: boolean) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sidebarOpen', JSON.stringify(open));
      } catch {}
    }
    return set({ sidebarOpen: open });
  },
}));

interface ModalStore {
  openModals: string[];
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  openModals: [],
  openModal: (id: string) =>
    set((state) => ({
      openModals: [...new Set([...state.openModals, id])],
    })),
  closeModal: (id: string) =>
    set((state) => ({
      openModals: state.openModals.filter((m) => m !== id),
    })),
  closeAll: () => set({ openModals: [] }),
  isOpen: (id: string) => get().openModals.includes(id),
}));

interface PaymentStore {
  stkPushInProgress: boolean;
  setStkPushInProgress: (inProgress: boolean) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  stkPushInProgress: false,
  setStkPushInProgress: (inProgress: boolean) =>
    set({ stkPushInProgress: inProgress }),
}));
