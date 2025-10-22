import { NextRequest, NextResponse } from 'next/server'
import { S3Client, CreateMultipartUploadCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, fileSize } = await request.json()
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, contentType' },
        { status: 400 }
      )
    }

    // 生成唯一的文件键
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const key = `uploads/${timestamp}-${randomId}-${filename}`

    // 如果文件大小超过 5MB，使用分片上传
    if (fileSize > 5 * 1024 * 1024) {
      const createMultipartCommand = new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })

      const multipartResponse = await s3Client.send(createMultipartCommand)
      
      return NextResponse.json({
        uploadId: multipartResponse.UploadId,
        key,
        publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        multipart: true,
      })
    } else {
      // 直接上传的预签名 URL
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1小时
      })

      return NextResponse.json({
        uploadUrl: uploadUrl.replace('GetObject', 'PutObject'),
        key,
        publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        multipart: false,
      })
    }
  } catch (error) {
    console.error('Error creating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    )
  }
}