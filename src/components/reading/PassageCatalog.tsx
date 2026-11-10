'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Clock, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Passage } from '@/types/database';

interface PassageCatalogProps {
  passages: Passage[];
  readPassageIds: string[];
}

export function PassageCatalog({ passages, readPassageIds }: PassageCatalogProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {passages.map((passage) => {
        const isCompleted = readPassageIds.includes(passage.id);
        const vocabCount = passage.vocabularyWords?.length || 4;

        return (
          <Card
            key={passage.id}
            className="p-6 flex flex-col justify-between hover:border-forest-300 transition-all shadow-subtle bg-white group"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-forest-700">
                  {passage.topic}
                </span>
                <div className="flex items-center space-x-1.5">
                  <Badge variant="primary" size="sm">
                    {passage.cefrLevel}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Read
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title & Excerpt */}
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-950 group-hover:text-forest-800 transition line-clamp-2">
                  {passage.title}
                </h3>
                <p className="text-xs text-ink-600 mt-2 line-clamp-3 leading-relaxed">
                  {(passage.content || passage.contentMarkdown || passage.excerpt || '').slice(0, 160)}...
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 pt-2 text-xs font-mono text-ink-500 border-t border-ivory-200">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-ink-400" />
                  <span>{passage.estimatedReadMinutes} mins</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-ink-400" />
                  <span>{passage.wordCount} words</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-forest-600" />
                  <span>{vocabCount} target lexis</span>
                </div>
              </div>
            </div>

            {/* Read Button */}
            <div className="pt-4 mt-2">
              <Link href={`/reading/${passage.id}`} className="w-full block">
                <Button variant="outline" className="w-full justify-center group-hover:bg-forest-50 group-hover:text-forest-900 group-hover:border-forest-200 transition">
                  <span>Explore Passage</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
