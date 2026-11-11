'use client'

import { Suspense, useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loginAction, quickDemoLoginAction, type ActionResult } from '@/lib/actions/auth'
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
  const urlError = searchParams.get('error')

  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('redirectTo', redirectTo)

    startTransition(async () => {
      const res = await loginAction(formData)
      if (res) setResult(res)
    })
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white border border-[#18231F]/10 rounded-2xl shadow-sm px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#18231F] tracking-tight mb-1.5">
            Xush kelibsiz!
          </h1>
          <p className="text-sm text-[#18231F]/50">
            LexiPath platformasiga kirish uchun ma'lumotlaringizni kiriting
          </p>
        </div>

        {/* Global errors */}
        {(result?.error || urlError) && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {result?.error ?? (urlError === 'auth_callback_failed' ? 'Authentication failed. Please try again.' : urlError)}
          </div>
        )}

        {/* 1-Click Fast Admin Login */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span>👑 Admin Portali</span>
            </span>
            <span className="text-[11px] font-medium text-amber-700/80">Boshqaruv paneli</span>
          </div>
          <form action={quickDemoLoginAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-all shadow-xs"
            >
              <span>👑 Admin sifatida kirish (Nodir Karimov)</span>
            </button>
          </form>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-[#18231F]/10" />
          <span className="text-xs text-[#18231F]/45 font-medium">yoki foydalanuvchi hisobi bilan</span>
          <div className="flex-1 h-px bg-[#18231F]/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#18231F]/60 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm text-[#18231F] bg-[#F7F6F0] border border-[#18231F]/15 rounded-lg placeholder-[#18231F]/30 focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30 focus:border-[#315C4A] transition-colors"
            />
            {result?.fieldErrors?.email && (
              <p className="mt-1 text-xs text-red-600">{result.fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#18231F]/60 uppercase tracking-wider">
                Parol
              </label>
              <Link href="/forgot-password" className="text-xs text-[#315C4A] hover:text-[#18231F] transition-colors">
                Parolni unutdingizmi?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                defaultValue="Password123!"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 text-sm text-[#18231F] bg-[#F7F6F0] border border-[#18231F]/15 rounded-lg placeholder-[#18231F]/30 focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30 focus:border-[#315C4A] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#18231F]/35 hover:text-[#18231F]/60 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {result?.fieldErrors?.password && (
              <p className="mt-1 text-xs text-red-600">{result.fieldErrors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#18231F] hover:bg-[#315C4A] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isPending ? 'Kirilmoqda…' : 'Kirish'}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-[#18231F]/55">
          Akkauntingiz yo'qmi?{' '}
          <Link href="/register" className="text-[#315C4A] font-semibold hover:text-[#18231F] transition-colors">
            Ro'yxatdan o'tish
          </Link>
        </p>
      </div>

      {/* Trust line */}
      <p className="mt-6 text-center text-xs text-[#18231F]/35">
        LexiPath — IELTS va CEFR o'rganuvchilari uchun maxsus yaratilgan.
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-2xl animate-pulse" />}>
      <LoginForm />
    </Suspense>
  )
}
