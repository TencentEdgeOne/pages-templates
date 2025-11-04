import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl } from '../../../lib/cos-client'

// 处理单个预签名URL请求 (用于文件上传)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType } = body

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing filename' },
        { status: 400 }
      )
    }

    // 生成唯一的对象键
    const key = `uploads/${filename}`

    // 生成预签名URL用于上传 (PUT方法)
    const uploadUrl = await getPresignedUrl(key, 3600, 'put')
    
    // 生成预签名URL用于访问 (GET方法)
    const publicUrl = await getPresignedUrl(key, 86400, 'get')

    return NextResponse.json({
      uploadUrl,
      publicUrl,
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

// 处理批量预签名URL请求 (用于文件列表显示)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { s3Keys, expiresIn = 300 } = body

    if (!s3Keys || !Array.isArray(s3Keys) || s3Keys.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid s3Keys array' },
        { status: 400 }
      )
    }

    // 批量生成预签名URL
    const presignedUrls: Record<string, string> = {}
    
    // 并发处理所有key，提高性能
    await Promise.all(
      s3Keys.map(async (key: string) => {
        try {
          const url = await getPresignedUrl(key, expiresIn, 'get')
          presignedUrls[key] = url
        } catch (error) {
          console.error(`Error generating presigned URL for key ${key}:`, error)
          // 对于失败的key，跳过处理，让成功的URL正常返回
        }
      })
    )

    return NextResponse.json({
      presignedUrls,
    })
  } catch (error) {
    console.error('Error generating batch presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate batch presigned URLs' },
      { status: 500 }
    )
  }
}
