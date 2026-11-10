'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Users, 
  Cpu 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AdminReportsPage() {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const reports = [
    {
      id: 'rep-1',
      title: 'Full Lexical Database Export (CSV / JSON)',
      description: 'Barcha tasdiqlangan va AI tomonidan yaratilgan so\'zlar, ularning O\'zbekcha tarjimalari va kollokatsiyalari.',
      category: 'Lexicon Data',
      frequency: 'On-Demand',
    },
    {
      id: 'rep-2',
      title: 'Monthly Learner Engagement & Retention Audit',
      description: 'Faol o\'rganuvchilar, SuperMemo SM-2 muvaffaqiyat foizlari va imtihon sanalari hisoboti.',
      category: 'Pedagogy & Analytics',
      frequency: 'Monthly',
    },
    {
      id: 'rep-3',
      title: 'AI Token Consumption & Financial Cost Audit',
      description: 'Google Gemini 1.5 API xarajatlari, chaqiruvlar soni va xatoliklar jurnali.',
      category: 'Finance & Infrastructure',
      frequency: 'Weekly',
    },
    {
      id: 'rep-4',
      title: 'Security & User Authorization Audit Trail',
      description: 'Administratorlar bajargan amallar, bloklangan hisoblar va kirish IP manzillari jurnali.',
      category: 'Compliance & Security',
      frequency: 'Daily',
    }
  ];

  const handleDownload = (title: string) => {
    setDownloadToast(`"${title}" muvaffaqiyatli yuklab olindi (.CSV)!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 inline mr-2" />
          <span>{downloadToast}</span>
        </div>
      )}

      <div className="border-b border-ivory-200/90 pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
          Data Export Center & Compliance Reports
        </span>
        <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
          Reports & Exports
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          Platforma faoliyati, leksik baza va xavfsizlik jurnallarini eksport qilish markazi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <Card key={rep.id} padding="lg" className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] uppercase bg-forest-100 text-forest-800 font-bold px-2 py-0.5 rounded">
                  {rep.category}
                </span>
                <span className="font-mono text-[11px] text-ink-400">
                  {rep.frequency}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-ink-950 mt-3">
                {rep.title}
              </h3>
              <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-ivory-200 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => handleDownload(rep.title)}
              >
                Eksport Qilish (.CSV)
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
