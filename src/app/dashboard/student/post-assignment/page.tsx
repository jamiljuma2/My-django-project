'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts';
import { Card, Input, Textarea, FileUpload, Button } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { formatCurrency } from '@/utils/helpers';

export default function PostAssignmentPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Assignment submitted for review!');
      setFormData({ title: '', description: '', budget: '', deadline: '' });
      setFiles([]);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post New Assignment</h1>
          <p className="text-gray-600 mt-2">Fill in the details for your assignment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Assignment Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Research Paper on Climate Change"
                  required
                />
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed requirements for the assignment..."
                  rows={6}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Budget (KES)"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="2000"
                    required
                  />
                  <Input
                    label="Deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment Files
                  </label>
                  <FileUpload onFilesSelected={setFiles} />
                </div>
                <Button type="submit" fullWidth isLoading={isSubmitting}>
                  Submit Assignment
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Assignment Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Budget</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formData.budget ? formatCurrency(Number(formData.budget)) : 'KES 0'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Files</p>
                  <p className="font-medium text-gray-900">{files.length} file(s)</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Be clear and specific</li>
                <li>✓ Set reasonable deadline</li>
                <li>✓ Include all requirements</li>
                <li>✓ Upload reference materials</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
