import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import YatraStoryDetail from '@/components/YatraStoryDetail'

export default async function YatraStoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  try {
    // Fetch story directly from database instead of HTTP request
    const story = await withRetry(() =>
      prisma.yatraStory.findUnique({
        where: { id },
        include: {
          heritageSite: {
            select: {
              id: true,
              title: true,
              type: true,
              description: true,
              images: {
                select: {
                  id: true,
                  r2Url: true,
                  cloudinaryUrl: true,
                  location: true,
                  gpsLatitude: true,
                  gpsLongitude: true,
                },
              },
            },
          },
        },
      })
    )

    if (!story) {
      notFound()
    }

    if (!story.isPublished) {
      notFound()
    }

    // Non-admin users can only view their own stories
    if (session.role !== 'admin' && story.userId !== session.userId) {
      notFound()
    }

    // Fetch author details
    const authorData = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: story.userId },
        select: {
          id: true,
          name: true,
        },
      })
    )

    // Ensure author is not null
    const author = authorData ?? { id: story.userId, name: 'Unknown User' }

    // Convert dates to strings for the component
    const storyData = {
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
      author,
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl mb-6">
          {/* Header with Logo and Back Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="bg-linear-to-br from-orange-500 to-amber-600 p-2 rounded-lg shadow-sm shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-base sm:text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent truncate">
                  Puranveshana
                </h2>
                <span className="text-xs text-orange-600 font-medium notranslate" translate="no">
                  पुरातन अन्वेषण
                </span>
              </div>
            </div>
            {/* Back Button - Top Right */}
            <a
              href="/dashboard/yatra"
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-3 py-2 sm:px-4 text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Yatra</span>
              <span className="sm:hidden">Back</span>
            </a>
          </div>
        </div>
        <YatraStoryDetail story={storyData} currentUserId={session.userId} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching story:', error)
    notFound()
  }
}
