import { HistoryItem, UploadConfig } from '../types/upload'

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
    return {
      maxFileSize: 104857600, // 100MB
      maxFiles: 20,
      concurrentUploads: 3,
    }
  }
  
  try {
    const config = localStorage.getItem(STORAGE_KEYS.UPLOAD_CONFIG)
    return config ? JSON.parse(config) : {
      maxFileSize: 104857600, // 100MB
      maxFiles: 20,
      concurrentUploads: 3,
    }
  } catch (error) {
    console.error('Error reading upload config:', error)
    return {
      maxFileSize: 104857600, // 100MB
      maxFiles: 20,
      concurrentUploads: 3,
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

