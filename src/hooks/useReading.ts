'use client';

import { useState, useMemo } from 'react';
import { useLexiPathStore } from '@/lib/data-store';
import { Passage, VocabularyItem } from '@/types/database';

export function useReading(currentPassageId?: string) {
  const store = useLexiPathStore();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  // Selected word inspection state
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [selectedVocabItem, setSelectedVocabItem] = useState<VocabularyItem | undefined>(undefined);

  const topics = useMemo(() => {
    return Array.from(new Set(store.passages.map((p) => p.topic)));
  }, [store.passages]);

  const allTopics = useMemo(() => ['all', ...topics], [topics]);

  const filteredPassages = useMemo(() => {
    return store.passages.filter((p) => {
      const matchesTopic = selectedTopic === 'all' || p.topic === selectedTopic;
      const matchesLevel = selectedLevel === 'all' || p.cefrLevel === selectedLevel;
      return matchesTopic && matchesLevel;
    });
  }, [store.passages, selectedTopic, selectedLevel]);

  const currentPassage = useMemo(() => {
    if (!currentPassageId) return store.passages[0];
    return store.passages.find((p) => p.id === currentPassageId) || store.passages[0];
  }, [store.passages, currentPassageId]);

  // Target vocabulary items for the current passage
  const targetVocab = useMemo(() => {
    if (!currentPassage) return [];
    const highlightedIds = currentPassage.highlightedWordIds || currentPassage.vocabularyWords || [];
    return store.vocabulary.filter((v) => highlightedIds.includes(v.id));
  }, [store.vocabulary, currentPassage]);

  // Saved vocabulary item IDs for the current user
  const savedVocabItemIds = useMemo(() => {
    return store.userVocabulary.map((uv) => uv.vocabularyItemId || uv.vocabId || '');
  }, [store.userVocabulary]);

  const isCurrentWordSaved = useMemo(() => {
    if (!selectedVocabItem) return false;
    return savedVocabItemIds.includes(selectedVocabItem.id);
  }, [selectedVocabItem, savedVocabItemIds]);

  const handleWordSelect = (word: string, contextSentence: string, vocab?: VocabularyItem) => {
    setSelectedWord(word);
    setSelectedContext(contextSentence);
    setSelectedVocabItem(vocab || targetVocab.find(v => v.lemma.toLowerCase() === word.toLowerCase()));
  };

  const clearSelectedWord = () => {
    setSelectedWord(null);
    setSelectedContext('');
    setSelectedVocabItem(undefined);
  };

  const saveCurrentWordToVault = (collectionName?: string) => {
    if (!selectedVocabItem || !currentPassage) return;
    store.saveWordFromReading(selectedVocabItem.id, currentPassage.id, selectedContext);
  };

  const completePassage = () => {
    if (currentPassage) {
      store.markPassageRead(currentPassage.id);
    }
  };

  const isCompleted = useMemo(() => {
    if (!currentPassage) return false;
    return store.readPassageIds.includes(currentPassage.id);
  }, [currentPassage, store.readPassageIds]);

  const answerQuestion = (qId: string, answer: string) => {
    if (checkedQuestions[qId]) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }));
    setCheckedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const isPassageCompleted = (passageId: string) => {
    return store.readPassageIds.includes(passageId);
  };

  return {
    passages: filteredPassages,
    filteredPassages,
    allPassages: store.passages,
    currentPassage,
    targetVocab,
    topics,
    allTopics,
    selectedTopic,
    setSelectedTopic,
    selectedLevel,
    setSelectedLevel,
    savedVocabItemIds,
    readPassageIds: store.readPassageIds,
    selectedWord,
    selectedContext,
    selectedVocabItem,
    isCurrentWordSaved,
    handleWordSelect,
    clearSelectedWord,
    saveCurrentWordToVault,
    completePassage,
    isCompleted,
    saveWordFromReading: store.saveWordFromReading,
    markPassageRead: store.markPassageRead,
    isPassageCompleted,
    userAnswers,
    checkedQuestions,
    answerQuestion,
  };
}
