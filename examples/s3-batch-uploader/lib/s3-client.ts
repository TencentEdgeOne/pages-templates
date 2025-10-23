import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export const S3_CONFIG = {
  region: process.env.AWS_REGION!,
  bucket: process.env.AWS_BUCKET_NAME!,
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '104857600'), // 100MB
  maxFiles: parseInt(process.env.NEXT_PUBLIC_MAX_FILES || '20'),
  chunkSize: parseInt(process.env.NEXT_PUBLIC_CHUNK_SIZE || '5242880'), // 5MB
  concurrentUploads: parseInt(process.env.NEXT_PUBLIC_CONCURRENT_UPLOADS || '3'),
}