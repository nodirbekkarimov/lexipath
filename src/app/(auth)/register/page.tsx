'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { registerAction, type ActionResult } from '@/lib/actions/auth'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await registerAction(formData)
      setResult(res)
    })
  }

  if (result?.success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#18231F]/10 rounded-2xl shadow-sm px-8 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#DCE9DF] flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-[#315C4A]" size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#18231F] mb-2">Check your email</h2>
          <p className="text-sm text-[#18231F]/55 leading-relaxed">
            We sent a confirmation link to your email address. Click it to activate your account and start learning.
          </p>
          <Link
            href="/login"
            className="inline-block mt-8 px-6 py-2.5 bg-[#315C4A] text-white text-sm font-semibold rounded-lg hover:bg-[#18231F] transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border border-[#18231F]/10 rounded-2xl shadow-sm px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#18231F] tracking-tight mb-1.5">
            Create your account
          </h1>
          <p className="text-sm text-[#18231F]/50">
            Join thousands of IELTS learners building their vocabulary
          </p>
        </div>

        {result?.error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {result.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-[#18231F]/60 uppercase tracking-wider mb-1.5">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="Your name"
              className="w-full px-3.5 py-2.5 text-sm text-[#18231F] bg-[#F7F6F0] border border-[#18231F]/15 rounded-lg placeholder-[#18231F]/30 focus:outline-none focus:ring-2 focus:ring-[#315C4A]/30 focus:border-[#315C4A] transition-colors"
            />
            {result?.fieldErrors?.fullName && (
              <p className="mt-1 text-xs text-red-600">{result.fieldErrors.fullName[0]}</p>
            )}
          </div>

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
            <label htmlFor="password" className="block text-xs font-semibold text-[#18231F]/60 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="At least 8 characters"
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

          {/* Terms notice */}
          <p className="text-xs text-[#18231F]/40 leading-relaxed">
            By creating an account you agree to our terms of service and privacy policy.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#315C4A] hover:bg-[#18231F] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#18231F]/55">
            Already have an account?{' '}
            <Link href="/login" className="text-[#315C4A] font-semibold hover:text-[#18231F] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
