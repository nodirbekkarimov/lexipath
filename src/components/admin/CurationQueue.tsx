'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, X, Sparkles, AlertCircle, Edit3 } from 'lucide-react';
import { VocabularyItem } from '@/types/database';

interface CurationQueueProps {
  initialItems: VocabularyItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function CurationQueue({ initialItems, onApprove, onReject }: CurationQueueProps) {
  const [items, setItems] = useState<VocabularyItem[]>(initialItems.slice(0, 3));

  const handleApprove = (id: string) => {
    onApprove(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleReject = (id: string) => {
    onReject(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Card className="p-6 bg-white border-ivory-200 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-forest-700" />
          <h3 className="font-serif text-lg font-bold text-ink-950">
            Editorial Curation Queue
          </h3>
          <Badge variant="primary" size="sm">
            {items.length} Pending
          </Badge>
        </div>
        <span className="text-xs text-ink-500 font-mono">
          AI generated glosses awaiting pedagogical verification
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-ink-500 text-xs">
          All pending submissions have been curated and approved.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-ivory-200 bg-ivory-50/50 hover:bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-base font-bold text-ink-950">
                    {item.lemma}
                  </span>
                  <Badge variant="outline" size="sm">{item.cefrLevel}</Badge>
                  <span className="text-xs font-mono text-ink-400 italic">{item.partOfSpeech}</span>
                </div>
                <p className="text-xs text-ink-600 line-clamp-1">
                  <strong>O&apos;zbekcha:</strong> <span className="text-forest-800">{item.translationUz}</span>
                  <span className="mx-2 text-ink-300">•</span>
                  <span>{item.definitionEn}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  className="bg-forest-700 hover:bg-forest-800"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(item.id)}
                  className="text-terracotta-700 hover:bg-terracotta-50 hover:border-terracotta-200"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
