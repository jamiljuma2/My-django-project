'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Upload,
  DollarSign,
  Star,
  Settings,
  LogOut,
  X,
  FileText,
  Wallet,
  Bell,
  BarChart3,
  Users,
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { toast } from '@/components/common/Toast';
import { UserRole } from '@/types';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const writerLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard/writer', icon: <LayoutDashboard size={20} /> },
  { label: 'Subscription', href: '/dashboard/writer/subscription', icon: <BookOpen size={20} /> },
  { label: 'Available Tasks', href: '/dashboard/writer/available-tasks', icon: <CheckSquare size={20} /> },
  { label: 'My Tasks', href: '/dashboard/writer/my-tasks', icon: <Upload size={20} /> },
  { label: 'Upload Work', href: '/dashboard/writer/upload', icon: <Upload size={20} /> },
  { label: 'Earnings', href: '/dashboard/writer/earnings', icon: <DollarSign size={20} /> },
  { label: 'Ratings & Badge', href: '/dashboard/writer/ratings', icon: <Star size={20} /> },
  { label: 'Settings', href: '/dashboard/writer/settings', icon: <Settings size={20} /> },
];

const studentLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard/student', icon: <LayoutDashboard size={20} /> },
  { label: 'Post Assignment', href: '/dashboard/student/post-assignment', icon: <FileText size={20} /> },
  { label: 'My Assignments', href: '/dashboard/student/my-assignments', icon: <BookOpen size={20} /> },
  { label: 'Wallet', href: '/dashboard/student/wallet', icon: <Wallet size={20} /> },
  { label: 'Notifications', href: '/dashboard/student/notifications', icon: <Bell size={20} /> },
  { label: 'Settings', href: '/dashboard/student/settings', icon: <Settings size={20} /> },
];

const adminLinks: SidebarLink[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: <BarChart3 size={20} /> },
  { label: 'Assignments', href: '/dashboard/admin/assignments', icon: <BookOpen size={20} /> },
  { label: 'Submissions', href: '/dashboard/admin/submissions', icon: <FileText size={20} /> },
  { label: 'Payments', href: '/dashboard/admin/payments', icon: <DollarSign size={20} /> },
  { label: 'Users', href: '/dashboard/admin/users', icon: <Users size={20} /> },
  { label: 'Ratings', href: '/dashboard/admin/ratings', icon: <Star size={20} /> },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Lock body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const getLinksByRole = (role: UserRole): SidebarLink[] => {
    switch (role) {
      case 'writer':
        return writerLinks;
      case 'student':
        return studentLinks;
      case 'admin':
        return adminLinks;
      default:
        return [];
    }
  };

  const links = user ? getLinksByRole(user.role) : [];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setShowLogoutConfirm(false);
    router.push('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay - only on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container - Responsive */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-[80%] max-w-xs
          lg:w-64 lg:relative lg:top-0 lg:h-screen
          bg-white border-r border-gray-200 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg self-end transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="space-y-2 border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to logout? You will need to login again to access your account.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmLogout}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
