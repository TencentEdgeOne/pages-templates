import { UploadFile, UploadProgress } from '../types/upload'
import { UPLOAD_CONFIG, isFileTypeAllowed, isFileSizeValid, formatFileSize as configFormatFileSize } from '../config/upload'

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatUploadSpeed = (bytesPerSecond: number): string => {
  return formatFileSize(bytesPerSecond) + '/s'
}

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/')
}

export const generateFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    } else if (isVideoFile(file)) {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.crossOrigin = 'anonymous'
      
      const cleanup = () => {
        URL.revokeObjectURL(video.src)
      }
      
      video.onloadedmetadata = () => {
        // Set time to 1 second or 10% of duration, whichever is smaller
        const seekTime = Math.min(1, video.duration * 0.1)
        video.currentTime = seekTime
      }
      
      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas')
          const aspectRatio = video.videoWidth / video.videoHeight
          
          // Set canvas size with proper aspect ratio
          if (aspectRatio > 1) {
            canvas.width = 300
            canvas.height = 300 / aspectRatio
          } else {
            canvas.width = 300 * aspectRatio
            canvas.height = 300
          }
          
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataURL = canvas.toDataURL('image/jpeg', 0.8)
            cleanup()
            resolve(dataURL)
          } else {
            cleanup()
            reject(new Error('Unable to get canvas context'))
          }
        } catch (error) {
          cleanup()
          reject(error)
        }
      }
      
      video.onerror = (error) => {
        cleanup()
        reject(error)
      }
      
      // Set timeout to prevent hanging
      setTimeout(() => {
        cleanup()
        reject(new Error('Video preview generation timeout'))
      }, 10000)
      
      video.src = URL.createObjectURL(file)
    } else {
      // Return a default icon for other file types
      resolve('/icons/file-default.svg')
    }
  })
}

export const validateFile = (file: File, maxSize?: number): string | null => {
  // Use max file size from config if no parameter is passed
  const maxFileSize = maxSize || UPLOAD_CONFIG.MAX_FILE_SIZE
  
  if (!isFileSizeValid(file.size)) {
    return `File size exceeds limit (${configFormatFileSize(maxFileSize)})`
  }
  
  if (!isFileTypeAllowed(file.type)) {
    return `Unsupported file type: ${file.type}`
  }
  
  return null
}

export const calculateProgress = (loaded: number, total: number): UploadProgress => {
  const percentage = Math.round((loaded / total) * 100)
  return {
    loaded,
    total,
    percentage,
    speed: 0, // Will be calculated separately
  }
}