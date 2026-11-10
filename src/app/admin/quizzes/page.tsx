'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Archive,
  Search
} from 'lucide-react';
import { MOCK_QUIZ_QUESTIONS } from '@/data/mock-data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, CefrBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { QuizQuestion, QuizQuestionType } from '@/types/database';

export default function AdminQuizzesPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(MOCK_QUIZ_QUESTIONS);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewQ, setPreviewQ] = useState<QuizQuestion | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    return selectedType === 'all' || q.type === selectedType;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-4 py-3 rounded-xl shadow-elevated text-xs animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ivory-200/90 pb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-forest-700 font-semibold">
            Assessment & Diagnostic Question Bank
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mt-1">
            Quiz Management
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            IELTS leksik testlari, kontekstual bo'shliq to'ldirish, kollokatsiya va sinonim savollari ombori.
          </p>
        </div>

        <Button
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setToastMessage('Yangi savol tuzish oynasi ochildi.');
            setTimeout(() => setToastMessage(null), 2500);
          }}
        >
          Yangi Savol Yaratish
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-ivory-200/90 p-3 flex flex-wrap items-center gap-2 text-xs shadow-card">
        <span className="font-mono text-[11px] text-ink-400 uppercase">Question Type:</span>
        {[
          { id: 'all', label: 'All Types' },
          { id: 'cloze', label: 'Cloze' },
          { id: 'meaning_match', label: 'Meaning Match' },
          { id: 'collocation', label: 'Collocation' },
          { id: 'definition', label: 'Definition' },
          { id: 'synonym', label: 'Synonym' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3 py-1 rounded-md font-medium transition ${
              selectedType === t.id
                ? 'bg-forest-700 text-white font-bold'
                : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <Card key={q.id} padding="md" className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] uppercase bg-forest-100 text-forest-800 font-bold px-2 py-0.5 rounded">
                  {q.type.replace('_', ' ')}
                </span>
                <CefrBadge level={q.cefrLevel} />
                <span className="font-mono text-[10px] text-ink-400 uppercase">
                  Diff: {q.difficulty}
                </span>
              </div>
              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                {q.status}
              </span>
            </div>

            <div>
              <h4 className="font-serif text-base font-bold text-ink-950">
                {q.prompt}
              </h4>
              {q.contextSentence && (
                <blockquote className="mt-2 text-xs font-serif italic text-ink-800 bg-ivory-50 border-l-2 border-forest-700 pl-2.5 py-1">
                  "{q.contextSentence}"
                </blockquote>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono">
              {q.options?.map((opt, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded border ${
                    opt === q.correctAnswer
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                      : 'bg-white border-ivory-300 text-ink-600'
                  }`}
                >
                  {opt === q.correctAnswer ? '✓ ' : ''}{opt}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-ivory-100 flex items-center justify-between text-xs">
              <span className="text-ink-500 italic text-[11px]">
                Target: <strong>{q.vocabulary?.word || q.vocabularyId}</strong> {q.vocabulary?.translationUz ? `(${q.vocabulary.translationUz})` : ''}
              </span>
              <button
                onClick={() => setPreviewQ(q)}
                className="font-semibold text-forest-700 hover:text-forest-900"
              >
                Inspect & Edit
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Question Detail Modal */}
      {previewQ && (
        <Modal
          isOpen={!!previewQ}
          onClose={() => setPreviewQ(null)}
          title="Savol Tafsiloti va O'zbekcha Sharhi"
          subtitle={`ID: ${previewQ.id} • Type: ${previewQ.type}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-mono text-ink-400 uppercase text-[10px] block">Prompt:</span>
              <p className="font-serif text-base font-bold text-ink-950 mt-1">{previewQ.prompt}</p>
            </div>

            {previewQ.contextSentence && (
              <div>
                <span className="font-mono text-ink-400 uppercase text-[10px] block">Context Sentence:</span>
                <p className="font-serif italic text-ink-800 bg-ivory-50 p-2.5 rounded border border-ivory-200 mt-1">
                  "{previewQ.contextSentence}"
                </p>
              </div>
            )}

            <div>
              <span className="font-mono text-ink-400 uppercase text-[10px] block">To'g'ri Javob:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-300 inline-block mt-1">
                {previewQ.correctAnswer}
              </span>
            </div>

            <div className="bg-sage-50 border border-sage-200 p-3 rounded-lg">
              <strong className="text-forest-900 block mb-0.5 font-mono text-[11px] uppercase">
                O'zbekcha tushuntirish (Explanation):
              </strong>
              <p className="text-ink-800 leading-relaxed">{previewQ.explanationUz}</p>
            </div>

            <div className="pt-3 flex justify-end border-t border-ivory-200">
              <Button size="sm" onClick={() => setPreviewQ(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
