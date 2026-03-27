import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db-utils'

export async function GET() {
  try {
    const dbConnected = await testConnection()

    if (!dbConnected) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          db: 'disconnected',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        db: 'unknown',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
