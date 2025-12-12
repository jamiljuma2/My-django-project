'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Badge } from '@/components/common';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/utils/helpers';
import { mockAssignments, mockStudents } from '@/utils/mockData';

export default function MyAssignmentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const student = mockStudents[0];
  const myAssignments = mockAssignments.filter((a) => a.studentId === student.id);

  const filteredAssignments = activeTab === 'all'
    ? myAssignments
    : myAssignments.filter((a) => a.status === activeTab);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending_approval', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-2">Track and manage your posted assignments</p>
        </div>

        <div className="flex gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{assignment.description}</p>
                </div>
                <Badge className={getStatusColor(assignment.status)}>
                  {getStatusLabel(assignment.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-t">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(assignment.budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-semibold text-gray-900">{formatDate(assignment.deadline)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-semibold text-gray-900">{formatDate(assignment.createdAt)}</p>
                </div>
              </div>

              {assignment.writerId && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Writer assigned:</span> Processing by expert writer
                  </p>
                </div>
              )}
            </Card>
          ))}

          {filteredAssignments.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No assignments in this category</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
