'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Play, Image as ImageIcon, FileText, Trash2, RotateCcw, Square, CheckSquare, X } from 'lucide-react'
import { UploadFile, FileStatus } from '../../types/upload'
import { formatFileSize } from '../../lib/upload-utils'
import { ProgressOverlay } from './ProgressOverlay'
import { Button } from '../UI/Button'

interface FilePreviewProps {
  file: UploadFile
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  onCancel: (id: string) => void
  onToggleSelect: (id: string) => void
  isCompleted?: boolean // 新增：标识是否为已完成文件
}

export function FilePreview({
  file,
  onRemove,
  onRetry,
  onCancel,
  onToggleSelect,
  isCompleted = false
}: FilePreviewProps) {
  const [imageError, setImageError] = useState(false)

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusClass = (status: FileStatus) => {
    switch (status) {
      case 'success':
        return 'status-success'
      case 'error':
        return 'status-error'
      case 'uploading':
        return 'status-info'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getFileIcon = () => {
    if (file.file.type.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-gray-500" />
    } else if (file.file.type.startsWith('video/')) {
      return <Play className="w-6 h-6 text-gray-500" />
    } else {
      return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const renderPreview = () => {
    if (file.file.type.startsWith('image/') && file.preview && !imageError) {
      return (
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-full h-full object-cover rounded-lg"
          onError={() => setImageError(true)}
        />
      )
    } else if (file.file.type.startsWith('video/') && file.preview) {
      return (
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={file.preview}
            alt={`${file.file.name} 预览`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-gray-800 ml-0.5" />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {getFileIcon()}
        </div>
      )
    }
  }

  return (
    <div className={`
      relative bg-white border rounded-lg overflow-hidden transition-all duration-200 shadow-sm
      ${file.selected ? 'selected-minimal border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}
    `}>
      {/* 文件预览区域 */}
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        {renderPreview()}
        
        {/* 左上角勾选按钮 - 待上传文件显示，默认勾选 */}
        {!isCompleted && file.status !== 'uploading' && (
          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={() => onToggleSelect(file.id)}
              className={`
                w-6 h-6 rounded border-2 flex items-center justify-center transition-all shadow-sm
                ${file.selected 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-white border-gray-300 hover:border-blue-400'
                }
              `}
            >
              {file.selected ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : null}
            </button>
          </div>
        )}

        {/* 上传进度蒙板 - 使用专用的ProgressOverlay组件，确保在最上层 */}
        <ProgressOverlay
          status={file.status}
          progress={file.progress}
          error={file.error}
          onRetry={() => onRetry(file.id)}
          onCancel={() => onCancel(file.id)}
        />
      </div>

      {/* 底部文件名区域 */}
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p 
              className="text-sm font-medium text-gray-900 truncate"
              title={file.file.name}
            >
              {file.file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.file.size)}
            </p>
          </div>
          
          {/* 操作按钮 - 只在非上传状态显示 */}
          {file.status !== 'uploading' && !isCompleted && (
            <div className="flex items-center space-x-1 ml-2">
              {file.status === 'error' && (
                <button
                  onClick={() => onRetry(file.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="重试上传"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onRemove(file.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="删除文件"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 成功状态提示 - 已完成文件 */}
        {isCompleted && file.status === 'success' && (
          <div className="flex items-center space-x-2 mt-2 p-2 bg-green-50 rounded border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-700 font-medium">上传成功</span>
          </div>
        )}
      </div>
    </div>
  )
}