import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { uploadToR2, generateR2Key } from '@/lib/r2'

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine file type and extension
    const fileType = file.type
    const extension = file.name.split('.').pop() || 'jpg'

    // Determine prefix based on file type
    const prefix = fileType.startsWith('video/') ? 'videos' : 'images'

    // Generate unique key
    const key = generateR2Key(prefix, extension)

    // Upload to R2
    const result = await uploadToR2(buffer, key, fileType)

    return NextResponse.json({
      success: true,
      r2Url: result.url,
      r2Key: result.key,
    })
  } catch (error: any) {
    console.error('Error in POST /api/upload:', error)
    return NextResponse.json(
      { error: 'Failed to upload file', details: error.message },
      { status: 500 }
    )
  }
}
