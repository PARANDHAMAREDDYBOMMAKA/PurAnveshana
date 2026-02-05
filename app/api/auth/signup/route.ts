import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { withRetry } from '@/lib/db-utils'
import { verifyTurnstileToken } from '@/lib/cloudflare/turnstile'
import { getClientIp, logSecurityEvent } from '@/lib/cloudflare/security'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, mobileNumber, turnstileToken } = body

    const clientIp = getClientIp(request.headers)
    if (turnstileToken) {
      const verification = await verifyTurnstileToken(turnstileToken, clientIp)
      if (!verification.success) {
        if (process.env.NODE_ENV === 'production') {
          await logSecurityEvent('turnstile_failed', clientIp, {
            endpoint: '/api/auth/signup',
            error: verification.error,
          })
          return NextResponse.json(
            { error: verification.error || 'Verification failed' },
            { status: 403 }
          )
        }
        console.warn('[Dev] Turnstile verification failed, but allowing signup in development mode')
      }
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase()
    const allowedDomains = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com',
      'icloud.com', 'protonmail.com', 'live.com', 'msn.com',
      'aol.com', 'zoho.com', 'yandex.com'
    ]

    const emailParts = emailLower.split('@')
    if (emailParts.length !== 2) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const [emailPrefix, emailDomain] = emailParts

    if (!allowedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a valid email provider (Gmail, Outlook, Yahoo, etc.)' },
        { status: 400 }
      )
    }

    const testPatterns = ['test', 'fake', 'demo', 'example', 'temp', 'throwaway', 'disposable', 'spam']
    if (testPatterns.some(pattern => emailPrefix.includes(pattern))) {
      return NextResponse.json(
        { error: 'Test or temporary emails are not allowed' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (mobileNumber) {
      const mobileRegex = /^\+91\d{10}$/
      if (!mobileRegex.test(mobileNumber)) {
        return NextResponse.json(
          { error: 'Mobile number must be in format +91 followed by 10 digits' },
          { status: 400 }
        )
      }
    }

    const existingUser = await withRetry(() =>
      prisma.profile.findUnique({
        where: { email },
      })
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await withRetry(() =>
      prisma.profile.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: email === process.env.ADMIN_EMAIL || email === 'rparandhama63@gmail.com' ? 'admin' : 'user',
          mobileNumber: mobileNumber || null,
        },
      })
    )

    return NextResponse.json({
      success: true,
      message: 'Signup successful',
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup', details: error.message },
      { status: 500 }
    )
  }
}
