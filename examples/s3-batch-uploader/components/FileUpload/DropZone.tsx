'use client'

import { useCallback, useState } from 'react'
import { Upload, FileImage, FileVideo, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '../UI/Button'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  maxFiles: number
  maxFileSize: number
  accept?: string
  disabled?: boolean
}

interface StorageCheckResult {
  allowed: boolean
  message?: string
  details?: {
    currentUsage: number
    uploadSize: number
    maxSize: number
    remainingSize: number
  }
}

export function DropZone({ 
  onFilesSelected, 
  maxFiles, 
  maxFileSize, 
  accept = 'image/*,video/*',
  disabled = false 
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [isCheckingStorage, setIsCheckingStorage] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled || isCheckingStorage) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFilesWithStorageCheck(files)
    }
  }, [disabled, isCheckingStorage])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFilesWithStorageCheck(files)
    }
    // Reset input value to allow selecting the same files again
    e.target.value = ''
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 检查存储容量
  const checkStorageCapacity = async (files: File[]): Promise<StorageCheckResult> => {
    try {
      const totalUploadSize = files.reduce((sum, file) => sum + file.size, 0)
      
      // 调用存储使用API检查当前使用情况
      const response = await fetch('/api/storage-usage')
      if (!response.ok) {
        throw new Error('Failed to check storage usage')
      }
      
      const storageInfo = await response.json()
      const totalAfterUpload = storageInfo.totalSize + totalUploadSize
      
      if (totalAfterUpload > storageInfo.maxSize) {
        const usedMB = Math.round(storageInfo.totalSize / (1024 * 1024))
        const uploadMB = Math.round(totalUploadSize / (1024 * 1024))
        const maxMB = Math.round(storageInfo.maxSize / (1024 * 1024))
        
        const message = `Insufficient storage space! Currently used ${usedMB}MB, attempting to upload ${uploadMB}MB, will exceed ${maxMB}MB limit. Please clean up some files first.`
        
        return {
          allowed: false,
          message: message,
          details: {
            currentUsage: storageInfo.totalSize,
            uploadSize: totalUploadSize,
            maxSize: storageInfo.maxSize,
            remainingSize: storageInfo.remainingSize
          }
        }
      }
      
      return { allowed: true }
    } catch (error) {
      console.error('Error checking storage capacity:', error)
      // 如果检查失败，允许上传但显示警告
      return { 
        allowed: true, 
        message: 'Unable to check storage capacity, please upload with caution'
      }
    }
  }

  // 处理文件选择（包含存储检查）
  const handleFilesWithStorageCheck = async (files: File[]) => {
    if (files.length === 0) return
    
    setIsCheckingStorage(true)
    setStorageError(null)
    
    try {
      const storageCheck = await checkStorageCapacity(files)
      
      if (!storageCheck.allowed) {
        setStorageError(storageCheck.message || 'Insufficient storage space')
        return
      }
      
      // 存储检查通过，继续文件选择流程
      onFilesSelected(files.slice(0, maxFiles))
    } catch (error) {
      console.error('Storage check error:', error)
      setStorageError('Storage check failed, please try again')
    } finally {
      setIsCheckingStorage(false)
    }
  }

  return (
    <div
      className={clsx(
        'relative clean-drag-zone p-10 text-center transition-all',
        {
          'hover:border-blue-400': !isDragOver && !disabled,
          'drag-over': isDragOver && !disabled,
          'opacity-60 cursor-not-allowed': disabled,
        }
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed pointer-events-auto"
        disabled={disabled || isCheckingStorage}
        id="file-upload"
        title="Click to select files"
        aria-label="Select files to upload"
      />
      
      <div className="space-y-5">
        <div className="flex justify-center">
          <div className={clsx(
            'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
            {
              'bg-gray-100': !isDragOver && !disabled,
              'bg-blue-100': isDragOver && !disabled,
              'bg-gray-50': disabled,
            }
          )}>
            <Upload className={clsx(
              'w-8 h-8',
              {
                'text-gray-500': !isDragOver && !disabled,
                'text-blue-600': isDragOver && !disabled,
                'text-gray-400': disabled,
              }
            )} />
          </div>
        </div>
        
        <div>
          <h3 className={clsx(
            'text-lg font-medium mb-1',
            {
              'text-gray-900': !disabled,
              'text-gray-400': disabled,
            }
          )}>
            Drag files here
          </h3>
          <p className={clsx(
            'text-sm',
            {
              'text-gray-600': !disabled,
              'text-gray-400': disabled,
            }
          )}>
            or click to select files
          </p>
        </div>
        
        <Button
          variant="primary"
          size="md"
          disabled={disabled || isCheckingStorage}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isCheckingStorage ? 'Checking storage space...' : 'Select Files'}
        </Button>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FileImage className="w-4 h-4" />
            <span>Image</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileVideo className="w-4 h-4" />
            <span>Video</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
          <p>Max files: {maxFiles} <span className="text-gray-400 mx-2">|</span> Max file size: {formatFileSize(maxFileSize)}</p>
          <p>Supported formats: JPG, PNG, GIF, WebP, MP4, WebM, MOV</p>
        </div>

        {/* 存储错误提示 */}
        {storageError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg relative z-10 pointer-events-auto">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">Insufficient Storage</h4>
                <p className="text-sm text-red-700">{storageError}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setStorageError(null)
                  }}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Close Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}