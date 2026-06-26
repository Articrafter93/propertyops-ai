import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getRole, isPathAllowed } from '@/lib/roles'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage = pathname.startsWith('/login')
  const isAuthRoute = pathname.startsWith('/auth')
  const isPublicPage = pathname.startsWith('/privacidad')

  // Redirect unauthenticated users to login
  if (!user && !isLoginPage && !isAuthRoute && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    const role = getRole(user.email)
    url.pathname = role === 'tecnico' ? '/incidencias' : '/dashboard'
    return NextResponse.redirect(url)
  }

  // Role-based access: tecnico can only access /incidencias
  if (user && !isPublicPage && !isLoginPage && !isAuthRoute) {
    const role = getRole(user.email)
    if (!isPathAllowed(role, pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/incidencias'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
