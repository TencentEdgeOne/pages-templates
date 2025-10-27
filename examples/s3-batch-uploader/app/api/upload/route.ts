import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client, BUCKET_NAME } from '../../../lib/s3-client'

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
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const key = `uploads/${timestamp}-${randomId}-${filename}`

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    })

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`,
    })
  } catch (error) {
    console.error('Error creating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    )
  }
}