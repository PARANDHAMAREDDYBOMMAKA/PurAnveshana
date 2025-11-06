import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth/session'

export async function POST(request: Request) {
  try {
    await deleteSession()

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
