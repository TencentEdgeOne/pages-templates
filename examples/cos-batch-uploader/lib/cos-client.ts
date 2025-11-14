const COS = require('cos-nodejs-sdk-v5')

// Get COS configuration from environment variables
export const COS_SECRET_ID = process.env.COS_SECRET_ID || ''
export const COS_SECRET_KEY = process.env.COS_SECRET_KEY || ''
export const COS_BUCKET = process.env.COS_BUCKET || ''
export const COS_REGION = process.env.COS_REGION || 'ap-guangzhou'

// Validate required environment variables
if (!COS_SECRET_ID || !COS_SECRET_KEY || !COS_BUCKET) {
  console.warn('Warning: COS credentials not configured. Please set COS_SECRET_ID, COS_SECRET_KEY, and COS_BUCKET in your environment variables.')
}

// Create COS client instance
export const cosClient = new COS({
  SecretId: COS_SECRET_ID,
  SecretKey: COS_SECRET_KEY,
  // Optional configuration
  Protocol: 'https:',
  Timeout: 90000, // Request timeout (milliseconds)
})

// Export configuration for use by other modules
export const BUCKET_NAME = COS_BUCKET
export const REGION = COS_REGION

// Helper function: Generate complete URL for object
export function getObjectUrl(key: string): string {
  return `https://${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com/${key}`
}

// Helper function: Generate presigned URL
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

// Helper function: Upload file
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

// Helper function: List objects
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

// Helper function: Delete object
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

// Helper function: Initialize multipart upload
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

// Helper function: Upload part
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

// Helper function: Complete multipart upload
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

// Helper function: Abort multipart upload
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
