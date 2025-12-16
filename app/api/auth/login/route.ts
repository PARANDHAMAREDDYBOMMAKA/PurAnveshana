import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'
import { verifyTurnstileToken } from '@/lib/cloudflare/turnstile'
import { getClientIp, logSecurityEvent } from '@/lib/cloudflare/security'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, turnstileToken } = body

    // Verify Turnstile token - only enforce in production
    const clientIp = getClientIp(request.headers)
    if (turnstileToken) {
      const verification = await verifyTurnstileToken(turnstileToken, clientIp)
      if (!verification.success) {
        // In production, block the request
        if (process.env.NODE_ENV === 'production') {
          await logSecurityEvent('turnstile_failed', clientIp, {
            endpoint: '/api/auth/login',
            error: verification.error,
          })
          return NextResponse.json(
            { error: verification.error || 'Verification failed' },
            { status: 403 }
          )
        }
        // In development, just log and continue
        console.warn('[Dev] Turnstile verification failed, but allowing login in development mode')
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await withRetry(() =>
      prisma.profile.findUnique({
        where: { email },
      })
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    await createSession(user.id, user.email, user.role)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login', details: error.message },
      { status: 500 }
    )
  }
}
