-- ============================================================
-- LexiPath — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE cefr_level AS ENUM ('A1','A2','B1','B2','C1','C2');
CREATE TYPE mastery_status AS ENUM ('new','learning','reviewing','mastered');
CREATE TYPE quiz_type AS ENUM ('multiple_choice','fill_blank','definition_match','context_usage','spelling');
CREATE TYPE admin_role_type AS ENUM ('super_admin','content_manager','support_agent','analyst');
CREATE TYPE passage_difficulty AS ENUM ('easy','medium','hard');

-- ============================================================
-- USER MANAGEMENT
-- ============================================================

-- profiles: extends auth.users (one row per user, created on sign-up)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  target_level  cefr_level DEFAULT 'B2',
  daily_goal    INTEGER DEFAULT 10 CHECK (daily_goal BETWEEN 1 AND 100),
  timezone      TEXT DEFAULT 'UTC',
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- user_preferences: granular notification and UI preferences
CREATE TABLE user_preferences (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_reminders     BOOLEAN DEFAULT TRUE,
  push_notifications  BOOLEAN DEFAULT TRUE,
  study_reminder_time TIME DEFAULT '08:00:00',
  ui_theme            TEXT DEFAULT 'light',
  quiz_auto_advance   BOOLEAN DEFAULT FALSE,
  show_phonetics      BOOLEAN DEFAULT TRUE,
  show_uzbek          BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- user_learning_goals: what the user is working toward
CREATE TABLE user_learning_goals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type       TEXT NOT NULL,  -- 'ielts_band', 'cefr_level', 'vocabulary_size'
  target_value    TEXT NOT NULL,
  deadline        DATE,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- VOCABULARY
-- ============================================================

-- vocabulary_words: the canonical English vocabulary word bank
CREATE TABLE vocabulary_words (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lemma               TEXT NOT NULL UNIQUE,
  part_of_speech      TEXT NOT NULL,
  phonetic_ipa        TEXT,
  audio_url           TEXT,
  cefr_level          cefr_level NOT NULL DEFAULT 'B2',
  ielts_topic         TEXT,
  frequency_rank      INTEGER,
  is_published        BOOLEAN DEFAULT FALSE,
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_vocabulary_words_lemma ON vocabulary_words USING gin(lemma gin_trgm_ops);
CREATE INDEX idx_vocabulary_words_cefr ON vocabulary_words(cefr_level);
CREATE INDEX idx_vocabulary_words_topic ON vocabulary_words(ielts_topic);
CREATE INDEX idx_vocabulary_words_published ON vocabulary_words(is_published);

-- word_definitions: multiple definitions per word
CREATE TABLE word_definitions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  definition_en   TEXT NOT NULL,
  definition_uz   TEXT,
  definition_order INTEGER DEFAULT 1,
  is_primary      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- word_examples: example sentences for each definition
CREATE TABLE word_examples (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  definition_id   UUID REFERENCES word_definitions(id) ON DELETE SET NULL,
  sentence        TEXT NOT NULL,
  source          TEXT,  -- e.g. 'IELTS Academic 2023', 'Cambridge English'
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- word_collocations: natural word combinations
CREATE TABLE word_collocations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  collocation     TEXT NOT NULL,
  example         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- word_forms: morphological variants (noun, verb forms, etc.)
CREATE TABLE word_forms (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  form_type       TEXT NOT NULL,  -- 'plural', 'past_tense', 'comparative', etc.
  form_value      TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- user_vocabulary: words saved by learners to their personal vault
CREATE TABLE user_vocabulary (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word_id             UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  mastery_status      mastery_status DEFAULT 'new' NOT NULL,
  personal_note       TEXT,
  source_context      TEXT,   -- the sentence/passage where the word was encountered
  source_passage_id   UUID,   -- FK added after reading_passages table
  times_seen          INTEGER DEFAULT 0,
  times_correct       INTEGER DEFAULT 0,
  times_incorrect     INTEGER DEFAULT 0,
  last_reviewed_at    TIMESTAMPTZ,
  next_review_at      TIMESTAMPTZ DEFAULT now(),
  srs_interval        INTEGER DEFAULT 1,    -- days until next review
  srs_easiness        FLOAT DEFAULT 2.5,    -- SM-2 easiness factor
  srs_repetitions     INTEGER DEFAULT 0,    -- successful repetition count
  starred             BOOLEAN DEFAULT FALSE,
  added_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, word_id)
);

CREATE INDEX idx_user_vocabulary_user ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_review ON user_vocabulary(user_id, next_review_at) WHERE mastery_status != 'mastered';
CREATE INDEX idx_user_vocabulary_mastery ON user_vocabulary(user_id, mastery_status);

-- vocabulary_collections: user-created word lists / decks
CREATE TABLE vocabulary_collections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT DEFAULT '#315C4A',
  is_public   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- collection_words: many-to-many between collections and vocabulary
CREATE TABLE collection_words (
  collection_id   UUID NOT NULL REFERENCES vocabulary_collections(id) ON DELETE CASCADE,
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  added_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (collection_id, word_id)
);

-- ============================================================
-- READING
-- ============================================================

-- reading_passages: IELTS/CEFR reading texts
CREATE TABLE reading_passages (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                     TEXT NOT NULL,
  content_markdown          TEXT NOT NULL,
  source                    TEXT,
  author                    TEXT,
  difficulty                passage_difficulty DEFAULT 'medium',
  cefr_level                cefr_level DEFAULT 'B2',
  ielts_topic               TEXT,
  estimated_reading_minutes INTEGER DEFAULT 5,
  word_count                INTEGER,
  is_published              BOOLEAN DEFAULT FALSE,
  created_by                UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at                TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_reading_passages_published ON reading_passages(is_published);
CREATE INDEX idx_reading_passages_cefr ON reading_passages(cefr_level);

-- passage_vocabulary: words linked to a specific passage
CREATE TABLE passage_vocabulary (
  passage_id  UUID NOT NULL REFERENCES reading_passages(id) ON DELETE CASCADE,
  word_id     UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  highlighted BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (passage_id, word_id)
);

-- reading_questions: comprehension questions per passage
CREATE TABLE reading_questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id      UUID NOT NULL REFERENCES reading_passages(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  question_type   TEXT NOT NULL,  -- 'multiple_choice','true_false','fill_blank'
  correct_answer  TEXT NOT NULL,
  explanation     TEXT,
  question_order  INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- reading_attempts: user reading session records
CREATE TABLE reading_attempts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  passage_id        UUID NOT NULL REFERENCES reading_passages(id) ON DELETE CASCADE,
  started_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at      TIMESTAMPTZ,
  time_spent_secs   INTEGER,
  words_saved       INTEGER DEFAULT 0,
  score             INTEGER,   -- 0-100 for comprehension questions
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_reading_attempts_user ON reading_attempts(user_id, created_at DESC);

-- ============================================================
-- QUIZ & LEARNING
-- ============================================================

-- quiz_questions: questions attached to vocabulary words
CREATE TABLE quiz_questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  question_type   quiz_type NOT NULL,
  prompt          TEXT NOT NULL,
  correct_answer  TEXT NOT NULL,
  explanation_uz  TEXT,
  difficulty      INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_quiz_questions_word ON quiz_questions(word_id, is_active);

-- quiz_options: multiple choice options for quiz questions
CREATE TABLE quiz_options (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id   UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text   TEXT NOT NULL,
  is_correct    BOOLEAN DEFAULT FALSE,
  option_order  INTEGER DEFAULT 1
);

-- quiz_attempts: one per quiz session
CREATE TABLE quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_type       TEXT NOT NULL DEFAULT 'practice',  -- 'practice','review','timed'
  total_questions INTEGER NOT NULL,
  correct_count   INTEGER DEFAULT 0,
  score           INTEGER DEFAULT 0,  -- 0-100
  time_spent_secs INTEGER,
  started_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id, created_at DESC);

-- quiz_answers: individual answers within an attempt
CREATE TABLE quiz_answers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  user_answer     TEXT,
  is_correct      BOOLEAN NOT NULL,
  time_taken_ms   INTEGER,
  answered_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- study_sessions: daily study tracking
CREATE TABLE study_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  words_studied   INTEGER DEFAULT 0,
  words_reviewed  INTEGER DEFAULT 0,
  quizzes_done    INTEGER DEFAULT 0,
  minutes_spent   INTEGER DEFAULT 0,
  xp_earned       INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, session_date)
);

CREATE INDEX idx_study_sessions_user ON study_sessions(user_id, session_date DESC);

-- review_schedules: SRS queue (per word, per user)
CREATE TABLE review_schedules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word_id         UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  scheduled_for   TIMESTAMPTZ NOT NULL,
  completed_at    TIMESTAMPTZ,
  was_correct     BOOLEAN,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, word_id, scheduled_for)
);

