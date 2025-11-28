import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
const PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

export interface UploadResult {
  url: string
  key: string
}

/**
 * Upload a file to Cloudflare R2
 * @param buffer - File buffer to upload
 * @param key - Object key (path) in R2
 * @param contentType - MIME type of the file
 * @returns Upload result with URL and key
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  try {
    const upload = new Upload({
      client: r2Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      },
    })

    await upload.done()

    const url = `${PUBLIC_URL}/${key}`

    return {
      url,
      key,
    }
  } catch (error) {
    console.error('Error uploading to R2:', error)
    throw new Error('Failed to upload file to R2')
  }
}

/**
 * Delete a file from Cloudflare R2
 * @param key - Object key (path) in R2 to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
    console.log(`Deleted file from R2: ${key}`)
  } catch (error) {
    console.error('Error deleting from R2:', error)
    throw new Error('Failed to delete file from R2')
  }
}

/**
 * Generate a unique key for storing files in R2
 * @param prefix - Prefix for the key (e.g., 'images', 'videos')
 * @param extension - File extension
 * @returns Unique key
 */
export function generateR2Key(prefix: string, extension: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  return `${prefix}/${timestamp}-${randomString}.${extension}`
}
