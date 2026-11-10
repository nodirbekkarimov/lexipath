'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Cpu, 
  Shield 
} from 'lucide-react';
import { MOCK_SYSTEM_SETTINGS } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SystemSettingItem } from '@/types/database';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettingItem[]>(MOCK_SYSTEM_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdate = (key: string, val: string | number) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: val } : s))
    );
  };

  const handleSave = () => {
    setToastMessage('Tizim konfiguratsiyasi parametrlari muvaffaqiyatli saqlandi!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 inline mr-2" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200/90 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
            Global Environment & Algorithmic Knobs
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
            System Settings
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            SuperMemo SM-2 algoritmi koeffitsiyentlari, AI xavfsizlik cheklovlari va sessiya vaqtlari.
          </p>
        </div>

        <Button
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          Konfiguratsiyani Saqlash
        </Button>
      </div>

      <Card padding="lg" className="space-y-6">
        <div className="space-y-5">
          {settings.map((item) => (
            <div
              key={item.key}
              className="p-4 bg-ivory-50 border border-ivory-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-sm text-ink-950">
                    {item.name}
                  </span>
                  <span className="font-mono text-[10px] text-ink-400 uppercase bg-ivory-200 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-ink-600 font-sans">
                  {item.description}
                </p>
                <div className="font-mono text-[11px] text-ink-400">
                  Key: {item.key}
                </div>
              </div>

              <div className="w-full md:w-56 flex-shrink-0">
                <input
                  type={typeof item.value === 'number' ? 'number' : 'text'}
                  value={String(item.value)}
                  onChange={(e) =>
                    handleUpdate(
                      item.key,
                      typeof item.value === 'number' ? Number(e.target.value) : e.target.value
                    )
                  }
                  className="w-full bg-white border border-ivory-300 rounded-lg p-2 font-mono text-xs text-ink-950 focus:ring-1 focus:ring-forest-700 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
