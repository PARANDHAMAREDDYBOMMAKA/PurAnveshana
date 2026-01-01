import { POST as loginHandler } from '@/app/api/auth/login/route'
import { POST as signupHandler } from '@/app/api/auth/signup/route'
import { POST as logoutHandler } from '@/app/api/auth/logout/route'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-token'),
  })),
}))

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

describe('Auth API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and password are required')
    })

    it('should return 401 if user does not exist', async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should return 401 if password is incorrect', async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should login successfully with correct credentials', async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User',
        role: 'user',
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const request = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.email).toBe('test@example.com')
    })
  })

  describe('POST /api/auth/signup', () => {
    it('should return 400 if required fields are missing', async () => {
      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          // missing name and password
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
    })

    it('should return 400 if user already exists', async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'existing@example.com',
      })

      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('User already exists')
    })

    it('should create a new user successfully', async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password')
      ;(prisma.profile.create as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'user',
      })

      const request = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await signupHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.email).toBe('newuser@example.com')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const request = new Request('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      })

      const response = await logoutHandler()

      expect(response.status).toBe(200)
    })
  })
})
