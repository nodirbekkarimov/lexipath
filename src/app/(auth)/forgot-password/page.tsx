'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { forgotPasswordAction, type ActionResult } from '@/lib/actions/auth'
import { Loader2, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await forgotPasswordAction(formData)
      setResult(res)
    })
  }

  if (result?.success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#18231F]/10 rounded-2xl shadow-sm px-8 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#DCE9DF] flex items-center justify-center mx-auto mb-5">
            <Mail className="text-[#315C4A]" size={26} />
          </div>
          <h2 className="text-xl font-bold text-[#18231F] mb-2">Email sent</h2>
          <p className="text-sm text-[#18231F]/55 leading-relaxed">
            If that email is registered, you will receive a password reset link shortly. Check your spam folder if it does not arrive.
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
            Reset your password
          </h1>
          <p className="text-sm text-[#18231F]/50">
            Enter your email and we will send you a reset link
          </p>
        </div>

        {result?.error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {result.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#18231F]/60 uppercase tracking-wider mb-1.5">
              Email address
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

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#315C4A] hover:bg-[#18231F] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 size={15} className="animate-spin" />}
            {isPending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-[#315C4A] font-medium hover:text-[#18231F] transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
