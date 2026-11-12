import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Production Security Middleware:
 * - Refreshes genuine Supabase Auth tokens via secure HttpOnly cookies.
 * - Protects administrative endpoints (/admin/*) using server-side role verification.
 * - Protects learner-only interactive routes from unauthenticated access.
 * - Insecure client-crafted cookies are strictly rejected.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lexipath-placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Retrieve authenticated user from Supabase auth server
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch {
    user = null
  }

  const { pathname } = request.nextUrl

  // Clean up any legacy untrusted cookie
  if (request.cookies.has('lexipath_session')) {
    supabaseResponse.cookies.delete('lexipath_session')
  }

  // ─── ADMIN PROTECTION ─────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Dedicated secret admin login gateway
    if (pathname === '/admin/login') {
      if (user) {
        // Check if user is already an admin
        const { data: roleRecords } = await supabase
          .from('user_admin_roles')
          .select('role_id, admin_roles(name)')
          .eq('user_id', user.id)

        const isAdmin = roleRecords && roleRecords.length > 0
        if (isAdmin) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        }
      }
      return supabaseResponse
    }

    // All other /admin routes require genuine authentication
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Verify admin role strictly from the database
    const { data: roleRecords } = await supabase
      .from('user_admin_roles')
      .select('role_id, admin_roles(name)')
      .eq('user_id', user.id)

    const isAuthorizedAdmin = roleRecords && roleRecords.length > 0
    if (!isAuthorizedAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  // ─── AUTHENTICATED LEARNER ROUTE GUARDS ──────────────────────────────────
  const protectedLearnerRoutes = [
    '/review',
    '/settings',
  ]

  const isProtectedRoute = protectedLearnerRoutes.some(route => pathname.startsWith(route))
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // ─── AUTH PAGE REDIRECT IF ALREADY LOGGED IN ──────────────────────────────
  const authRoutes = ['/login', '/register', '/forgot-password']
  if (authRoutes.includes(pathname) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
