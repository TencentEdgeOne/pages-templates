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

  // Get single presigned URL
  const getPresignedUrl = useCallback(async (s3Key: string, expiresIn: number = 300): Promise<string> => {
    // Check cache
    const cached = cache.current[s3Key]
    if (cached && cached.expiresAt > Date.now() + 30000) { // Expire 30 seconds early
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
      
      // Cache result
      cache.current[s3Key] = {
        url: presignedUrl,
        expiresAt: Date.now() + (expiresIn * 1000) - 30000, // Expire 30 seconds early
      }

      return presignedUrl
    } catch (error) {
      console.error('Error getting presigned URL:', error)
      throw error
    }
  }, [])

  // Batch get presigned URLs
  const getBatchPresignedUrls = useCallback(async (s3Keys: string[], expiresIn: number = 300): Promise<Record<string, string>> => {
    if (s3Keys.length === 0) return {}

    setLoading(true)
    
    try {
      // Check which URLs need to be refetched
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

      // If all URLs are cached, return directly
      if (keysToFetch.length === 0) {
        return cachedUrls
      }

      // Get new presigned URLs
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
      
      // Cache newly fetched URLs
      Object.entries(presignedUrls).forEach(([key, url]) => {
        cache.current[key] = {
          url: url as string,
          expiresAt: Date.now() + (expiresIn * 1000) - 30000,
        }
      })

      // Merge cached and newly fetched URLs
      return { ...cachedUrls, ...presignedUrls }
    } catch (error) {
      console.error('Error getting batch presigned URLs:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Clear cache
  const clearCache = useCallback(() => {
    cache.current = {}
  }, [])

  // Clear expired cache
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
    // Force refresh all presigned URLs
    forceRefresh: () => {
      clearCache()
      // Trigger refetch
      window.location.reload()
    }
  }
}