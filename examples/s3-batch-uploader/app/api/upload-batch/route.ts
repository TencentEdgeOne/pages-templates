import { NextRequest, NextResponse } from 'next/server'
import { S3Client, CreateMultipartUploadCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
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
const MAX_STORAGE_SIZE = 500 * 1024 * 1024 // 500MB in bytes

// 检查存储使用情况
async function checkStorageUsage(): Promise<{ totalSize: number; canUpload: boolean; message?: string }> {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/',
    })

    const response = await s3Client.send(listCommand)
    
    let totalSize = 0
    if (response.Contents) {
      response.Contents.forEach((object) => {
        if (object.Size) {
          totalSize += object.Size
        }
      })
    }

    return {
      totalSize,
      canUpload: totalSize < MAX_STORAGE_SIZE,
      message: totalSize >= MAX_STORAGE_SIZE ? '存储空间已满，无法上传更多文件' : undefined
    }
  } catch (error) {
    console.error('Error checking storage usage:', error)
    // 如果检查失败，允许上传但记录错误
    return { totalSize: 0, canUpload: true }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, fileSize } = await request.json()
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, contentType' },
        { status: 400 }
      )
    }

    // 检查存储容量
    const storageCheck = await checkStorageUsage()
    const totalAfterUpload = storageCheck.totalSize + (fileSize || 0)
    
    if (totalAfterUpload > MAX_STORAGE_SIZE) {
      const usedMB = Math.round(storageCheck.totalSize / (1024 * 1024))
      const uploadMB = Math.round((fileSize || 0) / (1024 * 1024))
      const maxMB = Math.round(MAX_STORAGE_SIZE / (1024 * 1024))
      
      return NextResponse.json(
        { 
          error: `存储空间不足！当前已用 ${usedMB}MB，尝试上传 ${uploadMB}MB，将超出 ${maxMB}MB 限制。请先清理一些文件后再试。`,
          code: 'STORAGE_LIMIT_EXCEEDED',
          details: {
            currentUsage: storageCheck.totalSize,
            uploadSize: fileSize,
            maxSize: MAX_STORAGE_SIZE,
            remainingSize: MAX_STORAGE_SIZE - storageCheck.totalSize
          }
        },
        { status: 413 } // 413 Payload Too Large
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