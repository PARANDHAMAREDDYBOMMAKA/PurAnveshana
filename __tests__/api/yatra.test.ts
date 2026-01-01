import { POST as createYatra, GET as getYatra } from '@/app/api/yatra/route'
import { POST as approveYatra } from '@/app/api/yatra/[id]/approve/route'
import { POST as likeYatra, GET as getLikeStatus } from '@/app/api/yatra/[id]/like/route'
import { POST as createComment, GET as getComments } from '@/app/api/yatra/[id]/comments/route'

// Mock dependencies
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    yatraStory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    yatraLike: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    yatraComment: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock('@/lib/db-utils', () => ({
  withRetry: jest.fn((fn) => fn()),
}))

import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

describe('Yatra API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/yatra - Create Story', () => {
    it('should return 401 if user is not authenticated', async () => {
      (getSession as jest.Mock).mockResolvedValue(null)

      const request = new Request('http://localhost:3000/api/yatra', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Story' }),
      })

      const response = await createYatra(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should create a yatra story successfully', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123', role: 'user' })
      ;(prisma.yatraStory.create as jest.Mock).mockResolvedValue({
        id: 'story123',
        title: 'Test Story',
        userId: 'user123',
      })

      const requestBody = {
        heritageSiteId: 'site123',
        title: 'Test Story',
        discoveryContext: 'Found it',
        journeyNarrative: 'It was amazing',
        historicalIndicators: ['temple'],
        evidenceTypes: ['photo'],
        safeVisuals: ['url1'],
      }

      const request = new Request('http://localhost:3000/api/yatra', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createYatra(request)

      expect(response.status).toBe(200)
    })
  })

  describe('GET /api/yatra - Get Stories', () => {
    it('should return all yatra stories', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123', role: 'user' })
      ;(prisma.yatraStory.findMany as jest.Mock).mockResolvedValue([
        { id: 'story1', title: 'Story 1' },
        { id: 'story2', title: 'Story 2' },
      ])

      const request = new Request('http://localhost:3000/api/yatra', {
        method: 'GET',
      })

      const response = await getYatra()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.stories).toHaveLength(2)
    })
  })

  describe('POST /api/yatra/[id]/approve - Approve Story', () => {
    it('should return 403 if user is not admin', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123', role: 'user' })

      const request = new Request('http://localhost:3000/api/yatra/story123/approve', {
        method: 'POST',
        body: JSON.stringify({ action: 'approve' }),
      })

      const response = await approveYatra(request, { params: Promise.resolve({ id: 'story123' }) })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Admin access required')
    })

    it('should approve story successfully as admin', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'admin123', role: 'admin' })
      ;(prisma.yatraStory.findUnique as jest.Mock).mockResolvedValue({
        id: 'story123',
        title: 'Test Story',
      })
      ;(prisma.yatraStory.update as jest.Mock).mockResolvedValue({
        id: 'story123',
        publishStatus: 'APPROVED_PUBLIC',
      })

      const request = new Request('http://localhost:3000/api/yatra/story123/approve', {
        method: 'POST',
        body: JSON.stringify({ action: 'approve' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await approveYatra(request, { params: Promise.resolve({ id: 'story123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('POST /api/yatra/[id]/like - Toggle Like', () => {
    it('should toggle like on a story', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123', role: 'user' })
      ;(prisma.yatraLike.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.yatraLike.create as jest.Mock).mockResolvedValue({ id: 'like123' })
      ;(prisma.yatraLike.count as jest.Mock).mockResolvedValue(1)

      const request = new Request('http://localhost:3000/api/yatra/story123/like', {
        method: 'POST',
      })

      const response = await likeYatra(request, { params: Promise.resolve({ id: 'story123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.liked).toBe(true)
      expect(data.likeCount).toBe(1)
    })
  })

  describe('POST /api/yatra/[id]/comments - Create Comment', () => {
    it('should create a comment successfully', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123', role: 'user' })

      const mockComment = {
        id: 'comment123',
        comment: 'Great story!',
        userId: 'user123',
        storyId: 'story123',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 'user123', name: 'Test User' },
      }

      ;(prisma.yatraComment.create as jest.Mock).mockResolvedValue(mockComment)

      const request = new Request('http://localhost:3000/api/yatra/story123/comments', {
        method: 'POST',
        body: JSON.stringify({ comment: 'Great story!' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createComment(request, { params: Promise.resolve({ id: 'story123' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.comment.comment).toBe('Great story!')
    })
  })
})
