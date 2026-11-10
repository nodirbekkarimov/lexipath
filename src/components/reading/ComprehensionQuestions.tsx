'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, HelpCircle, Award } from 'lucide-react';

interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface ComprehensionQuestionsProps {
  questions: ComprehensionQuestion[];
  onCompletePassage: () => void;
  isPassageCompleted: boolean;
}

export function ComprehensionQuestions({
  questions,
  onCompletePassage,
  isPassageCompleted,
}: ComprehensionQuestionsProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onCompletePassage();
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (!questions || questions.length === 0) return null;

  const score = calculateScore();
  const allAnswered = questions.every(q => Boolean(selectedAnswers[q.id]));

  return (
    <Card className="p-6 sm:p-8 bg-white border-ivory-200 shadow-subtle space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-xl font-bold text-ink-950">
              IELTS Reading Comprehension Check
            </h3>
            <Badge variant="primary" size="sm">
              Academic Assessment
            </Badge>
          </div>
          <p className="text-xs text-ink-500 mt-1">
            Test your understanding of the argument structure and academic vocabulary in this passage.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center space-x-2 bg-sage-50 border border-sage-200 px-3 py-1.5 rounded-lg">
            <Award className="w-4 h-4 text-forest-700" />
            <span className="text-xs font-bold text-forest-900 font-mono">
              Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
          </div>
        )}
      </div>

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((q, index) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctAnswer;

          return (
            <div key={q.id} className="space-y-3 pb-5 border-b border-ivory-200 last:border-b-0">
              <div className="flex items-start space-x-2">
                <span className="font-mono text-xs font-bold text-forest-700 bg-forest-50 border border-forest-200 rounded px-1.5 py-0.5">
                  Q{index + 1}
                </span>
                <p className="text-sm font-semibold text-ink-900 leading-snug">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-6">
                {q.options.map((opt) => {
                  const isThisSelected = selected === opt;
                  let optStyle = 'border-ivory-200 bg-white hover:bg-ivory-50 text-ink-800';

                  if (submitted) {
                    if (opt === q.correctAnswer) {
                      optStyle = 'border-forest-500 bg-forest-50 text-forest-900 font-semibold';
                    } else if (isThisSelected && !isCorrect) {
                      optStyle = 'border-terracotta-300 bg-terracotta-50 text-terracotta-900';
                    }
                  } else if (isThisSelected) {
                    optStyle = 'border-forest-700 bg-sage-100 text-ink-950 font-medium';
                  }

                  return (
                    <div
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && opt === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0 ml-2" />
                      )}
                      {submitted && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-terracotta-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submitted && (
                <div className="ml-6 p-3 rounded-lg bg-ivory-100 border border-ivory-200 text-xs text-ink-700 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-ink-500 block">
                    Explanation & IELTS Rationale:
                  </span>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-ink-500">
          {!submitted && (allAnswered ? 'All questions answered.' : 'Please select an answer for each question.')}
        </span>

        {!submitted ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Check Answers & Mark Read
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setSelectedAnswers({});
            }}
          >
            Retake Exercise
          </Button>
        )}
      </div>
    </Card>
  );
}
