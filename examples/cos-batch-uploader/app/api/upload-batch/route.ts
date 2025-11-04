import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl, createMultipartUpload, getObjectUrl } from '../../../lib/cos-client'

// 大文件阈值 (50MB)
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename, contentType, fileSize } = body

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing filename' },
        { status: 400 }
      )
    }

    // 生成唯一的对象键
    const key = `uploads/${filename}`

    // 判断是否需要分片上传
    if (fileSize && fileSize > LARGE_FILE_THRESHOLD) {
      // 大文件使用分片上传
      try {
        const uploadId = await createMultipartUpload(key, contentType)
        const publicUrl = getObjectUrl(key)

        return NextResponse.json({
          multipart: true,
          uploadId,
          key,
          publicUrl,
        })
      } catch (error) {
        console.error('Error creating multipart upload:', error)
        return NextResponse.json(
          { error: 'Failed to create multipart upload' },
          { status: 500 }
        )
      }
    } else {
      // 小文件使用简单上传
      const uploadUrl = await getPresignedUrl(key, 3600, 'put')
      const publicUrl = getObjectUrl(key)

      return NextResponse.json({
        uploadUrl,
        publicUrl,
        key,
      })
    }
  } catch (error) {
    console.error('Error in upload-batch:', error)
    return NextResponse.json(
      { error: 'Failed to process upload request' },
      { status: 500 }
    )
  }
}
