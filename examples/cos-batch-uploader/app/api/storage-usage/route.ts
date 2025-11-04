import { NextRequest, NextResponse } from 'next/server'
import { listObjects, BUCKET_NAME } from '../../../lib/cos-client'
import { UPLOAD_CONFIG } from '../../../config/upload'

// 禁用Next.js缓存 - 强制动态渲染
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

    // 添加时间戳确保每次请求都是新的
    const requestTimestamp = Date.now()

    // 获取存储桶中所有对象
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
        // 注意：COS返回的Size是字符串类型，需要转换为数字
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

    // 计算使用百分比
    const usagePercentage = Math.round((totalSize / UPLOAD_CONFIG.MAX_STORAGE_SIZE) * 100)
    const remainingSize = UPLOAD_CONFIG.MAX_STORAGE_SIZE - totalSize
    
    // 根据平均文件大小估算还能上传多少文件
    const averageFileSize = totalCount > 0 ? totalSize / totalCount : 50 * 1024 * 1024 // 默认50MB
    const estimatedRemainingFiles = Math.floor(remainingSize / averageFileSize)

    // 确定状态
    let status: 'normal' | 'warning' | 'danger' = 'normal'
    if (usagePercentage >= 90) {
      status = 'danger'
    } else if (usagePercentage >= 70) {
      status = 'warning'
    }

    // 生成提示消息
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
      files: files.slice(0, 10), // 返回最近10个文件的信息
      requestTimestamp,
      lastUpdated: new Date().toISOString(),
      cosObjectsCount: result.objects.length
    }

    const response = NextResponse.json(responseData)

    // 设置响应头禁用所有级别的缓存
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
