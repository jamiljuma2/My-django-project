'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';
import { BarChart3, DollarSign, FileText, Users } from 'lucide-react';
import { mockAssignments, mockWriters, mockStudents, mockPayments } from '@/utils/mockData';
import { formatCurrency } from '@/utils/helpers';

export default function AdminDashboardPage() {
  const totalAssignments = mockAssignments.length;
  const totalUsers = mockWriters.length + mockStudents.length;
  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { label: 'Total Assignments', value: totalAssignments, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Writers', value: mockWriters.length, icon: BarChart3, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Assignments</h2>
            <div className="space-y-3">
              {mockAssignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(assignment.budget)}</p>
                  </div>
                  <span className="text-xs text-gray-500">{assignment.status}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Writers</span>
                  <span className="font-semibold">{mockWriters.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Students</span>
                  <span className="font-semibold">{mockStudents.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
