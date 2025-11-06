import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/auth/session'

export async function middleware(request: NextRequest) {
  // Check for session token
  const sessionToken = request.cookies.get('session')?.value

  // Protected routes
  if (!sessionToken && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/upload')
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if already logged in
  if (sessionToken && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/'
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Update session (refresh token if needed)
  const response = await updateSession(request)
  return response || NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
