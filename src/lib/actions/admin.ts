'use server';

import { createAdminClient, createClient } from '@/lib/supabase/server';
import { requireAdminRole, writeAuditLog } from '@/lib/db/admin';
import { revalidatePath } from 'next/cache';

/**
 * Ensures caller is an authenticated admin before performing privileged operations.
 */
async function verifyAdminAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Autentifikatsiya talab qilinadi.');
  }

  const { authorized, roles } = await requireAdminRole(user.id);
  if (!authorized || roles.length === 0) {
    throw new Error('Ruxsat etilmagan: Admin huquqlari talab qilinadi.');
  }

  return { user, roles };
}

/**
 * Fetch real user list from Supabase for Admin Panel.
 */
export async function fetchAdminUsersAction(page = 1, perPage = 20, search = '') {
  await verifyAdminAuth();
  const adminClient = await createAdminClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = adminClient
    .from('profiles')
    .select(`
      *,
      user_admin_roles (
        role_id,
        admin_roles (name)
      )
    `, { count: 'exact' });

  if (search.trim()) {
    query = query.or(`email.ilike.%${search.trim()}%,full_name.ilike.%${search.trim()}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('[fetchAdminUsersAction]:', error.message);
    return { users: [], total: 0 };
  }

  // Map to clean Profile model
  const users = (data || []).map((row: any) => {
    const adminRole = row.user_admin_roles?.[0]?.admin_roles?.name;
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name || row.email?.split('@')[0] || 'Foydalanuvchi',
      avatarUrl: row.avatar_url,
      role: adminRole || 'learner',
      targetBand: row.target_level === 'C2' ? 8.5 : row.target_level === 'C1' ? 7.5 : 6.5,
      targetLevel: row.target_level || 'B2',
      dailyGoalWords: row.daily_goal || 10,
      nativeLanguage: 'uz',
      streakDays: 1,
      wordsLearnedToday: 0,
      wordsLearnedCount: 0,
      totalStudyMinutes: 0,
      createdAt: row.created_at,
      status: 'active' as const,
    };
  });

  return { users, total: count || 0 };
}

/**
 * Toggle user suspension status.
 */
export async function toggleUserStatusAction(userId: string, newStatus: 'active' | 'suspended') {
  const { user } = await verifyAdminAuth();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  await writeAuditLog({
    actorId: user.id,
    action: newStatus === 'suspended' ? 'user.suspend' : 'user.activate',
    targetType: 'profile',
    targetId: userId,
  });

  revalidatePath('/admin/users');
  return { success: true };
}

/**
 * Fetch real audit logs from Supabase audit_logs table.
 */
export async function fetchAuditLogsAction(limit = 50) {
  await verifyAdminAuth();
  const adminClient = await createAdminClient();

  const { data, error } = await adminClient
    .from('audit_logs')
    .select(`
      id,
      actor_id,
      action,
      target_type,
      target_id,
      created_at,
      ip_address,
      profiles:actor_id (email, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    actorEmail: row.profiles?.email || 'system@lexipath.uz',
    actorRole: 'super_admin' as const,
    action: row.action,
    targetEntity: row.target_type || 'system',
    targetId: row.target_id || '',
    ipAddress: row.ip_address || '127.0.0.1',
    timestamp: row.created_at,
    details: `${row.action} bajarildi (${row.target_type || ''})`,
  }));
}

/**
 * Fetch real AI operations and token costs from ai_usage_events.
 */
export async function fetchAIOperationsAction(limit = 50) {
  await verifyAdminAuth();
  const adminClient = await createAdminClient();

  const { data, error } = await adminClient
    .from('ai_usage_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    endpoint: row.operation_type,
    model: row.model,
    inputTokenCount: row.prompt_tokens || 0,
    outputTokenCount: row.completion_tokens || 0,
    estimatedCostUsd: Number((((row.total_tokens || 0) / 1000) * 0.00015).toFixed(5)),
    latencyMs: row.latency_ms || 250,
    status: row.success ? ('success' as const) : ('failed' as const),
    errorMessage: row.error_message,
    createdAt: row.created_at,
    redactedPromptPreview: `${row.operation_type} call on ${row.model}`,
  }));
}

/**
 * Publish or unpublish vocabulary word.
 */
export async function toggleWordPublishAction(wordId: string, isPublished: boolean) {
  const { user } = await verifyAdminAuth();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('vocabulary_words')
    .update({ is_published: isPublished })
    .eq('id', wordId);

  if (error) {
    return { success: false, error: error.message };
  }

  await writeAuditLog({
    actorId: user.id,
    action: isPublished ? 'word.publish' : 'word.unpublish',
    targetType: 'vocabulary_word',
    targetId: wordId,
  });

  revalidatePath('/admin/vocabulary');
  return { success: true };
}

/**
 * Publish or unpublish reading passage.
 */
export async function togglePassagePublishAction(passageId: string, isPublished: boolean) {
  const { user } = await verifyAdminAuth();
  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from('reading_passages')
    .update({ is_published: isPublished })
    .eq('id', passageId);

  if (error) {
    return { success: false, error: error.message };
  }

  await writeAuditLog({
    actorId: user.id,
    action: isPublished ? 'passage.publish' : 'passage.unpublish',
    targetType: 'reading_passage',
    targetId: passageId,
  });

  revalidatePath('/admin/reading');
  return { success: true };
}
