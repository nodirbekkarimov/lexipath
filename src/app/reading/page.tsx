'use client';

import React from 'react';
import { useReading } from '@/hooks/useReading';
import { PassageCatalog } from '@/components/reading/PassageCatalog';
import { BookOpen, Sparkles, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ReadingListPage() {
  const {
    filteredPassages,
    selectedTopic,
    setSelectedTopic,
    selectedLevel,
    setSelectedLevel,
    readPassageIds,
    allTopics,
  } = useReading();

  const cefrLevels = ['all', 'B2', 'C1', 'C2'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-ivory-200 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-ink-500 mb-1">
          <span>LexiPath</span>
          <span>/</span>
          <span className="text-forest-700">Reading Passages</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950">
          Authentic IELTS Reading Passages
        </h1>
        <p className="text-sm text-ink-600 mt-1 max-w-3xl leading-relaxed">
          Cambridge formati asosidagi akademik matnlar. Mutolaa davomida ajratib ko&apos;rsatilgan akademik so&apos;zlarni bosib kontekstual tahlil qiling va shaxsiy lug&apos;at xazinangizga saqlang.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-ivory-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-subtle text-xs">
        {/* Topic Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[11px] text-ink-400 uppercase mr-1">Mavzu:</span>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-lg transition capitalize ${
                selectedTopic === topic
                  ? 'bg-forest-700 text-white font-medium shadow-xs'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
              }`}
            >
              {topic === 'all' ? 'Barcha Mavzular' : topic}
            </button>
          ))}
        </div>

        {/* Level Filters */}
        <div className="flex items-center space-x-1.5">
          <span className="font-mono text-[11px] text-ink-400 uppercase mr-1">Daraja:</span>
          {cefrLevels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                selectedLevel === lvl
                  ? 'bg-ink-900 text-white font-medium'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-ink-700'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Passages Catalog */}
      <PassageCatalog
        passages={filteredPassages}
        readPassageIds={readPassageIds}
      />
    </div>
  );
}
