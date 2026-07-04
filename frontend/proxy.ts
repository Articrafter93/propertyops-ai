import { NextResponse, type NextRequest } from 'next/server'
import { getRole, isPathAllowed } from '@/lib/roles'

const COOKIE_NAME = 'propertyops_demo_session'

export function proxy(request: NextRequest) {
  const email = request.cookies.get(COOKIE_NAME)?.value ?? null

  const { pathname } = request.nextUrl
  const isLoginPage = pathname.startsWith('/login')
  const isAuthRoute = pathname.startsWith('/auth')
  const isPublicPage = pathname.startsWith('/privacy')

  if (!email && !isLoginPage && !isAuthRoute && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (email && isLoginPage) {
    const url = request.nextUrl.clone()
    const role = getRole(email)
    url.pathname = role === 'tecnico' ? '/incidents' : '/dashboard'
    return NextResponse.redirect(url)
  }

  if (email && !isPublicPage && !isLoginPage && !isAuthRoute) {
    const role = getRole(email)
    if (!isPathAllowed(role, pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/incidents'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
