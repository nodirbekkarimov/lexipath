'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLearnerStats } from '@/hooks/useLearnerStats';
import { useLexiPathStore } from '@/lib/data-store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { WeeklyActivityChart } from '@/components/dashboard/WeeklyActivityChart';

export default function ProgressAnalyticsPage() {
  const store = useLexiPathStore();
  const {
    stats,
    predictedBand,
    retentionIndex,
    accuracyRate,
    accuracyByType,
    countsByStatus,
  } = useLearnerStats();

  const totalWords = Math.max(stats.totalWords, 1);
  const masteredPercent = Math.round((countsByStatus.mastered / totalWords) * 100);
  const reviewingPercent = Math.round((countsByStatus.reviewing / totalWords) * 100);
  const learningPercent = Math.round((countsByStatus.learning / totalWords) * 100);
  const newPercent = Math.round((countsByStatus.new / totalWords) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-ivory-200 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-500 mb-1">
            <span>LexiPath</span>
            <span>/</span>
            <span className="text-forest-700">Diagnostics & Analytics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
            Learning Progress & Analytics
          </h1>
          <p className="text-sm text-ink-600 mt-1 max-w-2xl">
            Real-time assessment of vocabulary retention, SM-2 decay resistance, and predicted IELTS academic lexical resource.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/practice">
            <Button variant="primary" size="md">
              <Sparkles className="w-4 h-4 mr-2" />
              Practice Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border-forest-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-ink-500 font-semibold">Predicted Band</span>
            <Badge variant="primary" size="sm">IELTS Target</Badge>
          </div>
          <div className="font-serif text-4xl font-bold text-forest-800">
            Band {predictedBand}
          </div>
          <p className="text-xs text-ink-500">
            Target goal: <strong className="text-ink-900">Band {store.learner.targetBand}</strong>
          </p>
        </Card>

        <Card className="p-5 bg-white border-ivory-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-ink-500 font-semibold">Retention Index</span>
            <Badge variant="success" size="sm">Optimal</Badge>
          </div>
          <div className="font-serif text-4xl font-bold text-ink-950">
            {retentionIndex}%
          </div>
          <p className="text-xs text-ink-500">Based on SM-2 recall history</p>
        </Card>

        <Card className="p-5 bg-white border-ivory-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-ink-500 font-semibold">Quiz Accuracy</span>
            <Badge variant="outline" size="sm">Exercises</Badge>
          </div>
          <div className="font-serif text-4xl font-bold text-ink-950">
            {accuracyRate}%
          </div>
          <p className="text-xs text-ink-500">{stats.totalQuizzesTaken} exercises completed</p>
        </Card>

        <Card className="p-5 bg-white border-ivory-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-ink-500 font-semibold">Total Invested</span>
            <Badge variant="outline" size="sm">Active Study</Badge>
          </div>
          <div className="font-serif text-4xl font-bold text-ink-950">
            {stats.totalStudyMinutes} mins
          </div>
          <p className="text-xs text-ink-500">{stats.streakDays} consecutive study days</p>
        </Card>
      </div>

      {/* Main Grid: Mastery Funnel & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vocabulary Mastery Funnel */}
        <Card className="p-6 bg-white border-ivory-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-ink-950">
                Memory Acquisition Pipeline
              </h3>
            </div>
            <span className="text-xs font-mono text-ink-500">
              {stats.totalWords} Total Items
            </span>
          </div>

          {/* Segmented Bar */}
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full bg-ivory-200 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${masteredPercent}%` }} className="bg-forest-700 h-full" title="Mastered" />
              <div style={{ width: `${reviewingPercent}%` }} className="bg-forest-500 h-full" title="Reviewing" />
              <div style={{ width: `${learningPercent}%` }} className="bg-amber-400 h-full" title="Learning" />
              <div style={{ width: `${newPercent}%` }} className="bg-ivory-400 h-full" title="New" />
            </div>

            {/* Legend with exact numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-forest-50 border border-forest-100">
                <div className="flex items-center space-x-1.5 text-forest-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest-700" />
                  <span>Mastered</span>
                </div>
                <div className="font-mono text-base font-bold text-forest-900 mt-1">
                  {countsByStatus.mastered} ({masteredPercent}%)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-sage-50 border border-sage-200">
                <div className="flex items-center space-x-1.5 text-forest-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest-500" />
                  <span>Reviewing</span>
                </div>
                <div className="font-mono text-base font-bold text-ink-900 mt-1">
                  {countsByStatus.reviewing} ({reviewingPercent}%)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <div className="flex items-center space-x-1.5 text-amber-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Learning</span>
                </div>
                <div className="font-mono text-base font-bold text-ink-900 mt-1">
                  {countsByStatus.learning} ({learningPercent}%)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-ivory-100 border border-ivory-200">
                <div className="flex items-center space-x-1.5 text-ink-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-ivory-400" />
                  <span>New</span>
                </div>
                <div className="font-mono text-base font-bold text-ink-900 mt-1">
                  {countsByStatus.new} ({newPercent}%)
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Activity */}
        <WeeklyActivityChart />
      </div>

      {/* Accuracy By Question Type */}
      <Card className="p-6 bg-white border-ivory-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-forest-700" />
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Exercise Performance by Assessment Format
            </h3>
          </div>
          <span className="text-xs font-mono text-ink-500">IELTS Criterion Diagnostic</span>
        </div>

        <div className="space-y-4 pt-2">
          {accuracyByType.map((item) => (
            <div key={item.type} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink-900">{item.type}</span>
                <span className="font-mono font-bold text-forest-800">
                  {item.accuracy}% ({item.count} items)
                </span>
              </div>
              <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.accuracy >= 85
                      ? 'bg-forest-700'
                      : item.accuracy >= 70
                      ? 'bg-forest-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${item.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
