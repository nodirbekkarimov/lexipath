import { createClient } from '@/lib/supabase/server'

/**
 * Get or create today's study session for the current user.
 */
export async function getTodayStudySession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .single()

  if (existing) return existing

  // Create today's session
  const { data: created } = await (supabase
    .from('study_sessions') as any)
    .insert({ user_id: user.id, session_date: today })
    .select()
    .single()

  return created
}

/**
 * Increment study session counters for today.
 */
export async function incrementStudySession(
  updates: Partial<{
    words_studied: number
    words_reviewed: number
    quizzes_done: number
    minutes_spent: number
    xp_earned: number
  }>
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const today = new Date().toISOString().split('T')[0]

  // Upsert session, then use raw SQL increment via RPC if needed
  // For now, read-then-write (safe since sessions are user-owned)
  const { data: session } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .single()

  if (!session) {
    await (supabase.from('study_sessions') as any).insert({
      user_id: user.id,
      session_date: today,
      ...updates,
    })
    return
  }

  await supabase
    .from('study_sessions')
    .update({
      words_studied: (session.words_studied ?? 0) + (updates.words_studied ?? 0),
      words_reviewed: (session.words_reviewed ?? 0) + (updates.words_reviewed ?? 0),
      quizzes_done: (session.quizzes_done ?? 0) + (updates.quizzes_done ?? 0),
      minutes_spent: (session.minutes_spent ?? 0) + (updates.minutes_spent ?? 0),
      xp_earned: (session.xp_earned ?? 0) + (updates.xp_earned ?? 0),
    })
    .eq('id', session.id)
    .eq('user_id', user.id)
}

/**
 * Get weekly study sessions (last 7 days) for activity chart.
 */
export async function getWeeklyStudySessions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  const from = sevenDaysAgo.toISOString().split('T')[0]

  const { data } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('session_date', from)
    .order('session_date', { ascending: true })

  return data ?? []
}

/**
 * Get comprehensive dashboard stats for the current user.
 */
export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [vocabStats, todaySession, weeklyActivity, recentActivity] = await Promise.all([
    // Vocabulary breakdown by mastery
    supabase
      .from('user_vocabulary')
      .select('mastery_status')
      .eq('user_id', user.id),

    // Today's session
    getTodayStudySession(),

    // Weekly sessions
    getWeeklyStudySessions(),

    // Recent learning activity (last 10 events)
    supabase
      .from('learning_activity')
      .select('*, vocabulary_words(lemma), reading_passages(title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const vocab = vocabStats.data ?? []
  const masteryBreakdown = {
    new: vocab.filter(v => v.mastery_status === 'new').length,
    learning: vocab.filter(v => v.mastery_status === 'learning').length,
    reviewing: vocab.filter(v => v.mastery_status === 'reviewing').length,
    mastered: vocab.filter(v => v.mastery_status === 'mastered').length,
    total: vocab.length,
  }

  return {
    masteryBreakdown,
    todaySession,
    weeklyActivity,
    recentActivity: recentActivity.data ?? [],
  }
}
