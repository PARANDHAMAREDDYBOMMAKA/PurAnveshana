import { GET as getProfile, PUT as updateProfile } from '@/app/api/profile/route'
import { PUT as updatePassword } from '@/app/api/profile/password/route'

jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

describe('Profile API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/profile', () => {
    it('should return 401 if not authenticated', async () => {
      (getSession as jest.Mock).mockResolvedValue(null)

      const response = await getProfile()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return user profile', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123' })
      ;(prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      })

      const response = await getProfile()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.profile.email).toBe('test@example.com')
    })
  })

  describe('PUT /api/profile', () => {
    it('should update user profile', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123' })
      ;(prisma.profile.update as jest.Mock).mockResolvedValue({
        id: 'user123',
        name: 'Updated Name',
        email: 'test@example.com',
      })

      const request = new Request('http://localhost:3000/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await updateProfile(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.profile.name).toBe('Updated Name')
    })
  })

  describe('PUT /api/profile/password', () => {
    it('should return 401 if current password is incorrect', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123' })
      ;(prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        passwordHash: 'hashed-password',
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const request = new Request('http://localhost:3000/api/profile/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: 'wrong',
          newPassword: 'newpass123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await updatePassword(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Current password is incorrect')
    })

    it('should update password successfully', async () => {
      (getSession as jest.Mock).mockResolvedValue({ userId: 'user123' })
      ;(prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        passwordHash: 'hashed-password',
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password')
      ;(prisma.profile.update as jest.Mock).mockResolvedValue({
        id: 'user123',
      })

      const request = new Request('http://localhost:3000/api/profile/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: 'oldpass123',
          newPassword: 'newpass123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await updatePassword(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Password updated successfully')
    })
  })
})
