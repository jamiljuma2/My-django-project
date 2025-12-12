'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card, Badge } from '@/components/common';
import { mockNotifications } from '@/utils/mockData';
import { useNotificationStore } from '@/store';
import { formatDateTime } from '@/utils/helpers';
import { Bell, X } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markAsRead, removeNotification } = useNotificationStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">Stay updated with your assignments</p>
          </div>
          {notifications.filter((n) => !n.read).length > 0 && (
            <Badge variant="primary">
              {notifications.filter((n) => !n.read).length} New
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No notifications yet</p>
              </div>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(notification.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
