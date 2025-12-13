'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useModalStore } from '@/store';

interface ModalProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  id,
  title,
  children,
  onClose,
  size = 'md',
  showCloseButton = true,
}) => {
  const { isOpen, closeModal } = useModalStore();
  const open = isOpen(id);

  const handleClose = () => {
    closeModal(id);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />
      <div
        className={`relative bg-white rounded-lg shadow-xl p-6 ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export const ModalHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 border-b pb-4">{children}</div>
);

export const ModalBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-4">{children}</div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-6 border-t pt-4 flex gap-3 justify-end">{children}</div>
);
