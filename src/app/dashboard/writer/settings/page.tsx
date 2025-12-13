'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Input, Button } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { useAuthStore } from '@/store';

export default function WriterSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
          <form className="space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button>Update Password</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
