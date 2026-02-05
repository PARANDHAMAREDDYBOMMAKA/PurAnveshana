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

  // Bot protection for sensitive routes - only in production and only if Cloudflare headers present
  if (
    process.env.NODE_ENV === 'production' &&
    (pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/upload') ||
      pathname.startsWith('/signup'))
  ) {
    const hasCfHeaders = request.headers.has('CF-Ray')
    if (hasCfHeaders) {
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

  if (process.env.NODE_ENV === 'production') {
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
  }

  const sessionToken = request.cookies.get('session')?.value

  if (
    !sessionToken &&
    (pathname.startsWith('/dashboard') || pathname.startsWith('/upload'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (
    sessionToken &&
    (pathname === '/login' || pathname === '/signup' || pathname === '/')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/yatra'
    return NextResponse.redirect(url)
  }

  const sessionResponse = await updateSession(request)
  if (sessionResponse) {
    response.headers.forEach((value, key) => {
      sessionResponse.headers.set(key, value)
    })
    return sessionResponse
  }

  return response
}

function applySecurityHeaders(response: NextResponse) {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://*.posthog.com https://us-assets.i.posthog.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.usemessages.com https://forms.hsforms.com https://js-na2.hscollectedforms.net",
    "style-src 'self' 'unsafe-inline' https://unpkg.com https://www.gstatic.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "media-src 'self' blob: https://res.cloudinary.com https://*.r2.dev https://*.r2.cloudflarestorage.com",
    "connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://*.r2.dev https://*.r2.cloudflarestorage.com https://translate.googleapis.com https://translate-pa.googleapis.com https://nominatim.openstreetmap.org https://res.cloudinary.com https://api.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://*.posthog.com https://*.hubspot.com https://*.hubspotusercontent.com https://*.hsforms.com https://*.hscollectedforms.net https://*.hs-analytics.net",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "frame-src 'self' https://challenges.cloudflare.com https://maps.google.com https://www.google.com/maps https://www.googletagmanager.com https://googleads.g.doubleclick.net",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )

  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  response.headers.set('X-Content-Type-Options', 'nosniff')

  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  response.headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(), geolocation=(self)'
  )

  response.headers.set('X-DNS-Prefetch-Control', 'on')

  response.headers.set('X-XSS-Protection', '1; mode=block')
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
