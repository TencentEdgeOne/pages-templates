'use client'

import { Settings } from 'lucide-react'

import { UploadConfig } from '../../types/upload'
import { formatFileSize } from '../../lib/utils'
import { UPLOAD_CONFIG } from '../../config/upload'
import { StorageUsage } from '../Storage/StorageUsage'

interface UploadConfigProps {
  config: UploadConfig
  onConfigChange: (config: UploadConfig) => void
}

export function UploadConfigComponent({ config, onConfigChange }: UploadConfigProps) {
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Configuration</h3>

      <div className="space-y-3">
        {/* Configuration Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">Max File Size</span>
            <span className="text-gray-900 font-medium">{formatFileSize(config.maxFileSize)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">Max Files</span>
            <span className="text-gray-900 font-medium">{config.maxFiles} files</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">Concurrent Uploads</span>
            <span className="text-gray-900 font-medium">{config.concurrentUploads} files</span>
          </div>
        </div>

        {/* Storage Usage Display */}
        <div className="pt-3">
          <StorageUsage />
        </div>

        {/* Upload Method Info */}
        <div className="pt-3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="font-semibold text-blue-800">Upload Method</div>
            </div>
            <div className="text-sm text-blue-700">
              Direct upload to COS using pre-signed URLs, secure and efficient
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}