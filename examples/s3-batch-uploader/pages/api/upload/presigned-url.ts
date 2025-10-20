import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fileName, fileType, fileSize } = req.body

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'Missing required fields: fileName, fileType' })
    }

    // Validate file size (max 100MB)
    if (fileSize && fileSize > 100 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 100MB limit' })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = fileName.split('.').pop()
    const uniqueFileName = `${timestamp}-${randomString}.${extension}`
    const s3Key = `uploads/${uniqueFileName}`

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      Metadata: {
        originalName: fileName,
        uploadTime: new Date().toISOString(),
      },
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    })

    return res.status(200).json({
      presignedUrl,
      s3Key,
      fileName: uniqueFileName,
      originalFileName: fileName,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return res.status(500).json({
      error: 'Failed to generate presigned URL',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}