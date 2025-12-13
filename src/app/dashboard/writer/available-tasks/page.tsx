'use client';

import { DashboardLayout } from '@/components/layouts';
import { AvailableTasksList } from '@/components/writer';
import { Card } from '@/components/common';
import { useAuthStore } from '@/store';
import { mockWriters } from '@/utils/mockData';

export default function AvailableTasksPage() {
  const writer = mockWriters[0]; // Mock data

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Tasks</h1>
            <p className="text-gray-600 mt-2">Browse and claim tasks that match your expertise</p>
          </div>
          <Card className="px-6 py-3">
            <p className="text-sm text-gray-600">Tasks Remaining Today</p>
            <p className="text-2xl font-bold text-blue-600">{writer.tasksRemaining}</p>
          </Card>
        </div>

        <AvailableTasksList />
      </div>
    </DashboardLayout>
  );
}
