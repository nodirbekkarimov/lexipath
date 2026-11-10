'use client';

import React from 'react';
import { Search, Plus, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CEFRLevel, MasteryStatus } from '@/types/database';

interface VocabularyToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCefr: string;
  setSelectedCefr: (cefr: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: 'newest' | 'alphabetical' | 'srs_due' | 'mastery') => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  onOpenAddModal: () => void;
  totalCount: number;
}

export function VocabularyToolbar({
  searchQuery,
  setSearchQuery,
  selectedCefr,
  setSelectedCefr,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onOpenAddModal,
  totalCount,
}: VocabularyToolbarProps) {
  const cefrLevels: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All CEFR' },
    { value: 'B2', label: 'B2' },
    { value: 'C1', label: 'C1 (Band 7.0-8.0)' },
    { value: 'C2', label: 'C2 (Band 8.5+)' },
  ];

  const statuses: Array<{ value: string; label: string }> = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'learning', label: 'Learning' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'mastered', label: 'Mastered' },
  ];

  return (
    <div className="bg-white border border-ivory-200 rounded-xl p-4 shadow-subtle space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            placeholder="Search lemma, definition, or Uzbek translation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-ink-400" />}
          />
        </div>

        {/* View Mode & Add Button */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-ivory-300 rounded-lg overflow-hidden bg-ivory-100 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-white shadow-subtle text-ink-950 font-bold'
                  : 'text-ink-500 hover:text-ink-800'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'table'
                  ? 'bg-white shadow-subtle text-ink-950 font-bold'
                  : 'text-ink-500 hover:text-ink-800'
              }`}
              title="Table View"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button variant="primary" onClick={onOpenAddModal} className="flex-shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Word
          </Button>
        </div>
      </div>

      {/* Filter Chips & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-ivory-100 text-xs">
        {/* CEFR and Status Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1">
            <span className="text-ink-400 font-mono text-[11px] uppercase mr-1">Level:</span>
            {cefrLevels.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => setSelectedCefr(lvl.value)}
                className={`px-2.5 py-1 rounded-md text-xs transition ${
                  selectedCefr === lvl.value
                    ? 'bg-forest-700 text-white font-medium shadow-xs'
                    : 'bg-ivory-100 hover:bg-ivory-200 text-ink-600'
                }`}
              >
                {lvl.value.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-ivory-300 mx-1 hidden sm:block" />

          <div className="flex items-center space-x-1">
            <span className="text-ink-400 font-mono text-[11px] uppercase mr-1">Status:</span>
            {statuses.map((st) => (
              <button
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={`px-2.5 py-1 rounded-md text-xs capitalize transition ${
                  selectedStatus === st.value
                    ? 'bg-ink-900 text-white font-medium'
                    : 'bg-ivory-100 hover:bg-ivory-200 text-ink-600'
                }`}
              >
                {st.value}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-ink-400 font-mono text-[11px] uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-ivory-100 border border-ivory-300 rounded-md px-2 py-1 text-ink-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
          >
            <option value="newest">Recently Saved</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="srs_due">SRS Due Date</option>
            <option value="mastery">Mastery Level</option>
          </select>
          <span className="text-ink-400 font-mono text-xs">({totalCount} words)</span>
        </div>
      </div>
    </div>
  );
}
