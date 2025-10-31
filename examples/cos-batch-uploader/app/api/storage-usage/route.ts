import { NextRequest, NextResponse } from 'next/server'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '../../../lib/s3-client'
import { UPLOAD_CONFIG } from '../../../config/upload'

// Disable Next.js caching - Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json(
        { error: 'S3 bucket name not configured' },
        { status: 500 }
      )
    }

    // Add a timestamp to ensure that each request is new
    const requestTimestamp = Date.now()


    // Get all objects in the storage bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/', // Only count files in uploads directory
    })

    const response = await s3Client.send(listCommand)
    
    let totalSize = 0
    let totalCount = 0
    const files: Array<{
      key: string
      size: number
      lastModified: Date
    }> = []

    if (response.Contents) {
      response.Contents.forEach((object) => {
        if (object.Size && object.Key && object.LastModified) {
          totalSize += object.Size
          totalCount++
          files.push({
            key: object.Key,
            size: object.Size,
            lastModified: object.LastModified
          })
        }
      })
    }

    // Calculate usage percentage
    const usagePercentage = Math.round((totalSize / UPLOAD_CONFIG.MAX_STORAGE_SIZE) * 100)
    const remainingSize = UPLOAD_CONFIG.MAX_STORAGE_SIZE - totalSize
    
    // Estimate how many more files can be uploaded based on average file size
    const averageFileSize = totalCount > 0 ? totalSize / totalCount : 50 * 1024 * 1024 // Default 50MB
    const estimatedRemainingFiles = Math.floor(remainingSize / averageFileSize)

    // Determine status
    let status: 'normal' | 'warning' | 'danger' = 'normal'
    if (usagePercentage >= 90) {
      status = 'danger'
    } else if (usagePercentage >= 70) {
      status = 'warning'
    }

    // Generate hint message
    let message = ''
    switch (status) {
      case 'normal':
        message = `Can upload approximately ${estimatedRemainingFiles} more files`
        break
      case 'warning':
        message = 'Storage space is running low, please clean up files'
        break
      case 'danger':
        message = 'Storage space is critically low, please clean up files before uploading'
        break
    }

    const responseData = {
      totalSize,
      totalCount,
      maxSize: UPLOAD_CONFIG.MAX_STORAGE_SIZE,
      remainingSize,
      usagePercentage,
      status,
      message,
      estimatedRemainingFiles,
      files: files.slice(0, 10), // Return information for the most recent 10 files
      requestTimestamp,
      lastUpdated: new Date().toISOString(),
      s3ObjectsCount: response.Contents?.length || 0
    }

    const result = NextResponse.json(responseData)

    // Set the response header to disable caching at all levels
    result.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    result.headers.set('Pragma', 'no-cache')
    result.headers.set('Expires', '0')
    result.headers.set('Surrogate-Control', 'no-store')
    result.headers.set('X-Timestamp', requestTimestamp.toString())
    
    return result

  } catch (error) {
    console.error('Error fetching storage usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch storage usage' },
      { status: 500 }
    )
  }
}