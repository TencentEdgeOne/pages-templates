'use client'

import { CheckCircle, XCircle, RotateCcw, X } from 'lucide-react'
import { Progress } from '../UI/Progress'
import { Button } from '../UI/Button'
import { FileStatus } from '../../types/upload'

interface ProgressOverlayProps {
  status: FileStatus
  progress: number
  error?: string
  onRetry?: () => void
  onCancel?: () => void
  onClose?: () => void
}

export function ProgressOverlay({
  status,
  progress,
  error,
  onRetry,
  onCancel,
  onClose,
}: ProgressOverlayProps) {
  if (status === 'pending' || status === 'success') {
    return null
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-3 shadow-xl max-w-xs w-full mx-2 relative">
        {/* 关闭按钮 */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}

        {status === 'uploading' && (
          <div className="text-center space-y-2">
            <div className="text-sm font-medium text-gray-900">上传中...</div>
            <Progress value={progress} showPercentage />
            <div className="flex justify-center">
              {onCancel && (
                <Button size="sm" variant="ghost" onClick={onCancel} className="text-[10px] px-2 py-1 h-6">
                  <XCircle className="w-3 h-3 max-[700px]:mr-0 min-[701px]:mr-1" />
                  <span className="max-[700px]:hidden">取消</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-sm font-medium text-gray-900">上传失败</div>
            <div className="flex justify-center">
              {onRetry && (
                <Button size="sm" variant="primary" onClick={onRetry} className="text-xs px-3 py-1.5 h-7">
                  <RotateCcw className="w-3 h-3 max-[700px]:mr-0 min-[701px]:mr-1" />
                  <span className="max-[700px]:hidden">重试</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}