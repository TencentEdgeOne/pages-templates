// EdgeOne Node Functionsapi接口， 获取s3文件列表，删除文件
// 优先使用 EdgeOne Node Functions，404 时回退到本地 API
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'

type HistoryItem = {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadTime: string
  s3Key: string
  s3Url: string
}

/**
 * EdgeOne Node Functions Handlers 版本
 * - onRequestGet：GET /api/s3-files 读取列表
 * - onRequestDelete：DELETE /api/s3-files 删除对象
 */

function detectMimeFromKey(key: string): string {
  const lower = key.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.mp4')) return 'video/mp4'
  if (lower.endsWith('.webm')) return 'video/webm'
  if (lower.endsWith('.mov')) return 'video/quicktime'
  return 'application/octet-stream'
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers }
  })
}

function makeS3() {
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  if (!region || !accessKeyId || !secretAccessKey) {
    throw json({ errorCode: 500, message: 'missing AWS credentials or region' }, 500)
  }
  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })
}


// GET /api/s3-files
export async function onRequestGet({ request }) {
  try {
    const bucket = process.env.AWS_BUCKET_NAME
    const s3 = makeS3()

    const { prefix = '', maxKeys = '1000', continuationToken, type = 'all' } = request.query
    const pageSize = parseInt(maxKeys || '50', 10)

    const res = await s3.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix || undefined,
      MaxKeys: pageSize,
      ContinuationToken: continuationToken
    }))

    const files: HistoryItem[] = (res.Contents || []).map(obj => {
      const key = obj.Key!
      return {
        id: key,
        fileName: key.split('/').pop() || key,
        fileSize: obj.Size || 0,
        fileType: detectMimeFromKey(key),
        uploadTime: (obj.LastModified || new Date()).toISOString(),
        s3Key: key,
        s3Url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}`
      }
    }).filter(item => {
      if (type === 'image') return item.fileType.startsWith('image/')
      if (type === 'video') return item.fileType.startsWith('video/')
      return true
    })
    return json({ files, nextContinuationToken: res.NextContinuationToken || null }, 200, { 'cache-control': 'no-store' })
  } catch (err) {
    if (err instanceof Response) return err
    const message = err instanceof Error ? err.message : 'Internal Error'
    return json({ errorCode: 500, message }, 500)
  }
}

// DELETE /api/s3-files
export async function onRequestDelete({ request } ) {
  try {
    const bucket = process.env.AWS_BUCKET_NAME
    const s3 = makeS3()

    const { key = '' } = request.query
    if (!key) return json({ errorCode: 400, message: 'key is required' }, 400)

    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    return json({ ok: true }, 200)
  } catch (err) {
    if (err instanceof Response) return err
    const message = err instanceof Error ? err.message : 'Internal Error'
    return json({ errorCode: 500, message }, 500)
  }
}