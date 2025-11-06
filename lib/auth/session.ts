import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const key = new TextEncoder().encode(secretKey)

export interface SessionData {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export async function encrypt(payload: SessionData) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionData
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string, email: string, role: 'admin' | 'user') {
  const token = await encrypt({ userId, email, role })
  const cookieStore = await cookies()

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  })

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  return await decrypt(token)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  if (!token) return null

  const payload = await decrypt(token)

  if (!payload) return null

  const response = NextResponse.next()
  response.cookies.set({
    name: 'session',
    value: await encrypt(payload),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  return response
}
