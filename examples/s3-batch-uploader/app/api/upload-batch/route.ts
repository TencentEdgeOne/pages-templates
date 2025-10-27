import { NextRequest, NextResponse } from 'next/server'
import { CreateMultipartUploadCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createHash } from 'crypto'
import { s3Client, BUCKET_NAME } from '../../../lib/s3-client'


const MAX_STORAGE_SIZE = 500 * 1024 * 1024 // 500MB in bytes

// Check storage usage
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
      message: totalSize >= MAX_STORAGE_SIZE ? 'Storage space is full, cannot upload more files' : undefined
    }
  } catch (error) {
    console.error('Error checking storage usage:', error)
    // If check fails, allow upload but log error
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

    // Check storage capacity
    const storageCheck = await checkStorageUsage()
    const totalAfterUpload = storageCheck.totalSize + (fileSize || 0)
    
    if (totalAfterUpload > MAX_STORAGE_SIZE) {
      const usedMB = Math.round(storageCheck.totalSize / (1024 * 1024))
      const uploadMB = Math.round((fileSize || 0) / (1024 * 1024))
      const maxMB = Math.round(MAX_STORAGE_SIZE / (1024 * 1024))
      
      return NextResponse.json(
        { 
          error: `Insufficient storage space! Currently used ${usedMB}MB, attempting to upload ${uploadMB}MB, will exceed ${maxMB}MB limit. Please clean up some files first.`,
          errorZh: `Insufficient storage space! Currently used ${usedMB}MB, attempting to upload ${uploadMB}MB, will exceed ${maxMB}MB limit. Please clean up some files first.`,
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

    // Generate fixed key name based on file attributes, enabling overwrite functionality
    // Use combination of filename, size and type to generate hash, ensuring same file always gets same key name
    const fileIdentifier = `${filename}-${fileSize}-${contentType}`
    const fileHash = createHash('md5').update(fileIdentifier).digest('hex').substring(0, 8)
    const fileExtension = filename.split('.').pop() || ''
    const baseFileName = filename.replace(/\.[^/.]+$/, '') // Remove extension
    const key = `uploads/${fileHash}-${baseFileName}.${fileExtension}`

    // If file size exceeds 50MB, use multipart upload
    if (fileSize > 50 * 1024 * 1024) {
      const createMultipartCommand = new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })

      const multipartResponse = await s3Client.send(createMultipartCommand)
      
      return NextResponse.json({
        uploadId: multipartResponse.UploadId,
        key,
        publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`,
        multipart: true,
      })
    } else {
      // Presigned URL for direct upload
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300, // 5 minutes, consistent with other presigned URLs
      })

      return NextResponse.json({
        uploadUrl,
        key,
        publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`,
        multipart: false,
        fields: {}, // Direct presigned URL doesn't need additional fields
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