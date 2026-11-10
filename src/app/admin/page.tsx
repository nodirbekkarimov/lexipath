'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Cpu, 
  ShieldCheck, 
  Check, 
  Edit3, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  MOCK_PASSAGES, 
  MOCK_VOCABULARY, 
  MOCK_ADMIN_USERS, 
  MOCK_AI_LOGS, 
  MOCK_AUDIT_LOGS 
} from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, CefrBadge, RoleBadge } from '@/components/ui/Badge';

export default function AdminOverviewPage() {
  const [pendingQueue, setPendingQueue] = useState(
    MOCK_VOCABULARY.filter((v) => v.verificationStatus === 'pending_review')
  );
  const [approvedToast, setApprovedToast] = useState<string | null>(null);

  const handleApprove = (id: string, word: string) => {
    setPendingQueue((prev) => prev.filter((item) => item.id !== id));
    setApprovedToast(`"${word}" muvaffaqiyatli tasdiqlandi va global leksikonga qo'shildi!`);
    setTimeout(() => setApprovedToast(null), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Feedback */}
      {approvedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated flex items-center space-x-2 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{approvedToast}</span>
        </div>
      )}

      {/* Admin Masthead Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-ivory-200/90 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-bold">
              Operations & Curriculum Management
            </span>
            <span className="text-ink-300">•</span>
            <span className="text-[11px] font-mono text-ink-500">
              Demo Environment (Verified Data Layer)
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 mt-1">
            Platform Overview & Operations
          </h1>
          <p className="text-sm text-ink-600 mt-1 max-w-2xl">
            Foydalanuvchilar faolligi, AI xarajatlari, yangi leksik navbat va mutolaa matnlari holati.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/admin/vocabulary">
            <Button size="sm" variant="outline" leftIcon={<Layers className="w-4 h-4" />}>
              Manage Vocabulary
            </Button>
          </Link>
          <Link href="/admin/reading">
            <Button size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
              Publish New Passage
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Total Registered Learners</span>
            <Users className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-ink-950">1,280</span>
            <span className="text-xs text-emerald-700 font-bold">↑ +14%</span>
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-mono">
            348 active today (27% engagement)
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Verified Lexicon Size</span>
            <Layers className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-ink-950">840</span>
            <span className="text-xs text-forest-700 font-mono">lemmas</span>
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-mono">
            {pendingQueue.length} pending tutor audit
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Published Reading Texts</span>
            <BookOpen className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-ink-950">{MOCK_PASSAGES.length + 12}</span>
            <span className="text-xs text-ink-400 font-mono">passages</span>
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-mono">
            B2, C1 & C2 IELTS topics
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Daily AI Cost & Volume</span>
            <DollarSign className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-forest-900">$0.04</span>
            <span className="text-xs text-ink-400 font-mono">/ day</span>
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-mono">
            18.4k tokens (Gemini 1.5 Flash)
          </p>
        </Card>
      </div>

      {/* Main Grid: Pending AI Curation Queue & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Lexical Curation Queue (Needs Review) */}
        <div className="lg:col-span-7 space-y-6">
          <Card padding="lg">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-950 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-forest-700" />
                  <span>AI Leksik Navbati (Curation Queue)</span>
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Google Gemini tomonidan matnlardan ajratib olingan va tasdiq kutilayotgan so'zlar
                </p>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {pendingQueue.length} Pending
              </span>
            </div>

            {pendingQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-ink-500 font-mono">
                Barcha yangi so'zlar tasdiqlangan. Navbat bo'sh.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-ivory-50 border border-ivory-200 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-serif text-xl font-bold text-ink-950">
                          {item.word}
                        </span>
                        <span className="font-mono text-xs text-ink-500 italic">
                          {item.pos}
                        </span>
                        <CefrBadge level={item.cefrLevel} />
                        <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                          AI Ingested
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-800">
                      <strong className="text-ink-950">Definition:</strong> {item.definitionEn}
                    </p>

                    <div className="bg-sage-100/60 p-2.5 rounded-lg text-xs">
                      <span className="font-bold text-forest-900 block text-[10px] font-mono uppercase">
                        Synthesized Uzbek Translation:
                      </span>
                      <p className="font-serif text-ink-950 italic mt-0.5">
                        "{item.translationUz}"
                      </p>
                      {item.uzbekContextNotes && (
                        <p className="text-[11px] text-ink-700 mt-1 pt-1 border-t border-sage-200">
                          {item.uzbekContextNotes}
                        </p>
                      )}
                    </div>

                    <blockquote className="text-[11px] font-serif text-ink-500 italic border-l-2 border-forest-700 pl-2.5">
                      "{item.contextSentence}"
                    </blockquote>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-ivory-200">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                        onClick={() => handleApprove(item.id, item.word)}
                      >
                        Approve & Publish
                      </Button>
                      <Link href={`/admin/vocabulary`}>
                        <Button size="sm" variant="outline" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                          Edit Nuance
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 5 Cols: System Health & Audit Stream */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Operational Health Card */}
          <Card padding="md">
            <h3 className="font-serif text-base font-bold text-ink-950 border-b border-ivory-200 pb-3 mb-3">
              Operational System Health
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Database Engine:</span>
                <span className="font-mono text-forest-800 font-bold">Supabase PostgreSQL 15.6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Row-Level Security (RLS):</span>
                <span className="font-mono text-emerald-700 font-bold">Active & Enforced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">AI Gateway (Gemini):</span>
                <span className="font-mono text-forest-800 font-bold">Connected (avg 420ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-600">Session Guard:</span>
                <span className="font-mono text-forest-800 font-bold">Next.js Edge Middleware</span>
              </div>
            </div>
          </Card>

          {/* Recent Audit Log Stream */}
          <Card padding="md">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-3 mb-3">
              <h3 className="font-serif text-base font-bold text-ink-950">
                Security & Audit Stream
              </h3>
              <Link href="/admin/audit-logs" className="text-xs text-forest-700 hover:text-forest-900 font-semibold">
                View all
              </Link>
            </div>

            <div className="divide-y divide-ivory-100 text-xs">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-forest-800 font-bold">{log.action}</span>
                    <span className="text-ink-400">{log.timestamp.split('T')[1].replace('Z', '')}</span>
                  </div>
                  <p className="text-ink-800 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-ink-400 font-mono">
                    Actor: {log.actorEmail} ({log.actorRole})
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
