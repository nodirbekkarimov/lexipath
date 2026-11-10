'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, Calendar } from 'lucide-react';
import { useLearnerStats } from '@/hooks/useLearnerStats';

export function WeeklyActivityChart() {
  const { weeklyActivity, stats, retentionIndex } = useLearnerStats();

  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 60);

  return (
    <Card className="p-6 flex flex-col justify-between shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-lg font-bold text-ink-950">Weekly Study Effort</h3>
            <Badge variant="primary" size="sm">
              <Calendar className="w-3 h-3 mr-1 inline" /> Last 7 Days
            </Badge>
          </div>
          <p className="text-xs text-ink-500 mt-0.5">
            Retention stability index: <span className="font-semibold text-forest-700">{retentionIndex}%</span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-ink-500 block">Total this week</span>
          <span className="font-serif text-xl font-bold text-ink-950">
            {weeklyActivity.reduce((acc, curr) => acc + curr.minutes, 0)} mins
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-36 border-b border-ivory-300 pb-2">
          {weeklyActivity.map((day, idx) => {
            const heightPercent = Math.max(Math.round((day.minutes / maxMinutes) * 100), 10);
            const isToday = idx === weeklyActivity.length - 1;

            return (
              <div key={day.day} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono font-medium text-ink-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.minutes}m
                </span>
                <div className="w-full max-w-[36px] bg-ivory-200 rounded-t-md overflow-hidden flex flex-col justify-end h-28 relative">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday
                        ? 'bg-forest-700 shadow-sm'
                        : 'bg-forest-500 hover:bg-forest-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[11px] font-mono mt-2 ${isToday ? 'font-bold text-forest-800' : 'text-ink-600'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-ink-500 pt-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-700 inline-block" />
          <span>Active Study Sessions</span>
        </div>
        <div className="flex items-center space-x-1 font-mono text-ink-700">
          <TrendingUp className="w-3.5 h-3.5 text-forest-600" />
          <span>+18% vs last week</span>
        </div>
      </div>
    </Card>
  );
}
