'use client';

import React, { useState } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useLexiPathStore } from '@/lib/data-store';
import { VocabularyToolbar } from '@/components/vocabulary/VocabularyToolbar';
import { VocabularyGrid } from '@/components/vocabulary/VocabularyGrid';
import { VocabularyTable } from '@/components/vocabulary/VocabularyTable';
import { DeleteWordModal } from '@/components/vocabulary/DeleteWordModal';
import { AddWordModal } from '@/components/dashboard/AddWordModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Plus, BookOpen, Layers, Download } from 'lucide-react';
import { ExportVocabularyModal } from '@/components/tools/ExportVocabularyModal';
import { MasteryStatus } from '@/types/database';

export default function MyVocabularyPage() {
  const store = useLexiPathStore();
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCefr,
    setSelectedCefr,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    totalCount,
    resetFilters,
  } = useVocabulary();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id: string;
    lemma: string;
  }>({
    isOpen: false,
    id: '',
    lemma: '',
  });

  const handleMarkLearned = (userVocabId: string, status?: MasteryStatus) => {
    store.markWordLearned(userVocabId, status || 'mastered');
  };

  const handleDeletePrompt = (userVocabId: string, lemma: string) => {
    setDeleteModalState({
      isOpen: true,
      id: userVocabId,
      lemma,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.id) {
      store.deleteUserWord(deleteModalState.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ivory-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-ink-500 mb-1">
            <span>LexiPath</span>
            <span>/</span>
            <span className="text-forest-700">Vocabulary Vault</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink-950">
            My Vocabulary Vault
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Personal lexical inventory anchored in authentic reading context with SM-2 spaced repetition schedules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setExportModalOpen(true)}
            className="text-xs"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Eksport (Anki & Telegram)
          </Button>

          <Button
            variant="primary"
            onClick={() => setAddModalOpen(true)}
            className="shadow-subtle text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Word to Vault
          </Button>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Sort, Layout Switcher */}
      <VocabularyToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCefr={selectedCefr}
        setSelectedCefr={setSelectedCefr}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenAddModal={() => setAddModalOpen(true)}
        totalCount={totalCount}
      />

      {/* Main Content: Grid or Table or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-ivory-200 p-12 text-center shadow-subtle space-y-3">
          <div className="w-12 h-12 bg-ivory-100 rounded-full flex items-center justify-center mx-auto text-ink-400">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink-950">
            No matching vocabulary items
          </h3>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">
            Try adjusting your search query, CEFR level, or status filters, or add a new word to your vault.
          </p>
          <div className="pt-2 flex justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Word
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <VocabularyGrid
          items={filteredItems}
          onMarkLearned={handleMarkLearned}
          onDelete={handleDeletePrompt}
        />
      ) : (
        <VocabularyTable
          items={filteredItems}
          onMarkLearned={handleMarkLearned}
          onDelete={handleDeletePrompt}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteWordModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        lemma={deleteModalState.lemma}
      />

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Export Modal */}
      <ExportVocabularyModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
