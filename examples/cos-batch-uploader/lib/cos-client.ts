const COS = require('cos-nodejs-sdk-v5')

// 从环境变量获取COS配置
export const COS_SECRET_ID = process.env.COS_SECRET_ID || ''
export const COS_SECRET_KEY = process.env.COS_SECRET_KEY || ''
export const COS_BUCKET = process.env.COS_BUCKET || ''
export const COS_REGION = process.env.COS_REGION || 'ap-guangzhou'

// 验证必需的环境变量
if (!COS_SECRET_ID || !COS_SECRET_KEY || !COS_BUCKET) {
  console.warn('Warning: COS credentials not configured. Please set COS_SECRET_ID, COS_SECRET_KEY, and COS_BUCKET in your environment variables.')
}

// 创建COS客户端实例
export const cosClient = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
  // 可选配置
  Protocol: 'https:',
  Timeout: 90000, // 请求超时时间（毫秒）
})

// 导出配置供其他模块使用
export const BUCKET_NAME = COS_BUCKET
export const REGION = COS_REGION

// 辅助函数：生成对象的完整URL
export function getObjectUrl(key: string): string {
  return `https://${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com/${key}`
}

// 辅助函数：生成预签名URL
export async function getPresignedUrl(
  key: string,
  expires: number = 3600,
  method: 'get' | 'put' = 'get'
): Promise<string> {
  return new Promise((resolve, reject) => {
    cosClient.getObjectUrl(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        Sign: true,
        Expires: expires,
        Method: method,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.Url)
        }
      }
    )
  })
}

// 辅助函数：上传文件
export async function putObject(
  key: string,
  body: Buffer | string,
  contentType?: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    cosClient.putObject(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
      (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}

// 辅助函数:列出对象
export async function listObjects(
  prefix: string = '',
  maxKeys: number = 1000,
  continuationToken?: string
): Promise<{
  objects: any[]
  isTruncated: boolean
  nextMarker?: string
}> {
  return new Promise((resolve, reject) => {
    cosClient.getBucket(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Prefix: prefix,
        MaxKeys: maxKeys,
        Marker: continuationToken,
      },
      (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            objects: data.Contents || [],
            isTruncated: data.IsTruncated === 'true',
            nextMarker: data.NextMarker,
          })
        }
      }
    )
  })
}

// 辅助函数:删除对象
export async function deleteObject(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cosClient.deleteObject(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

// 辅助函数:初始化分片上传
export async function createMultipartUpload(
  key: string,
  contentType?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cosClient.multipartInit(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        ContentType: contentType,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.UploadId)
        }
      }
    )
  })
}

// 辅助函数:上传分片
export async function uploadPart(
  key: string,
  uploadId: string,
  partNumber: number,
  body: Buffer
): Promise<{ ETag: string }> {
  return new Promise((resolve, reject) => {
    cosClient.multipartUpload(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: body,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve({ ETag: data.ETag })
        }
      }
    )
  })
}

// 辅助函数:完成分片上传
export async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: Array<{ PartNumber: number; ETag: string }>
): Promise<void> {
  return new Promise((resolve, reject) => {
    cosClient.multipartComplete(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        UploadId: uploadId,
        Parts: parts,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

// 辅助函数:终止分片上传
export async function abortMultipartUpload(
  key: string,
  uploadId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    cosClient.multipartAbort(
      {
        Bucket: COS_BUCKET,
        Region: COS_REGION,
        Key: key,
        UploadId: uploadId,
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}
