import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase auth session on every request.
 * Supports graceful fallback to local session if Supabase project is paused or offline.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const localSession = request.cookies.get('lexipath_session')?.value
  let user: any = null

  // Fast check: Only attempt Supabase fetch if URL is configured and not placeholder
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  ) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

      // 300ms max timeout race so unresolvable / paused Supabase domains NEVER freeze navigation
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), 300)
      )
      const { data } = await Promise.race([userPromise, timeoutPromise])
      user = data?.user || null
    } catch {
      // Supabase offline / paused — fallback to local session gracefully
    }
  }

  const { pathname } = request.nextUrl
  const isAuthenticated = !!user || !!localSession

  const isAuthPath = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ].includes(pathname)

  // Protect admin operations strictly
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }

    // Verify admin role if session exists
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession)
        if (parsed.role !== 'super_admin' && parsed.role !== 'admin') {
          const url = request.nextUrl.clone()
          url.pathname = '/login'
          url.searchParams.set('error', 'admin_access_required')
          return NextResponse.redirect(url)
        }
      } catch {}
    }
  }

  return supabaseResponse
}
