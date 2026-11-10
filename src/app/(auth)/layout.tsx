import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LexiPath — Sign in',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6F0] flex flex-col">
      {/* Top bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-[#18231F]/8">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#315C4A] flex items-center justify-center">
            <span className="text-white text-sm font-bold leading-none">L</span>
          </div>
          <span className="text-[#18231F] font-semibold text-base tracking-tight">LexiPath</span>
        </a>
        <span className="text-xs text-[#18231F]/40 font-medium tracking-wide uppercase">
          IELTS &amp; CEFR Vocabulary
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-5 text-center">
        <p className="text-xs text-[#18231F]/35">
          &copy; {new Date().getFullYear()} LexiPath. Built for serious English learners.
        </p>
      </footer>
    </div>
  )
}
