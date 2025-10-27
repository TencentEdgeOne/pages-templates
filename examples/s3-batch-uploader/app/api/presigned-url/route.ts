import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UPLOAD_CONFIG } from '../../../config/upload'
import { s3Client, BUCKET_NAME } from '../../../lib/s3-client'



export async function POST(request: NextRequest) {
  try {
    const { key, expiresIn = UPLOAD_CONFIG.PRESIGNED_URL_EXPIRES } = await request.json()
    
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    // Generate presigned URL
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    })

    return NextResponse.json({
      presignedUrl,
      expiresIn,
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

// Batch generate presigned URLs
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { keys, s3Keys, expiresIn = 300 } = body
    
    // Support two parameter names: keys or s3Keys
    const keysArray = keys || s3Keys
    
    if (!keysArray || !Array.isArray(keysArray)) {
      return NextResponse.json(
        { error: 'Missing or invalid keys parameter' },
        { status: 400 }
      )
    }

    const presignedUrls: Record<string, string> = {}

    // Generate all presigned URLs in parallel
    await Promise.all(
      keysArray.map(async (key: string) => {
        try {
          const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })

          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: expiresIn,
          })

          presignedUrls[key] = presignedUrl
        } catch (error) {
          console.error(`Error generating presigned URL for key ${key}:`, error)
          // Continue processing other files, don't interrupt due to single file failure
        }
      })
    )

    return NextResponse.json({
      presignedUrls,
      expiresIn,
    })
  } catch (error) {
    console.error('Error generating batch presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URLs' },
      { status: 500 }
    )
  }
}