'use client';

import React, { useState } from 'react';
import { adminLoginAction } from '@/lib/actions/auth';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [showSetupSecret, setShowSetupSecret] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (setupSecret.trim()) {
      formData.append('setupSecret', setupSecret.trim());
    }

    try {
      const res = await adminLoginAction(formData);
      if (res && !res.success) {
        setError(res.error || "Ruxsat etilmadi: Kalit yoki email noto'g'ri.");
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        window.location.href = '/admin';
        return;
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111816] text-[#E0E7E3] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#315C4A]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#DCE9DF]/60 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Platformaga qaytish</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#18231F] border border-[#315C4A]/30 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#315C4A]/30 border border-[#315C4A]/50 flex items-center justify-center mx-auto mb-4 text-[#F3C969] shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              LexiPath Admin Portali
            </h1>
            <p className="text-xs text-[#DCE9DF]/60 mt-1.5 font-sans">
              Faqat vakolatli boshqaruvchi uchun maxfiy kirish shlyuzi
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#DCE9DF]/80 mb-2">
                Admin E-pochta manzili
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DCE9DF]/40" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@lexipath.uz"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111816]/70 border border-[#315C4A]/40 rounded-xl text-sm text-white placeholder-[#DCE9DF]/30 focus:outline-none focus:border-[#F3C969] focus:ring-1 focus:ring-[#F3C969] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#DCE9DF]/80 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#DCE9DF]/40" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#111816]/70 border border-[#315C4A]/40 rounded-xl text-sm text-white placeholder-[#DCE9DF]/30 focus:outline-none focus:border-[#F3C969] focus:ring-1 focus:ring-[#F3C969] transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#DCE9DF]/40 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Optional Setup Secret Bootstrap disclosure */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSetupSecret(!showSetupSecret)}
                className="text-xs text-[#F3C969]/80 hover:text-[#F3C969] underline cursor-pointer flex items-center gap-1"
              >
                <span>{showSetupSecret ? '▲ Maxfiy sozlash kalitini yashirish' : '▼ Dastlabki admin sozlash kaliti (Setup Secret)?'}</span>
              </button>

              {showSetupSecret && (
                <div className="mt-2.5 p-3.5 bg-[#111816]/90 border border-[#F3C969]/30 rounded-xl space-y-1.5 animate-fadeIn">
                  <label className="block text-[11px] font-semibold text-[#F3C969]">
                    ADMIN_SETUP_SECRET Kaliti
                  </label>
                  <input
                    type="password"
                    value={setupSecret}
                    onChange={(e) => setSetupSecret(e.target.value)}
                    placeholder="Render environment'dagi ADMIN_SETUP_SECRET"
                    className="w-full px-3 py-2 bg-[#18231F] border border-[#F3C969]/40 rounded-lg text-xs text-white placeholder-[#DCE9DF]/30 focus:outline-none focus:border-[#F3C969] font-mono"
                  />
                  <p className="text-[10px] text-[#DCE9DF]/50">
                    Ushbu kalit kiritilsa, tizim emailingizni avtomatik tasdiqlab, eng yuqori Super Admin maqomini biriktiradi.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#315C4A] to-[#26483a] hover:from-[#3a6e58] hover:to-[#2e5746] text-white font-semibold text-sm rounded-xl border border-[#315C4A] shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              <KeyRound size={16} className="text-[#F3C969]" />
              <span>{isLoading ? 'Tekshirilmoqda...' : 'Admin sifatida tizimga kirish'}</span>
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-[#315C4A]/20 text-center">
            <p className="text-[11px] text-[#DCE9DF]/40 flex items-center justify-center gap-1.5">
              <span>🔒 256-bit xavfsizlik shifrlangan boshqaruv tizimi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
