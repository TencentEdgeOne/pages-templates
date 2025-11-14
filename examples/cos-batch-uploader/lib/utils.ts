import { UPLOAD_CONFIG } from '../config/upload'

// Format file size
export function formatFileSize(bytes: number): string {
  // Validate input
  if (!bytes || bytes === 0 || !isFinite(bytes)) return '0 Bytes'
  if (bytes < 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check if file type is supported
export function isFileTypeAllowed(fileType: string): boolean {
  return UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(fileType)
}

// Check if file size meets requirements
export function isFileSizeValid(fileSize: number): boolean {
  return fileSize <= UPLOAD_CONFIG.MAX_FILE_SIZE
}

// Get file type category
export function getFileCategory(fileType: string): string {
  if (fileType.startsWith('image/')) return 'image'
  if (fileType.startsWith('video/')) return 'video'
  if (fileType.startsWith('audio/')) return 'audio'
  if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation') || fileType.includes('text')) return 'document'
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || fileType.includes('gzip')) return 'archive'
  return 'other'
}