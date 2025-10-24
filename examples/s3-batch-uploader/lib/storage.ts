import { HistoryItem, UploadConfig } from '../types/upload'
import { UPLOAD_CONFIG } from '../config/upload'

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

export const addToUploadHistory = (item: Omit<HistoryItem, 's3Url'> & { s3Url?: string }): void => {
  const history = getUploadHistory()
  // Add s3Key if not provided
  const itemWithKey: HistoryItem = {
    ...item,
    s3Key: item.s3Key || item.id, // Use s3Key or fallback to id
  }
  const updatedHistory = [itemWithKey, ...history.filter(h => h.id !== itemWithKey.id)]
  saveUploadHistory(updatedHistory)
}

export const removeFromUploadHistory = (id: string): void => {
  const history = getUploadHistory()
  const updatedHistory = history.filter(h => h.id !== id)
  saveUploadHistory(updatedHistory)
}

export const getUploadConfig = (): UploadConfig => {
  // Always return the same default config to avoid SSR hydration mismatch
  // localStorage customization can be implemented later if needed
  return {
    maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    maxFiles: UPLOAD_CONFIG.MAX_FILES,
    concurrentUploads: UPLOAD_CONFIG.CONCURRENT_UPLOADS,
  }
}

export const saveUploadConfig = (config: UploadConfig): void => {
  // Configuration is now read-only from config file
  // This function is kept for compatibility but does nothing
  return
}

