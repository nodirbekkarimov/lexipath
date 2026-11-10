'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Cpu, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  KeyRound, 
  Sliders, 
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { AdminRole } from '@/types/database';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState<AdminRole>('super_admin');

  const adminNavItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/vocabulary', label: 'Vocabulary Database', icon: Layers },
    { href: '/admin/reading', label: 'Reading Content CMS', icon: BookOpen },
    { href: '/admin/quizzes', label: 'Quiz Management', icon: HelpCircle },
    { href: '/admin/ai-operations', label: 'AI Operations & Costs', icon: Cpu },
    { href: '/admin/analytics', label: 'Learning Analytics', icon: BarChart3 },
    { href: '/admin/reports', label: 'Reports & Exports', icon: FileText },
    { href: '/admin/feedback', label: 'User Feedback', icon: MessageSquare, badge: '2 New' },
    { href: '/admin/audit-logs', label: 'Security & Audit Logs', icon: ClipboardList },
    { href: '/admin/roles', label: 'Roles & Permissions', icon: KeyRound },
    { href: '/admin/settings', label: 'System Settings', icon: Sliders },
  ];

  const roleLabels: Record<AdminRole, string> = {
    super_admin: 'Super Admin (Full Root Access)',
    content_manager: 'Content Manager (CMS & Lexicon)',
    support_agent: 'Support Agent (Users & Tickets)',
    analyst: 'Analyst (Read-only Analytics)',
    admin: 'Administrator',
    moderator: 'Content Moderator',
  };

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row text-ink-950 font-sans">
      
      {/* Mobile Admin Header */}
      <div className="md:hidden bg-ink-950 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-forest-400" />
          <span className="font-serif font-bold text-base">LexiPath Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-ink-300 hover:text-white rounded-lg transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-ink-950 text-ink-200 border-r border-ink-900 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          
          {/* Brand & Security Stamp */}
          <div className="px-3 pb-4 border-b border-ink-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center font-serif text-lg font-bold">
                L
              </div>
              <div>
                <div className="font-serif font-bold text-white text-base tracking-tight leading-tight">
                  LexiPath
                </div>
                <div className="text-[10px] font-mono text-forest-400 tracking-wider uppercase font-semibold">
                  Administration Console
                </div>
              </div>
            </div>

            {/* Role Simulation Switcher for Testing Least-Privilege */}
            <div className="mt-4 pt-3 border-t border-ink-800/80">
              <label className="block text-[10px] font-mono uppercase text-ink-400 mb-1">
                Active RBAC Role (Simulated):
              </label>
              <select
                value={simulatedRole}
                onChange={(e) => setSimulatedRole(e.target.value as AdminRole)}
                className="w-full bg-ink-900 border border-ink-800 text-[11px] text-white rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-forest-500 font-mono"
              >
                <option value="super_admin">Super Admin</option>
                <option value="content_manager">Content Manager</option>
                <option value="support_agent">Support Agent</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-ink-500 font-bold">
              Core Management
            </div>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-forest-800 text-white font-bold shadow-sm'
                      : 'text-ink-400 hover:text-white hover:bg-ink-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-forest-400' : 'text-ink-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer: Return to Learner Portal */}
        <div className="p-4 border-t border-ink-800 bg-ink-950/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-ink-400 font-mono">
            <span>Security Model:</span>
            <span className="text-forest-400 font-bold">RLS Active</span>
          </div>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center space-x-2 bg-ink-900 hover:bg-ink-800 text-white border border-ink-700/60 px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <span>Exit to Learner Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Admin Bar */}
        <header className="border-b border-ivory-200/90 bg-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-mono font-bold text-forest-800 bg-forest-100 border border-forest-200 px-2 py-0.5 rounded">
              {roleLabels[simulatedRole].split(' ')[0]} Active
            </span>
            <span className="text-ink-300">•</span>
            <span className="text-ink-500 font-mono">
              Server Time: {new Date().toISOString().split('T')[0]}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="hidden sm:inline-block font-mono text-[11px] text-ink-400">
              Demo/UI Mode with Deterministic Data Layer
            </span>
            <div className="w-7 h-7 rounded-full bg-ink-800 text-white flex items-center justify-center font-bold text-xs">
              NR
            </div>
          </div>
        </header>

        {/* Admin Page Content Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
