import { HistoryItem, UploadConfig } from '../types/upload'
import { UPLOAD_CONFIG } from '../config/upload.js'

const STORAGE_KEYS = {
  UPLOAD_HISTORY: 'upload_history',
  UPLOAD_CONFIG: 'upload_config',
}

export const getUploadHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const history = localStorage.getItem(STORAGE_KEYS.UPLOAD_HISTORY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error reading upload history:', error)
    return []
  }
}

export const saveUploadHistory = (items: HistoryItem[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEYS.UPLOAD_HISTORY, JSON.stringify(items))
  } catch (error) {
    console.error('Error saving upload history:', error)
  }
}

export const addToUploadHistory = (item: HistoryItem): void => {
  const history = getUploadHistory()
  const updatedHistory = [item, ...history.filter(h => h.id !== item.id)]
  saveUploadHistory(updatedHistory)
}

export const removeFromUploadHistory = (id: string): void => {
  const history = getUploadHistory()
  const updatedHistory = history.filter(h => h.id !== id)
  saveUploadHistory(updatedHistory)
}

export const getUploadConfig = (): UploadConfig => {
  if (typeof window === 'undefined') {
    // Server-side default - 使用配置文件中的值
    return {
      maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      maxFiles: UPLOAD_CONFIG.MAX_FILES,
      concurrentUploads: UPLOAD_CONFIG.CONCURRENT_UPLOADS,
    }
  }
  
  try {
    const config = localStorage.getItem(STORAGE_KEYS.UPLOAD_CONFIG)
    if (config) {
      const parsedConfig = JSON.parse(config)
      // 确保保存的配置不超过系统限制
      return {
        maxFileSize: Math.min(parsedConfig.maxFileSize || UPLOAD_CONFIG.MAX_FILE_SIZE, UPLOAD_CONFIG.MAX_FILE_SIZE),
        maxFiles: Math.min(parsedConfig.maxFiles || UPLOAD_CONFIG.MAX_FILES, UPLOAD_CONFIG.MAX_FILES),
        concurrentUploads: Math.min(parsedConfig.concurrentUploads || UPLOAD_CONFIG.CONCURRENT_UPLOADS, UPLOAD_CONFIG.CONCURRENT_UPLOADS),
      }
    }
    
    // Default config - 使用配置文件中的值
    return {
      maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      maxFiles: UPLOAD_CONFIG.MAX_FILES,
      concurrentUploads: UPLOAD_CONFIG.CONCURRENT_UPLOADS,
    }
  } catch (error) {
    console.error('Error reading upload config:', error)
    return {
      maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      maxFiles: UPLOAD_CONFIG.MAX_FILES,
      concurrentUploads: UPLOAD_CONFIG.CONCURRENT_UPLOADS,
    }
  }
}

export const saveUploadConfig = (config: UploadConfig): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEYS.UPLOAD_CONFIG, JSON.stringify(config))
  } catch (error) {
    console.error('Error saving upload config:', error)
  }
}

