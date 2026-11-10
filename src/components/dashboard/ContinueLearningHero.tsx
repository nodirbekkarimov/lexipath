'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RotateCcw, BookOpen, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';
import { useReview } from '@/hooks/useReview';

export function ContinueLearningHero() {
  const store = useLexiPathStore();
  const { queue } = useReview();
  const dueCount = queue.length;
  
  // Get latest reading passage
  const currentPassage = store.passages[0];

  return (
    <Card className="overflow-hidden border-forest-200 bg-gradient-to-br from-white via-sage-50/50 to-ivory-100 p-6 sm:p-8 shadow-subtle relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="md">
            RECOMMENDED FOCUS
          </Badge>
          {dueCount > 0 ? (
            <Badge variant="warning" size="md">
              <RotateCcw className="w-3 h-3 mr-1 inline" /> {dueCount} SRS Reviews Waiting
            </Badge>
          ) : (
            <Badge variant="success" size="md">
              All reviews caught up
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 tracking-tight">
            {dueCount > 0 
              ? `Strengthen ${dueCount} words before they fade from memory`
              : `Deepen comprehension with authentic IELTS reading`}
          </h2>
          <p className="text-sm sm:text-base text-ink-700 leading-relaxed max-w-2xl">
            {dueCount > 0
              ? `Spaced repetition preserves long-term recall for complex academic lexis. Complete your ${dueCount} pending cards in approximately ${Math.ceil(dueCount * 0.8)} minutes.`
              : `Explore "${currentPassage?.title || 'Academic Passage'}" to encounter Band 8.0+ vocabulary in authentic context with inline Uzbek glosses.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {dueCount > 0 ? (
            <Link href="/review">
              <Button variant="primary" size="lg" className="shadow-subtle">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start SRS Review ({dueCount} cards)
              </Button>
            </Link>
          ) : (
            <Link href="/practice">
              <Button variant="primary" size="lg" className="shadow-subtle">
                <Sparkles className="w-4 h-4 mr-2" />
                Practice Interactive Quiz
              </Button>
            </Link>
          )}

          {currentPassage && (
            <Link href={`/reading/${currentPassage.id}`}>
              <Button variant="outline" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Read Passage
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {currentPassage && (
          <div className="flex items-center space-x-4 pt-2 text-xs text-ink-500 border-t border-ivory-200">
            <span className="flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-ink-400" />
              Topic: <strong className="ml-1 text-ink-800">{currentPassage.topic}</strong>
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-ink-400" />
              Est. time: <strong className="ml-1 text-ink-800">{currentPassage.estimatedReadMinutes} mins</strong>
            </span>
            <span className="hidden sm:inline font-mono text-ink-600">
              CEFR Level: {currentPassage.cefrLevel}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
