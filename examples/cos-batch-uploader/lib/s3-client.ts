import { S3Client } from '@aws-sdk/client-s3'

// Validate required environment variables
if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('AWS_ACCESS_KEY_ID environment variable is required')
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_SECRET_ACCESS_KEY environment variable is required')
}

if (!process.env.AWS_REGION && !process.env.AWS_BUCKET_REGION) {
  throw new Error('AWS_REGION or AWS_BUCKET_REGION environment variable is required')
}

// Create and export shared S3 client instance
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Export bucket name for convenience
export const BUCKET_NAME = process.env.AWS_BUCKET_NAME!

if (!BUCKET_NAME) {
  throw new Error('AWS_BUCKET_NAME environment variable is required')
}