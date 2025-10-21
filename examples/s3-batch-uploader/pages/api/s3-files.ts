// 本地api接口， 获取s3文件列表，删除文件
// 优先使用 EdgeOne Node Functions，404 时回退到本地 API
import { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, ListObjectsV2Command, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// 从浏览器查看 Amazon S3 桶中的照片
// https://docs.aws.amazon.com/zh_cn/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { prefix = '', maxKeys = '1000', continuationToken } = req.query

      // 列出S3存储桶中的对象
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix as string,
        MaxKeys: parseInt(maxKeys as string),
        ContinuationToken: continuationToken as string || undefined,
      })

      const listResponse = await s3Client.send(listCommand)

      if (!listResponse.Contents) {
        return res.status(200).json({
          files: [],
          nextContinuationToken: null,
          isTruncated: false
        })
      }

      // 获取每个文件的详细信息
      const filePromises = listResponse.Contents.map(async (object) => {
        if (!object.Key || object.Key.endsWith('/')) {
          return null // 跳过文件夹
        }

        try {
          // 获取文件的详细元数据
          const headCommand = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: object.Key,
          })
          
          const headResponse = await s3Client.send(headCommand)

          // 构建S3 URL
          const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${object.Key}`

          // 从文件名推断文件类型
          const fileExtension = object.Key.split('.').pop()?.toLowerCase()
          let contentType = headResponse.ContentType || 'application/octet-stream'
          
          // 如果S3没有正确的ContentType，根据扩展名推断
          if (contentType === 'application/octet-stream' && fileExtension) {
            const mimeTypes: Record<string, string> = {
              'jpg': 'image/jpeg',
              'jpeg': 'image/jpeg',
              'png': 'image/png',
              'gif': 'image/gif',
              'webp': 'image/webp',
              'mp4': 'video/mp4',
              'avi': 'video/avi',
              'mov': 'video/quicktime',
              'wmv': 'video/x-ms-wmv',
              'flv': 'video/x-flv',
              'webm': 'video/webm',
              'pdf': 'application/pdf',
              'doc': 'application/msword',
              'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'txt': 'text/plain',
            }
            contentType = mimeTypes[fileExtension] || 'application/octet-stream'
          }

          return {
            id: object.Key, // 使用S3 Key作为ID
            fileName: object.Key.split('/').pop() || object.Key, // 提取文件名
            fileSize: object.Size || 0,
            fileType: contentType,
            s3Url: s3Url,
            uploadTime: object.LastModified?.toISOString() || new Date().toISOString(),
            etag: object.ETag?.replace(/"/g, ''), // 移除引号
            storageClass: object.StorageClass || 'STANDARD',
            // 添加S3特有的元数据
            s3Key: object.Key,
            s3Metadata: headResponse.Metadata || {},
          }
        } catch (error) {
          console.error(`Error getting metadata for ${object.Key}:`, error)
          return null
        }
      })

      const files = (await Promise.all(filePromises)).filter(Boolean)

      return res.status(200).json({
        files,
        nextContinuationToken: listResponse.NextContinuationToken || null,
        isTruncated: listResponse.IsTruncated || false,
        totalCount: files.length
      })

    } catch (error) {
      console.error('Error listing S3 files:', error)
      return res.status(500).json({
        error: 'Failed to list S3 files',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { key } = req.query

      if (!key) {
        return res.status(400).json({
          error: 'Missing file key parameter'
        })
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key as string,
      })

      await s3Client.send(deleteCommand)

      return res.status(200).json({ success: true, message: 'File deleted successfully' })

    } catch (error) {
      console.error('Error deleting S3 file:', error)
      return res.status(500).json({
        error: 'Failed to delete S3 file',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}