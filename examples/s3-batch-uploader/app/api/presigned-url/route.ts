/**
 * S3 Presigned URL Generation API Route
 * 
 * Provides two functionalities:
 * 1. POST: Generate presigned download URL for a single file
 * 2. PUT: Batch generate presigned download URLs for multiple files
 */

import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UPLOAD_CONFIG } from '../../../config/upload'
import { s3Client, BUCKET_NAME } from '../../../lib/s3-client'



/**
 * Generate presigned download URL for a single file
 * 
 * @param request - Request object containing the following parameters:
 *   - key: S3 object key (file path)
 *   - expiresIn: URL expiration time (seconds), optional, defaults to config value
 * 
 * @returns JSON response containing:
 *   - presignedUrl: Presigned download URL
 *   - expiresIn: URL expiration time
 *   - key: Original file key
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request parameters: file key and expiration time
    const { key, expiresIn = UPLOAD_CONFIG.PRESIGNED_URL_EXPIRES } = await request.json()
    
    // Validate required file key parameter
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    // Create S3 GetObject command for generating download URL
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    // Generate presigned URL, allowing temporary access to S3 object
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    })

    // Return presigned URL and related information
    return NextResponse.json({
      presignedUrl,
      expiresIn,
      key,
    })
  } catch (error) {
    // Log error and return server error response
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}

/**
 * Batch generate presigned download URLs for multiple files
 * 
 * @param request - Request object containing the following parameters:
 *   - keys or s3Keys: Array of S3 object keys (list of file paths)
 *   - expiresIn: URL expiration time (seconds), optional, defaults to 300 seconds
 * 
 * @returns JSON response containing:
 *   - presignedUrls: Key-value object, key is file path, value is presigned URL
 *   - expiresIn: URL expiration time
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse request body parameters
    const body = await request.json()
    const { keys, s3Keys, expiresIn = 300 } = body
    
    // Support two parameter names: keys or s3Keys (backward compatibility)
    const keysArray = keys || s3Keys
    
    // Validate file keys array parameter
    if (!keysArray || !Array.isArray(keysArray)) {
      return NextResponse.json(
        { error: 'Missing or invalid keys parameter' },
        { status: 400 }
      )
    }

    // Object to store generated presigned URLs
    const presignedUrls: Record<string, string> = {}

    // Generate all presigned URLs in parallel for better performance
    await Promise.all(
      keysArray.map(async (key: string) => {
        try {
          // Create GetObject command for each file
          const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })

          // Generate presigned URL for this file
          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: expiresIn,
          })

          // Add URL to result object
          presignedUrls[key] = presignedUrl
        } catch (error) {
          console.error(`Error generating presigned URL for key ${key}:`, error)
          // Continue processing other files when a single file fails, don't interrupt the entire batch
        }
      })
    )

    // Return all successfully generated presigned URLs
    return NextResponse.json({
      presignedUrls,
      expiresIn,
    })
  } catch (error) {
    // Log batch processing error and return server error response
    console.error('Error generating batch presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URLs' },
      { status: 500 }
    )
  }
}