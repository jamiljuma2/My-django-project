'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common';
import { Navbar } from '@/components/layouts';
import { BookOpen, CheckCircle, DollarSign, Shield, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar isDashboard={false} />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/ChatGPT%20Image%20Dec%2012%2C%202025%2C%2011_18_03%20PM.png"
              alt="EduLink Writers"
              width={72}
              height={72}
              className="rounded-xl shadow-md bg-white"
            />
            <span className="text-2xl font-semibold text-blue-700">EduLink Writers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Expert Writers for Your Assignments
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EduLink Writers is the premier marketplace connecting students with professional writers. Get quality work delivered on time, every time.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">Login</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose EduLink Writers?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Writers</h3>
            <p className="text-gray-600">
              All writers are vetted and verified to ensure quality and professionalism in every assignment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Safe and secure M-Pesa integration with escrow protection for both students and writers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Turnaround</h3>
            <p className="text-gray-600">
              Get your assignments completed quickly with our network of experienced writers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-yellow-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Subjects</h3>
            <p className="text-gray-600">
              From essays to research papers, programming to presentations - we cover it all.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">
              Admin review process ensures all submissions meet high quality standards.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fair Pricing</h3>
            <p className="text-gray-600">
              Competitive rates that are fair to both students and writers in the marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Students */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Students</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Post Your Assignment</h4>
                    <p className="text-gray-600">Upload your requirements and set your budget</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Wait for Approval</h4>
                    <p className="text-gray-600">Admin reviews and approves your assignment</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Writer Claims Task</h4>
                    <p className="text-gray-600">A qualified writer picks up your assignment</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Receive & Review</h4>
                    <p className="text-gray-600">Get your completed work and leave a rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Writers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Writers</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose a Subscription</h4>
                    <p className="text-gray-600">Select a plan that fits your workload</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Available Tasks</h4>
                    <p className="text-gray-600">View and claim tasks that match your expertise</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete the Work</h4>
                    <p className="text-gray-600">Upload your completed assignment</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Paid</h4>
                    <p className="text-gray-600">Receive payment directly to your M-Pesa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of students and writers using EduLink Writers</p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Account Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EduLink Writers</h3>
              <p className="text-gray-400">
                Connecting students with professional writers for quality academic assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Post Assignment</li>
                <li>How It Works</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Writers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Become a Writer</li>
                <li>Subscriptions</li>
                <li>Earnings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduLink Writers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
