import { createAdminClient } from '@/lib/supabase/server'
import type { AdminRoleType, Json } from '@/types/supabase'

/**
 * Check whether the currently authenticated user has the given admin role.
 * Uses the service role client — always server-side only.
 */
export async function requireAdminRole(
  userId: string,
  requiredRole?: AdminRoleType
): Promise<{ authorized: boolean; roles: AdminRoleType[] }> {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('user_admin_roles')
    .select('admin_roles(name)')
    .eq('user_id', userId)

  if (error || !data || data.length === 0) {
    return { authorized: false, roles: [] }
  }

  const roles = data
    .map((r: { admin_roles: { name: string } | null }) => r.admin_roles?.name as AdminRoleType)
    .filter(Boolean)

  if (!requiredRole) {
    return { authorized: roles.length > 0, roles }
  }

  // super_admin always has access
  if (roles.includes('super_admin')) {
    return { authorized: true, roles }
  }

  return {
    authorized: roles.includes(requiredRole),
    roles,
  }
}

/**
 * Write an entry to the audit log.
 */
export async function writeAuditLog(data: {
  actorId: string
  action: string
  targetType?: string
  targetId?: string
  beforeState?: Json
  afterState?: Json
  ipAddress?: string
  userAgent?: string
}): Promise<void> {
  const supabase = await createAdminClient()

  await (supabase.from('audit_logs') as any).insert({
    actor_id: data.actorId,
    action: data.action,
    target_type: data.targetType ?? null,
    target_id: data.targetId ?? null,
    before_state: data.beforeState ?? null,
    after_state: data.afterState ?? null,
    ip_address: data.ipAddress ?? null,
    user_agent: data.userAgent ?? null,
  })
}

/**
 * Get paginated user list for the admin panel.
 */
export async function getAdminUserList(page = 1, perPage = 20) {
  const supabase = await createAdminClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[getAdminUserList]', error.message)
    return { users: [], total: 0 }
  }

  return { users: data ?? [], total: count ?? 0 }
}

/**
 * Get AI usage summary for the admin analytics panel.
 */
export async function getAIUsageSummary(days = 30) {
  const supabase = await createAdminClient()

  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('ai_usage_events')
    .select('operation_type, model, total_tokens, success, created_at')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

/**
 * Get recent audit logs for the admin audit-logs panel.
 */
export async function getRecentAuditLogs(limit = 50) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}
