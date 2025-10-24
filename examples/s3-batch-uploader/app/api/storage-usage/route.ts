import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || ''
const MAX_STORAGE_SIZE = 500 * 1024 * 1024 // 500MB in bytes

export async function GET(request: NextRequest) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json(
        { error: 'S3 bucket name not configured' },
        { status: 500 }
      )
    }

    // 获取存储桶中所有对象
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/', // 只统计 uploads 目录下的文件
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

    // 计算使用百分比
    const usagePercentage = Math.round((totalSize / MAX_STORAGE_SIZE) * 100)
    const remainingSize = MAX_STORAGE_SIZE - totalSize
    
    // 根据平均文件大小估算还能上传多少文件
    const averageFileSize = totalCount > 0 ? totalSize / totalCount : 5 * 1024 * 1024 // 默认5MB
    const estimatedRemainingFiles = Math.floor(remainingSize / averageFileSize)

    // 确定状态
    let status: 'normal' | 'warning' | 'danger' = 'normal'
    if (usagePercentage >= 90) {
      status = 'danger'
    } else if (usagePercentage >= 70) {
      status = 'warning'
    }

    // 生成提示信息
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

    return NextResponse.json({
      totalSize,
      totalCount,
      maxSize: MAX_STORAGE_SIZE,
      remainingSize,
      usagePercentage,
      status,
      message,
      estimatedRemainingFiles,
      files: files.slice(0, 10) // 返回最近的10个文件信息
    })

  } catch (error) {
    console.error('Error fetching storage usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch storage usage' },
      { status: 500 }
    )
  }
}