'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';

export default function AdminSubmissionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-600 mt-2">Review writer submissions and approvals.</p>
        </div>
        <Card>
          <p className="text-gray-600">Admin submissions view is coming soon.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
