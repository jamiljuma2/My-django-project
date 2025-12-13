'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';
import { BookOpen, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/store';
import { formatCurrency } from '@/utils/helpers';
import { mockStudents, mockAssignments } from '@/utils/mockData';

export default function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const student = mockStudents[0];
  const myAssignments = mockAssignments.filter((a) => a.studentId === student.id);

  const stats = [
    { label: 'Wallet Balance', value: formatCurrency(student.wallet), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Assignments', value: student.assignmentCount, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'In Progress', value: myAssignments.filter((a) => a.status === 'in_progress').length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed', value: myAssignments.filter((a) => a.status === 'completed').length, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-2">Manage your assignments and track progress</p>
        </div>

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

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/dashboard/student/post-assignment" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">Post New Assignment</h3>
              <p className="text-sm text-gray-600">Submit a new assignment for writers</p>
            </a>
            <a href="/dashboard/student/my-assignments" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">View Assignments</h3>
              <p className="text-sm text-gray-600">Check status of your assignments</p>
            </a>
            <a href="/dashboard/student/wallet" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">Top Up Wallet</h3>
              <p className="text-sm text-gray-600">Add funds to your account</p>
            </a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
