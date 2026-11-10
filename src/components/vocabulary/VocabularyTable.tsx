'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Trash2, CheckCircle2, Volume2 } from 'lucide-react';
import { VocabularyItem, MasteryStatus } from '@/types/database';

interface VocabularyTableItem {
  id: string;
  vocabId: string;
  status: MasteryStatus;
  intervalDays: number;
  dueDate: string;
  repetitionCount: number;
  vocab: VocabularyItem;
}

interface VocabularyTableProps {
  items: VocabularyTableItem[];
  onMarkLearned: (id: string, status?: MasteryStatus) => void;
  onDelete: (id: string, lemma: string) => void;
}

export function VocabularyTable({ items, onMarkLearned, onDelete }: VocabularyTableProps) {
  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.85;
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
    <div className="overflow-x-auto rounded-xl border border-ivory-200 bg-white shadow-subtle">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-ivory-100/80 border-b border-ivory-200 text-ink-500 font-mono text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold">Word / Lemma</th>
            <th className="py-3 px-3 font-semibold">CEFR</th>
            <th className="py-3 px-3 font-semibold">POS</th>
            <th className="py-3 px-4 font-semibold">O&apos;zbekcha Tarjima</th>
            <th className="py-3 px-4 font-semibold">Status / SRS</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ivory-200">
          {items.map(({ id, vocab, status, intervalDays, dueDate }) => {
            const isDue = new Date(dueDate) <= new Date();

            return (
              <tr key={id} className="hover:bg-ivory-50/70 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/vocabulary/${vocab.id}`}
                      className="font-serif text-sm font-bold text-ink-950 hover:text-forest-700 transition"
                    >
                      {vocab.lemma}
                    </Link>
                    <button
                      onClick={() => handleSpeak(vocab.lemma)}
                      className="text-ink-400 hover:text-forest-700"
                      title="Listen"
                      aria-label="Listen pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] font-mono text-ink-400 block">
                    {vocab.pronunciationIpa}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <Badge variant="outline" size="sm">
                    {vocab.cefrLevel}
                  </Badge>
                </td>

                <td className="py-3 px-3 font-mono text-ink-600 italic">
                  {vocab.partOfSpeech}
                </td>

                <td className="py-3 px-4">
                  <span className="font-semibold text-forest-800">
                    {vocab.translationUz}
                  </span>
                  <p className="text-[11px] text-ink-500 line-clamp-1 max-w-xs">
                    {vocab.definitionEn}
                  </p>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(status)}
                    <span className="font-mono text-[11px] text-ink-500">
                      {isDue ? (
                        <span className="text-terracotta-600 font-bold">Due today</span>
                      ) : (
                        `Due in ${intervalDays}d`
                      )}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {status !== 'mastered' && (
                      <button
                        onClick={() => onMarkLearned(id, 'mastered')}
                        className="p-1 rounded text-ink-400 hover:text-forest-700 hover:bg-forest-50"
                        title="Mark as Mastered"
                        aria-label="Mark mastered"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <Link
                      href={`/vocabulary/${vocab.id}`}
                      className="p-1 rounded text-ink-400 hover:text-ink-900 hover:bg-ivory-200"
                      title="View Details"
                      aria-label="View details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(id, vocab.lemma)}
                      className="p-1 rounded text-ink-400 hover:text-terracotta-700 hover:bg-terracotta-50"
                      title="Delete"
                      aria-label="Delete word"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
