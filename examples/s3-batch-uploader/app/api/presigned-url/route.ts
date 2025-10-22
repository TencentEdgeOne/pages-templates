import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
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
    const { key, expiresIn = 300 } = await request.json()
    
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    // 生成预签名 URL
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    })

    return NextResponse.json({
      presignedUrl,
      expiresIn,
      key,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}

// 批量生成预签名 URL
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { keys, s3Keys, expiresIn = 300 } = body
    
    // 支持两种参数名称：keys 或 s3Keys
    const keysArray = keys || s3Keys
    
    if (!keysArray || !Array.isArray(keysArray)) {
      return NextResponse.json(
        { error: 'Missing or invalid keys parameter' },
        { status: 400 }
      )
    }

    const presignedUrls: Record<string, string> = {}

    // 并行生成所有预签名 URL
    await Promise.all(
      keysArray.map(async (key: string) => {
        try {
          const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })

          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: expiresIn,
          })

          presignedUrls[key] = presignedUrl
        } catch (error) {
          console.error(`Error generating presigned URL for key ${key}:`, error)
          // 继续处理其他文件，不因单个文件失败而中断
        }
      })
    )

    return NextResponse.json({
      presignedUrls,
      expiresIn,
    })
  } catch (error) {
    console.error('Error generating batch presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URLs' },
      { status: 500 }
    )
  }
}