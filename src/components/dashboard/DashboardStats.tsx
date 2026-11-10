'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  Flame, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import { useLearnerStats } from '@/hooks/useLearnerStats';

export function DashboardStats() {
  const { stats, predictedBand, accuracyRate } = useLearnerStats();

  const statItems = [
    {
      title: 'Vocabulary Vault',
      value: stats.totalWords,
      subtext: `${stats.masteredWords} mastered (${Math.round((stats.masteredWords / Math.max(stats.totalWords, 1)) * 100)}%)`,
      icon: BookOpen,
      iconColor: 'text-forest-700',
      bgColor: 'bg-forest-50 border-forest-100',
      badgeText: '+14 this week',
      badgeVariant: 'success' as const,
    },
    {
      title: 'SRS Due Today',
      value: stats.dueForReviewCount,
      subtext: stats.dueForReviewCount > 0 ? 'Action required for retention' : 'All caught up!',
      icon: RotateCcw,
      iconColor: 'text-terracotta-600',
      bgColor: 'bg-terracotta-50/70 border-terracotta-100',
      badgeText: stats.dueForReviewCount > 0 ? 'Priority' : 'Optimal',
      badgeVariant: (stats.dueForReviewCount > 0 ? 'warning' : 'outline') as BadgeVariant,
    },
    {
      title: 'Quiz Accuracy',
      value: `${accuracyRate}%`,
      subtext: `${stats.totalQuizzesTaken} exercises completed`,
      icon: CheckCircle2,
      iconColor: 'text-forest-600',
      bgColor: 'bg-sage-100 border-sage-200',
      badgeText: '88% Target',
      badgeVariant: 'outline' as const,
    },
    {
      title: 'Study Streak',
      value: `${stats.streakDays} Days`,
      subtext: `${stats.totalStudyMinutes} mins invested`,
      icon: Flame,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      badgeText: `Band ${predictedBand}`,
      badgeVariant: 'primary' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="p-5 flex flex-col justify-between hover:border-ivory-400 transition-all shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 font-mono">
                {item.title}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.bgColor}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-3xl font-bold tracking-tight text-ink-950">
                  {item.value}
                </span>
                <Badge variant={item.badgeVariant} size="sm">
                  {item.badgeText}
                </Badge>
              </div>
              <p className="text-xs text-ink-600">
                {item.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
