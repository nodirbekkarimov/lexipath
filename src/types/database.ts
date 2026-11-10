export type AdminRole = 'super_admin' | 'content_manager' | 'support_agent' | 'analyst' | 'admin' | 'moderator';
export type UserRole = 'learner' | AdminRole;
export type CEFRLevel = 'B1' | 'B2' | 'C1' | 'C2';
export type MasteryStatus = 'new' | 'learning' | 'reviewing' | 'mastered';
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'collocation' | 'phrase' | 'idiom';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type VerificationStatus = 'verified' | 'pending_review' | 'ai_generated' | 'rejected';

// Exact requested type names and interfaces
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface UserProfile extends User {
  fullName: string;
  avatarUrl?: string;
  targetBand: number; // e.g. 7.5
  targetExamDate?: string;
  dailyGoalWords: number;
  nativeLanguage: string; // 'uz'
  streakDays: number;
  wordsLearnedToday: number;
  wordsLearnedCount: number;
  totalStudyMinutes: number;
  lastActiveAt?: string;
  status: 'active' | 'suspended' | 'pending';
}

// Alias for backward compatibility
export type Profile = UserProfile;

export interface WordDefinition {
  en: string;
  uz: string;
  contextNotesUz?: string;
}

export interface WordExample {
  sentence: string;
  translationUz?: string;
  source?: string;
}

export interface VocabularyWordForms {
  noun?: string;
  verb?: string;
  adjective?: string;
  adverb?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  lemma: string;
  phoneticIpa: string;
  pronunciationIpa?: string; // alias for phoneticIpa
  pos: PartOfSpeech;
  partOfSpeech?: PartOfSpeech; // alias for pos
  definitionEn: string;
  translationUz: string;
  uzbekContextNotes?: string;
  contextSentence: string;
  additionalExamples: string[];
  collocations: string[];
  synonyms: string[];
  antonyms?: string[];
  wordForms?: VocabularyWordForms;
  cefrLevel: CEFRLevel;
  ieltsBand: number; // e.g. 7.5
  topic: string;
  ieltsTopic?: string; // alias for topic
  verificationStatus: VerificationStatus;
  aiGenerated: boolean;
  duplicateFlag?: boolean;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type VocabularyItem = VocabularyWord;

export interface ReviewSchedule {
  srsStage: number; // Repetition count
  intervalDays: number;
  easeFactor: number; // Starts at 2.50
  dueDate: string; // YYYY-MM-DD
  isOverdue?: boolean;
  lastReviewedAt?: string;
}

export interface UserVocabularyItem {
  id: string;
  userId: string;
  vocabularyItemId: string;
  vocabId?: string; // alias for vocabularyItemId
  vocabulary: VocabularyWord;
  collectionName?: string;
  sourcePassageId?: string;
  sourcePassageTitle?: string;
  customContextSentence: string;
  personalNote?: string;
  personalNotes?: string; // alias for personalNote
  status: MasteryStatus;
  
  // SuperMemo SM-2 Parameters
  srsStage: number;
  repetitionCount?: number; // alias for srsStage
  intervalDays: number;
  easeFactor: number;
  dueDate: string;
  isOverdue?: boolean;
  lastReviewedAt?: string;
  createdAt: string;
}

export interface VocabularyCollection {
  id: string;
  name: string;
  description?: string;
  wordCount: number;
  createdAt: string;
}

export interface ReadingQuestion {
  id: string;
  passageId: string;
  questionNumber: number;
  type: 'multiple_choice' | 'true_false_not_given' | 'summary_completion';
  prompt: string;
  question?: string; // alias for prompt
  options?: string[];
  correctAnswer: string;
  explanationUz: string;
  explanation?: string; // alias for explanationUz
}

export interface ReadingPassage {
  id: string;
  title: string;
  slug: string;
  topic: string;
  cefrLevel: CEFRLevel;
  targetBand: number;
  estimatedReadingMinutes: number;
  estimatedReadMinutes?: number; // alias for estimatedReadingMinutes
  excerpt: string;
  contentMarkdown: string;
  content?: string; // alias for contentMarkdown
  wordCount: number;
  audioUrl?: string;
  status: ContentStatus;
  highlightedWordIds: string[];
  vocabularyWords?: string[]; // alias for highlightedWordIds
  questions: ReadingQuestion[];
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type Passage = ReadingPassage;

export type QuizQuestionType = 
  | 'cloze' 
  | 'meaning_match' 
  | 'definition' 
  | 'collocation' 
  | 'synonym' 
  | 'sentence_construction';

export interface QuizQuestion {
  id: string;
  vocabularyId: string;
  type: QuizQuestionType;
  questionType?: string; // alias for type
  prompt: string;
  questionText?: string; // alias for prompt
  contextSentence?: string;
  correctAnswer: string;
  options?: string[];
  explanationUz: string;
  explanation?: string; // alias for explanationUz
  cefrLevel: CEFRLevel;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: ContentStatus;
  vocabulary?: VocabularyWord;
  audioPromptUrl?: string;
}

export interface QuizAttempt {
  id: string;
  quizQuestionId: string;
  userId: string;
  userAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
  attemptedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  sessionType: 'learn' | 'practice' | 'review' | 'reading';
  durationMinutes: number;
  cardsStudiedCount: number;
  accuracyRate?: number;
  completedAt: string;
}

export interface ReviewLog {
  id: string;
  userVocabularyId: string;
  userId: string;
  quizType: string;
  rating: number; // 0 to 5
  responseTimeMs: number;
  reviewedAt: string;
}

// Admin Operations & Monitoring Types
export interface AIRequestLog {
  id: string;
  endpoint: string;
  model: string;
  inputTokenCount: number;
  outputTokenCount: number;
  estimatedCostUsd: number;
  latencyMs: number;
  status: 'success' | 'failed' | 'rate_limited';
  errorMessage?: string;
  createdAt: string;
  redactedPromptPreview: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: AdminRole;
  action: string;
  targetEntity: string;
  targetId: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

// Alias for backward compatibility
export type AuditLogItem = AuditLog;

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  allowedRoles: AdminRole[];
}

export interface FeedbackTicket {
  id: string;
  userEmail: string;
  userName: string;
  category: 'vocabulary_error' | 'translation_inaccuracy' | 'bug_report' | 'feature_request';
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface SystemSettingItem {
  key: string;
  category: 'ai' | 'srs' | 'security' | 'general';
  name: string;
  description: string;
  value: string | number | boolean;
  isEditable: boolean;
}
