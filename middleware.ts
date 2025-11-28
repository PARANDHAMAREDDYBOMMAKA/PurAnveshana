import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/auth/session'
import {
  getClientIp,
  verifyCloudflareBot,
  getRayId,
  logSecurityEvent,
} from '@/lib/cloudflare/security'
import { rateLimit, RATE_LIMITS } from '@/lib/cloudflare/rate-limit'

export async function middleware(request: NextRequest) {
  const clientIp = getClientIp(request.headers)
  const pathname = request.nextUrl.pathname
  const rayId = getRayId(request.headers)

  // Apply security headers
  const response = NextResponse.next()
  applySecurityHeaders(response)

  // Block requests from specific countries (optional)
  // Uncomment and add country codes to block: ['XX', 'YY']
  // if (isBlockedCountry(request.headers, [])) {
  //   return new NextResponse('Access denied', { status: 403 })
  // }

  // Bot protection for sensitive routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/upload') ||
    pathname.startsWith('/signup')
  ) {
    // Skip bot check in development
    if (process.env.NODE_ENV === 'production') {
      const isLegitimate = verifyCloudflareBot(request.headers)
      if (!isLegitimate) {
        await logSecurityEvent('bot_detected', clientIp, {
          path: pathname,
          rayId,
        })
        return new NextResponse('Bot detected', { status: 403 })
      }
    }
  }

  // Rate limiting
  let rateLimitConfig = RATE_LIMITS.GENERAL
  if (pathname.startsWith('/api/auth')) {
    rateLimitConfig = RATE_LIMITS.AUTH
  } else if (pathname.startsWith('/api/upload')) {
    rateLimitConfig = RATE_LIMITS.UPLOAD
  } else if (pathname.startsWith('/api')) {
    rateLimitConfig = RATE_LIMITS.API
  }

  const rateLimitResult = rateLimit(
    `${clientIp}:${pathname}`,
    rateLimitConfig
  )

  if (!rateLimitResult.allowed) {
    await logSecurityEvent('rate_limit_exceeded', clientIp, {
      path: pathname,
      limit: rateLimitResult.limit,
      rayId,
    })

    const rateLimitResponse = new NextResponse('Too many requests', {
      status: 429,
    })
    rateLimitResponse.headers.set(
      'X-RateLimit-Limit',
      rateLimitResult.limit.toString()
    )
    rateLimitResponse.headers.set('X-RateLimit-Remaining', '0')
    rateLimitResponse.headers.set(
      'X-RateLimit-Reset',
      rateLimitResult.resetAt.toString()
    )
    rateLimitResponse.headers.set(
      'Retry-After',
      Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString()
    )
    return rateLimitResponse
  }

  // Add rate limit headers
  response.headers.set(
    'X-RateLimit-Limit',
    rateLimitResult.limit.toString()
  )
  response.headers.set(
    'X-RateLimit-Remaining',
    rateLimitResult.remaining.toString()
  )
  response.headers.set(
    'X-RateLimit-Reset',
    rateLimitResult.resetAt.toString()
  )

  // Check for session token
  const sessionToken = request.cookies.get('session')?.value

  // Protected routes
  if (
    !sessionToken &&
    (pathname.startsWith('/dashboard') || pathname.startsWith('/upload'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if already logged in
  if (
    sessionToken &&
    (pathname === '/login' || pathname === '/signup' || pathname === '/')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Update session (refresh token if needed)
  const sessionResponse = await updateSession(request)
  if (sessionResponse) {
    // Copy security headers to session response
    response.headers.forEach((value, key) => {
      sessionResponse.headers.set(key, value)
    })
    return sessionResponse
  }

  return response
}

function applySecurityHeaders(response: NextResponse) {
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://unpkg.com https://www.gstatic.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "media-src 'self' https://res.cloudinary.com https://*.r2.dev https://*.r2.cloudflarestorage.com",
    "connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://*.r2.dev https://*.r2.cloudflarestorage.com https://translate.googleapis.com https://translate-pa.googleapis.com",
    "frame-src 'self' https://challenges.cloudflare.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )

  // Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  )

  // X-DNS-Prefetch-Control
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // X-XSS-Protection (legacy, but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block')
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
