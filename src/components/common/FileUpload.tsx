'use client';

import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { formatFileSize, validateFile, ALLOWED_FILE_TYPES } from '@/utils/helpers';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 50 * 1024 * 1024,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const newErrors: string[] = [];
      const validFiles: File[] = [];

      Array.from(newFiles).forEach((file) => {
        const validation = validateFile(file);
        if (!validation.valid) {
          newErrors.push(`${file.name}: ${validation.error}`);
        } else if (files.length + validFiles.length >= maxFiles) {
          newErrors.push(`Maximum ${maxFiles} files allowed`);
        } else {
          validFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
      }

      setErrors(newErrors);
    },
    [files, maxFiles, onFilesSelected]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <Upload className="mx-auto mb-3 text-gray-400" size={32} />
        <p className="text-gray-700 font-medium mb-1">Drag and drop files here</p>
        <p className="text-gray-500 text-sm mb-4">or click to select files</p>
        <p className="text-gray-500 text-xs">
          Supported formats: PDF, DOCX, PPTX, XLSX, ZIP, JPG, PNG, TXT, RAR, CSV (Max 50MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          accept={Array.from(ALLOWED_FILE_TYPES).join(',')}
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          {errors.map((error, idx) => (
            <p key={idx} className="text-red-700 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Selected Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
