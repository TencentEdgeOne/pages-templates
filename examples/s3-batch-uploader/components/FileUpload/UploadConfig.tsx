'use client'

import { Settings } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import { UploadConfig } from '../../types/upload'
import { formatFileSize } from '../../lib/upload-utils'

interface UploadConfigProps {
  config: UploadConfig
  onConfigChange: (config: UploadConfig) => void
}

export function UploadConfigComponent({ config, onConfigChange }: UploadConfigProps) {
  const { t } = useTranslation('common')
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('uploadConfig.title')}</h3>

      <div className="space-y-3">
        {/* Configuration Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">{t('uploadConfig.maxFileSize')}</span>
            <span className="text-gray-900 font-medium">{formatFileSize(config.maxFileSize)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">{t('uploadConfig.maxFiles')}</span>
            <span className="text-gray-900 font-medium">{config.maxFiles} {t('uploadConfig.filesUnit')}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">{t('uploadConfig.concurrentUploads')}</span>
            <span className="text-gray-900 font-medium">{config.concurrentUploads} {t('uploadConfig.filesUnit')}</span>
          </div>
        </div>

        {/* Upload Method Info */}
        <div className="pt-3 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="font-semibold text-blue-800">{t('uploadConfig.uploadMethod')}</div>
            </div>
            <div className="text-sm text-blue-700">
              {t('uploadConfig.uploadMethodDescription')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}