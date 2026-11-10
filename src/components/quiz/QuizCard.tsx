'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { QuizQuestion } from '@/types/database';
import { QuestionFeedback } from './QuestionFeedback';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onNext,
  isLast,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isAnswered) return;
    const correct = selectedOption.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(selectedOption, correct);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    onNext();
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'fill_blank':
        return 'Sentence Completion';
      case 'match_uzbek':
        return 'O\'zbekcha Ma\'nosini Topish';
      case 'context_usage':
        return 'Context & Collocation';
      default:
        return 'Academic Exercise';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border-ivory-200 shadow-elevated space-y-6">
      {/* Top Header: Progress and Type */}
      <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="sm">
            {getQuestionTypeLabel(question.questionType || question.type)}
          </Badge>
          <span className="font-mono text-xs text-ink-500">
            CEFR {question.cefrLevel}
          </span>
        </div>

        <div className="font-mono text-xs text-ink-600">
          Question <strong className="text-forest-800">{currentIndex + 1}</strong> of {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden -mt-2">
        <div
          className="bg-forest-700 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Prompt */}
      <div className="space-y-3">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-950 leading-snug">
          {question.questionText || question.prompt}
        </h3>

        {question.audioPromptUrl && (
          <button
            onClick={() => handleSpeak(question.questionText || question.prompt)}
            className="inline-flex items-center space-x-1.5 text-xs text-forest-700 hover:text-forest-900 bg-forest-50 px-2.5 py-1 rounded-md transition"
            title="Listen prompt"
            aria-label="Listen audio prompt"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen Audio</span>
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {(question.options || []).map((opt, idx) => {
          const isThisSelected = selectedOption === opt;
          let optStyle = 'border-ivory-300 bg-white hover:border-forest-400 hover:bg-ivory-50 text-ink-900';

          if (isAnswered) {
            if (opt === question.correctAnswer) {
              optStyle = 'border-forest-600 bg-forest-50/80 text-forest-950 font-semibold shadow-xs';
            } else if (isThisSelected && !isCorrect) {
              optStyle = 'border-terracotta-400 bg-terracotta-50 text-terracotta-950 font-medium';
            } else {
              optStyle = 'border-ivory-200 bg-ivory-50 text-ink-400 opacity-60';
            }
          } else if (isThisSelected) {
            optStyle = 'border-forest-700 bg-sage-100 text-ink-950 font-semibold ring-1 ring-forest-700 shadow-xs';
          }

          return (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-xl border text-sm sm:text-base cursor-pointer transition flex items-center justify-between ${optStyle}`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-md bg-ivory-100 text-ink-600 flex items-center justify-center font-mono text-xs font-bold border border-ivory-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Panel */}
      {isAnswered && (
        <QuestionFeedback
          isCorrect={isCorrect}
          correctAnswer={question.correctAnswer}
          explanation={question.explanation || question.explanationUz || ''}
          cefrLevel={question.cefrLevel}
        />
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-ivory-200 flex items-center justify-between">
        <span className="text-xs text-ink-400">
          {!isAnswered ? 'Select an answer to verify' : 'Review explanation before advancing'}
        </span>

        {!isAnswered ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Check Answer
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNextQuestion}
          >
            {isLast ? 'Complete Quiz & View Results' : 'Next Question'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
