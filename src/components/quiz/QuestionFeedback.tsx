'use client';

import React from 'react';
import { CheckCircle2, XCircle, Lightbulb, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface QuestionFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  uzbekTranslation?: string;
  cefrLevel?: string;
}

export function QuestionFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  uzbekTranslation,
  cefrLevel,
}: QuestionFeedbackProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all animate-in fade-in duration-200 ${
        isCorrect
          ? 'bg-forest-50/70 border-forest-200 text-forest-950'
          : 'bg-terracotta-50/60 border-terracotta-200 text-terracotta-950'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-forest-700" />
              <span className="font-serif font-bold text-base text-forest-900">
                To&apos;g&apos;ri! (Correct)
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-terracotta-700" />
              <span className="font-serif font-bold text-base text-terracotta-900">
                Noto&apos;g&apos;ri javob (Incorrect)
              </span>
            </>
          )}
        </div>

        {cefrLevel && (
          <Badge variant={isCorrect ? 'success' : 'outline'} size="sm">
            CEFR {cefrLevel}
          </Badge>
        )}
      </div>

      {!isCorrect && (
        <div className="text-xs mb-2">
          <span className="font-semibold text-ink-700">To&apos;g&apos;ri javob: </span>
          <span className="font-bold text-forest-800 bg-white/80 px-2 py-0.5 rounded border border-forest-200">
            {correctAnswer}
          </span>
        </div>
      )}

      {/* Uzbek Translation Callout */}
      {uzbekTranslation && (
        <div className="my-2 p-2 bg-white/70 border border-ivory-300 rounded text-xs">
          <span className="font-mono text-[10px] uppercase font-bold text-forest-700 block mb-0.5">
            O&apos;zbekcha Ma&apos;nosi:
          </span>
          <span className="font-semibold text-ink-900">{uzbekTranslation}</span>
        </div>
      )}

      {/* Academic Explanation */}
      <div className="text-xs text-ink-700 leading-relaxed mt-1 flex items-start space-x-1.5">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>{explanation}</p>
      </div>
    </div>
  );
}
