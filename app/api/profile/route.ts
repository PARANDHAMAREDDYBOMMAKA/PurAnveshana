import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: session.userId },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        role: profile.role,
        membershipTier: profile.membershipTier,
        createdAt: profile.createdAt,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
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

    const body = await request.json()
    const { name, mobileNumber } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: 'Mobile number must be 10 digits' },
        { status: 400 }
      )
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: session.userId },
      data: {
        name: name.trim(),
        ...(mobileNumber && { mobileNumber }),
      },
    })

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedProfile.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        mobileNumber: updatedProfile.mobileNumber,
        role: updatedProfile.role,
        membershipTier: updatedProfile.membershipTier,
        createdAt: updatedProfile.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
