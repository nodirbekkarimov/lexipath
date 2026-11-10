'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Brain, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Target,
  Layers
} from 'lucide-react';
import { CURRENT_USER } from '@/data/mock-data';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Compass },
    { href: '/reader/pass-1', label: 'Reading Studio', icon: BookOpen },
    { href: '/vault', label: 'Lexical Vault', icon: Layers },
    { href: '/quiz', label: 'SRS Quiz', icon: Brain },
    { href: '/admin', label: 'Admin Studio', icon: ShieldCheck, badge: 'Protected' },
  ];

  return (
    <header className="border-b border-parchment-200 bg-parchment-50/90 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Masthead */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-navy-900 text-parchment-50 flex items-center justify-center font-serif text-xl font-bold shadow-sm transition group-hover:bg-navy-800">
                L
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-semibold tracking-tight text-ink-950">
                  LexiPath
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-ink-500">
                  IELTS & CEFR Lexicon
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-parchment-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-parchment-200/80 text-navy-900 font-semibold'
                        : 'text-ink-600 hover:text-ink-950 hover:bg-parchment-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-navy-900' : 'text-ink-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-mono uppercase bg-parchment-200 text-ink-600 px-1.5 py-0.5 rounded ml-1 border border-parchment-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status Tray: User Streak & Target */}
          <div className="flex items-center space-x-4">
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 text-terracotta-700 bg-terracotta-50 border border-terracotta-100 px-2.5 py-1 rounded-full text-xs font-medium">
              <Flame className="w-3.5 h-3.5 fill-terracotta-500 text-terracotta-500" />
              <span>{CURRENT_USER.streakDays} Day Streak</span>
            </div>

            {/* Target Band Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 text-navy-900 bg-navy-100/60 border border-navy-100 px-2.5 py-1 rounded-full text-xs font-medium">
              <Target className="w-3.5 h-3.5 text-navy-700" />
              <span>Band {CURRENT_USER.targetBand} Target</span>
            </div>

            {/* User Profile Mini */}
            <div className="flex items-center space-x-2 pl-2 border-l border-parchment-200">
              <div className="w-8 h-8 rounded-full bg-parchment-300 flex items-center justify-center text-xs font-semibold text-ink-800">
                FA
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-ink-900 leading-tight">
                  {CURRENT_USER.fullName}
                </span>
                <span className="text-[10px] text-ink-500">
                  {CURRENT_USER.nativeLanguage.toUpperCase()} Learner
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
