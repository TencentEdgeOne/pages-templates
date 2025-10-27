/**
 * S3 预签名 URL 生成 API 路由
 * 
 * 提供两个功能：
 * 1. POST: 生成单个文件的预签名下载 URL
 * 2. PUT: 批量生成多个文件的预签名下载 URL
 */

import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UPLOAD_CONFIG } from '../../../config/upload'
import { s3Client, BUCKET_NAME } from '../../../lib/s3-client'



/**
 * 生成单个文件的预签名下载 URL
 * 
 * @param request - 包含以下参数的请求对象:
 *   - key: S3 对象键（文件路径）
 *   - expiresIn: URL 过期时间（秒），可选，默认使用配置值
 * 
 * @returns JSON 响应包含:
 *   - presignedUrl: 预签名下载 URL
 *   - expiresIn: URL 过期时间
 *   - key: 原始文件键
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求参数：文件键和过期时间
    const { key, expiresIn = UPLOAD_CONFIG.PRESIGNED_URL_EXPIRES } = await request.json()
    
    // 验证必需的文件键参数
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    // 创建 S3 GetObject 命令，用于生成下载 URL
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    // 生成预签名 URL，允许临时访问 S3 对象
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresIn,
    })

    // 返回预签名 URL 和相关信息
    return NextResponse.json({
      presignedUrl,
      expiresIn,
      key,
    })
  } catch (error) {
    // 记录错误并返回服务器错误响应
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}

/**
 * 批量生成多个文件的预签名下载 URL
 * 
 * @param request - 包含以下参数的请求对象:
 *   - keys 或 s3Keys: S3 对象键数组（文件路径列表）
 *   - expiresIn: URL 过期时间（秒），可选，默认 300 秒
 * 
 * @returns JSON 响应包含:
 *   - presignedUrls: 键值对对象，键为文件路径，值为预签名 URL
 *   - expiresIn: URL 过期时间
 */
export async function PUT(request: NextRequest) {
  try {
    // 解析请求体参数
    const body = await request.json()
    const { keys, s3Keys, expiresIn = 300 } = body
    
    // 支持两种参数名称：keys 或 s3Keys（向后兼容）
    const keysArray = keys || s3Keys
    
    // 验证文件键数组参数
    if (!keysArray || !Array.isArray(keysArray)) {
      return NextResponse.json(
        { error: 'Missing or invalid keys parameter' },
        { status: 400 }
      )
    }

    // 存储生成的预签名 URL 的对象
    const presignedUrls: Record<string, string> = {}

    // 并行生成所有预签名 URL 以提高性能
    await Promise.all(
      keysArray.map(async (key: string) => {
        try {
          // 为每个文件创建 GetObject 命令
          const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })

          // 生成该文件的预签名 URL
          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: expiresIn,
          })

          // 将 URL 添加到结果对象中
          presignedUrls[key] = presignedUrl
        } catch (error) {
          console.error(`Error generating presigned URL for key ${key}:`, error)
          // 单个文件失败时继续处理其他文件，不中断整个批处理
        }
      })
    )

    // 返回所有成功生成的预签名 URL
    return NextResponse.json({
      presignedUrls,
      expiresIn,
    })
  } catch (error) {
    // 记录批处理错误并返回服务器错误响应
    console.error('Error generating batch presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URLs' },
      { status: 500 }
    )
  }
}