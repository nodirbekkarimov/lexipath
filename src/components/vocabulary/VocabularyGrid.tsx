'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Volume2, CheckCircle2, Trash2, ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { VocabularyItem, UserVocabularyItem, MasteryStatus } from '@/types/database';

interface VocabularyCardItem {
  id: string; // userVocabId
  vocabId: string;
  status: MasteryStatus;
  intervalDays: number;
  dueDate: string;
  repetitionCount: number;
  personalNotes?: string;
  vocab: VocabularyItem;
}

interface VocabularyGridProps {
  items: VocabularyCardItem[];
  onMarkLearned: (id: string, status?: MasteryStatus) => void;
  onDelete: (id: string, lemma: string) => void;
}

export function VocabularyGrid({ items, onMarkLearned, onDelete }: VocabularyGridProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeak = (id: string, text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
      utterance.onstart = () => setPlayingId(id);
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getStatusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'mastered':
        return <Badge variant="success" size="sm">Mastered</Badge>;
      case 'reviewing':
        return <Badge variant="primary" size="sm">Reviewing</Badge>;
      case 'learning':
        return <Badge variant="warning" size="sm">Learning</Badge>;
      default:
        return <Badge variant="outline" size="sm">New</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ id, vocab, status, intervalDays, dueDate, repetitionCount }) => {
        const isDue = new Date(dueDate) <= new Date();

        return (
          <Card
            key={id}
            className="p-5 flex flex-col justify-between hover:border-forest-300 transition-all shadow-subtle group bg-white"
          >
            <div>
              {/* Header: Lemma, Level, Audio */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/vocabulary/${vocab.id}`}
                      className="font-serif text-xl font-bold text-ink-950 hover:text-forest-700 transition"
                    >
                      {vocab.lemma}
                    </Link>
                    <button
                      onClick={() => handleSpeak(id, vocab.lemma)}
                      className={`p-1 rounded-full text-ink-500 hover:text-forest-700 transition ${
                        playingId === id ? 'text-forest-700 scale-110' : ''
                      }`}
                      title="Listen British English"
                      aria-label="Listen pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-ink-400 mt-0.5">
                    <span>{vocab.pronunciationIpa}</span>
                    <span>•</span>
                    <span className="italic">{vocab.partOfSpeech}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <Badge variant="outline" size="sm">
                    {vocab.cefrLevel}
                  </Badge>
                  {getStatusBadge(status)}
                </div>
              </div>

              {/* Uzbek Translation */}
              <div className="my-3 bg-sage-50/90 border border-sage-200/80 rounded-lg p-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-forest-700 font-bold block mb-0.5">
                  O&apos;zbekcha Tarjimasi
                </span>
                <p className="text-xs font-semibold text-ink-900 leading-snug">
                  {vocab.translationUz}
                </p>
              </div>

              {/* English Definition */}
              <p className="text-xs text-ink-700 line-clamp-2 leading-relaxed">
                {vocab.definitionEn}
              </p>

              {/* Context Sentence */}
              {vocab.contextSentence && (
                <div className="mt-2 text-xs text-ink-500 italic bg-ivory-50 p-2 rounded border border-ivory-200/60 line-clamp-2">
                  &ldquo;{vocab.contextSentence}&rdquo;
                </div>
              )}
            </div>

            {/* SRS Info & Action Buttons */}
            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-ink-500 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-ink-400" />
                <span>
                  {isDue ? (
                    <strong className="text-terracotta-600">Due today</strong>
                  ) : (
                    `In ${intervalDays}d`
                  )}
                </span>
                <span>•</span>
                <span>{repetitionCount} reviews</span>
              </div>

              <div className="flex items-center space-x-1">
                {status !== 'mastered' && (
                  <button
                    onClick={() => onMarkLearned(id, 'mastered')}
                    className="p-1.5 rounded text-ink-400 hover:text-forest-700 hover:bg-forest-50 transition"
                    title="Mark as Mastered"
                    aria-label="Mark as mastered"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}

                <Link
                  href={`/vocabulary/${vocab.id}`}
                  className="p-1.5 rounded text-ink-400 hover:text-ink-900 hover:bg-ivory-200 transition"
                  title="View Details"
                  aria-label="View details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => onDelete(id, vocab.lemma)}
                  className="p-1.5 rounded text-ink-400 hover:text-terracotta-700 hover:bg-terracotta-50 transition"
                  title="Remove from vault"
                  aria-label="Delete word"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
