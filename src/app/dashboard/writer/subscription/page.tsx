'use client';

import { DashboardLayout } from '@/components/layouts';
import { SubscriptionPlans } from '@/components/writer';

export default function WriterSubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-2">Choose a plan that fits your workload</p>
        </div>

        <SubscriptionPlans />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">How Subscriptions Work</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Your task limit resets every 24 hours</li>
            <li>• Upgrade anytime to increase your daily task limit</li>
            <li>• All payments are processed securely via M-Pesa</li>
            <li>• Premium members get priority support and bonus earnings</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
