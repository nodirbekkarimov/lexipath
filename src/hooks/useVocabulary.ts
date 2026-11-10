'use client';

import { useState, useMemo } from 'react';
import { useLexiPathStore } from '@/lib/data-store';
import { CEFRLevel, MasteryStatus, UserVocabularyItem, VocabularyItem } from '@/types/database';

export function useVocabulary() {
  const store = useLexiPathStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'alpha' | 'date' | 'newest' | 'alphabetical' | 'srs_due' | 'mastery'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Unique collections
  const collections = useMemo(() => {
    const list = store.userVocabulary.map((uv) => uv.collectionName || 'General');
    return Array.from(new Set(list));
  }, [store.userVocabulary]);

  // Filtered and sorted list
  const filteredVocabulary = useMemo(() => {
    let result = store.userVocabulary.filter((item) => {
      const vocab = item.vocabulary || store.vocabulary.find(v => v.id === item.vocabId) || store.vocabulary[0];
      const term = searchTerm.toLowerCase();
      const wordText = (vocab.lemma || vocab.word || '').toLowerCase();
      const translation = (vocab.translationUz || '').toLowerCase();
      const def = (vocab.definitionEn || '').toLowerCase();

      const matchesSearch =
        wordText.includes(term) ||
        translation.includes(term) ||
        def.includes(term);

      const matchesCefr = selectedCefr === 'all' || vocab.cefrLevel === selectedCefr;
      const isDue = item.dueDate <= new Date().toISOString().split('T')[0] || item.isOverdue;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'due' ? isDue : item.status === selectedStatus);

      const matchesCollection =
        selectedCollection === 'all' || (item.collectionName || 'General') === selectedCollection;

      return matchesSearch && matchesCefr && matchesStatus && matchesCollection;
    });

    return result.sort((a, b) => {
      const vocabA = a.vocabulary || store.vocabulary.find(v => v.id === a.vocabId);
      const vocabB = b.vocabulary || store.vocabulary.find(v => v.id === b.vocabId);
      const wordA = vocabA?.lemma || vocabA?.word || '';
      const wordB = vocabB?.lemma || vocabB?.word || '';

      if (sortBy === 'alpha' || sortBy === 'alphabetical') {
        return wordA.localeCompare(wordB);
      }
      if (sortBy === 'date' || sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'srs_due' || sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [
    store.userVocabulary,
    store.vocabulary,
    searchTerm,
    selectedCefr,
    selectedStatus,
    selectedCollection,
    sortBy,
  ]);

  const filteredItems = useMemo(() => {
    return filteredVocabulary.map(item => {
      const vocab = item.vocabulary || store.vocabulary.find(v => v.id === item.vocabId) || store.vocabulary[0];
      return {
        id: item.id,
        vocabId: item.vocabularyItemId || item.vocabId || '',
        status: item.status,
        intervalDays: item.intervalDays,
        dueDate: item.dueDate,
        repetitionCount: item.repetitionCount || item.srsStage || 0,
        personalNotes: item.personalNotes || item.personalNote || '',
        vocab,
      };
    });
  }, [filteredVocabulary, store.vocabulary]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredVocabulary.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVocabulary.map((item) => item.id));
    }
  };

  const bulkMarkLearned = () => {
    selectedIds.forEach((id) => store.markWordLearned(id, 'mastered'));
    setSelectedIds([]);
  };

  const bulkResetInterval = () => {
    selectedIds.forEach((id) => store.submitReview(id, 'again'));
    setSelectedIds([]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCefr('all');
    setSelectedStatus('all');
    setSelectedCollection('all');
    setSortBy('newest');
  };

  return {
    vocabularyList: filteredVocabulary,
    filteredVocabulary,
    filteredItems,
    totalCount: store.userVocabulary.length,
    filteredCount: filteredVocabulary.length,
    collections,
    searchTerm,
    setSearchTerm,
    searchQuery: searchTerm,
    setSearchQuery: setSearchTerm,
    selectedCefr,
    setSelectedCefr,
    selectedStatus,
    setSelectedStatus,
    selectedCollection,
    setSelectedCollection,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedIds,
    toggleSelect,
    selectAll,
    bulkMarkLearned,
    bulkResetInterval,
    resetFilters,
  };
}
