import { NextApiRequest, NextApiResponse } from 'next'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'

// 生成预签名 URL 的 API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { filename, contentType, fileSize } = req.body

    if (!filename || !contentType) {
      return res.status(400).json({ error: 'Missing filename or contentType' })
    }

    // 检查环境变量
    if (!process.env.AWS_REGION || !process.env.AWS_BUCKET_NAME) {
      return res.status(500).json({ error: 'AWS configuration missing' })
    }

    const client = new S3Client({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    })
    
    // 保持原始文件名，只在uploads目录下组织
    // 如果需要避免重名，可以在文件名前加时间戳而不是UUID
    const timestamp = Date.now()
    const key = `uploads/${filename}`
    
    // 如果担心文件名冲突，可以使用这个版本（添加时间戳但保持可读性）：
    // const key = `uploads/${timestamp}-${filename}`
    
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

    return res.status(200).json({ 
      success: true,
      uploadUrl: url,
      fields: fields,
      publicUrl: publicUrl,
      key: key,
    })

  } catch (error) {
    console.error('Presigned URL generation error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate upload URL' 
    })
  }
}