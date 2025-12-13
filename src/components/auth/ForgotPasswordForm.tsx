'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input, Button, Card } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { validateEmail } from '@/utils/helpers';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Mock API call (replace with actual API call)
    setTimeout(() => {
      toast.success('Password reset link sent! Check your email.');
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <Link href="/login">
          <Button fullWidth>Back to Login</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          error={error}
          placeholder="Enter your email"
          required
        />
        <Button type="submit" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Login here
        </Link>
      </p>
    </Card>
  );
};
