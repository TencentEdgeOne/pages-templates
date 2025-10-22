'use client'

import { useCallback, useState } from 'react'
import { Upload, FileImage, FileVideo } from 'lucide-react'
import { clsx } from 'clsx'
import { useTranslation } from '../../app/[locale]/i18n-provider'
import { Button } from '../UI/Button'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  maxFiles: number
  maxFileSize: number
  accept?: string
  disabled?: boolean
}

export function DropZone({ 
  onFilesSelected, 
  maxFiles, 
  maxFileSize, 
  accept = 'image/*,video/*',
  disabled = false 
}: DropZoneProps) {
  const { t } = useTranslation('common')
  const [isDragOver, setIsDragOver] = useState(false)

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
    
    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles))
    }
  }, [onFilesSelected, maxFiles, disabled])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles))
    }
    // Reset input value to allow selecting the same files again
    e.target.value = ''
  }, [onFilesSelected, maxFiles])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        disabled={disabled}
        id="file-upload"
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
            {t('dropZoneTitle')}
          </h3>
          <p className={clsx(
            'text-sm',
            {
              'text-gray-600': !disabled,
              'text-gray-400': disabled,
            }
          )}>
            {t('dropZoneSubtitle')}
          </p>
        </div>
        
        <Button
          variant="primary"
          size="md"
          disabled={disabled}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {t('selectFiles')}
        </Button>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FileImage className="w-4 h-4" />
            <span>{t('image')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileVideo className="w-4 h-4" />
            <span>{t('video')}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
          <p>{t('maxFilesLimit', { count: maxFiles })} <span className="text-gray-400 mx-2">|</span> {t('maxFileSizeLimit', { size: formatFileSize(maxFileSize) })}</p>
          <p>{t('supportedFormats', { formats: 'JPG、PNG、GIF、WebP、MP4、WebM、MOV' })}</p>
        </div>
      </div>
    </div>
  )
}