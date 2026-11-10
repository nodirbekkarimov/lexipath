'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, RotateCcw, ArrowRight, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface QuizSummaryCardProps {
  score: number;
  totalQuestions: number;
  results: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
  onRestart: () => void;
}

export function QuizSummaryCard({
  score,
  totalQuestions,
  results,
  onRestart,
}: QuizSummaryCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getEvaluation = () => {
    if (percentage >= 85) {
      return {
        title: 'Outstanding Lexical Mastery',
        subtitle: 'Equivalent to IELTS Band 8.0 - 8.5 performance',
        badgeVariant: 'success' as const,
      };
    }
    if (percentage >= 65) {
      return {
        title: 'Solid Academic Competence',
        subtitle: 'Equivalent to IELTS Band 7.0 performance',
        badgeVariant: 'primary' as const,
      };
    }
    return {
      title: 'Review Recommended',
      subtitle: 'Schedule spaced repetition practice to reinforce these terms',
      badgeVariant: 'warning' as const,
    };
  };

  const evalData = getEvaluation();

  return (
    <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border-forest-200 shadow-elevated space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-forest-50 border border-forest-200 text-forest-700 rounded-2xl flex items-center justify-center mx-auto shadow-subtle">
          <Award className="w-7 h-7" />
        </div>
        <Badge variant={evalData.badgeVariant} size="md">
          {evalData.subtitle}
        </Badge>
        <h2 className="font-serif text-3xl font-bold text-ink-950">
          {evalData.title}
        </h2>
        <p className="text-sm text-ink-600 font-mono">
          Final Score: <strong className="text-forest-800 text-lg">{score}</strong> / {totalQuestions} ({percentage}%)
        </p>
      </div>

      {/* Breakdown list */}
      <div className="space-y-3 pt-2">
        <h3 className="font-serif text-base font-bold text-ink-950 border-b border-ivory-200 pb-2">
          Question Review
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {results.map((r, i) => (
            <div
              key={r.questionId || i}
              className="p-3 rounded-lg border border-ivory-200 bg-ivory-50/70 text-xs flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <span className="font-medium text-ink-900 block line-clamp-1">
                  {i + 1}. {r.questionText}
                </span>
                <div className="text-ink-600">
                  <span>Your answer: </span>
                  <span className={r.isCorrect ? 'text-forest-700 font-semibold' : 'text-terracotta-700 font-semibold line-through'}>
                    {r.userAnswer}
                  </span>
                  {!r.isCorrect && (
                    <span className="text-forest-800 font-semibold ml-2">
                      Correct: {r.correctAnswer}
                    </span>
                  )}
                </div>
              </div>

              {r.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-terracotta-600 flex-shrink-0 mt-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-4 border-t border-ivory-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="outline" onClick={onRestart} className="w-full sm:w-auto">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Link href="/review" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full justify-center">
              Go to SRS Review
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full justify-center">
              Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
