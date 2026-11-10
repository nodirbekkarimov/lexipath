'use client';

import { useState } from 'react';
import { useLexiPathStore } from '@/lib/data-store';
import { QuizQuestion } from '@/types/database';

export interface QuizResultItem {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export function usePractice() {
  const store = useLexiPathStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<QuizResultItem[]>([]);

  const questions = store.quizQuestions;
  const currentQuestion: QuizQuestion | undefined = questions[currentIndex];

  const submitAnswer = (option: string, isCorrect?: boolean) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = isCorrect !== undefined 
      ? isCorrect 
      : option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setResults(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionText || currentQuestion.prompt || '',
        userAnswer: option,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: correct,
      }
    ]);

    // Record attempt in store
    store.recordQuizAttempt(currentQuestion.id, option, correct);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setResults([]);
  };

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    selectedOption,
    isAnswered,
    isCorrect: selectedOption === currentQuestion?.correctAnswer,
    score,
    isFinished,
    results,
    selectOption: submitAnswer,
    submitAnswer,
    nextQuestion,
    restartQuiz,
  };
}
