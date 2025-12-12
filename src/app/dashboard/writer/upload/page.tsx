'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layouts';
import { Card, FileUpload, Button, Select } from '@/components/common';
import { toast } from '@/components/common/Toast';
import { mockTasks } from '@/utils/mockData';

export default function UploadWorkPage() {
  const [selectedTask, setSelectedTask] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState('');

  const inProgressTasks = mockTasks.filter((t) => t.status === 'in_progress');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pending = localStorage.getItem('writerPendingSubmission');
      if (pending) setPendingTaskId(pending);
    }
  }, []);

  const handleSubmit = async () => {
    if (pendingTaskId) {
      toast.error('You already have a submission awaiting approval. Wait for approval before uploading another.');
      return;
    }
    if (!selectedTask) {
      toast.error('Please select a task');
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsUploading(true);
    
    // Mock upload
    setTimeout(() => {
      toast.success('Work submitted successfully!');
      setPendingTaskId(selectedTask);
      if (typeof window !== 'undefined') {
        localStorage.setItem('writerPendingSubmission', selectedTask);
      }
      setSelectedTask('');
      setFiles([]);
      setIsUploading(false);
    }, 2000);
  };

  const handleMarkApproved = () => {
    setPendingTaskId('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('writerPendingSubmission');
    }
    toast.success('Submission marked as approved. You can upload the next task.');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Completed Work</h1>
          <p className="text-gray-600 mt-2">Submit your finished assignment files</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Files</h2>
              
              <div className="space-y-6">
                {pendingTaskId && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    You have a submission pending approval. Please wait for approval before uploading another task.
                  </div>
                )}
                <Select
                  label="Select Task"
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  options={inProgressTasks.map((t) => ({
                    value: t.id,
                    label: t.title,
                  }))}
                  required
                />

                <FileUpload onFilesSelected={setFiles} maxFiles={10} />

                <div className="space-y-3">
                  <Button
                    fullWidth
                    onClick={handleSubmit}
                    isLoading={isUploading}
                    disabled={!!pendingTaskId || !selectedTask || files.length === 0}
                  >
                    Submit Work
                  </Button>
                  {pendingTaskId && (
                    <Button fullWidth variant="secondary" onClick={handleMarkApproved}>
                      Mark Previous Submission Approved (simulate)
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Submission Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>✓ Ensure all files are properly named</li>
                <li>✓ Double-check for spelling and grammar</li>
                <li>✓ Include all required documents</li>
                <li>✓ Follow the assignment requirements</li>
                <li>✓ Submit before the deadline</li>
                <li>✓ Maximum file size: 50MB</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
