'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useUIStore, useNotificationStore, useAuthStore } from '@/store';
import { Button } from '@/components/common';

export const Navbar: React.FC<{ isDashboard?: boolean }> = ({ isDashboard = false }) => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {isDashboard && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <Menu size={24} />
              </button>
            )}
            <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600">
              <Image
                src="/ChatGPT%20Image%20Dec%2012%2C%202025%2C%2011_18_03%20PM.png"
                alt="EduLink Writers"
                width={40}
                height={40}
                className="rounded-lg shadow-sm bg-white"
                priority
              />
              <span>EduLink Writers</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isDashboard && (
              <>
                <Link
                  href="/dashboard/student/notifications"
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {user && (
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size={18} />
                </Button>
              </>
            )}
            {!isDashboard && (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
