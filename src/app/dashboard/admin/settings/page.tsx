'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card } from '@/components/common';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure platform preferences and roles.</p>
        </div>
        <Card>
          <p className="text-gray-600">Admin settings are coming soon.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
