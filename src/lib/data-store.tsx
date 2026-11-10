'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  VocabularyItem,
  UserVocabularyItem,
  Passage,
  QuizQuestion,
  AIRequestLog,
  AuditLogItem,
  FeedbackTicket,
  SystemSettingItem,
  VocabularyCollection,
  QuizAttempt,
  MasteryStatus
} from '@/types/database';
import {
  SEED_LEARNER,
  SEED_VOCABULARY,
  SEED_USER_VOCABULARY,
  SEED_COLLECTIONS,
  SEED_PASSAGES,
  SEED_QUIZ_QUESTIONS,
  SEED_ADMIN_USERS,
  SEED_AI_LOGS,
  SEED_AUDIT_LOGS,
  SEED_FEEDBACK_TICKETS,
  SEED_SYSTEM_SETTINGS
} from '@/data/seed-data';
import { calculateSM2, mapChoiceToRating } from '@/lib/srs';

const STORAGE_KEY = 'lexipath_storage_v1';

function normalizeVocab(v: any): VocabularyItem {
  return {
    ...v,
    lemma: v.lemma || v.word,
    word: v.word || v.lemma,
    pronunciationIpa: v.pronunciationIpa || v.phoneticIpa || `/${(v.lemma || v.word || '').toLowerCase()}/`,
    phoneticIpa: v.phoneticIpa || v.pronunciationIpa || `/${(v.lemma || v.word || '').toLowerCase()}/`,
    pos: v.pos || v.partOfSpeech || 'noun',
    partOfSpeech: v.partOfSpeech || v.pos || 'noun',
    topic: v.topic || v.ieltsTopic || 'General Academic',
    ieltsTopic: v.ieltsTopic || v.topic || 'General Academic',
  };
}

function normalizeUserVocab(uv: any): UserVocabularyItem {
  return {
    ...uv,
    vocabId: uv.vocabId || uv.vocabularyItemId,
    vocabularyItemId: uv.vocabularyItemId || uv.vocabId,
    personalNotes: uv.personalNotes || uv.personalNote || '',
    personalNote: uv.personalNote || uv.personalNotes || '',
    repetitionCount: uv.repetitionCount ?? uv.srsStage ?? 0,
    srsStage: uv.srsStage ?? uv.repetitionCount ?? 0,
  };
}

function normalizePassage(p: any): Passage {
  return {
    ...p,
    content: p.content || p.contentMarkdown || '',
    contentMarkdown: p.contentMarkdown || p.content || '',
    estimatedReadMinutes: p.estimatedReadMinutes ?? p.estimatedReadingMinutes ?? 4,
    estimatedReadingMinutes: p.estimatedReadingMinutes ?? p.estimatedReadMinutes ?? 4,
    vocabularyWords: p.vocabularyWords || p.highlightedWordIds || [],
    highlightedWordIds: p.highlightedWordIds || p.vocabularyWords || [],
    questions: (p.questions || []).map((q: any) => ({
      ...q,
      question: q.question || q.prompt || '',
      prompt: q.prompt || q.question || '',
      explanation: q.explanation || q.explanationUz || '',
      explanationUz: q.explanationUz || q.explanation || '',
    })),
  };
}

export interface LexiPathContextType {
  isHydrated: boolean;
  learner: Profile;
  vocabulary: VocabularyItem[];
  userVocabulary: UserVocabularyItem[];
  collections: VocabularyCollection[];
  passages: Passage[];
  quizQuestions: QuizQuestion[];
  adminUsers: Profile[];
  aiLogs: AIRequestLog[];
  auditLogs: AuditLogItem[];
  feedbackTickets: FeedbackTicket[];
  systemSettings: SystemSettingItem[];
  readPassageIds: string[];
  quizAttempts: QuizAttempt[];

  // Learner Vocabulary Actions
  addWord: (wordData: Partial<VocabularyItem>, contextSentence?: string, collectionName?: string) => VocabularyItem;
  addBatchWords: (words: Partial<VocabularyItem>[], collectionName?: string) => VocabularyItem[];
  editWord: (id: string, updates: Partial<VocabularyItem>) => void;
  deleteUserWord: (userVocabId: string) => void;
  updateUserWordNote: (userVocabId: string, note: string) => void;
  markWordLearned: (userVocabId: string, status?: MasteryStatus) => void;
  addWordToCollection: (userVocabId: string, collectionName: string) => void;
  saveWordFromReading: (vocabId: string, passageId: string, contextSentence: string) => void;

