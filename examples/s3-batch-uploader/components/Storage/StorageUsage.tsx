'use client'

import { useStorageInfo } from '../../hooks/useStorageInfo'

import { HardDrive, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface StorageUsageProps {
  className?: string
  showDetails?: boolean
}

export function StorageUsage({ className, showDetails = true }: StorageUsageProps) {
  const { storageInfo, loading, error, refreshStorageInfo } = useStorageInfo()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'danger':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <HardDrive className="w-5 h-5 text-gray-500" />
    }
  }

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'danger':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className={clsx('bg-white rounded-lg border border-gray-200 p-4', className)}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={clsx('bg-white rounded-lg border border-red-200 p-4', className)}>
        <div className="flex items-center space-x-3 mb-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <h3 className="font-medium text-red-900">Failed to load storage info</h3>
        </div>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={refreshStorageInfo}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!storageInfo) {
    return null
  }

  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200 p-4', className)}>

      <div className="space-y-3">
        {/* Usage text display */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Used Space</span>
          <span className="font-medium text-gray-900">
            {formatFileSize(storageInfo.totalSize)} / {formatFileSize(storageInfo.maxSize)} ({storageInfo.usagePercentage}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={clsx('h-2 rounded-full transition-all duration-300', getProgressBarColor(storageInfo.status))}
            style={{ width: `${Math.min(storageInfo.usagePercentage, 100)}%` }}
          ></div>
        </div>

        {/* Remaining space */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Remaining Space</span>
          <span className="font-medium text-gray-900">
            {formatFileSize(storageInfo.remainingSize)}
          </span>
        </div>

        {showDetails && (
          <>
            {/* File statistics */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">File Count</span>
              <span className="font-medium text-gray-900">{storageInfo.totalCount} files</span>
            </div>
          </>
        )}

        {/* Refresh button */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={refreshStorageInfo}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            🔄 Refresh Storage Info
          </button>
        </div>

        {/* Auto-cleanup notice */}
        <div className="mt-2">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Auto-cleanup Notice:</strong> Uploaded files will be automatically removed after 24 hours. Please backup important files promptly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}