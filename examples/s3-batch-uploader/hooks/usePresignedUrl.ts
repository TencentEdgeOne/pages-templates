'use client'

import { useState, useCallback, useRef } from 'react'

interface PresignedUrlCache {
  [key: string]: {
    url: string
    expiresAt: number
  }
}

export function usePresignedUrl() {
  const [loading, setLoading] = useState(false)
  const cache = useRef<PresignedUrlCache>({})

  // 获取单个预签名 URL
  const getPresignedUrl = useCallback(async (s3Key: string, expiresIn: number = 300): Promise<string> => {
    // 检查缓存
    const cached = cache.current[s3Key]
    if (cached && cached.expiresAt > Date.now() + 30000) { // 提前30秒过期
      return cached.url
    }

    try {
      const response = await fetch('/api/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: s3Key,
          expiresIn,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get presigned URL')
      }

      const { presignedUrl } = await response.json()
      
      // 缓存结果
      cache.current[s3Key] = {
        url: presignedUrl,
        expiresAt: Date.now() + (expiresIn * 1000) - 30000, // 提前30秒过期
      }

      return presignedUrl
    } catch (error) {
      console.error('Error getting presigned URL:', error)
      throw error
    }
  }, [])

  // 批量获取预签名 URL
  const getBatchPresignedUrls = useCallback(async (s3Keys: string[], expiresIn: number = 300): Promise<Record<string, string>> => {
    if (s3Keys.length === 0) return {}

    setLoading(true)
    
    try {
      // 检查哪些 URL 需要重新获取
      const keysToFetch: string[] = []
      const cachedUrls: Record<string, string> = {}

      s3Keys.forEach(key => {
        const cached = cache.current[key]
        if (cached && cached.expiresAt > Date.now() + 30000) {
          cachedUrls[key] = cached.url
        } else {
          keysToFetch.push(key)
        }
      })

      // 如果所有 URL 都已缓存，直接返回
      if (keysToFetch.length === 0) {
        return cachedUrls
      }

      // 获取新的预签名 URL
      const response = await fetch('/api/presigned-url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s3Keys: keysToFetch,
          expiresIn,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get batch presigned URLs')
      }

      const data = await response.json()
      const presignedUrls = data.presignedUrls || {}
      
      // 缓存新获取的 URL
      Object.entries(presignedUrls).forEach(([key, url]) => {
        cache.current[key] = {
          url: url as string,
          expiresAt: Date.now() + (expiresIn * 1000) - 30000,
        }
      })

      // 合并缓存的和新获取的 URL
      return { ...cachedUrls, ...presignedUrls }
    } catch (error) {
      console.error('Error getting batch presigned URLs:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // 清除缓存
  const clearCache = useCallback(() => {
    cache.current = {}
  }, [])

  // 清除过期缓存
  const clearExpiredCache = useCallback(() => {
    const now = Date.now()
    Object.keys(cache.current).forEach(key => {
      if (cache.current[key].expiresAt <= now) {
        delete cache.current[key]
      }
    })
  }, [])

  return {
    getPresignedUrl,
    getBatchPresignedUrls,
    clearCache,
    clearExpiredCache,
    loading,
    // 强制刷新所有预签名 URL
    forceRefresh: () => {
      clearCache()
      // 触发重新获取
      window.location.reload()
    }
  }
}