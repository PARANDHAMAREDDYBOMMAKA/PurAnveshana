import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { withRetry } from '@/lib/db-utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, mobileNumber } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email domain and prevent test emails
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

    // Check if domain is allowed
    if (!allowedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a valid email provider (Gmail, Outlook, Yahoo, etc.)' },
        { status: 400 }
      )
    }

    // Block test/fake email patterns
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

    // Validate mobile number format: +91 followed by exactly 10 digits
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
