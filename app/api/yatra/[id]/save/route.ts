import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: storyId } = await params

    // Check if already saved
    const existingSave = await prisma.yatraSaved.findUnique({
      where: {
        storyId_userId: {
          storyId,
          userId: session.userId,
        },
      },
    })

    if (existingSave) {
      // Unsave
      await prisma.yatraSaved.delete({
        where: { id: existingSave.id },
      })
      return NextResponse.json({ saved: false })
    } else {
      // Save
      await prisma.yatraSaved.create({
        data: {
          storyId,
          userId: session.userId,
        },
      })
      return NextResponse.json({ saved: true })
    }
  } catch (error: any) {
    console.error('Error toggling save:', error)
    return NextResponse.json(
      { error: 'Failed to toggle save', details: error.message },
      { status: 500 }
    )
  }
}
