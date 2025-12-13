'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Card } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { useAuthStore } from '@/store';
import { validateEmail } from '@/utils/helpers';

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

    // Production authentication - only check registered users
    setTimeout(() => {
      // Get registered users from localStorage only
      let registeredUsers: any[] = [];
      try {
        registeredUsers = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          : [];
      } catch (_) {
        registeredUsers = [];
      }

      // Find user by email
      const user = registeredUsers.find((u) => u.email === formData.email);

      if (!user) {
        toast.error('No account found with this email. Please register first.');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (user.password !== formData.password) {
        toast.error('Invalid password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful authentication
      const normalizedUser =
        user.role === 'writer' && typeof user.isSubscribed === 'undefined'
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
        Don''t have an account?{' '}
        <Link href="/register" className="text-blue-600 font-medium hover:underline">
          Register here
        </Link>
      </p>
    </Card>
  );
};

