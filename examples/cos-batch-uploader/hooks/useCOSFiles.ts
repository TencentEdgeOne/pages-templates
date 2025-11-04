import { useState, useEffect, useCallback } from 'react'
import { HistoryItem, S3FilesResponse } from '../types/upload'

interface UseCOSFilesOptions {
  prefix?: string
  maxKeys?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useCOSFiles(options: UseCOSFilesOptions = {}) {
  const {
    prefix = '',
    maxKeys = 1000,
    autoRefresh = false,
    refreshInterval = 30000 // 30秒
  } = options

  const [files, setFiles] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextContinuationToken, setNextContinuationToken] = useState<string | null>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const fetchFiles = useCallback(async (continuationToken?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.set('prefix', prefix)
      // 提供两个参数: pageSize用于Edge, maxKeys用于本地API
      params.set('pageSize', maxKeys.toString())
      params.set('maxKeys', maxKeys.toString())

      if (continuationToken) {
        params.append('continuationToken', continuationToken)
      }

      const localUrl = `/api/cos-files?${params.toString()}`
      const response = await fetch(localUrl)
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch COS files'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // 如果响应不是JSON,使用状态文本
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data: S3FilesResponse = await response.json()

      if (continuationToken) {
        // 追加更多文件(分页加载)
        setFiles(prev => [...prev, ...data.files])
      } else {
        // 替换所有文件(刷新)
        setFiles(data.files)
      }

      setNextContinuationToken(data.nextContinuationToken)
      setIsTruncated(data.isTruncated)

    } catch (err) {
      console.error('Error fetching COS files:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [prefix, maxKeys])

  const refreshFiles = useCallback(() => {
    fetchFiles()
  }, [fetchFiles])

  const loadMoreFiles = useCallback(() => {
    if (nextContinuationToken && !loading) {
      fetchFiles(nextContinuationToken)
    }
  }, [nextContinuationToken, loading, fetchFiles])

  const deleteFile = useCallback(async (s3Key: string) => {
    try {
      const localDel = `/api/cos-files?key=${encodeURIComponent(s3Key)}`
      const response = await fetch(localDel, { method: 'DELETE' })

      if (!response.ok) {
        let errorMessage = 'Failed to delete file'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // 从本地状态中移除文件
      setFiles(prev => prev.filter(file => file.s3Key !== s3Key))

      return true
    } catch (err) {
      console.error('Error deleting COS file:', err)
      throw err
    }
  }, [])

  // 初始加载
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return

    const interval = setInterval(() => {
      refreshFiles()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refreshFiles])

  return {
    files,
    loading,
    error,
    isTruncated,
    hasMore: isTruncated && !!nextContinuationToken,
    refreshFiles,
    loadMoreFiles,
    deleteFile,
  }
}
