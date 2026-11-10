'use client';

import React from 'react';
import { 
  ClipboardList, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter 
} from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '@/data/mock-data';
import { Card } from '@/components/ui/Card';

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-200/90 pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
          Immutable Governance & Tamper-Evident Trail
        </span>
        <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
          Security & Audit Logs
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          Administratorlar va tizim jarayonlari tomonidan amalga oshirilgan barcha xavfsizlik va kontent o'zgarishlari jurnali.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-ivory-200/90 overflow-hidden shadow-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50/80 text-ink-500 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-2 font-semibold">Actor Email</th>
              <th className="py-3 px-2 font-semibold">Role</th>
              <th className="py-3 px-2 font-semibold">Action</th>
              <th className="py-3 px-2 font-semibold">Target</th>
              <th className="py-3 px-2 font-semibold">Details</th>
              <th className="py-3 px-4 font-semibold text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100 font-mono">
            {MOCK_AUDIT_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-ivory-50/60 transition">
                <td className="py-3 px-4 text-ink-500 whitespace-nowrap">
                  {log.timestamp.replace('T', ' ').replace('Z', '')}
                </td>
                <td className="py-3 px-2 font-semibold text-ink-950 font-sans">
                  {log.actorEmail}
                </td>
                <td className="py-3 px-2">
                  <span className="px-2 py-0.5 rounded bg-forest-100 text-forest-800 text-[10px] font-bold">
                    {log.actorRole}
                  </span>
                </td>
                <td className="py-3 px-2 font-bold text-forest-900">
                  {log.action}
                </td>
                <td className="py-3 px-2 text-ink-600">
                  {log.targetEntity} ({log.targetId})
                </td>
                <td className="py-3 px-2 text-ink-800 font-sans max-w-xs truncate">
                  {log.details}
                </td>
                <td className="py-3 px-4 text-right text-ink-500">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
