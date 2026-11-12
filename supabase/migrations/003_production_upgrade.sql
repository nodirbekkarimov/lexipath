-- ============================================================
-- LexiPath — Production Upgrade & Schema Enhancements
-- Migration: 003_production_upgrade.sql
-- ============================================================

-- 1. Ensure verification_status_type enum exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status_type') THEN
    CREATE TYPE verification_status_type AS ENUM ('verified', 'ai_generated', 'pending_review', 'rejected');
  END IF;
END $$;

-- 2. Add verification_status and optimized cached metadata columns to vocabulary_words
ALTER TABLE public.vocabulary_words
  ADD COLUMN IF NOT EXISTS verification_status verification_status_type DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS definition_en TEXT,
  ADD COLUMN IF NOT EXISTS translation_uz TEXT,
  ADD COLUMN IF NOT EXISTS context_sentence TEXT,
  ADD COLUMN IF NOT EXISTS uzbek_context_notes TEXT,
  ADD COLUMN IF NOT EXISTS collocations TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS synonyms TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS antonyms TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ielts_band NUMERIC(2,1) DEFAULT 6.5;

-- 3. Set default timezone for profiles to Asia/Tashkent
ALTER TABLE public.profiles
  ALTER COLUMN timezone SET DEFAULT 'Asia/Tashkent';

-- 4. Ensure RLS policies for admin role verification
-- Authenticated users can view their own assigned admin roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_admin_roles' AND policyname = 'Users can view own admin roles'
  ) THEN
    CREATE POLICY "Users can view own admin roles"
      ON public.user_admin_roles FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Seed initial super_admin role to nodir.karimov@lexipath.uz if profile exists
DO $$
DECLARE
  v_user_id UUID;
  v_role_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM public.profiles WHERE email = 'nodir.karimov@lexipath.uz' LIMIT 1;
  SELECT id INTO v_role_id FROM public.admin_roles WHERE name = 'super_admin' LIMIT 1;

  IF v_user_id IS NOT NULL AND v_role_id IS NOT NULL THEN
    INSERT INTO public.user_admin_roles (user_id, role_id)
    VALUES (v_user_id, v_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
END $$;

-- 6. Indexes for performant filtering on vocabulary and review queue
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_verification ON public.vocabulary_words(verification_status);
CREATE INDEX IF NOT EXISTS idx_vocabulary_words_band ON public.vocabulary_words(ielts_band);
CREATE INDEX IF NOT EXISTS idx_user_vocab_due ON public.user_vocabulary(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user ON public.quiz_answers(user_answer, is_correct);
