'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-ink-950/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          role="dialog"
          aria-modal="true"
          className={`w-screen ${widthClasses[width]} bg-white shadow-2xl border-l border-ivory-200 flex flex-col animate-in slide-in-from-right duration-200`}
        >
          {/* Header */}
          <div className="p-6 border-b border-ivory-200 flex items-start justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink-950">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-ink-500 mt-1">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-400 hover:text-ink-800 hover:bg-ivory-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
