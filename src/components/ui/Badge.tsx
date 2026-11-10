import React from 'react';
import { CEFRLevel, MasteryStatus, PartOfSpeech, UserRole } from '@/types/database';

export type BadgeVariant = 
  | 'neutral' 
  | 'forest' 
  | 'sage' 
  | 'amber' 
  | 'terracotta' 
  | 'emerald'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-ivory-200 text-ink-700 border-ivory-300',
    forest: 'bg-forest-100 text-forest-800 border-forest-200',
    sage: 'bg-sage-100 text-sage-900 border-sage-300',
    amber: 'bg-amber-100 text-amber-700 border-amber-300',
    terracotta: 'bg-terracotta-100 text-terracotta-700 border-terracotta-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    primary: 'bg-forest-100 text-forest-800 border-forest-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-terracotta-100 text-terracotta-800 border-terracotta-200',
    outline: 'bg-transparent text-ink-700 border-ivory-300',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-mono',
    md: 'text-xs px-2 py-0.5 font-mono',
    lg: 'text-xs px-2.5 py-1 font-mono font-bold',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export function CefrBadge({ level }: { level: CEFRLevel }) {
  const map: Record<CEFRLevel, BadgeProps['variant']> = {
    B1: 'neutral',
    B2: 'sage',
    C1: 'amber',
    C2: 'forest',
  };
  return <Badge variant={map[level]}>{level}</Badge>;
}

export function MasteryBadge({ status }: { status: MasteryStatus }) {
  const map: Record<MasteryStatus, { variant: BadgeProps['variant']; label: string }> = {
    new: { variant: 'neutral', label: 'New' },
    learning: { variant: 'sage', label: 'Learning' },
    reviewing: { variant: 'amber', label: 'Reviewing' },
    mastered: { variant: 'emerald', label: 'Mastered' },
  };
  const config = map[status] || { variant: 'neutral', label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { variant: BadgeProps['variant']; label: string }> = {
    learner: { variant: 'neutral', label: 'Learner' },
    super_admin: { variant: 'forest', label: 'Super Admin' },
    content_manager: { variant: 'amber', label: 'Content Mgr' },
    support_agent: { variant: 'sage', label: 'Support' },
    analyst: { variant: 'emerald', label: 'Analyst' },
    admin: { variant: 'terracotta', label: 'Admin' },
    moderator: { variant: 'amber', label: 'Moderator' },
  };
  const config = map[role] || { variant: 'neutral', label: role };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
