import imageCompression from 'browser-image-compression'

export interface UploadResult {
  url: string
  publicId: string
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

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  // Compress image before uploading
  const compressedFile = await compressImage(file)

  const formData = new FormData()
  formData.append('file', compressedFile)
  formData.append('upload_preset', 'ml_default') // You'll need to create this in Cloudinary

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary')
  }

  const data = await response.json()

  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}
