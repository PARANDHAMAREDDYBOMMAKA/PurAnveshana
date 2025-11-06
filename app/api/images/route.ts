import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: session.userId },
      })
    )

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let sites: any[] = []

    try {
      if (profile.role === 'admin') {
        sites = await withRetry(() =>
          prisma.heritageSite.findMany({
            include: {
              profile: {
                select: {
                  email: true,
                  role: true,
                },
              },
              images: {
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })
        )
      } else {
        sites = await withRetry(() =>
          prisma.heritageSite.findMany({
            where: {
              userId: profile.id,
            },
            include: {
              images: {
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })
        )
      }
    } catch (err) {
      console.error('Error fetching from new schema:', err)
      sites = []
    }

    return NextResponse.json({
      success: true,
      sites: sites || [],
      userRole: profile.role,
    })
  } catch (error: any) {
    console.error('Error in GET /api/images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heritage sites', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: session.userId },
      })
    )

    if (!profile) {
      return NextResponse.json({
        error: 'Profile not found. Please logout and login again.',
      }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      description,
      images,
    } = body

    if (!title || !description || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields. Need title, description, and at least one image.' },
        { status: 400 }
      )
    }

    for (const img of images) {
      if (!img.location || !img.cloudinaryUrl || !img.cloudinaryPublicId) {
        return NextResponse.json(
          { error: 'Each image must have location, cloudinaryUrl, and cloudinaryPublicId' },
          { status: 400 }
        )
      }
    }

    const site = await withRetry(() =>
      prisma.heritageSite.create({
        data: {
          userId: profile.id,
          title,
          description,
          images: {
            create: images.map((img: any) => ({
              location: img.location,
              cloudinaryUrl: img.cloudinaryUrl,
              cloudinaryPublicId: img.cloudinaryPublicId,
              isVerified: img.isVerified || false,
              cameraModel: img.cameraModel || null,
              gpsLatitude: img.latitude || null,
              gpsLongitude: img.longitude || null,
            })),
          },
        },
        include: {
          images: true,
        },
      })
    )

    return NextResponse.json({ success: true, data: site })
  } catch (error: any) {
    console.error('Error in POST /api/images:', error)
    return NextResponse.json(
      { error: 'An error occurred', details: error.message },
      { status: 500 }
    )
  }
}
