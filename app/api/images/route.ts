import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
          paymentStatus: 'IN_PROGRESS',
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

export async function PUT(request: Request) {
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

    const body = await request.json()
    const { siteId, title, description } = body

    if (!siteId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, title, description' },
        { status: 400 }
      )
    }

    const site = await withRetry(() =>
      prisma.heritageSite.findUnique({
        where: { id: siteId },
      })
    )

    if (!site) {
      return NextResponse.json({ error: 'Heritage site not found' }, { status: 404 })
    }

    if (site.userId !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to edit this site' }, { status: 403 })
    }

    if (site.paymentStatus !== 'NOT_STARTED') {
      return NextResponse.json(
        { error: 'Cannot edit site once payment processing has begun' },
        { status: 403 }
      )
    }

    const updatedSite = await withRetry(() =>
      prisma.heritageSite.update({
        where: { id: siteId },
        data: { title, description },
        include: {
          images: true,
        },
      })
    )

    return NextResponse.json({ success: true, data: updatedSite })
  } catch (error: any) {
    console.error('Error in PUT /api/images:', error)
    return NextResponse.json(
      { error: 'Failed to update heritage site', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')

    if (!siteId) {
      return NextResponse.json({ error: 'Missing siteId parameter' }, { status: 400 })
    }

    const site = await withRetry(() =>
      prisma.heritageSite.findUnique({
        where: { id: siteId },
        include: {
          images: true,
        },
      })
    )

    if (!site) {
      return NextResponse.json({ error: 'Heritage site not found' }, { status: 404 })
    }

    if (site.userId !== profile.id && profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to delete this site' }, { status: 403 })
    }

    if (site.paymentStatus !== 'NOT_STARTED') {
      return NextResponse.json(
        { error: 'Cannot delete site once payment processing has begun' },
        { status: 403 }
      )
    }

    // Delete all images/videos from Cloudinary
    const deletePromises = site.images.map(async (image) => {
      try {
        // Determine resource type based on the URL or public ID
        const resourceType = image.cloudinaryUrl.includes('/video/') ? 'video' : 'image'
        await cloudinary.uploader.destroy(image.cloudinaryPublicId, {
          resource_type: resourceType,
        })
        console.log(`Deleted ${resourceType} from Cloudinary:`, image.cloudinaryPublicId)
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        // Continue with deletion even if Cloudinary fails
      }
    })

    // Wait for all Cloudinary deletions to complete
    await Promise.allSettled(deletePromises)

    // Delete from database
    await withRetry(() =>
      prisma.heritageSite.delete({
        where: { id: siteId },
      })
    )

    return NextResponse.json({ success: true, message: 'Heritage site deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/images:', error)
    return NextResponse.json(
      { error: 'Failed to delete heritage site', details: error.message },
      { status: 500 }
    )
  }
}
