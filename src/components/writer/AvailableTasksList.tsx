'use client';

import React from 'react';
import { Card, Badge, Button } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { formatCurrency, formatDate, getDaysUntil } from '@/utils/helpers';
import { mockTasks } from '@/utils/mockData';
import { Clock, DollarSign } from 'lucide-react';

export const AvailableTasksList: React.FC = () => {
  const availableTasks = mockTasks.filter((t) => t.status === 'available');

  const handleClaimTask = (taskId: string) => {
    toast.success('Task claimed successfully!');
    // In real app: apiClient.claimTask(taskId)
  };

  if (availableTasks.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No available tasks at the moment</p>
          <p className="text-gray-400 mt-2">Check back later for new assignments</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {availableTasks.map((task) => (
        <Card key={task.id} hoverable>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-gray-600 line-clamp-2">{task.description}</p>
            </div>
            <Badge variant="primary">Available</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign size={18} />
              <span className="font-semibold">{formatCurrency(task.budget)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock size={18} />
              <span>
                {getDaysUntil(task.deadline)} days ({formatDate(task.deadline)})
              </span>
            </div>
          </div>

          <Button fullWidth onClick={() => handleClaimTask(task.id)}>
            Claim Task
          </Button>
        </Card>
      ))}
    </div>
  );
};
