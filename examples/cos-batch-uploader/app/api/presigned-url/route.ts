import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl } from '../../../lib/cos-client'

// Handle single presigned URL request (for file upload)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType } = body

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing filename' },
        { status: 400 }
      )
    }

    // Generate unique object key
    const key = `uploads/${filename}`

    // Generate presigned URL for upload (PUT method)
    const uploadUrl = await getPresignedUrl(key, 3600, 'put')
    
    // Generate presigned URL for access (GET method)
    const publicUrl = await getPresignedUrl(key, 86400, 'get')

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}

// Handle batch presigned URL request (for file list display)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { s3Keys, expiresIn = 300 } = body

    if (!s3Keys || !Array.isArray(s3Keys) || s3Keys.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid s3Keys array' },
        { status: 400 }
      )
    }

    // Batch generate presigned URLs
    const presignedUrls: Record<string, string> = {}
    
    // Process all keys concurrently for better performance
    await Promise.all(
      s3Keys.map(async (key: string) => {
        try {
          const url = await getPresignedUrl(key, expiresIn, 'get')
          presignedUrls[key] = url
        } catch (error) {
          console.error(`Error generating presigned URL for key ${key}:`, error)
          // For failed keys, skip processing and let successful URLs return normally
        }
      })
    )

    return NextResponse.json({
      presignedUrls,
    })
  } catch (error) {
    console.error('Error generating batch presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate batch presigned URLs' },
      { status: 500 }
    )
  }
}