CREATE INDEX idx_review_schedules_due ON review_schedules(user_id, scheduled_for) WHERE completed_at IS NULL;

-- learning_activity: event log for dashboard activity feed
CREATE TABLE learning_activity (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type   TEXT NOT NULL,  -- 'word_added','word_mastered','quiz_completed','passage_read'
  word_id         UUID REFERENCES vocabulary_words(id) ON DELETE SET NULL,
  passage_id      UUID REFERENCES reading_passages(id) ON DELETE SET NULL,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_learning_activity_user ON learning_activity(user_id, created_at DESC);

-- ============================================================
-- ADMINISTRATION
-- ============================================================

-- admin_roles: available admin role definitions
CREATE TABLE admin_roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        admin_role_type NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- admin_permissions: granular permission definitions
CREATE TABLE admin_permissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        TEXT NOT NULL UNIQUE,  -- e.g. 'vocabulary.create', 'users.ban'
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- admin_role_permissions: which permissions each role has
CREATE TABLE admin_role_permissions (
  role_id       UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES admin_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- user_admin_roles: which users have admin roles
CREATE TABLE user_admin_roles (
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id     UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  granted_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

-- audit_logs: tamper-evident log of admin actions
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,       -- e.g. 'user.ban', 'word.publish'
  target_type     TEXT,                -- e.g. 'user', 'vocabulary_word'
  target_id       UUID,
  before_state    JSONB,
  after_state     JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id, created_at DESC);

-- ============================================================
-- AI OPERATIONS
-- ============================================================

-- ai_usage_events: track every AI call for cost monitoring
CREATE TABLE ai_usage_events (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  operation_type    TEXT NOT NULL,   -- 'definition','translation','quiz_gen','explanation'
  model             TEXT NOT NULL,   -- e.g. 'gemini-1.5-flash'
  prompt_tokens     INTEGER,
  completion_tokens INTEGER,
  total_tokens      INTEGER,
  latency_ms        INTEGER,
  success           BOOLEAN DEFAULT TRUE,
  error_message     TEXT,
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_ai_usage_events_date ON ai_usage_events(created_at DESC);
CREATE INDEX idx_ai_usage_events_user ON ai_usage_events(user_id, created_at DESC);

-- ai_prompt_versions: versioned prompt templates
CREATE TABLE ai_prompt_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_key      TEXT NOT NULL,   -- e.g. 'word_definition', 'quiz_question'
  version         INTEGER NOT NULL DEFAULT 1,
  prompt_template TEXT NOT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(prompt_key, version)
);

-- ============================================================
-- DEFERRED FOREIGN KEY: user_vocabulary → reading_passages
-- ============================================================
ALTER TABLE user_vocabulary
  ADD CONSTRAINT fk_user_vocab_passage
  FOREIGN KEY (source_passage_id)
  REFERENCES reading_passages(id) ON DELETE SET NULL;

-- ============================================================
-- TRIGGERS: auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_vocabulary_words_updated_at
  BEFORE UPDATE ON vocabulary_words FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_vocabulary_updated_at
  BEFORE UPDATE ON user_vocabulary FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_vocabulary_collections_updated_at
  BEFORE UPDATE ON vocabulary_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reading_passages_updated_at
  BEFORE UPDATE ON reading_passages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_study_sessions_updated_at
  BEFORE UPDATE ON study_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on auth sign-up
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all user-data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_events ENABLE ROW LEVEL SECURITY;

-- Publicly readable (published content)
ALTER TABLE vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_collocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE passage_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ---- USER_PREFERENCES ----
CREATE POLICY "Users manage own preferences"
  ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- ---- USER_LEARNING_GOALS ----
CREATE POLICY "Users manage own goals"
  ON user_learning_goals FOR ALL USING (auth.uid() = user_id);

-- ---- USER_VOCABULARY ----
CREATE POLICY "Users manage own vocabulary"
  ON user_vocabulary FOR ALL USING (auth.uid() = user_id);

-- ---- VOCABULARY_COLLECTIONS ----
CREATE POLICY "Users manage own collections"
  ON vocabulary_collections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public collections are viewable by all"
  ON vocabulary_collections FOR SELECT USING (is_public = TRUE);

-- ---- COLLECTION_WORDS ----
CREATE POLICY "Users manage words in own collections"
  ON collection_words FOR ALL
  USING (
    collection_id IN (
      SELECT id FROM vocabulary_collections WHERE user_id = auth.uid()
    )
  );

-- ---- VOCABULARY CONTENT (public reading) ----
CREATE POLICY "Published words are publicly readable"
  ON vocabulary_words FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Definitions are publicly readable"
  ON word_definitions FOR SELECT
  USING (word_id IN (SELECT id FROM vocabulary_words WHERE is_published = TRUE));

CREATE POLICY "Examples are publicly readable"
  ON word_examples FOR SELECT
  USING (word_id IN (SELECT id FROM vocabulary_words WHERE is_published = TRUE));

CREATE POLICY "Collocations are publicly readable"
  ON word_collocations FOR SELECT
  USING (word_id IN (SELECT id FROM vocabulary_words WHERE is_published = TRUE));

CREATE POLICY "Word forms are publicly readable"
  ON word_forms FOR SELECT
  USING (word_id IN (SELECT id FROM vocabulary_words WHERE is_published = TRUE));

-- ---- READING PASSAGES ----
CREATE POLICY "Published passages are publicly readable"
  ON reading_passages FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Passage vocabulary publicly readable"
  ON passage_vocabulary FOR SELECT
  USING (passage_id IN (SELECT id FROM reading_passages WHERE is_published = TRUE));

CREATE POLICY "Reading questions publicly readable"
  ON reading_questions FOR SELECT
  USING (passage_id IN (SELECT id FROM reading_passages WHERE is_published = TRUE));

-- ---- READING ATTEMPTS ----
CREATE POLICY "Users manage own reading attempts"
  ON reading_attempts FOR ALL USING (auth.uid() = user_id);

-- ---- QUIZ ----
CREATE POLICY "Active quiz questions readable by authenticated users"
  ON quiz_questions FOR SELECT
  TO authenticated USING (is_active = TRUE);

CREATE POLICY "Quiz options readable by authenticated users"
  ON quiz_options FOR SELECT
  TO authenticated
  USING (question_id IN (SELECT id FROM quiz_questions WHERE is_active = TRUE));

CREATE POLICY "Users manage own quiz attempts"
  ON quiz_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own quiz answers"
  ON quiz_answers FOR ALL
  USING (attempt_id IN (SELECT id FROM quiz_attempts WHERE user_id = auth.uid()));

-- ---- STUDY SESSIONS ----
CREATE POLICY "Users manage own study sessions"
  ON study_sessions FOR ALL USING (auth.uid() = user_id);

-- ---- REVIEW SCHEDULES ----
CREATE POLICY "Users manage own review schedules"
  ON review_schedules FOR ALL USING (auth.uid() = user_id);

-- ---- LEARNING ACTIVITY ----
CREATE POLICY "Users view own activity"
  ON learning_activity FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own activity"
  ON learning_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ---- ADMIN TABLES (service role only via server) ----
CREATE POLICY "Admin roles viewable by authenticated users"
  ON user_admin_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Audit logs: admins see all via service role; users see none via anon
CREATE POLICY "Audit logs restricted"
  ON audit_logs FOR SELECT USING (FALSE);

-- AI usage: users see own usage
CREATE POLICY "Users see own AI usage"
  ON ai_usage_events FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- SEED: Admin roles and permissions
-- ============================================================
INSERT INTO admin_roles (name, description) VALUES
  ('super_admin',      'Full platform access: users, content, settings, billing'),
  ('content_manager',  'Create, edit, publish vocabulary and reading passages'),
  ('support_agent',    'View user accounts and resolve support tickets'),
  ('analyst',          'Read-only access to analytics, reports, and AI usage');

INSERT INTO admin_permissions (code, description) VALUES
  ('users.view',             'View user list and profiles'),
  ('users.ban',              'Ban and unban user accounts'),
  ('users.delete',           'Permanently delete user accounts'),
  ('vocabulary.view',        'View vocabulary word bank'),
  ('vocabulary.create',      'Add new vocabulary words'),
  ('vocabulary.edit',        'Edit existing vocabulary words'),
  ('vocabulary.delete',      'Delete vocabulary words'),
  ('vocabulary.publish',     'Publish/unpublish vocabulary words'),
  ('readings.view',          'View reading passages'),
  ('readings.create',        'Add new reading passages'),
  ('readings.edit',          'Edit existing reading passages'),
  ('readings.delete',        'Delete reading passages'),
  ('readings.publish',       'Publish/unpublish reading passages'),
  ('quizzes.view',           'View quiz questions'),
  ('quizzes.create',         'Create quiz questions'),
  ('quizzes.edit',           'Edit quiz questions'),
  ('quizzes.delete',         'Delete quiz questions'),
  ('analytics.view',         'View analytics and reports'),
  ('ai.view',                'View AI usage and prompt versions'),
  ('ai.manage',              'Manage AI prompt templates'),
  ('audit.view',             'View audit logs'),
  ('roles.manage',           'Assign and revoke admin roles'),
  ('settings.manage',        'Manage platform settings');
