import { prisma } from './prisma'

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      const isConnectionError =
        error instanceof Error && (
          error.message.includes('connection pool') ||
          error.message.includes('Timed out') ||
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ETIMEDOUT')
        )

      if (attempt === maxRetries - 1 || !isConnectionError) {
        throw error
      }

      const delay = initialDelay * Math.pow(2, attempt)
      console.warn(`Database connection attempt ${attempt + 1} failed, retrying in ${delay}ms...`)

      await prisma.$disconnect()
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Operation failed after retries')
}

export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}


export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}
