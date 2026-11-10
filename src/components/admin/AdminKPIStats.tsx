'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Layers, BookOpen, Sparkles, Server, CheckCircle2 } from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';

export function AdminKPIStats() {
  const store = useLexiPathStore();

  const totalUsers = store.adminUsers.length + 1284;
  const totalWords = store.vocabulary.length + 2420;
  const totalPassages = store.passages.length + 42;
  const totalQuestions = store.quizQuestions.length + 580;
  const aiSuccessRate = '99.4%';

  const stats = [
    {
      label: 'Total Learners',
      value: totalUsers.toLocaleString(),
      subtext: '+48 this week',
      icon: Users,
      badge: 'Active',
      color: 'text-forest-700 bg-forest-50 border-forest-100',
    },
    {
      label: 'Curated Lexis Vault',
      value: totalWords.toLocaleString(),
      subtext: 'Academic C1/C2 terms',
      icon: Layers,
      badge: 'Curated',
      color: 'text-forest-800 bg-sage-100 border-sage-200',
    },
    {
      label: 'Published Passages',
      value: totalPassages.toLocaleString(),
      subtext: 'IELTS Academic genres',
      icon: BookOpen,
      badge: 'Live',
      color: 'text-amber-700 bg-amber-50 border-amber-100',
    },
    {
      label: 'AI Service Reliability',
      value: aiSuccessRate,
      subtext: 'Avg latency: 240ms',
      icon: Server,
      badge: 'Healthy',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <Card key={idx} className="p-5 flex flex-col justify-between shadow-subtle border-ivory-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-500">
                {s.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-3xl font-bold tracking-tight text-ink-950">
                  {s.value}
                </span>
                <Badge variant="outline" size="sm">
                  {s.badge}
                </Badge>
              </div>
              <p className="text-xs text-ink-500">{s.subtext}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
