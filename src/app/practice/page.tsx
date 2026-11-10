'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Headphones, BookOpen } from 'lucide-react';
import { usePractice } from '@/hooks/usePractice';
import { useLexiPathStore } from '@/lib/data-store';
import { QuizCard } from '@/components/quiz/QuizCard';
import { QuizSummaryCard } from '@/components/quiz/QuizSummaryCard';
import { SpellingDictationGame } from '@/components/practice/SpellingDictationGame';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type PracticeMode = 'quiz' | 'dictation';

export default function PracticeQuizPage() {
  const [mode, setMode] = useState<PracticeMode>('quiz');
  const store = useLexiPathStore();

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    score,
    isFinished,
    results,
    submitAnswer,
    nextQuestion,
    restartQuiz,
  } = usePractice();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#18231F]/10 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-[#18231F]/60 hover:text-[#315C4A] transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Dashboardga qaytish
        </Link>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-[#F7F6F0] rounded-xl border border-[#18231F]/10">
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'quiz'
                ? 'bg-white text-[#18231F] shadow-2xs'
                : 'text-[#18231F]/60 hover:text-[#18231F]'
            }`}
          >
            <Sparkles size={13} className="text-[#315C4A]" />
            <span>Kontekstual Testlar</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('dictation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'dictation'
                ? 'bg-white text-[#18231F] shadow-2xs'
                : 'text-[#18231F]/60 hover:text-[#18231F]'
            }`}
          >
            <Headphones size={13} className="text-[#315C4A]" />
            <span>🎧 Tinglab Yozish (Diktant)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <Badge variant="primary" size="sm">
            IELTS Academic
          </Badge>
        </div>
      </div>

      {/* Mode 1: Spelling Dictation */}
      {mode === 'dictation' && (
        <SpellingDictationGame vocabularyList={store.vocabulary} />
      )}

      {/* Mode 2: Standard Cloze / Multiple Choice Quiz */}
      {mode === 'quiz' && (
        <>
          {!currentQuestion && !isFinished ? (
            <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
              <h2 className="font-serif text-2xl font-bold text-ink-950">Test savollari topilmadi</h2>
              <Link href="/dashboard">
                <Button variant="outline">Dashboardga qaytish</Button>
              </Link>
            </div>
          ) : isFinished ? (
            <QuizSummaryCard
              score={score}
              totalQuestions={totalQuestions}
              results={results}
              onRestart={restartQuiz}
            />
          ) : (
            <QuizCard
              question={currentQuestion!}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              onAnswer={submitAnswer}
              onNext={nextQuestion}
              isLast={currentIndex === totalQuestions - 1}
            />
          )}
        </>
      )}
    </div>
  );
}
