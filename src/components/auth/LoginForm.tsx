'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Button, Card } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { useAuthStore } from '@/store';
import { validateEmail } from '@/utils/helpers';
import { apiClient } from '@/services/api';

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

    try {
      // Call backend API
      const response = await apiClient.login(formData.email, formData.password);

      if (!response || !response.success) {
        toast.error(response?.error || 'Login failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store auth token if provided
      if (response.data?.token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }

      // Update auth store with user data
      const user = response.data?.user || response.data;
      login(user);
      toast.success('Login successful!');

      // Redirect based on role
      const role = user.role || 'student';
      router.push(`/dashboard/${role}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      setIsLoading(false);
    }
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
