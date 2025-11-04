import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl, createMultipartUpload, getObjectUrl } from '../../../lib/cos-client'

// Large file threshold (50MB)
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType, fileSize } = body

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing filename' },
        { status: 400 }
      )
    }

    // Generate unique object key
    const key = `uploads/${filename}`

    // Determine if multipart upload is needed
    if (fileSize && fileSize > LARGE_FILE_THRESHOLD) {
      // Use multipart upload for large files
      try {
        const uploadId = await createMultipartUpload(key, contentType)
        const publicUrl = getObjectUrl(key)

        return NextResponse.json({
          multipart: true,
          uploadId,
          key,
          publicUrl,
        })
      } catch (error) {
        console.error('Error creating multipart upload:', error)
        return NextResponse.json(
          { error: 'Failed to create multipart upload' },
          { status: 500 }
        )
      }
    } else {
      // Use simple upload for small files
      const uploadUrl = await getPresignedUrl(key, 3600, 'put')
      const publicUrl = getObjectUrl(key)

      return NextResponse.json({
        uploadUrl,
        publicUrl,
        key,
      })
    }
  } catch (error) {
    console.error('Error in upload-batch:', error)
    return NextResponse.json(
      { error: 'Failed to process upload request' },
      { status: 500 }
    )
  }
}
