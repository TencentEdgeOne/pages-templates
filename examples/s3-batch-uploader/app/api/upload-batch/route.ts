import { NextRequest, NextResponse } from 'next/server'
import { S3Client, CreateMultipartUploadCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createHash } from 'crypto'

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

    // 生成基于文件属性的固定键名，实现覆盖功能
    // 使用文件名、大小和类型的组合生成哈希，确保同一文件总是得到相同的键名
    const fileIdentifier = `${filename}-${fileSize}-${contentType}`
    const fileHash = createHash('md5').update(fileIdentifier).digest('hex').substring(0, 8)
    const fileExtension = filename.split('.').pop() || ''
    const baseFileName = filename.replace(/\.[^/.]+$/, '') // 移除扩展名
    const key = `uploads/${fileHash}-${baseFileName}.${fileExtension}`

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
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300, // 5分钟，与其他预签名URL保持一致
      })

      return NextResponse.json({
        uploadUrl,
        key,
        publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        multipart: false,
        fields: {}, // 直接预签名 URL 不需要额外字段
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