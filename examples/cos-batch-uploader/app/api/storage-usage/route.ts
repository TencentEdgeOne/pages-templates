import { NextRequest, NextResponse } from 'next/server'
import { listObjects, BUCKET_NAME } from '../../../lib/cos-client'
import { UPLOAD_CONFIG } from '../../../config/upload'

// Disable Next.js caching - force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json(
        { error: 'COS bucket name not configured' },
        { status: 500 }
      )
    }

    // Add timestamp to ensure each request is fresh
    const requestTimestamp = Date.now()

    // Get all objects in the bucket
    const result = await listObjects('uploads/', 1000)
    
    let totalSize = 0
    let totalCount = 0
    const files: Array<{
      key: string
      size: number
      lastModified: string
    }> = []

    result.objects.forEach((object) => {
      if (object.Size && object.Key && object.LastModified) {
        // Note: COS returns Size as string type, need to convert to number
        const fileSize = parseInt(object.Size, 10)
        totalSize += fileSize
        totalCount++
        files.push({
          key: object.Key,
          size: fileSize,
          lastModified: object.LastModified
        })
      }
    })

    // Calculate usage percentage
    const usagePercentage = Math.round((totalSize / UPLOAD_CONFIG.MAX_STORAGE_SIZE) * 100)
    const remainingSize = UPLOAD_CONFIG.MAX_STORAGE_SIZE - totalSize
    
    // Estimate remaining files based on average file size
    const averageFileSize = totalCount > 0 ? totalSize / totalCount : 50 * 1024 * 1024 // Default 50MB
    const estimatedRemainingFiles = Math.floor(remainingSize / averageFileSize)

    // Determine status
    let status: 'normal' | 'warning' | 'danger' = 'normal'
    if (usagePercentage >= 90) {
      status = 'danger'
    } else if (usagePercentage >= 70) {
      status = 'warning'
    }

    // Generate message
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
      files: files.slice(0, 10), // Return info for the most recent 10 files
      requestTimestamp,
      lastUpdated: new Date().toISOString(),
      cosObjectsCount: result.objects.length
    }

    const response = NextResponse.json(responseData)

    // Set response headers to disable all levels of caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('X-Timestamp', requestTimestamp.toString())
    
    return response

  } catch (error) {
    console.error('Error fetching storage usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch storage usage' },
      { status: 500 }
    )
  }
}
