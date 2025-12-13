'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';

export default function AdminAssignmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-2">Manage and review platform assignments.</p>
        </div>
        <Card>
          <p className="text-gray-600">Admin assignments view is coming soon.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
