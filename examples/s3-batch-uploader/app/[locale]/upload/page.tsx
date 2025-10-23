'use client'

import { useState, useEffect } from 'react'
import { Upload as UploadIcon, Trash2 } from 'lucide-react'
import { useTranslation } from '../i18n-provider'
import { DropZone } from '../../../components/FileUpload/DropZone'
import { FilePreview } from '../../../components/FileUpload/FilePreview'
import { UploadConfigComponent } from '../../../components/FileUpload/UploadConfig'
import { Button } from '../../../components/UI/Button'
import { useFileUpload } from '../../../hooks/useFileUpload'
import { useStorageRefresh } from '../../../hooks/useStorageRefresh'
import { UploadConfig } from '../../../types/upload'
import { getUploadConfig, saveUploadConfig } from '../../../lib/storage'
import MainLayout from '../../../components/Layout/MainLayout'

function UploadPage() {
  const { t } = useTranslation()
  const [config, setConfig] = useState<UploadConfig>(() => getUploadConfig())
  const { refreshStorage } = useStorageRefresh()
  
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
  } = useFileUpload(config)

  useEffect(() => {
    saveUploadConfig(config)
  }, [config])

  // 监听上传完成，刷新存储信息
  useEffect(() => {
    const completedCount = files.filter(f => f.status === 'success').length
    const errorCount = files.filter(f => f.status === 'error').length
    const uploadingCount = files.filter(f => f.status === 'uploading').length
    
    // 如果有文件上传完成且没有正在上传的文件，刷新存储信息
    if (completedCount > 0 && uploadingCount === 0 && !isUploading) {
      refreshStorage()
    }
  }, [files, isUploading, refreshStorage])

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
    <div className="p-6 max-w-7xl min-w-[1000px] mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('fileUpload')}</h1>
        <p className="text-gray-600">{t('fileUploadDescription')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DropZone
            onFilesSelected={addFiles}
            maxFiles={config.maxFiles}
            maxFileSize={config.maxFileSize}
            disabled={isUploading}
          />

          {pendingFiles.length > 0 && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {allSelected ? (
                        <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : someSelected ? (
                        <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-white rounded-sm" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded hover:border-blue-600 transition-colors" />
                      )}
                      <span>{allSelected ? t('deselectAll') : t('selectAll')}</span>
                    </button>
                    
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      {t('selectedCount', { count: selectedFiles.length, size: formatFileSize(totalSize) })}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" onClick={clearFiles} disabled={isUploading}>
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
                      {t('startUpload')}
                    </Button>
                  </div>
                </div>
              </div>

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
                    onToggleSelect={() => {}}
                    onRemove={removeFile}
                    onRetry={() => {}}
                    onCancel={() => {}}
                    isCompleted={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <UploadConfigComponent config={config} onConfigChange={setConfig} />
          </div>

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