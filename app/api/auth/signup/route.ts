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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
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
