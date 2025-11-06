import { prisma } from './prisma'

/**
 * Retry database operations with exponential backoff
 * Useful when network changes cause temporary connection issues
 */
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

      // Check if it's a connection-related error
      const isConnectionError =
        error instanceof Error && (
          error.message.includes('connection pool') ||
          error.message.includes('Timed out') ||
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ETIMEDOUT')
        )

      // If it's the last attempt or not a connection error, throw immediately
      if (attempt === maxRetries - 1 || !isConnectionError) {
        throw error
      }

      // Exponential backoff: wait longer between each retry
      const delay = initialDelay * Math.pow(2, attempt)
      console.warn(`Database connection attempt ${attempt + 1} failed, retrying in ${delay}ms...`)

      // Disconnect and reconnect to clear stale connections
      await prisma.$disconnect()
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Operation failed after retries')
}

/**
 * Test database connection
 * Returns true if connected, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

/**
 * Safely disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}
