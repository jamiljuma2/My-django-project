'use client';

import { DashboardLayout } from '@/components/layouts';
import { Card, Badge, ProgressBar } from '@/components/common';
import { mockWriters, mockRatings } from '@/utils/mockData';
import { getProgressToNextBadge } from '@/utils/helpers';
import { Award, Star, TrendingUp } from 'lucide-react';

export default function RatingsPage() {
  const writer = mockWriters[0];
  const writerRatings = mockRatings.filter((r) => r.writerId === writer.id);
  const badgeProgress = getProgressToNextBadge(writer.completedTasks);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Badge</h1>
          <p className="text-gray-600 mt-2">Track your performance and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-yellow-600" size={32} />
            </div>
            <p className="text-gray-600 mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-gray-900">{writer.rating.toFixed(1)}</p>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={star <= writer.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-blue-600" size={32} />
            </div>
            <p className="text-gray-600 mb-1">Current Badge</p>
            <p className="text-4xl font-bold text-blue-600">{writer.badge}</p>
            <p className="text-sm text-gray-500 mt-2">{writer.completedTasks} tasks completed</p>
          </Card>

          <Card className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-green-600" size={32} />
            </div>
            <p className="text-gray-600 mb-1">Total Reviews</p>
            <p className="text-4xl font-bold text-gray-900">{writerRatings.length}</p>
            <p className="text-sm text-gray-500 mt-2">From students</p>
          </Card>
        </div>

        {/* Badge Progress */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Badge Progress</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Current: {badgeProgress.current}</p>
                <p className="text-sm text-gray-600">Next: {badgeProgress.next}</p>
              </div>
              <p className="text-sm text-gray-600">
                {badgeProgress.needed} more tasks to {badgeProgress.next}
              </p>
            </div>
            <ProgressBar progress={badgeProgress.progress * 100} />
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            {['Bronze', 'Silver', 'Gold', 'Platinum'].map((badge, idx) => (
              <div
                key={badge}
                className={`text-center p-4 rounded-lg ${
                  badge === writer.badge
                    ? 'bg-blue-100 border-2 border-blue-600'
                    : 'bg-gray-50'
                }`}
              >
                <p className="font-semibold text-gray-900">{badge}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {idx === 0 ? '0-19' : idx === 1 ? '20-49' : idx === 2 ? '50-99' : '100+'} tasks
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
          <div className="space-y-4">
            {writerRatings.map((rating) => (
              <div key={rating.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= rating.score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{new Date(rating.createdAt).toLocaleDateString()}</p>
                </div>
                {rating.comment && <p className="text-gray-700">{rating.comment}</p>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
