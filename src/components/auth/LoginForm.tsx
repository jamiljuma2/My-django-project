'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Card } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { useAuthStore } from '@/store';
import { validateEmail, validatePassword } from '@/utils/helpers';
import { mockWriters, mockStudents } from '@/utils/mockData';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = { email: '', password: '' };
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Mock authentication (replace with actual API call)
    setTimeout(() => {
      // Find user in mock data and any locally registered users
      let locallyRegistered: any[] = [];
      try {
        locallyRegistered = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          : [];
      } catch (_) {}
      const allUsers = [...mockWriters, ...mockStudents, ...locallyRegistered];
      const user = allUsers.find((u) => u.email === formData.email);

      if (user) {
        const normalizedUser =
          user.role === 'writer' && typeof (user as any).isSubscribed === 'undefined'
            ? { ...user, isSubscribed: true }
            : user;

        login(normalizedUser as any);
        toast.success('Login successful!');
        // Redirect based on role
        if (user.role === 'writer') {
          router.push('/dashboard/writer');
        } else if (user.role === 'student') {
          router.push('/dashboard/student');
        } else {
          router.push('/dashboard/admin');
        }
      } else {
        toast.error('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to EduLink Writers</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          required
        />
        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 font-medium hover:underline">
          Register here
        </Link>
      </p>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600 font-medium mb-1">Demo Accounts:</p>
        <p className="text-xs text-gray-600">Writer: alice@example.com</p>
        <p className="text-xs text-gray-600">Student: student1@example.com</p>
      </div>
    </Card>
  );
};
