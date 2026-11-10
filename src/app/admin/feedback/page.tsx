'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Check, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  User 
} from 'lucide-react';
import { MOCK_FEEDBACK_TICKETS } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FeedbackTicket } from '@/types/database';

export default function AdminFeedbackPage() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>(MOCK_FEEDBACK_TICKETS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
    setToastMessage('Murojaat ko\'rib chiqildi va hal etildi deb belgilandi.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          {toastMessage}
        </div>
      )}

      <div className="border-b border-ivory-200/90 pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
          Learner Support & Vocabulary Inaccuracies
        </span>
        <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
          User Feedback & Support
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          O'quvchilar tomonidan yuborilgan takliflar, xatoliklar va tarjima tuzatishlari.
        </p>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <Card key={t.id} padding="lg" className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sage-200 text-forest-900">
                  {t.category.replace('_', ' ')}
                </span>
                <span className="font-mono text-ink-500">{t.userEmail}</span>
              </div>
              <span
                className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  t.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : t.status === 'in_progress'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-ivory-200 text-ink-700'
                }`}
              >
                {t.status.replace('_', ' ')}
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-ink-950">
              {t.subject}
            </h3>

            <p className="text-xs sm:text-sm text-ink-800 leading-relaxed bg-ivory-50 p-3.5 rounded-xl border border-ivory-200 font-sans">
              "{t.message}"
            </p>

            <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-xs">
              <span className="text-ink-400 font-mono text-[11px]">
                Yuborilgan vaqt: {t.createdAt.split('T')[0]} • Muallif: {t.userName}
              </span>

              {t.status !== 'resolved' && (
                <Button
                  size="sm"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={() => handleResolve(t.id)}
                >
                  Hal Etildi (Resolve)
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
