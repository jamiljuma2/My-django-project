'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';
import { BarChart3, CheckCircle, DollarSign, Star, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store';
import { formatCurrency } from '@/utils/helpers';
import { mockWriters } from '@/utils/mockData';

export default function WriterDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const writer = mockWriters[0]; // Mock data

  const stats = [
    { label: 'Wallet Balance', value: formatCurrency(writer.wallet), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Completed Tasks', value: writer.completedTasks, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Current Rating', value: writer.rating.toFixed(1), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Current Badge', value: writer.badge, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your writing activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/dashboard/writer/available-tasks" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">Browse Tasks</h3>
              <p className="text-sm text-gray-600">Find and claim new assignments</p>
            </a>
            <a href="/dashboard/writer/my-tasks" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">My Tasks</h3>
              <p className="text-sm text-gray-600">View your active assignments</p>
            </a>
            <a href="/dashboard/writer/earnings" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">View Earnings</h3>
              <p className="text-sm text-gray-600">Check your payment history</p>
            </a>
          </div>
        </Card>

        {/* Subscription Status */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Status</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold text-blue-600">{writer.subscription.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Tasks Remaining Today</p>
              <p className="text-2xl font-bold text-gray-900">{writer.tasksRemaining}</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
