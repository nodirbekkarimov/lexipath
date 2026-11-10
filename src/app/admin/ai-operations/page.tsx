'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Sliders, 
  Eye, 
  RefreshCw,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { MOCK_AI_LOGS } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AIRequestLog } from '@/types/database';

export default function AdminAIOperationsPage() {
  const [logs, setLogs] = useState<AIRequestLog[]>(MOCK_AI_LOGS);
  const [selectedLog, setSelectedLog] = useState<AIRequestLog | null>(null);
  const [refreshToast, setRefreshToast] = useState(false);

  const totalTokens = logs.reduce((acc, l) => acc + l.inputTokenCount + l.outputTokenCount, 0);
  const totalCost = logs.reduce((acc, l) => acc + l.estimatedCostUsd, 0);
  const avgLatency = Math.round(logs.reduce((acc, l) => acc + l.latencyMs, 0) / logs.length);

  const handleRefresh = () => {
    setRefreshToast(true);
    setTimeout(() => setRefreshToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {refreshToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-2.5 rounded-xl shadow-elevated text-xs animate-in fade-in">
          AI operatsiyalari telemetriyasi yangilandi!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200/90 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
            Cognitive Infrastructure & Token Ledger
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
            AI Operations & Costs
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Google Gemini 1.5 Flash/Pro chaqiruvlari, token sarfi, hisoblangan xarajatlar va server-side promptlar nazorati.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={handleRefresh}
        >
          Telemetriyani Yangilash
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Estimated Cost (Today)</span>
            <DollarSign className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-forest-900">
              ${totalCost.toFixed(4)}
            </span>
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-mono">
            Oylik prognoz: ~$1.20
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Processed Tokens</span>
            <Cpu className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-ink-950">
              {totalTokens.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-ink-500 mt-2 font-mono">
            Input: 3,152 • Output: 1,070
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Average Latency</span>
            <Clock className="w-4 h-4 text-forest-700" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-ink-950">
              {avgLatency}
            </span>
            <span className="text-xs text-ink-400 font-mono">ms</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-2 font-mono">
            ✓ SLA normal (Target: &lt;1500ms)
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span>Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-mono text-3xl font-bold text-ink-950">96.8%</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-2 font-mono">
            1 rate-limited attempt recorded
          </p>
        </Card>
      </div>

      {/* Model Configuration Card */}
      <Card padding="lg" className="border-ivory-300">
        <h3 className="font-serif text-lg font-bold text-ink-950 border-b border-ivory-200 pb-3 mb-4">
          Active Model Configurations (Server-Side)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-ink-950">
                Leksik Boyitish & Tarjima Modeli
              </span>
              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Active
              </span>
            </div>
            <div className="font-mono text-ink-600">Model: google/gemini-1.5-flash</div>
            <div className="font-mono text-ink-600">Temperature: 0.20 (Strict academic fidelity)</div>
            <div className="text-ink-500 text-[11px]">
              Vazifasi: IELTS mutolaa matnlaridan so'z ta'riflari, kollokatsiyalar va O'zbekcha sharhlarni sintez qilish.
            </div>
          </div>

          <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-ink-950">
                Insho va Faol Nutqni Baholash Modeli
              </span>
              <span className="font-mono text-[10px] bg-forest-100 text-forest-800 px-2 py-0.5 rounded font-bold">
                Active
              </span>
            </div>
            <div className="font-mono text-ink-600">Model: google/gemini-1.5-pro</div>
            <div className="font-mono text-ink-600">Temperature: 0.15 (Extreme examiner objectivity)</div>
            <div className="text-ink-500 text-[11px]">
              Vazifasi: O'quvchining yozgan insho jumlalarini Cambridge 9-band mezonlari bo'yicha baholash.
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-forest-50 border border-forest-200 rounded-lg flex items-center space-x-2 text-xs text-forest-900 font-mono">
          <ShieldAlert className="w-4 h-4 text-forest-700 flex-shrink-0" />
          <span>Security Protocol: GEMINI_API_KEY hech qachon brauzerga yuborilmaydi. Barcha so'rovlar maxfiy server route-handlerlar orqali amalga oshiriladi.</span>
        </div>
      </Card>

      {/* Redacted AI Request Log Stream */}
      <div className="bg-white rounded-xl border border-ivory-200/90 overflow-hidden shadow-card">
        <div className="p-4 border-b border-ivory-200 bg-ivory-50/80 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-ink-950">
            Redacted AI Invocation Logs
          </h3>
          <span className="text-xs font-mono text-ink-500">Oxirgi so'rovlar</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50/40 text-ink-500 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 font-semibold">Endpoint</th>
              <th className="py-3 px-2 font-semibold">Model</th>
              <th className="py-3 px-2 font-semibold">Tokens</th>
              <th className="py-3 px-2 font-semibold">Latency</th>
              <th className="py-3 px-2 font-semibold">Cost</th>
              <th className="py-3 px-2 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-ivory-50/60 transition">
                <td className="py-3 px-4 font-mono font-semibold text-ink-900">
                  {log.endpoint}
                </td>
                <td className="py-3 px-2 font-mono text-ink-600">
                  {log.model}
                </td>
                <td className="py-3 px-2 font-mono text-ink-500">
                  {log.inputTokenCount + log.outputTokenCount}
                </td>
                <td className="py-3 px-2 font-mono text-ink-500">
                  {log.latencyMs}ms
                </td>
                <td className="py-3 px-2 font-mono text-forest-800 font-bold">
                  ${log.estimatedCostUsd.toFixed(5)}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      log.status === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'rate_limited'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-terracotta-100 text-terracotta-700'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-xs font-semibold text-forest-700 hover:text-forest-900"
                  >
                    View Prompt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="AI So'rov Tahlili va Redacted Prompt"
          subtitle={`Log ID: ${selectedLog.id} • Latency: ${selectedLog.latencyMs}ms`}
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="bg-ink-950 text-ink-200 p-4 rounded-xl space-y-2">
              <div className="text-forest-400 font-bold">
                ENDPOINT: {selectedLog.endpoint}
              </div>
              <div>MODEL: {selectedLog.model}</div>
              <div>INPUT TOKENS: {selectedLog.inputTokenCount}</div>
              <div>OUTPUT TOKENS: {selectedLog.outputTokenCount}</div>
              <div>ESTIMATED COST: ${selectedLog.estimatedCostUsd.toFixed(6)}</div>
            </div>

            <div>
              <span className="font-bold text-ink-900 block mb-1">
                Prompt Preview (Maxfiy ma'lumotlar yashiringan):
              </span>
              <div className="p-3 bg-ivory-50 border border-ivory-200 rounded-lg text-ink-800 leading-relaxed font-sans">
                "{selectedLog.redactedPromptPreview}"
              </div>
            </div>

            {selectedLog.errorMessage && (
              <div className="p-3 bg-terracotta-50 border border-terracotta-200 text-terracotta-900 rounded-lg">
                <strong>Error Log:</strong> {selectedLog.errorMessage}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setSelectedLog(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
