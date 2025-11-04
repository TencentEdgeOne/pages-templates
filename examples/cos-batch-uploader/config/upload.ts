// Upload configuration file
// These configurations don't need to be loaded from environment variables, define directly in code

export const UPLOAD_CONFIG = {
  // Maximum file size (50MB)
  MAX_FILE_SIZE: 52428800, // 50MB in bytes
  
  // Maximum storage size (500MB)
  MAX_STORAGE_SIZE: 500 * 1024 * 1024, // 500MB in bytes
  
  // Maximum number of files
  MAX_FILES: 20,
  
  // Chunk upload size (50MB)
  CHUNK_SIZE: 52428800, // 50MB chunk size for multipart upload
  
  // Concurrent upload count
  CONCURRENT_UPLOADS: 3,
  
  // Supported file types
  ALLOWED_FILE_TYPES: [
    // Image types
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    
    // Video types
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    
    // Document types
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    
    // Archive files
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    
    // Audio files
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp3',
    'audio/flac'
  ],
  
  // Presigned URL expiration time (5 minutes)
  PRESIGNED_URL_EXPIRES: 300,
  
  // Upload retry attempts
  MAX_RETRY_ATTEMPTS: 3,
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check if file type is supported
export function isFileTypeAllowed(fileType) {
  return UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(fileType)
}

// Check if file size meets requirements
export function isFileSizeValid(fileSize) {
  return fileSize <= UPLOAD_CONFIG.MAX_FILE_SIZE
}

// Get file type category
export function getFileCategory(fileType) {
  if (fileType.startsWith('image/')) return 'image'
  if (fileType.startsWith('video/')) return 'video'
  if (fileType.startsWith('audio/')) return 'audio'
  if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation') || fileType.includes('text')) return 'document'
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || fileType.includes('gzip')) return 'archive'
  return 'other'
}