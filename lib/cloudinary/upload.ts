import imageCompression from 'browser-image-compression'

export interface UploadResult {
  url: string
  publicId: string
  // R2 fields
  r2Url?: string
  r2Key?: string
}

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Error compressing image:', error)
    return file // Return original if compression fails
  }
}

// New function: Upload to R2
export async function uploadToR2(file: File): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/')

  // Compress image before uploading (skip compression for videos)
  const fileToUpload = isVideo ? file : await compressImage(file)

  const formData = new FormData()
  formData.append('file', fileToUpload)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to upload file to R2')
  }

  const data = await response.json()

  return {
    url: data.r2Url,
    publicId: data.r2Key, // For backward compatibility with existing code
    r2Url: data.r2Url,
    r2Key: data.r2Key,
  }
}

// Legacy function: Upload to Cloudinary (kept for backward compatibility)
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/')

  // Compress image before uploading (skip compression for videos)
  const fileToUpload = isVideo ? file : await compressImage(file)

  const formData = new FormData()
  formData.append('file', fileToUpload)
  formData.append('upload_preset', 'ml_default')

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured')
  }

  // Use different endpoint for videos vs images
  const uploadType = isVideo ? 'video' : 'image'
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${uploadType}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to upload ${uploadType} to Cloudinary`)
  }

  const data = await response.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}
