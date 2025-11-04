import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl, getObjectUrl } from '../../../lib/cos-client'

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json()
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, contentType' },
        { status: 400 }
      )
    }

    // Generate unique file key
    const key = `uploads/${filename}`

    // Generate presigned URL for upload
    const uploadUrl = await getPresignedUrl(key, 3600, 'put')
    
    // Generate public access URL
    const publicUrl = getObjectUrl(key)

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl,
    })
  } catch (error) {
    console.error('Error creating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    )
  }
}
