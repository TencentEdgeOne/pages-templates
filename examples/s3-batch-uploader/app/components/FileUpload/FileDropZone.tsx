'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage, FileVideo, Plus } from 'lucide-react'
import { Button } from '../UI/Button'

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function FileDropZone({ onFilesSelected, disabled = false }: FileDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles)
    setIsDragActive(false)
  }, [onFilesSelected])

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: true,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  })

  return (
    <div className="flat-card">
      <div
        {...getRootProps()}
        className={`
          drag-zone-minimal p-16 text-center cursor-pointer transition-all
          ${isDragActive ? 'drag-over' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          {/* 主图标 */}
          <div className="flex justify-center">
            <div className={`
              w-16 h-16 border-2 border-dashed flex items-center justify-center transition-colors
              ${isDragActive 
                ? 'border-gray-600 bg-gray-100' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}>
              <Upload className={`
                w-8 h-8 transition-colors
                ${isDragActive ? 'text-gray-600' : 'text-gray-400'}
              `} />
            </div>
          </div>

          {/* 文字内容 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {isDragActive ? '释放文件开始上传' : '拖拽文件到此处'}
            </h3>
            
            <p className="text-gray-600 max-w-md mx-auto">
              支持批量上传图片和视频文件，单个文件最大 100MB
            </p>

            {/* 支持的文件类型 */}
            <div className="flex justify-center space-x-8 py-4">
              <div className="flex items-center space-x-2">
                <FileImage className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">图片文件</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileVideo className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">视频文件</span>
              </div>
            </div>

            {/* 分割线 */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">或者</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* 上传按钮 */}
            <div>
              <Button
                onClick={open}
                disabled={disabled}
                className="flat-button-primary px-6 py-3 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                选择文件
              </Button>
            </div>

            {/* 提示信息 */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>支持格式：PNG, JPG, GIF, MP4, MOV, AVI</p>
              <p>文件将直接上传到 AWS S3 存储桶</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}