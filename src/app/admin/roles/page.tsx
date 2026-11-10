'use client';

import React from 'react';
import { 
  KeyRound, 
  Check, 
  X, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function AdminRolesPage() {
  const permissions = [
    { name: 'Mutolaa matnlarini nashr etish va o\'chirish', superAdmin: true, contentManager: true, supportAgent: false, analyst: false },
    { name: 'Leksik birliklarni va O\'zbekcha tarjimalarni tasdiqlash', superAdmin: true, contentManager: true, supportAgent: false, analyst: false },
    { name: 'O\'quvchi hisoblarini bloklash va tiklash', superAdmin: true, contentManager: false, supportAgent: true, analyst: false },
    { name: 'Admin rollarini belgilash va foydalanuvchi huquqlarini o\'zgartirish', superAdmin: true, contentManager: false, supportAgent: false, analyst: false },
    { name: 'AI xarajatlari va prompt versiyalarini boshqarish', superAdmin: true, contentManager: false, supportAgent: false, analyst: false },
    { name: 'Analitika va kohort hisobotlarini ko\'rish', superAdmin: true, contentManager: true, supportAgent: true, analyst: true },
    { name: 'Tizim xavfsizlik audit jurnallarini to\'liq ko\'rish', superAdmin: true, contentManager: false, supportAgent: false, analyst: false },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-200/90 pb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
          Role-Based Access Control (RBAC) Matrix
        </span>
        <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
          Roles & Permissions
        </h1>
        <p className="text-sm text-ink-600 mt-1">
          Eng kam imtiyoz (Least Privilege) tamoyili asosida rollarga berilgan huquqlar matritsasi.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-ivory-200/90 overflow-hidden shadow-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50/80 text-ink-500 font-mono text-[11px] uppercase">
              <th className="py-3 px-4 font-semibold">Huquq / Amaliyot (Permission)</th>
              <th className="py-3 px-2 text-center font-semibold">Super Admin</th>
              <th className="py-3 px-2 text-center font-semibold">Content Mgr</th>
              <th className="py-3 px-2 text-center font-semibold">Support Agent</th>
              <th className="py-3 px-2 text-center font-semibold">Analyst</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-100">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-ivory-50/60 transition">
                <td className="py-3 px-4 font-medium text-ink-900">
                  {p.name}
                </td>
                <td className="py-3 px-2 text-center">
                  {p.superAdmin ? (
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-ink-300 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-2 text-center">
                  {p.contentManager ? (
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-ink-300 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-2 text-center">
                  {p.supportAgent ? (
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-ink-300 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-2 text-center">
                  {p.analyst ? (
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-ink-300 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-forest-50 border border-forest-200 rounded-xl flex items-start space-x-3 text-xs text-forest-900 font-sans leading-relaxed">
        <Info className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-serif text-sm">Xavfsizlik eslatmasi (Security Rule):</strong>
          UI tugmalarini yashirish xavfsizlik hisoblanmaydi. Haqiqiy avtorizatsiya server tomonida Next.js Server Actions va Supabase PostgreSQL Row Level Security (RLS) qoidalari orqali qat'iy tekshiriladi.
        </div>
      </div>
    </div>
  );
}
