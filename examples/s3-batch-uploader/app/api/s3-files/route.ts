import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const continuationToken = searchParams.get('continuationToken')
    const maxKeys = parseInt(searchParams.get('maxKeys') || '50')

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken || undefined,
    })

    const response = await s3Client.send(command)
    
    const files = (response.Contents || []).map(obj => ({
      id: obj.Key!,
      s3Key: obj.Key!,
      fileName: obj.Key!.split('/').pop() || obj.Key!,
      fileSize: obj.Size || 0,
      fileType: getFileType(obj.Key!),
      uploadTime: obj.LastModified?.toISOString() || new Date().toISOString(),
      // Remove direct S3 URL, use presigned URL instead
    }))

    return NextResponse.json({
      files,
      hasMore: response.IsTruncated || false,
      nextContinuationToken: response.NextContinuationToken,
    })
  } catch (error) {
    console.error('Error listing S3 files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting S3 file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

function getFileType(key: string): string {
  const extension = key.split('.').pop()?.toLowerCase()
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
  
  if (imageExtensions.includes(extension || '')) {
    return `image/${extension === 'jpg' ? 'jpeg' : extension}`
  }
  
  if (videoExtensions.includes(extension || '')) {
    return `video/${extension}`
  }
  
  return 'application/octet-stream'
}