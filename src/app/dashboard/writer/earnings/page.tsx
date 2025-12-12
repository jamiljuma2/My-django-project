'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card, Badge } from '@/components/common';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { mockPayments, mockWriters } from '@/utils/mockData';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function EarningsPage() {
  const writer = mockWriters[0];
  const writerPayments = mockPayments.filter((p) => p.userId === writer.id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-2">Track your payments and wallet balance</p>
        </div>

        {/* Wallet Card */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100">Current Balance</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(writer.wallet)}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <DollarSign size={32} />
              </div>
            </div>
            <p className="text-blue-100 text-sm">Available for withdrawal</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600">Total Earned</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(writer.wallet * 2)}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-green-600" size={32} />
              </div>
            </div>
            <p className="text-gray-600 text-sm">From {writer.completedTasks} completed tasks</p>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Reference</th>
                </tr>
              </thead>
              <tbody>
                {writerPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(payment.createdAt)}</td>
                    <td className="py-3 px-4 capitalize">{payment.type}</td>
                    <td className="py-3 px-4 font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{payment.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
