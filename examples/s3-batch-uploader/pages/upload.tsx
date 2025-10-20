import { useState, useEffect } from 'react'
import { CheckSquare, Square, Upload as UploadIcon, Trash2 } from 'lucide-react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { DropZone } from '../components/FileUpload/DropZone'
import { FilePreview } from '../components/FileUpload/FilePreview'
import { UploadConfigComponent } from '../components/FileUpload/UploadConfig'
import { Button } from '../components/UI/Button'
import { useFileUpload } from '../hooks/useFileUpload'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { UploadConfig } from '../types/upload'
import { getUploadConfig, saveUploadConfig } from '../lib/storage'
import MainLayout from '../components/Layout/MainLayout'

function UploadPage() {
  const { t } = useTranslation('common')
  const [config, setConfig] = useState<UploadConfig>(() => getUploadConfig())
  
  const {
    files,
    isUploading,
    addFiles,
    removeFile,
    toggleFileSelection,
    selectAll,
    deselectAll,
    clearFiles,
    startUpload,
    retryFile,
    cancelFile,
    closeErrorDialog,
  } = useFileUpload(config)

  // Save config changes to localStorage
  useEffect(() => {
    saveUploadConfig(config)
  }, [config])

  const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'uploading' || f.status === 'error')
  const completedFiles = files.filter(f => f.status === 'success')
  const selectedFiles = pendingFiles.filter(f => f.selected)
  const allSelected = pendingFiles.length > 0 && selectedFiles.length === pendingFiles.length
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < pendingFiles.length

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll()
    } else {
      selectAll()
    }
  }

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.file.size, 0)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('fileUpload')}</h1>
        <p className="text-gray-600">
          {t('fileUploadDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <DropZone
            onFilesSelected={addFiles}
            maxFiles={config.maxFiles}
            maxFileSize={config.maxFileSize}
            disabled={isUploading}
          />

          {/* Pending Files */}
          {pendingFiles.length > 0 && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {allSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : someSelected ? (
                        <div className="w-4 h-4 border-2 border-blue-600 rounded bg-blue-600 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      <span>
                        {allSelected ? t('deselectAll') : t('selectAll')}
                      </span>
                    </button>
                    
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      {t('selectedCount', { count: selectedFiles.length, size: formatFileSize(totalSize) })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={clearFiles}
                      disabled={isUploading}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('clear')}
                    </Button>
                    
                    <Button
                      variant="primary"
                      size="md"
                      onClick={startUpload}
                      disabled={selectedFiles.length === 0 || isUploading}
                      loading={isUploading}
                    >
                      <UploadIcon className="w-4 h-4 mr-2" />
                      {t('startUploadCount', { count: selectedFiles.length })}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pending Files Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pendingFiles.map((file) => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onToggleSelect={toggleFileSelection}
                    onRemove={removeFile}
                    onRetry={retryFile}
                    onCancel={cancelFile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Files */}
          {completedFiles.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('completedFiles', { count: completedFiles.length })}
                </h3>
                <div className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
                  {t('totalSize', { size: formatFileSize(completedFiles.reduce((sum, f) => sum + f.file.size, 0)) })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {completedFiles.map((file) => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onToggleSelect={() => {}} // 已完成文件不需要选择
                    onRemove={removeFile}
                    onRetry={() => {}} // 已完成文件不需要重试
                    onCancel={() => {}} // 已完成文件不需要取消
                    isCompleted={true} // 标识为已完成文件
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <UploadConfigComponent
              config={config}
              onConfigChange={setConfig}
            />
          </div>

          {/* Upload Statistics */}
          {files.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('uploadStatistics')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('totalFiles')}</span>
                  <span className="font-semibold text-gray-900">{files.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('selected')}</span>
                  <span className="font-semibold text-blue-600">{selectedFiles.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('uploadSuccessCount')}</span>
                  <span className="font-semibold text-green-600">
                    {files.filter(f => f.status === 'success').length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('uploadFailedCount')}</span>
                  <span className="font-semibold text-red-600">
                    {files.filter(f => f.status === 'error').length}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t('totalSizeLabel')}</span>
                  <span className="font-semibold text-gray-900">{formatFileSize(totalSize)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Upload() {
  return (
    <MainLayout>
      <UploadPage />
    </MainLayout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lng = locale || 'en'
  return {
    props: {
      ...(await serverSideTranslations(lng, ['common'])),
    },
  }
}