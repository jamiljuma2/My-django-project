'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';

export default function AdminRatingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ratings</h1>
          <p className="text-gray-600 mt-2">Review writer performance and feedback.</p>
        </div>
        <Card>
          <p className="text-gray-600">Admin ratings view is coming soon.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
