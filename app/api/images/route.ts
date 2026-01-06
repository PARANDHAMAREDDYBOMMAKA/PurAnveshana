import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import { deleteFromR2 } from '@/lib/r2'
import { v2 as cloudinary } from 'cloudinary'
import { getCached, setCached, deleteCached, CACHE_KEYS, CACHE_TTL } from '@/lib/redis'

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

    const cacheKey = profile.role === 'admin'
      ? `${CACHE_KEYS.HERITAGE_SITES}admin`
      : `${CACHE_KEYS.HERITAGE_SITES}user:${profile.id}`

    const cached = await getCached<any>(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache-Status': 'HIT',
        },
      })
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
                  mobileNumber: true,
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

      const siteIds = sites.map((s) => s.id)
      const allPayments = await withRetry(() =>
        prisma.payment.findMany({
          where: {
            heritageSiteId: { in: siteIds },
            status: 'COMPLETED',
          },
          select: {
            heritageSiteId: true,
            amount: true,
          },
        })
      )

      const paymentMap = new Map<string, number>()
      allPayments.forEach((payment) => {
        const current = paymentMap.get(payment.heritageSiteId || '') || 0
        paymentMap.set(payment.heritageSiteId || '', current + payment.amount)
      })

      const sitesWithPayments = sites.map((site) => ({
        ...site,
        paymentAmount: paymentMap.get(site.id) || 0,
      }))

      const response = {
        success: true,
        sites: sitesWithPayments || [],
        userRole: profile.role,
      }

      await setCached(cacheKey, response, CACHE_TTL.MEDIUM)

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      })
    } catch (err) {
      console.error('Error fetching from new schema:', err)
      sites = []
      return NextResponse.json({
        success: true,
        sites: sites || [],
        userRole: profile.role,
      })
    }
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
      type,
      referenceLinks,
      images,
    } = body

    if (!title || !description || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields. Need title, description, and at least one image.' },
        { status: 400 }
      )
    }

    for (const img of images) {
      if (!img.location) {
        return NextResponse.json(
          { error: 'Each image must have a location' },
          { status: 400 }
        )
      }
      const hasR2 = img.r2Url && img.r2Key
      const hasCloudinary = img.cloudinaryUrl && img.cloudinaryPublicId
      if (!hasR2 && !hasCloudinary) {
        return NextResponse.json(
          { error: 'Each image must have either R2 (r2Url, r2Key) or Cloudinary (cloudinaryUrl, cloudinaryPublicId) fields' },
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
          type: type || null,
          referenceLinks: referenceLinks || [],
          paymentStatus: 'IN_PROGRESS',
          images: {
            create: images.map((img: any) => ({
              location: img.location,
              r2Url: img.r2Url || null,
              r2Key: img.r2Key || null,
              cloudinaryUrl: img.cloudinaryUrl || null,
              cloudinaryPublicId: img.cloudinaryPublicId || null,
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

    // Clear admin cache (all admins need to see new site) and user's cache
    const adminCacheKey = `${CACHE_KEYS.HERITAGE_SITES}admin`
    const userCacheKey = `${CACHE_KEYS.HERITAGE_SITES}user:${profile.id}`
    await Promise.all([
      deleteCached(adminCacheKey),
      deleteCached(userCacheKey),
    ])

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
    const { siteId, title, description, type, referenceLinks } = body

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

    const updateData: any = { title, description }
    if (type !== undefined) {
      updateData.type = type || null
    }
    if (referenceLinks !== undefined) {
      updateData.referenceLinks = referenceLinks || []
    }

    const updatedSite = await withRetry(() =>
      prisma.heritageSite.update({
        where: { id: siteId },
        data: updateData,
        include: {
          images: true,
        },
      })
    )

    // Clear admin cache (all admins need to see updated site) and user's cache
    const adminCacheKey = `${CACHE_KEYS.HERITAGE_SITES}admin`
    const userCacheKey = `${CACHE_KEYS.HERITAGE_SITES}user:${profile.id}`
    await Promise.all([
      deleteCached(adminCacheKey),
      deleteCached(userCacheKey),
    ])

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

    const deletePromises = site.images.map(async (image) => {
      try {
        if (image.r2Key) {
          await deleteFromR2(image.r2Key)
          console.log(`Deleted file from R2:`, image.r2Key)
        }
        else if (image.cloudinaryPublicId) {
          const resourceType = image.cloudinaryUrl?.includes('/video/') ? 'video' : 'image'
          await cloudinary.uploader.destroy(image.cloudinaryPublicId, {
            resource_type: resourceType,
          })
          console.log(`Deleted ${resourceType} from Cloudinary:`, image.cloudinaryPublicId)
        }
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    })

    await Promise.allSettled(deletePromises)

    await withRetry(() =>
      prisma.heritageSite.delete({
        where: { id: siteId },
      })
    )

    // Clear admin cache (all admins need to see deletion) and user's cache
    const adminCacheKey = `${CACHE_KEYS.HERITAGE_SITES}admin`
    const userCacheKey = `${CACHE_KEYS.HERITAGE_SITES}user:${profile.id}`
    await Promise.all([
      deleteCached(adminCacheKey),
      deleteCached(userCacheKey),
    ])

    return NextResponse.json({ success: true, message: 'Heritage site deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /api/images:', error)
    return NextResponse.json(
      { error: 'Failed to delete heritage site', details: error.message },
      { status: 500 }
    )
  }
}
