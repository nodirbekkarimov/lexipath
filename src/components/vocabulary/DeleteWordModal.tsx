'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lemma: string;
}

export function DeleteWordModal({
  isOpen,
  onClose,
  onConfirm,
  lemma,
}: DeleteWordModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Word from Vault"
      size="sm"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-start space-x-3 text-ink-700 text-sm">
          <div className="p-2 rounded-full bg-terracotta-50 text-terracotta-700 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p>
              Are you sure you want to remove <strong className="font-serif text-ink-950">&ldquo;{lemma}&rdquo;</strong> from your vocabulary vault?
            </p>
            <p className="text-xs text-ink-500 mt-1">
              Your spaced repetition history and personal study notes for this word will be deleted.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, Remove Word
          </Button>
        </div>
      </div>
    </Modal>
  );
}
