import { createClient } from '@/lib/supabase/server'
import type { Database, MasteryStatus } from '@/types/supabase'

type VocabularyWord = Database['public']['Tables']['vocabulary_words']['Row']
type UserVocabRow = Database['public']['Tables']['user_vocabulary']['Row']

export type UserVocabWithWord = UserVocabRow & {
  vocabulary_words: VocabularyWord & {
    word_definitions: Database['public']['Tables']['word_definitions']['Row'][]
    word_examples: Database['public']['Tables']['word_examples']['Row'][]
    word_collocations: Database['public']['Tables']['word_collocations']['Row'][]
    word_forms: Database['public']['Tables']['word_forms']['Row'][]
  }
}

/**
 * Get all vocabulary words saved by the authenticated user.
 */
export async function getUserVocabulary(): Promise<UserVocabWithWord[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_vocabulary')
    .select(`
      *,
      vocabulary_words (
        *,
        word_definitions (*),
        word_examples (*),
        word_collocations (*),
        word_forms (*)
      )
    `)
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  if (error) {
    console.error('[getUserVocabulary]', error.message)
    return []
  }

  return (data as UserVocabWithWord[]) ?? []
}

/**
 * Add a word to the user's vocabulary vault.
 */
export async function addWordToVault(
  wordId: string,
  opts?: { sourceContext?: string; sourcePassageId?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('user_vocabulary').upsert(
    {
      user_id: user.id,
      word_id: wordId,
      source_context: opts?.sourceContext ?? null,
      source_passage_id: opts?.sourcePassageId ?? null,
    },
    { onConflict: 'user_id,word_id', ignoreDuplicates: true }
  )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Update the SRS fields after a review session.
 */
export async function updateWordSRS(
  userVocabId: string,
  data: {
    mastery_status: MasteryStatus
    srs_interval: number
    srs_easiness: number
    srs_repetitions: number
    next_review_at: string
    last_reviewed_at: string
    times_seen: number
    times_correct: number
    times_incorrect: number
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_vocabulary')
    .update(data)
    .eq('id', userVocabId)
    .eq('user_id', user.id) // ensure ownership

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Delete a word from the user's vault.
 */
export async function removeWordFromVault(
  userVocabId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_vocabulary')
    .delete()
    .eq('id', userVocabId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Get words due for SRS review today.
 */
export async function getDueWords(): Promise<UserVocabWithWord[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_vocabulary')
    .select(`
      *,
      vocabulary_words (
        *,
        word_definitions (*),
        word_examples (*),
        word_collocations (*),
        word_forms (*)
      )
    `)
    .eq('user_id', user.id)
    .neq('mastery_status', 'mastered')
    .lte('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })
    .limit(50)

  if (error) {
    console.error('[getDueWords]', error.message)
    return []
  }

  return (data as UserVocabWithWord[]) ?? []
}

/**
 * Toggle the starred status of a word.
 */
export async function toggleWordStarred(
  userVocabId: string,
  starred: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_vocabulary')
    .update({ starred })
    .eq('id', userVocabId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
