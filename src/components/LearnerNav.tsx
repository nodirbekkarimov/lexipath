'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  Settings as SettingsIcon,
  Flame,
  Target,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { CURRENT_LEARNER } from '@/data/mock-data';
import { useLexiPathStore } from '@/lib/data-store';

export function LearnerNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const store = useLexiPathStore();
  const learner = store?.learner || CURRENT_LEARNER;

  // If in admin section or auth pages, do not render learner navigation
  if (
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  ) {
    return null;
  }

  const learnerNavItems = [
    { href: '/', label: 'Dashboard', icon: Compass, exact: true },
    { href: '/vocabulary', label: 'My Vocabulary', icon: Layers },
    { href: '/reading', label: 'Reading', icon: BookOpen },
    { href: '/learn', label: 'Learn', icon: GraduationCap },
    { href: '/practice', label: 'Practice', icon: Sparkles },
    { href: '/review', label: 'Review', icon: RotateCcw, badge: 'Due' },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isItemActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b border-ivory-200/90 bg-ivory-100/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center font-serif text-lg font-bold shadow-subtle group-hover:bg-forest-800 transition">
                L
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-ink-950">
                  LexiPath
                </span>
                <span className="text-[9px] uppercase font-mono tracking-widest text-ink-500">
                  IELTS & CEFR
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (8 Learner Items) */}
            <nav className="hidden xl:flex items-center space-x-0.5 pl-4 border-l border-ivory-200">
              {learnerNavItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-sage-300 text-ink-950 font-semibold'
                        : 'text-ink-600 hover:text-ink-950 hover:bg-ivory-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-forest-700' : 'text-ink-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono uppercase bg-terracotta-100 text-terracotta-700 px-1 py-0.2 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Status: Streak & Profile */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Admin Panel Button strictly for verified super_admin or admin roles */}
            {(learner.role === 'super_admin' || learner.role === 'admin') && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#315C4A] hover:bg-[#18231F] text-white font-bold text-xs shadow-xs transition"
              >
                <ShieldCheck size={14} className="text-amber-300" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Study Streak */}
            <div className="flex items-center space-x-1.5 text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-medium">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{learner.streakDays}d Streak</span>
            </div>

            {/* Target Band Pill */}
            <div className="flex items-center space-x-1.5 text-forest-800 bg-forest-50 border border-forest-200/80 px-2.5 py-1 rounded-full text-xs font-medium">
              <Target className="w-3.5 h-3.5 text-forest-700" />
              <span>Band {learner.targetBand} Target</span>
            </div>

            {/* User Profile Mini or Login / Register */}
            {(!learner.email || learner.email === 'learner@lexipath.uz' || learner.id === 'guest') ? (
              <div className="flex items-center gap-2 pl-2 border-l border-ivory-200">
                <Link
                  href="/login"
                  className="px-2.5 py-1 text-xs font-semibold text-[#18231F] hover:text-[#315C4A] transition"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 bg-[#315C4A] hover:bg-[#18231F] text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            ) : (
              <Link
                href="/settings"
                className="flex items-center space-x-2 pl-2 border-l border-ivory-200 hover:opacity-85 transition"
              >
                <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 border border-forest-200 flex items-center justify-center text-xs font-semibold">
                  {(learner.fullName || 'FO').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-ink-900 leading-tight">
                    {learner.fullName}
                  </span>
                  <span className="text-[10px] text-ink-500">
                    {learner.role === 'super_admin' ? 'Super Admin' : 'Talaba'}
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-600 hover:text-ink-950 hover:bg-ivory-200 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-ivory-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-elevated animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-ivory-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center text-xs font-semibold">
                {learner.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-ink-950">{learner.fullName}</div>
                <div className="text-[10px] text-ink-500">Band {learner.targetBand} • {learner.streakDays}d Streak</div>
              </div>
            </div>

            {learner.email === 'learner@lexipath.uz' && (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1 text-xs font-semibold text-[#18231F] border border-ivory-300 rounded"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 bg-[#315C4A] text-white text-xs font-semibold rounded"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>

          {(learner.role === 'super_admin' || learner.role === 'admin' || learner.email?.includes('nodir')) && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 mb-2 rounded-lg bg-[#315C4A] text-white font-bold text-xs"
            >
              <ShieldCheck size={16} className="text-amber-300" />
              <span>👑 Admin Boshqaruv Paneli</span>
            </Link>
          )}

          <div className="grid grid-cols-2 gap-1">
            {learnerNavItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-sage-300 text-ink-950 font-bold'
                      : 'text-ink-700 hover:bg-ivory-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-forest-700' : 'text-ink-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[8px] font-mono uppercase bg-terracotta-100 text-terracotta-700 px-1 py-0.2 rounded font-bold ml-auto">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
