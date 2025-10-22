'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from '../app/[locale]/i18n-provider'

interface FileWithProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}

export default function FileUploader() {
  const { t } = useTranslation('common')
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.csv'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar']
    }
  })

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    
    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i]
      if (fileItem.status !== 'pending') continue

      try {
        // Update status to uploading
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, status: 'uploading' } : f
        ))

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setFiles(prev => prev.map((f, index) => 
            index === i ? { ...f, progress } : f
          ))
        }

        // Simulate successful upload
        const mockUrl = `https://your-bucket.s3.amazonaws.com/${fileItem.file.name}`
        setFiles(prev => prev.map((f, index) => 
          index === i ? { 
            ...f, 
            status: 'completed',
            progress: 100,
            url: mockUrl
          } : f
        ))

      } catch (error) {
        setFiles(prev => prev.map((f, index) => 
          index === i ? { 
            ...f, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f
        ))
      }
    }

    setIsUploading(false)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-500'
      case 'uploading': return 'text-blue-500'
      case 'completed': return 'text-green-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('fileStatus.pending')
      case 'uploading': return t('fileStatus.uploading')
      case 'completed': return t('fileStatus.success')
      case 'error': return t('fileStatus.error')
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-lg font-medium text-gray-900">
            {isDragActive ? t('dropZoneTitle') : t('dropZoneTitle')}
          </div>
          <p className="text-gray-500">{t('dropZoneSubtitle')}</p>
          <p className="text-sm text-gray-400">{t('supportedFormats', { formats: 'JPG、PNG、GIF、WebP、MP4、WebM、MOV' })}</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {t('selectedFiles')} ({files.length})
            </h3>
            <div className="space-x-2">
              <button
                onClick={uploadFiles}
                disabled={isUploading || files.every(f => f.status === 'completed')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? t('uploading') : t('startUpload')}
              </button>
              <button
                onClick={clearAll}
                disabled={isUploading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('clear')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {files.map((fileItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {fileItem.progress}% {t('uploaded')}
                      </p>
                    </div>
                  )}
                  
                  {fileItem.url && (
                    <div className="mt-2">
                      <a
                        href={fileItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {t('viewFile')}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${getStatusColor(fileItem.status)}`}>
                    {getStatusText(fileItem.status)}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    disabled={fileItem.status === 'uploading'}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}