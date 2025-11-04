import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl, getObjectUrl } from '../../../lib/cos-client'

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json()
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, contentType' },
        { status: 400 }
      )
    }

    // 生成唯一的文件键
    const key = `uploads/${filename}`

    // 生成预签名URL用于上传
    const uploadUrl = await getPresignedUrl(key, 3600, 'put')
    
    // 生成公共访问URL
    const publicUrl = getObjectUrl(key)

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl,
    })
  } catch (error) {
    console.error('Error creating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    )
  }
}
