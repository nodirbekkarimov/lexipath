'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/db/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// ─── Validation schemas ────────────────────────────────────────────────────

const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  email: z.string().email('Noto\'g\'ri email manzili'),
  password: z.string().min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak'),
})

const LoginSchema = z.object({
  email: z.string().email('Noto\'g\'ri email manzili'),
  password: z.string().min(1, 'Parol kiritilishi shart'),
})

const AdminLoginSchema = z.object({
  email: z.string().email('Noto\'g\'ri admin email manzili'),
  password: z.string().min(1, 'Admin paroli kiritilishi shart'),
  setupSecret: z.string().optional(),
})

const ForgotPasswordSchema = z.object({
  email: z.string().email('Noto\'g\'ri email manzili'),
})

const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak'),
})

// ─── Types ────────────────────────────────────────────────────────────────

export type ActionResult = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
  needsEmailConfirmation?: boolean
}

// ─── Register ─────────────────────────────────────────────────────────────

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    fullName: (formData.get('fullName') as string)?.trim(),
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    password: formData.get('password') as string,
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { fullName, email, password } = parsed.data

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: null,
        },
      },
    })

    if (error) {
      // Map common Supabase error messages to clear Uzbek text
      let errorMsg = error.message
      if (error.message.includes('User already registered')) {
        errorMsg = 'Bu email bilan allaqachon ro\'yxatdan o\'tilgan. Iltimos, tizimga kiring.'
      } else if (error.message.includes('Password should be')) {
        errorMsg = 'Parol kamida 8 ta belgidan iborat bo\'lishi lozim.'
      }
      return { success: false, error: errorMsg }
    }

    // If email confirmation is required and session is null
    if (data?.user && !data.session) {
      return {
        success: true,
        needsEmailConfirmation: true,
      }
    }
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err
    return {
      success: false,
      error: 'Tizimga ulanishda xatolik yuz berdi. Iltimos, internetingizni tekshirib qayta urinib ko\'ring.',
    }
  }

  redirect('/dashboard')
}

// ─── Login ────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    password: formData.get('password') as string,
  }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password } = parsed.data
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard'

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: 'Email yoki parol noto\'g\'ri. Iltimos, ma\'lumotlarni tekshirib qayta urinib ko\'ring.',
      }
    }
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err
    return {
      success: false,
      error: 'Xizmat serveriga ulanishda xatolik yuz berdi.',
    }
  }

  redirect(redirectTo)
}

// ─── Genuine Admin Gateway Login ──────────────────────────────────────────

export async function adminLoginAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    password: (formData.get('password') as string) || (formData.get('secretKey') as string),
    setupSecret: (formData.get('setupSecret') as string)?.trim(),
  }

  const parsed = AdminLoginSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password, setupSecret } = parsed.data

  try {
    const supabase = await createClient()

    // ─── 1. Emergency or initial Admin Setup Bootstrap ───────────────────────
    const configuredSecret = process.env.ADMIN_SETUP_SECRET || process.env.ADMIN_SECRET_KEY
    const isSetupAttempt = Boolean(setupSecret && configuredSecret && setupSecret === configuredSecret)

    if (isSetupAttempt) {
      try {
        const adminClient = await createAdminClient()
        // Check if user exists in auth
        const { data: userList } = await adminClient.auth.admin.listUsers()
        let targetUser = userList?.users?.find((u) => u.email?.toLowerCase() === email)

        if (!targetUser) {
          const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'Platform Super Admin' },
          })
          if (createErr || !newUser?.user) {
            return { success: false, error: `Admin yaratishda xatolik: ${createErr?.message}` }
          }
          targetUser = newUser.user
        } else {
          // Update password and ensure email is confirmed
          await adminClient.auth.admin.updateUserById(targetUser.id, {
            password,
            email_confirm: true,
          })
        }

        // Ensure super_admin role exists in admin_roles table
        let { data: superAdminRole } = await adminClient
          .from('admin_roles')
          .select('id')
          .eq('name', 'super_admin')
          .single()

        if (!superAdminRole) {
          const { data: createdRole } = await (adminClient.from('admin_roles') as any)
            .insert({ name: 'super_admin', description: 'Platform Super Administrator' })
            .select('id')
            .single()
          superAdminRole = createdRole
        }

        if (superAdminRole && targetUser) {
          await (adminClient.from('user_admin_roles') as any).upsert({
            user_id: targetUser.id,
            role_id: superAdminRole.id,
          })
        }

        // Log the bootstrap action
        await writeAuditLog({
          actorId: targetUser.id,
          action: 'admin_bootstrap_elevated',
          targetType: 'user_admin_roles',
          targetId: targetUser.id,
        }).catch(() => {})

        // Now sign in standard client
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInErr) {
          return { success: false, error: `Avtorizatsiyada xatolik: ${signInErr.message}` }
        }

        redirect('/admin')
      } catch (bootErr: any) {
        if (bootErr?.message === 'NEXT_REDIRECT') throw bootErr
        return { success: false, error: `Admin bootstrap xatosi: ${bootErr?.message}` }
      }
    }

    // ─── 2. Standard Admin Login with Database Role Verification ─────────────
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData?.user) {
      return {
        success: false,
        error: 'Admin hisob ma\'lumotlari noto\'g\'ri. Ruxsat rad etildi.',
      }
    }

    const userId = authData.user.id

    // Check if user has admin role in database
    const { authorized, roles } = await requireAdminRole(userId)

    if (!authorized || roles.length === 0) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Xavfsizlik ogohlantirishi: Ushbu hisobga administratorlik huquqlari biriktirilmagan.',
      }
    }
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err
    return {
      success: false,
      error: 'Admin autentifikatsiyasida xatolik yuz berdi.',
    }
  }

  redirect('/admin')
}

// ─── Logout ───────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {}

  const cookieStore = await cookies()
  // Clean up any legacy or stale session cookies
  cookieStore.delete('lexipath_session')

  redirect('/login')
}

// ─── Forgot password ──────────────────────────────────────────────────────

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  const raw = { email: (formData.get('email') as string)?.trim().toLowerCase() }

  const parsed = ForgotPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lexipath-ozwy.onrender.com'
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${appUrl}/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }
  } catch (err: any) {
    return { success: false, error: 'Parolni tiklash so\'rovida xatolik yuz berdi.' }
  }

  return { success: true }
}

// ─── Reset password ───────────────────────────────────────────────────────

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const raw = { password: formData.get('password') as string }

  const parsed = ResetPasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

    if (error) {
      return { success: false, error: error.message }
    }
  } catch (err: any) {
    return { success: false, error: 'Parolni yangilashda xatolik yuz berdi.' }
  }

  redirect('/dashboard')
}

// ─── Get current session user (strictly genuine Supabase session) ──────────

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!error && user) return user
  } catch {}

  return null
}

// ─── Get current user profile from Supabase database ─────────────────────

export async function getCurrentProfile() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) return profile
    }
  } catch {}

  return null
}
