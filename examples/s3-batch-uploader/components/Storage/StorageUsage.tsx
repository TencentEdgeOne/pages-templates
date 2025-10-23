'use client'

import { useStorageInfo } from '../../hooks/useStorageInfo'
import { useTranslation } from '../../app/[locale]/i18n-provider'
import { HardDrive, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface StorageUsageProps {
  className?: string
  showDetails?: boolean
}

export function StorageUsage({ className, showDetails = true }: StorageUsageProps) {
  const { t } = useTranslation()
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
          <h3 className="font-medium text-red-900">存储信息获取失败</h3>
        </div>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={refreshStorageInfo}
          className="text-sm text-red-600 hover:text-red-800 underline"
        >
          重试
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
        {/* 使用情况文字显示 */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">已用空间</span>
          <span className="font-medium text-gray-900">
            {formatFileSize(storageInfo.totalSize)} / {formatFileSize(storageInfo.maxSize)} ({storageInfo.usagePercentage}%)
          </span>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={clsx('h-2 rounded-full transition-all duration-300', getProgressBarColor(storageInfo.status))}
            style={{ width: `${Math.min(storageInfo.usagePercentage, 100)}%` }}
          ></div>
        </div>

        {/* 剩余空间 */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">剩余空间</span>
          <span className="font-medium text-gray-900">
            {formatFileSize(storageInfo.remainingSize)}
          </span>
        </div>

        {showDetails && (
          <>
            {/* 文件统计 */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">文件数量</span>
              <span className="font-medium text-gray-900">{storageInfo.totalCount} 个</span>
            </div>


          </>
        )}

        {/* 刷新按钮 */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={refreshStorageInfo}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            🔄 刷新存储信息
          </button>
        </div>
      </div>
    </div>
  )
}