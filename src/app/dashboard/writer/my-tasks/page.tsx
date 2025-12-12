'use client';

import { DashboardLayout } from '@/components/layouts';
import { MyTasksList } from '@/components/writer';

export default function MyTasksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-2">Manage your claimed and completed tasks</p>
        </div>

        <MyTasksList />
      </div>
    </DashboardLayout>
  );
}
