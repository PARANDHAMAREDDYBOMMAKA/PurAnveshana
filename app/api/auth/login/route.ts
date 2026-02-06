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

    // Validate input FIRST before any external calls
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const clientIp = getClientIp(request.headers)

    // Run turnstile verification and DB lookup in parallel
    // Rate limiting already protects against brute force, so the DB read is safe
    const [turnstileResult, user] = await Promise.all([
      turnstileToken
        ? verifyTurnstileToken(turnstileToken, clientIp)
        : Promise.resolve({ success: true } as { success: boolean; error?: string }),
      withRetry(() =>
        prisma.profile.findUnique({
          where: { email },
          select: { id: true, email: true, password: true, role: true },
        })
      ),
    ])

    // Check turnstile result after parallel execution
    if (turnstileToken && !turnstileResult.success) {
      if (process.env.NODE_ENV === 'production') {
        await logSecurityEvent('turnstile_failed', clientIp, {
          endpoint: '/api/auth/login',
          error: turnstileResult.error,
        })
        return NextResponse.json(
          { error: turnstileResult.error || 'Verification failed' },
          { status: 403 }
        )
      }
      console.warn('[Dev] Turnstile verification failed, but allowing login in development mode')
    }

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
