'use client';

import React, { useState } from 'react';
import { Card, Badge, Button } from '@/components/common';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/utils/helpers';
import { mockTasks } from '@/utils/mockData';
import { Clock, DollarSign, FileText } from 'lucide-react';

export const MyTasksList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'in_progress' | 'submitted' | 'completed'>('in_progress');

  const myTasks = mockTasks.filter((t) => t.writerId && t.status !== 'available');
  const filteredTasks = myTasks.filter((t) => {
    if (activeTab === 'in_progress') return t.status === 'in_progress';
    if (activeTab === 'submitted') return t.status === 'submitted';
    if (activeTab === 'completed') return t.status === 'completed';
    return false;
  });

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { key: 'in_progress', label: 'In Progress' },
          { key: 'submitted', label: 'Submitted' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
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

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks in this category</p>
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <Badge className={getStatusColor(task.status)}>
                  {getStatusLabel(task.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign size={18} />
                  <span className="font-semibold">{formatCurrency(task.budget)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={18} />
                  <span>{formatDate(task.deadline)}</span>
                </div>
                {task.claimedAt && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FileText size={18} />
                    <span>Claimed {formatDate(task.claimedAt)}</span>
                  </div>
                )}
              </div>

              {activeTab === 'in_progress' && (
                <Button fullWidth>Upload Submission</Button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
