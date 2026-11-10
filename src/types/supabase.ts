/**
 * Supabase Database TypeScript types.
 * These match the schema in supabase/migrations/001_initial_schema.sql
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type MasteryStatus = 'new' | 'learning' | 'reviewing' | 'mastered'
export type QuizType = 'multiple_choice' | 'fill_blank' | 'definition_match' | 'context_usage' | 'spelling'
export type AdminRoleType = 'super_admin' | 'content_manager' | 'support_agent' | 'analyst'
export type PassageDifficulty = 'easy' | 'medium' | 'hard'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          target_level: CefrLevel
          daily_goal: number
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          target_level?: CefrLevel
          daily_goal?: number
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          target_level?: CefrLevel
          daily_goal?: number
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          email_reminders: boolean
          push_notifications: boolean
          study_reminder_time: string
          ui_theme: string
          quiz_auto_advance: boolean
          show_phonetics: boolean
          show_uzbek: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_reminders?: boolean
          push_notifications?: boolean
          study_reminder_time?: string
          ui_theme?: string
          quiz_auto_advance?: boolean
          show_phonetics?: boolean
          show_uzbek?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          email_reminders?: boolean
          push_notifications?: boolean
          study_reminder_time?: string
          ui_theme?: string
          quiz_auto_advance?: boolean
          show_phonetics?: boolean
          show_uzbek?: boolean
        }
        Relationships: []
      }
      vocabulary_words: {
        Row: {
          id: string
          lemma: string
          part_of_speech: string
          phonetic_ipa: string | null
          audio_url: string | null
          cefr_level: CefrLevel
          ielts_topic: string | null
          frequency_rank: number | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lemma: string
          part_of_speech: string
          phonetic_ipa?: string | null
          audio_url?: string | null
          cefr_level?: CefrLevel
          ielts_topic?: string | null
          frequency_rank?: number | null
          is_published?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          lemma?: string
          part_of_speech?: string
          phonetic_ipa?: string | null
          audio_url?: string | null
          cefr_level?: CefrLevel
          ielts_topic?: string | null
          frequency_rank?: number | null
          is_published?: boolean
          created_by?: string | null
        }
        Relationships: []
      }
      word_definitions: {
        Row: {
          id: string
          word_id: string
          definition_en: string
          definition_uz: string | null
          definition_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          word_id: string
          definition_en: string
          definition_uz?: string | null
          definition_order?: number
          is_primary?: boolean
        }
        Update: {
          id?: string
          word_id?: string
          definition_en?: string
          definition_uz?: string | null
          definition_order?: number
          is_primary?: boolean
        }
        Relationships: []
      }
      word_examples: {
        Row: {
          id: string
          word_id: string
          definition_id: string | null
          sentence: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          word_id: string
          definition_id?: string | null
          sentence: string
          source?: string | null
        }
        Update: {
          id?: string
          word_id?: string
          definition_id?: string | null
          sentence?: string
          source?: string | null
        }
        Relationships: []
      }
      word_collocations: {
        Row: {
          id: string
          word_id: string
          collocation: string
          example: string | null
          created_at: string
        }
        Insert: {
          id?: string
          word_id: string
          collocation: string
          example?: string | null
        }
        Update: {
          id?: string
          word_id?: string
          collocation?: string
          example?: string | null
        }
        Relationships: []
      }
      word_forms: {
        Row: {
          id: string
          word_id: string
          form_type: string
          form_value: string
          created_at: string
        }
        Insert: {
          id?: string
          word_id: string
          form_type: string
          form_value: string
        }
        Update: {
          id?: string
          word_id?: string
          form_type?: string
          form_value?: string
        }
        Relationships: []
      }
      user_vocabulary: {
        Row: {
          id: string
          user_id: string
          word_id: string
          mastery_status: MasteryStatus
          personal_note: string | null
          source_context: string | null
          source_passage_id: string | null
          times_seen: number
          times_correct: number
          times_incorrect: number
          last_reviewed_at: string | null
          next_review_at: string
          srs_interval: number
          srs_easiness: number
          srs_repetitions: number
          starred: boolean
          added_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word_id: string
          mastery_status?: MasteryStatus
          personal_note?: string | null
          source_context?: string | null
          source_passage_id?: string | null
          times_seen?: number
          times_correct?: number
          times_incorrect?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          srs_interval?: number
          srs_easiness?: number
          srs_repetitions?: number
          starred?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          word_id?: string
          mastery_status?: MasteryStatus
          personal_note?: string | null
          source_context?: string | null
          source_passage_id?: string | null
          times_seen?: number
          times_correct?: number
          times_incorrect?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          srs_interval?: number
          srs_easiness?: number
          srs_repetitions?: number
          starred?: boolean
        }
        Relationships: []
      }
      vocabulary_collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          is_public?: boolean
        }
        Relationships: []
      }
      reading_passages: {
        Row: {
          id: string
          title: string
          content_markdown: string
          source: string | null
          author: string | null
          difficulty: PassageDifficulty
          cefr_level: CefrLevel
          ielts_topic: string | null
          estimated_reading_minutes: number
          word_count: number | null
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content_markdown: string
          source?: string | null
          author?: string | null
          difficulty?: PassageDifficulty
          cefr_level?: CefrLevel
          ielts_topic?: string | null
          estimated_reading_minutes?: number
          word_count?: number | null
          is_published?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          content_markdown?: string
          source?: string | null
          author?: string | null
          difficulty?: PassageDifficulty
          cefr_level?: CefrLevel
          ielts_topic?: string | null
          estimated_reading_minutes?: number
          word_count?: number | null
          is_published?: boolean
          created_by?: string | null
        }
        Relationships: []
      }
      passage_vocabulary: {
        Row: {
          passage_id: string
          word_id: string
          highlighted: boolean
        }
        Insert: {
          passage_id: string
          word_id: string
          highlighted?: boolean
        }
        Update: {
          passage_id?: string
          word_id?: string
          highlighted?: boolean
        }
        Relationships: []
      }
      reading_questions: {
        Row: {
          id: string
          passage_id: string
          question_text: string
          question_type: string
          correct_answer: string
          explanation: string | null
          question_order: number
          created_at: string
        }
        Insert: {
          id?: string
          passage_id: string
          question_text: string
          question_type: string
          correct_answer: string
          explanation?: string | null
          question_order?: number
        }
        Update: {
          id?: string
          passage_id?: string
          question_text?: string
          question_type?: string
          correct_answer?: string
          explanation?: string | null
          question_order?: number
        }
        Relationships: []
      }
      reading_attempts: {
        Row: {
          id: string
          user_id: string
          passage_id: string
          started_at: string
          completed_at: string | null
          time_spent_secs: number | null
          words_saved: number
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          passage_id: string
          started_at?: string
          completed_at?: string | null
          time_spent_secs?: number | null
          words_saved?: number
          score?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          passage_id?: string
          started_at?: string
          completed_at?: string | null
          time_spent_secs?: number | null
          words_saved?: number
          score?: number | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          id: string
          word_id: string
          question_type: QuizType
          prompt: string
          correct_answer: string
          explanation_uz: string | null
          difficulty: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word_id: string
          question_type: QuizType
          prompt: string
          correct_answer: string
          explanation_uz?: string | null
          difficulty?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          word_id?: string
          question_type?: QuizType
          prompt?: string
          correct_answer?: string
          explanation_uz?: string | null
          difficulty?: number
          is_active?: boolean
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          id: string
          question_id: string
          option_text: string
          is_correct: boolean
          option_order: number
        }
        Insert: {
          id?: string
          question_id: string
          option_text: string
          is_correct?: boolean
          option_order?: number
        }
        Update: {
          id?: string
          question_id?: string
          option_text?: string
          is_correct?: boolean
          option_order?: number
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_type: string
          total_questions: number
          correct_count: number
          score: number
          time_spent_secs: number | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_type?: string
          total_questions: number
          correct_count?: number
          score?: number
          time_spent_secs?: number | null
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          quiz_type?: string
          total_questions?: number
          correct_count?: number
          score?: number
          time_spent_secs?: number | null
          started_at?: string
          completed_at?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          session_date: string
          words_studied: number
          words_reviewed: number
          quizzes_done: number
          minutes_spent: number
          xp_earned: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_date?: string
          words_studied?: number
          words_reviewed?: number
          quizzes_done?: number
          minutes_spent?: number
          xp_earned?: number
        }
        Update: {
          id?: string
          user_id?: string
          session_date?: string
          words_studied?: number
          words_reviewed?: number
          quizzes_done?: number
          minutes_spent?: number
          xp_earned?: number
        }
        Relationships: []
      }
      learning_activity: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          word_id: string | null
          passage_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          word_id?: string | null
          passage_id?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          word_id?: string | null
          passage_id?: string | null
          metadata?: Json
        }
        Relationships: []
      }
      user_admin_roles: {
        Row: {
          user_id: string
          role_id: string
          granted_by: string | null
          granted_at: string
        }
        Insert: {
          user_id: string
          role_id: string
          granted_by?: string | null
          granted_at?: string
        }
        Update: {
          user_id?: string
          role_id?: string
          granted_by?: string | null
          granted_at?: string
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          id: string
          name: AdminRoleType
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: AdminRoleType
          description?: string | null
        }
        Update: {
          id?: string
          name?: AdminRoleType
          description?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          target_type: string | null
          target_id: string | null
          before_state: Json | null
          after_state: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          target_type?: string | null
          target_id?: string | null
          before_state?: Json | null
          after_state?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          target_type?: string | null
          target_id?: string | null
          before_state?: Json | null
          after_state?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      ai_usage_events: {
        Row: {
          id: string
          user_id: string | null
          operation_type: string
          model: string
          prompt_tokens: number | null
          completion_tokens: number | null
          total_tokens: number | null
          latency_ms: number | null
          success: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          operation_type: string
          model: string
          prompt_tokens?: number | null
          completion_tokens?: number | null
          total_tokens?: number | null
          latency_ms?: number | null
          success?: boolean
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          operation_type?: string
          model?: string
          prompt_tokens?: number | null
          completion_tokens?: number | null
          total_tokens?: number | null
          latency_ms?: number | null
          success?: boolean
          error_message?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      cefr_level: CefrLevel
      mastery_status: MasteryStatus
      quiz_type: QuizType
      admin_role_type: AdminRoleType
      passage_difficulty: PassageDifficulty
    }
  }
}
