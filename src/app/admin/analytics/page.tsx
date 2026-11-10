'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Brain, 
  CheckCircle2, 
  Clock,
  Layers
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AdminAnalyticsPage() {
  const cohorts = [
    { cohort: 'Cohort Oct 2026', learners: 420, day7Retention: 78, day30Retention: 64 },
    { cohort: 'Cohort Sep 2026', learners: 380, day7Retention: 74, day30Retention: 61 },
    { cohort: 'Cohort Aug 2026', learners: 310, day7Retention: 71, day30Retention: 58 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-200/90 pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
          Platform-Wide Learning Diagnostics
        </span>
        <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
          Learning Analytics & Retention
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          O'quvchilar faolligi, SuperMemo SM-2 retensiyasi va kohort tahlillari.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="text-xs text-ink-500">Average Day-7 Retention</div>
          <div className="font-mono text-3xl font-bold text-ink-950 mt-2">76.4%</div>
          <p className="text-[11px] text-forest-700 mt-1 font-mono">EdTech soha me'yori: ~45%</p>
        </Card>
        <Card padding="md">
          <div className="text-xs text-ink-500">Avg Reviews Completed / User</div>
          <div className="font-mono text-3xl font-bold text-ink-950 mt-2">18.2 / wk</div>
          <p className="text-[11px] text-ink-500 mt-1 font-mono">Yuqori o'zlashtirish chastotasi</p>
        </Card>
        <Card padding="md">
          <div className="text-xs text-ink-500">C1/C2 Lexical Acquisition Rate</div>
          <div className="font-mono text-3xl font-bold text-forest-900 mt-2">+12.4 words/wk</div>
          <p className="text-[11px] text-ink-500 mt-1 font-mono">O'quvchi boshiga o'rtacha</p>
        </Card>
      </div>

      {/* Retention Cohorts Table */}
      <Card padding="lg">
        <h3 className="font-serif text-xl font-bold text-ink-950 border-b border-ivory-200 pb-3 mb-4">
          Oylik O'quvchi Kohortlari va Retensiya Dinamikasi
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ivory-200 text-ink-500 font-mono text-[11px] uppercase">
                <th className="py-2.5">O'quvchilar Kohorti</th>
                <th className="py-2.5">Jami O'quvchilar</th>
                <th className="py-2.5">7-Kunlik Retensiya</th>
                <th className="py-2.5">30-Kunlik Retensiya</th>
                <th className="py-2.5">Baholash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-100 font-mono">
              {cohorts.map((c) => (
                <tr key={c.cohort} className="hover:bg-ivory-50/60">
                  <td className="py-3 font-bold text-ink-950 font-serif text-sm">{c.cohort}</td>
                  <td className="py-3">{c.learners} o'quvchi</td>
                  <td className="py-3 text-forest-800 font-bold">{c.day7Retention}%</td>
                  <td className="py-3 text-emerald-700 font-bold">{c.day30Retention}%</td>
                  <td className="py-3">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      A'lo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
