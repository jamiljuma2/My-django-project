'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';

export default function AdminPaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Track payouts, refunds, and platform fees.</p>
        </div>
        <Card>
          <p className="text-gray-600">Admin payments view is coming soon.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
