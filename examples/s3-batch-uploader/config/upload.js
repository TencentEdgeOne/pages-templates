// 上传配置文件
// 这些配置不需要从环境变量加载，直接在代码中定义

export const UPLOAD_CONFIG = {
  // 最大文件大小 (10MB)
  MAX_FILE_SIZE: 10485760, // 10MB in bytes
  
  // 最大文件数量
  MAX_FILES: 20,
  
  // 分块上传大小 (5MB)
  CHUNK_SIZE: 5242880, // 5MB chunk size for multipart upload
  
  // 并发上传数量
  CONCURRENT_UPLOADS: 3,
  
  // 支持的文件类型
  ALLOWED_FILE_TYPES: [
    // 图片类型
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    
    // 视频类型
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    
    // 文档类型
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    
    // 压缩文件
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    
    // 音频文件
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp3',
    'audio/flac'
  ],
  
  // 预签名URL过期时间 (10分钟)
  PRESIGNED_URL_EXPIRES: 600,
  
  // 上传重试次数
  MAX_RETRY_ATTEMPTS: 3,
  
  // 上传超时时间 (30秒)
  UPLOAD_TIMEOUT: 30000
}

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 检查文件类型是否支持
export function isFileTypeAllowed(fileType) {
  return UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(fileType)
}

// 检查文件大小是否符合限制
export function isFileSizeValid(fileSize) {
  return fileSize <= UPLOAD_CONFIG.MAX_FILE_SIZE
}

// 获取文件类型分类
export function getFileCategory(fileType) {
  if (fileType.startsWith('image/')) return 'image'
  if (fileType.startsWith('video/')) return 'video'
  if (fileType.startsWith('audio/')) return 'audio'
  if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation') || fileType.includes('text')) return 'document'
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || fileType.includes('gzip')) return 'archive'
  return 'other'
}