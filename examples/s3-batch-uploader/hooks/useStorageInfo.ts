'use client'

import { useState, useEffect, useCallback } from 'react'
import { storageRefreshManager } from './useStorageRefresh'

export interface StorageInfo {
  totalSize: number
  totalCount: number
  maxSize: number
  remainingSize: number
  usagePercentage: number
  status: 'normal' | 'warning' | 'danger'
  message: string
  estimatedRemainingFiles: number
  files: Array<{
    key: string
    size: number
    lastModified: Date
  }>
}

interface UseStorageInfoReturn {
  storageInfo: StorageInfo | null
  loading: boolean
  error: string | null
  refreshStorageInfo: () => Promise<void>
}

export function useStorageInfo(): UseStorageInfoReturn {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStorageInfo = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/storage-usage')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setStorageInfo(data)
    } catch (err) {
      console.error('Error fetching storage info:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch storage info')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshStorageInfo = useCallback(async () => {
    await fetchStorageInfo()
  }, [fetchStorageInfo])

  useEffect(() => {
    fetchStorageInfo()
    
    // 监听存储刷新事件
    const unsubscribe = storageRefreshManager.subscribe(() => {
      fetchStorageInfo()
    })
    
    return unsubscribe
  }, [fetchStorageInfo])

  return {
    storageInfo,
    loading,
    error,
    refreshStorageInfo
  }
}