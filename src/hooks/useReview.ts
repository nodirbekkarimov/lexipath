'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLexiPathStore } from '@/lib/data-store';
import { UserVocabularyItem } from '@/types/database';
import { getLocalISODate } from '@/lib/srs';

export interface ReviewSessionSummary {
  totalReviewed: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  elapsedSeconds: number;
  accuracyRate: number;
}

export function useReview() {
  const store = useLexiPathStore();

  const [sessionQueue, setSessionQueue] = useState<UserVocabularyItem[]>([]);
  const [isQueueInitialized, setIsQueueInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Accurate duration tracking
  const sessionStartTimeRef = useRef<number>(Date.now());
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState(0);

  // Detailed session metrics
  const [choiceCounts, setChoiceCounts] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  // Calculate local Tashkent date
  const today = useMemo(() => getLocalISODate('Asia/Tashkent'), []);

  // Initialize a stable snapshot queue on start
  const initializeQueue = useCallback(() => {
    const due = store.userVocabulary.filter(
      (item) => item.dueDate <= today || item.isOverdue
    );
    // If no overdue cards, provide least-reviewed cards for practice
    const finalQueue = due.length > 0 ? due : store.userVocabulary.slice(0, 10);
    setSessionQueue(finalQueue);
    setIsQueueInitialized(true);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsFinished(finalQueue.length === 0);
    sessionStartTimeRef.current = Date.now();
    setChoiceCounts({ again: 0, hard: 0, good: 0, easy: 0 });
    setFeedbackMessage(null);
  }, [store.userVocabulary, today]);

  // Run initialization once when store is hydrated
  useEffect(() => {
    if (store.isHydrated && !isQueueInitialized) {
      initializeQueue();
    }
  }, [store.isHydrated, isQueueInitialized, initializeQueue]);

  // Track session timer
  useEffect(() => {
    if (isFinished || sessionQueue.length === 0) return;
    const timer = setInterval(() => {
      setSessionDurationSeconds(Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, sessionQueue.length]);

  const currentItem: UserVocabularyItem | undefined = sessionQueue[currentIndex];

  const currentCard = useMemo(() => {
    if (!currentItem) return undefined;
    const vocab = currentItem.vocabulary || store.vocabulary.find(v => v.id === (currentItem.vocabId || currentItem.vocabularyItemId));
    return {
      ...currentItem,
      vocab: vocab || store.vocabulary[0] || {
        id: currentItem.vocabularyItemId,
        word: 'Vocabulary Item',
        lemma: 'item',
        pos: 'noun',
        definitionEn: 'Definition pending review.',
        translationUz: 'Tarjima kutilmoqda',
        contextSentence: currentItem.customContextSentence,
        phoneticIpa: '/.../',
        cefrLevel: 'B2',
        ieltsBand: 6.5,
        topic: 'General Academic',
        verificationStatus: 'verified',
        aiGenerated: false,
        additionalExamples: [],
        collocations: [],
        synonyms: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }, [currentItem, store.vocabulary]);

  const submitRating = (choice: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentItem) return;

    // Record choice count for summary
    setChoiceCounts(prev => ({
      ...prev,
      [choice]: prev[choice] + 1,
    }));

    // Update the authoritative store/database
    const result = store.submitReview(currentItem.id, choice);

    setFeedbackMessage(
      `Interval: +${result.intervalDays} kun. Keyingi takrorlash: ${result.dueDate}`
    );

    setTimeout(() => {
      if (currentIndex + 1 < sessionQueue.length) {
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
        setFeedbackMessage(null);
      } else {
        setIsFinished(true);
        setFeedbackMessage(null);
      }
    }, 700);
  };

  const restartReview = () => {
    initializeQueue();
  };

  const sessionSummary: ReviewSessionSummary = useMemo(() => {
    const total = choiceCounts.again + choiceCounts.hard + choiceCounts.good + choiceCounts.easy;
    const correct = choiceCounts.hard + choiceCounts.good + choiceCounts.easy;
    return {
      totalReviewed: total,
      againCount: choiceCounts.again,
      hardCount: choiceCounts.hard,
      goodCount: choiceCounts.good,
      easyCount: choiceCounts.easy,
      elapsedSeconds: sessionDurationSeconds,
      accuracyRate: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }, [choiceCounts, sessionDurationSeconds]);

  return {
    queue: sessionQueue,
    dueItems: sessionQueue,
    currentCard,
    currentItem,
    currentIndex,
    totalCards: sessionQueue.length,
    totalDue: sessionQueue.length,
    isRevealed,
    revealCard: () => setIsRevealed(true),
    setIsRevealed,
    isSessionFinished: isFinished,
    isFinished,
    reviewedCount: choiceCounts.again + choiceCounts.hard + choiceCounts.good + choiceCounts.easy,
    lastFeedback: feedbackMessage,
    feedbackMessage,
    submitRating,
    restartSession: restartReview,
    restartReview,
    sessionDurationSeconds,
    sessionSummary,
  };
}
