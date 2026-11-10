'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookMarked, Layers } from 'lucide-react';
import { useLexiPathStore } from '@/lib/data-store';

export function RecentVocabularyList() {
  const store = useLexiPathStore();

  // Combine user vocabulary with vocabulary details
  const recentItems = store.userVocabulary.slice(0, 5).map(uv => {
    const vocab = store.vocabulary.find(v => v.id === uv.vocabId);
    return {
      ...uv,
      vocab,
    };
  }).filter(item => Boolean(item.vocab));

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'success';
      case 'reviewing':
        return 'primary';
      case 'learning':
        return 'warning';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-6 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-forest-700" />
            <h3 className="font-serif text-lg font-bold text-ink-950">
              Recent Vault Additions
            </h3>
          </div>
          <Link href="/vocabulary">
            <span className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center">
              View All ({store.userVocabulary.length})
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <div className="py-8 text-center text-ink-500">
            <BookMarked className="w-8 h-8 mx-auto text-ink-300 mb-2" />
            <p className="text-xs">No vocabulary words saved yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-ivory-200">
            {recentItems.map((item) => {
              if (!item.vocab) return null;
              return (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between hover:bg-ivory-50 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/vocabulary/${item.vocab.id}`}
                        className="font-serif text-sm font-bold text-ink-950 hover:text-forest-700 transition"
                      >
                        {item.vocab.lemma}
                      </Link>
                      <Badge variant="outline" size="sm">
                        {item.vocab.cefrLevel}
                      </Badge>
                      <span className="text-[11px] font-mono text-ink-400">
                        {item.vocab.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xs text-ink-600 line-clamp-1">
                      <span className="font-medium text-forest-800">{item.vocab.translationUz}</span>
                      <span className="text-ink-400 mx-1.5">•</span>
                      <span>{item.vocab.definitionEn}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-ivory-200 flex items-center justify-between text-xs text-ink-500">
        <span>Organized by CEFR & SM-2 Spaced Repetition</span>
        <Link href="/vocabulary" className="font-semibold text-ink-800 hover:text-forest-700">
          Manage Collections →
        </Link>
      </div>
    </Card>
  );
}