  // Review & SRS Actions
  submitReview: (userVocabId: string, choice: 'again' | 'hard' | 'good' | 'easy') => { intervalDays: number; dueDate: string };

  // Quiz & Practice Actions
  recordQuizAttempt: (quizId: string, answer: string, isCorrect: boolean, responseTimeMs?: number) => void;

  // Reading Actions
  markPassageRead: (passageId: string) => void;

  // Profile & Settings
  updateLearnerProfile: (updates: Partial<Profile>) => void;

  // Admin Actions
  adminUpdateUser: (userId: string, updates: Partial<Profile>) => void;
  adminAddPassage: (passageData: Partial<Passage>) => Passage;
  adminUpdatePassage: (id: string, updates: Partial<Passage>) => void;
  adminAddQuiz: (quizData: Partial<QuizQuestion>) => QuizQuestion;
  adminResolveFeedback: (ticketId: string) => void;
  adminUpdateSetting: (key: string, value: any) => void;
  adminApproveWord: (vocabId: string) => void;

  // Utility
  resetAllData: () => void;
}

const LexiPathContext = createContext<LexiPathContextType | null>(null);

export function LexiPathProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Core State initialized with SEED data
  const [learner, setLearner] = useState<Profile>(SEED_LEARNER);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(SEED_VOCABULARY.map(normalizeVocab));
  const [userVocabulary, setUserVocabulary] = useState<UserVocabularyItem[]>(SEED_USER_VOCABULARY.map(normalizeUserVocab));
  const [collections, setCollections] = useState<VocabularyCollection[]>(SEED_COLLECTIONS);
  const [passages, setPassages] = useState<Passage[]>(SEED_PASSAGES.map(normalizePassage));
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(SEED_QUIZ_QUESTIONS);
  const [adminUsers, setAdminUsers] = useState<Profile[]>(SEED_ADMIN_USERS);
  const [aiLogs, setAiLogs] = useState<AIRequestLog[]>(SEED_AI_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(SEED_AUDIT_LOGS);
  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>(SEED_FEEDBACK_TICKETS);
  const [systemSettings, setSystemSettings] = useState<SystemSettingItem[]>(SEED_SYSTEM_SETTINGS);
  const [readPassageIds, setReadPassageIds] = useState<string[]>(['pass-1']);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.learner) setLearner(parsed.learner);
        if (parsed.vocabulary) setVocabulary((parsed.vocabulary as any[]).map(normalizeVocab));
        if (parsed.userVocabulary) setUserVocabulary((parsed.userVocabulary as any[]).map(normalizeUserVocab));
        if (parsed.collections) setCollections(parsed.collections);
        if (parsed.passages) setPassages((parsed.passages as any[]).map(normalizePassage));
        if (parsed.quizQuestions) setQuizQuestions(parsed.quizQuestions);
        if (parsed.adminUsers) setAdminUsers(parsed.adminUsers);
        if (parsed.aiLogs) setAiLogs(parsed.aiLogs);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.feedbackTickets) setFeedbackTickets(parsed.feedbackTickets);
        if (parsed.systemSettings) setSystemSettings(parsed.systemSettings);
        if (parsed.readPassageIds) setReadPassageIds(parsed.readPassageIds);
        if (parsed.quizAttempts) setQuizAttempts(parsed.quizAttempts);
      }
    } catch (e) {
      console.warn('Failed to hydrate LexiPath local storage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage on updates (debounced/effect)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const payload = {
        learner,
        vocabulary,
        userVocabulary,
        collections,
        passages,
        quizQuestions,
        adminUsers,
        aiLogs,
        auditLogs,
        feedbackTickets,
        systemSettings,
        readPassageIds,
        quizAttempts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [
    isHydrated,
    learner,
    vocabulary,
    userVocabulary,
    collections,
    passages,
    quizQuestions,
    adminUsers,
    aiLogs,
    auditLogs,
    feedbackTickets,
    systemSettings,
    readPassageIds,
    quizAttempts
  ]);

  // Actions
  const addWord = (
    wordData: Partial<VocabularyItem>,
    contextSentence?: string,
    collectionName?: string
  ): VocabularyItem => {
    const newId = `vocab-${Date.now()}`;
    const wordItem: VocabularyItem = {
      id: newId,
      word: wordData.word || 'unnamed',
      lemma: wordData.lemma || wordData.word?.toLowerCase() || 'unnamed',
      phoneticIpa: wordData.phoneticIpa || '/.../',
      pos: wordData.pos || 'noun',
      definitionEn: wordData.definitionEn || 'Contextual definition awaiting review.',
      translationUz: wordData.translationUz || 'O\'zbekcha tarjima kutilmoqda',
      uzbekContextNotes: wordData.uzbekContextNotes || '',
      contextSentence: contextSentence || wordData.contextSentence || 'Context sentence.',
      additionalExamples: wordData.additionalExamples || [],
      collocations: wordData.collocations || [],
      synonyms: wordData.synonyms || [],
      antonyms: wordData.antonyms || [],
      wordForms: wordData.wordForms || {},
      cefrLevel: wordData.cefrLevel || 'C1',
      ieltsBand: wordData.ieltsBand || 7.5,
      topic: wordData.topic || 'General Academic',
      verificationStatus: 'verified',
      aiGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVocabulary((prev) => [wordItem, ...prev]);

    // Also add to userVocabulary
    const newUserVocabItem: UserVocabularyItem = {
      id: `uv-${Date.now()}`,
      userId: learner.id,
      vocabularyItemId: wordItem.id,
      vocabulary: wordItem,
      collectionName: collectionName || 'IELTS Academic Writing',
      customContextSentence: wordItem.contextSentence,
      status: 'learning',
      srsStage: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setUserVocabulary((prev) => [newUserVocabItem, ...prev]);
    setLearner((prev) => ({
      ...prev,
      wordsLearnedToday: prev.wordsLearnedToday + 1,
      wordsLearnedCount: prev.wordsLearnedCount + 1,
    }));

    return wordItem;
  };

  const addBatchWords = (
    wordsData: Partial<VocabularyItem>[],
    collectionName?: string
  ): VocabularyItem[] => {
    const newItems: VocabularyItem[] = [];
    const newUserItems: UserVocabularyItem[] = [];

    const now = new Date();
    wordsData.forEach((wordData, idx) => {
      const newId = `vocab-${Date.now()}-${idx}`;
      const item: VocabularyItem = {
        id: newId,
        word: wordData.word || wordData.lemma || 'unnamed',
        lemma: wordData.lemma || wordData.word?.toLowerCase() || 'unnamed',
        phoneticIpa: wordData.phoneticIpa || `/${(wordData.lemma || wordData.word || '').toLowerCase()}/`,
        pos: wordData.pos || wordData.partOfSpeech || 'noun',
        partOfSpeech: wordData.partOfSpeech || wordData.pos || 'noun',
        definitionEn: wordData.definitionEn || 'Academic contextual definition.',
        translationUz: wordData.translationUz || 'O\'zbekcha tarjimasi',
        uzbekContextNotes: wordData.uzbekContextNotes || '',
        contextSentence: wordData.contextSentence || 'Context sentence from text.',
        additionalExamples: wordData.additionalExamples || [],
        collocations: wordData.collocations || [],
        synonyms: wordData.synonyms || [],
        antonyms: wordData.antonyms || [],
        wordForms: wordData.wordForms || {},
        cefrLevel: wordData.cefrLevel || 'C1',
        ieltsBand: wordData.ieltsBand || 7.5,
        topic: wordData.topic || 'General Academic',
        verificationStatus: 'verified',
        aiGenerated: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      newItems.push(item);
      newUserItems.push({
        id: `uv-${Date.now()}-${idx}`,
        userId: learner.id,
        vocabularyItemId: item.id,
        vocabulary: item,
        collectionName: collectionName || 'IELTS Extracted Words',
        customContextSentence: item.contextSentence,
        status: 'learning',
        srsStage: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        dueDate: now.toISOString().split('T')[0],
        createdAt: now.toISOString(),
      });
    });

    setVocabulary((prev) => [...newItems, ...prev]);
    setUserVocabulary((prev) => [...newUserItems, ...prev]);
    setLearner((prev) => ({
      ...prev,
      wordsLearnedToday: prev.wordsLearnedToday + newItems.length,
      wordsLearnedCount: prev.wordsLearnedCount + newItems.length,
    }));

    return newItems;
  };

  const editWord = (id: string, updates: Partial<VocabularyItem>) => {
    setVocabulary((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v))
    );
    // Also update in userVocabulary
    setUserVocabulary((prev) =>
      prev.map((uv) =>
        uv.vocabularyItemId === id
          ? { ...uv, vocabulary: { ...uv.vocabulary, ...updates, updatedAt: new Date().toISOString() } }
          : uv
      )
    );
  };

  const deleteUserWord = (userVocabId: string) => {
    setUserVocabulary((prev) => prev.filter((uv) => uv.id !== userVocabId));
    setLearner((prev) => ({
      ...prev,
      wordsLearnedCount: Math.max(0, prev.wordsLearnedCount - 1),
    }));
  };

  const updateUserWordNote = (userVocabId: string, note: string) => {
    setUserVocabulary((prev) =>
      prev.map((uv) => (uv.id === userVocabId ? { ...uv, personalNote: note } : uv))
    );
  };

  const markWordLearned = (userVocabId: string, status: MasteryStatus = 'mastered') => {
    setUserVocabulary((prev) =>
      prev.map((uv) =>
        uv.id === userVocabId
          ? {
              ...uv,
              status,
              srsStage: status === 'mastered' ? Math.max(uv.srsStage, 4) : uv.srsStage,
              intervalDays: status === 'mastered' ? 21 : uv.intervalDays,
            }
          : uv
      )
    );
  };

  const addWordToCollection = (userVocabId: string, collectionName: string) => {
    setUserVocabulary((prev) =>
      prev.map((uv) => (uv.id === userVocabId ? { ...uv, collectionName } : uv))
    );
  };

  const saveWordFromReading = (vocabId: string, passageId: string, contextSentence: string) => {
    const existing = userVocabulary.find((uv) => uv.vocabularyItemId === vocabId);
    if (existing) {
      // Already saved
      return;
    }

    const vocabItem = vocabulary.find((v) => v.id === vocabId);
    const pass = passages.find((p) => p.id === passageId);
    if (!vocabItem) return;

    const newUV: UserVocabularyItem = {
      id: `uv-${Date.now()}`,
      userId: learner.id,
      vocabularyItemId: vocabId,
      vocabulary: vocabItem,
      sourcePassageId: passageId,
      sourcePassageTitle: pass?.title,
      customContextSentence: contextSentence || vocabItem.contextSentence,
      status: 'new',
      srsStage: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setUserVocabulary((prev) => [newUV, ...prev]);
    setLearner((prev) => ({
      ...prev,
      wordsLearnedToday: prev.wordsLearnedToday + 1,
      wordsLearnedCount: prev.wordsLearnedCount + 1,
    }));
  };

  const submitReview = (
    userVocabId: string,
    choice: 'again' | 'hard' | 'good' | 'easy'
  ) => {
    const target = userVocabulary.find((uv) => uv.id === userVocabId);
    const rating = mapChoiceToRating(choice);

    let nextState = { repetitions: 1, intervalDays: 1, easeFactor: 2.5, dueDate: new Date().toISOString().split('T')[0] };
    if (target) {
      nextState = calculateSM2(
        {
          repetitions: target.srsStage,
          intervalDays: target.intervalDays,
          easeFactor: target.easeFactor,
        },
        rating
      );

      const nextStatus: MasteryStatus =
        nextState.repetitions >= 4 ? 'mastered' : nextState.repetitions >= 2 ? 'reviewing' : 'learning';

      setUserVocabulary((prev) =>
        prev.map((uv) =>
          uv.id === userVocabId
            ? {
                ...uv,
                srsStage: nextState.repetitions,
                intervalDays: nextState.intervalDays,
                easeFactor: nextState.easeFactor,
                dueDate: nextState.dueDate,
                status: nextStatus,
                isOverdue: false,
                lastReviewedAt: new Date().toISOString(),
              }
            : uv
        )
      );
    }

    // Update study minutes and streak
    setLearner((prev) => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + 1,
    }));

    return { intervalDays: nextState.intervalDays, dueDate: nextState.dueDate };
  };

  const recordQuizAttempt = (
    quizId: string,
    answer: string,
    isCorrect: boolean,
    responseTimeMs = 1200
  ) => {
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizQuestionId: quizId,
      userId: learner.id,
      userAnswer: answer,
      isCorrect,
      responseTimeMs,
      attemptedAt: new Date().toISOString(),
    };

    setQuizAttempts((prev) => [newAttempt, ...prev]);
    setLearner((prev) => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + 1,
    }));
  };

  const markPassageRead = (passageId: string) => {
    if (!readPassageIds.includes(passageId)) {
      setReadPassageIds((prev) => [...prev, passageId]);
    }
  };

  const updateLearnerProfile = (updates: Partial<Profile>) => {
    setLearner((prev) => ({ ...prev, ...updates }));
  };

  // Admin Actions
  const adminUpdateUser = (userId: string, updates: Partial<Profile>) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  };

  const adminAddPassage = (passageData: Partial<Passage>): Passage => {
    const newPass: Passage = {
      id: `pass-${Date.now()}`,
      title: passageData.title || 'Untitled Passage',
      slug: (passageData.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
      topic: passageData.topic || 'General Academic',
      cefrLevel: passageData.cefrLevel || 'C1',
      targetBand: passageData.targetBand || 7.5,
      estimatedReadingMinutes: passageData.estimatedReadingMinutes || 4,
      wordCount: passageData.contentMarkdown?.split(/\s+/).length || 400,
      excerpt: passageData.contentMarkdown?.slice(0, 150) + '...' || '',
      contentMarkdown: passageData.contentMarkdown || '',
      status: passageData.status || 'published',
      highlightedWordIds: passageData.highlightedWordIds || [],
      questions: passageData.questions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPassages((prev) => [newPass, ...prev]);
    return newPass;
  };

  const adminUpdatePassage = (id: string, updates: Partial<Passage>) => {
    setPassages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const adminAddQuiz = (quizData: Partial<QuizQuestion>): QuizQuestion => {
    const targetVocab = vocabulary.find((v) => v.id === quizData.vocabularyId) || vocabulary[0];
    const newQ: QuizQuestion = {
      id: `qq-${Date.now()}`,
      vocabularyId: targetVocab.id,
      type: quizData.type || 'cloze',
      prompt: quizData.prompt || 'Vocabulary question',
      contextSentence: quizData.contextSentence,
      correctAnswer: quizData.correctAnswer || targetVocab.word,
      options: quizData.options || [targetVocab.word],
      explanationUz: quizData.explanationUz || 'O\'zbekcha izoh',
      cefrLevel: quizData.cefrLevel || targetVocab.cefrLevel,
      difficulty: quizData.difficulty || 'medium',
      status: 'published',
      vocabulary: targetVocab,
    };

    setQuizQuestions((prev) => [newQ, ...prev]);
    return newQ;
  };

  const adminResolveFeedback = (ticketId: string) => {
    setFeedbackTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t))
    );
  };

  const adminUpdateSetting = (key: string, value: any) => {
    setSystemSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const adminApproveWord = (vocabId: string) => {
    setVocabulary((prev) =>
      prev.map((v) => (v.id === vocabId ? { ...v, verificationStatus: 'verified' } : v))
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLearner(SEED_LEARNER);
    setVocabulary(SEED_VOCABULARY);
    setUserVocabulary(SEED_USER_VOCABULARY);
    setCollections(SEED_COLLECTIONS);
    setPassages(SEED_PASSAGES);
    setQuizQuestions(SEED_QUIZ_QUESTIONS);
    setAdminUsers(SEED_ADMIN_USERS);
    setAiLogs(SEED_AI_LOGS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setFeedbackTickets(SEED_FEEDBACK_TICKETS);
    setSystemSettings(SEED_SYSTEM_SETTINGS);
    setReadPassageIds(['pass-1']);
    setQuizAttempts([]);
  };

  return (
    <LexiPathContext.Provider
      value={{
        isHydrated,
        learner,
        vocabulary,
        userVocabulary,
        collections,
        passages,
        quizQuestions,
        adminUsers,
        aiLogs,
        auditLogs,
        feedbackTickets,
        systemSettings,
        readPassageIds,
        quizAttempts,

        addWord,
        addBatchWords,
        editWord,
        deleteUserWord,
        updateUserWordNote,
        markWordLearned,
        addWordToCollection,
        saveWordFromReading,

        submitReview,
        recordQuizAttempt,
        markPassageRead,
        updateLearnerProfile,

        adminUpdateUser,
        adminAddPassage,
        adminUpdatePassage,
        adminAddQuiz,
        adminResolveFeedback,
        adminUpdateSetting,
        adminApproveWord,

        resetAllData,
      }}
    >
      {children}
    </LexiPathContext.Provider>
  );
}

export function useLexiPathStore() {
  const context = useContext(LexiPathContext);
  if (!context) {
    throw new Error('useLexiPathStore must be used within a LexiPathProvider');
  }
  return context;
}
