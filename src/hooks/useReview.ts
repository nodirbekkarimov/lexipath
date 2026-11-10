'use client';

import { useState, useMemo } from 'react';
import { useLexiPathStore } from '@/lib/data-store';
import { UserVocabularyItem } from '@/types/database';

export function useReview() {
  const store = useLexiPathStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Compute due & overdue words
  const today = new Date().toISOString().split('T')[0];
  const dueItems: UserVocabularyItem[] = useMemo(() => {
    return store.userVocabulary.filter(
      (item) => item.dueDate <= today || item.isOverdue
    );
  }, [store.userVocabulary, today]);

  const currentItem: UserVocabularyItem | undefined = dueItems[currentIndex];

  const currentCard = useMemo(() => {
    if (!currentItem) return undefined;
    const vocab = currentItem.vocabulary || store.vocabulary.find(v => v.id === currentItem.vocabId);
    return {
      ...currentItem,
      vocab: vocab || store.vocabulary[0],
    };
  }, [currentItem, store.vocabulary]);

  const submitRating = (choice: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentItem) return;

    const result = store.submitReview(currentItem.id, choice);
    setReviewedCount((prev) => prev + 1);
    setFeedbackMessage(
      `Interval updated: ${result.intervalDays} day(s). Next review: ${result.dueDate}`
    );

    setTimeout(() => {
      if (currentIndex + 1 < dueItems.length) {
        setCurrentIndex((prev) => prev + 1);
        setIsRevealed(false);
        setFeedbackMessage(null);
      } else {
        setIsFinished(true);
      }
    }, 900);
  };

  const restartReview = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsFinished(false);
    setReviewedCount(0);
    setFeedbackMessage(null);
  };

  return {
    queue: dueItems,
    dueItems,
    currentCard,
    currentItem,
    currentIndex,
    totalCards: dueItems.length,
    totalDue: dueItems.length,
    isRevealed,
    revealCard: () => setIsRevealed(true),
    setIsRevealed,
    isSessionFinished: isFinished,
    isFinished,
    reviewedCount,
    lastFeedback: feedbackMessage,
    feedbackMessage,
    submitRating,
    restartSession: restartReview,
    restartReview,
  };
}
