export interface UploadFile {
  id: string
  file: File
  preview?: string
  selected: boolean
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  s3Url?: string
  error?: string
}

export interface UploadConfig {
  maxFileSize: number
  maxFiles: number
  concurrentUploads: number
}

export interface HistoryItem {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  s3Url: string
  uploadTime: string
  thumbnail?: string
  // S3特有属性
  etag?: string
  storageClass?: string
  s3Key?: string
  s3Metadata?: Record<string, string>
}

export interface S3FilesResponse {
  files: HistoryItem[]
  nextContinuationToken: string | null
  isTruncated: boolean
  totalCount: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  speed: number
}

export type FileStatus = 'pending' | 'uploading' | 'success' | 'error'