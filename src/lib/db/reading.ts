import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type ReadingPassage = Database['public']['Tables']['reading_passages']['Row']

/**
 * Get all published reading passages.
 */
export async function getPublishedPassages(): Promise<ReadingPassage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reading_passages')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getPublishedPassages]', error.message)
    return []
  }

  return data ?? []
}

/**
 * Get a single published passage by ID, with associated vocabulary.
 */
export async function getPassageById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reading_passages')
    .select(`
      *,
      reading_questions (*),
      passage_vocabulary (
        word_id,
        highlighted,
        vocabulary_words (
          id, lemma, part_of_speech, phonetic_ipa, cefr_level,
          word_definitions (definition_en, definition_uz, is_primary)
        )
      )
    `)
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('[getPassageById]', error.message)
    return null
  }

  return data
}

/**
 * Record or update a reading attempt for the current user.
 */
export async function upsertReadingAttempt(
  passageId: string,
  data: { words_saved?: number; score?: number; time_spent_secs?: number; completed_at?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('reading_attempts').insert({
    user_id: user.id,
    passage_id: passageId,
    ...data,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Get recent reading attempts for the current user.
 */
export async function getUserReadingHistory(limit = 10) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('reading_attempts')
    .select('*, reading_passages(id, title, cefr_level, difficulty, estimated_reading_minutes)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}
