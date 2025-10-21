// EdgeOne Node Functions - 单文件上传预签名 URL 生成
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'

export async function onRequestPost(request) {
  try {
    const body = await request.json()
    const { filename, contentType, fileSize } = body

    if (!filename || !contentType) {
      return new Response(JSON.stringify({ error: 'Missing filename or contentType' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 检查环境变量
    if (!process.env.AWS_REGION || !process.env.AWS_BUCKET_NAME) {
      return new Response(JSON.stringify({ error: 'AWS configuration missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const client = new S3Client({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    })
    
    // 生成唯一的文件名，避免冲突
    const timestamp = Date.now()
    const key = `uploads/${timestamp}-${filename}`
    
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 104857600], // up to 100 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 600, // 10 minutes
    })

    // 构建公共 URL
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    return new Response(JSON.stringify({ 
      success: true,
      uploadUrl: url,
      fields: fields,
      publicUrl: publicUrl,
      key: key,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Presigned URL generation error:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate upload URL' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}