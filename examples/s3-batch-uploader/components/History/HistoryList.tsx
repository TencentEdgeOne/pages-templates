import { useState } from 'react'
import { Clock, Copy, Trash2, Eye, FileText, Image, Video, File, Check, Download } from 'lucide-react'
import { useTranslation } from '../../app/[locale]/i18n-provider'
import { HistoryItem } from '../../types/upload'

interface HistoryListProps {
  items: HistoryItem[]
  onDelete: (id: string) => void
  loading: boolean
  selectedItems: HistoryItem[]
  onItemSelect: (item: HistoryItem, selected: boolean) => void
  onSelectAll: () => void
  onClearSelection: () => void
}

export default function HistoryList({ 
  items, 
  onDelete, 
  loading,
  selectedItems,
  onItemSelect 
}: HistoryListProps) {
  const { t } = useTranslation('common')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />
    } else if (fileType.startsWith('video/')) {
      return <Video className="w-5 h-5 text-purple-500" />
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />
    } else {
      return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const isSelected = (item: HistoryItem) => {
    return selectedItems.some(selected => selected.id === item.id)
  }

  const handleItemClick = (item: HistoryItem) => {
    const selected = isSelected(item)
    onItemSelect(item, !selected)
  }

  const handleCopyUrl = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(item.s3Url)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000) // 2秒后重置状态
    } catch (err) {
      console.error('Failed to copy URL:', err)
      // 降级方案：选择文本
      const textArea = document.createElement('textarea')
      textArea.value = item.s3Url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">{t('loadingFiles')}</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('noFilesFound')}
        </h3>
        <p className="text-gray-500">
          {t('noFilesDescription')}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('fileList', { count: items.length })}
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`relative group border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  isSelected(item)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handleItemClick(item)}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected(item)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 bg-white group-hover:border-gray-400'
                  }`}>
                    {isSelected(item) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* File Preview */}
                <div className="mb-3 pt-6">
                  {item.fileType.startsWith('image/') ? (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.s3Url}
                        alt={item.fileName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(item.fileType)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm truncate" title={item.fileName}>
                    {item.fileName}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(item.fileSize)}</span>
                    <span>{formatDate(item.uploadTime)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <a
                      href={item.s3Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title={t('viewFile')}
                    >
                      <Eye className="w-3 h-3" />
                    </a>
                    <button
                      onClick={(e) => handleCopyUrl(item, e)}
                      className="p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:text-green-600 transition-colors"
                      title={t('copyLink')}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id)
                      }}
                      className="p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-600 hover:text-red-600 transition-colors"
                      title={t('deleteFile')}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected(item)
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleItemClick(item)}
              >
                {/* Selection Checkbox */}
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected(item)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300 bg-white'
                }`}>
                  {isSelected(item) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(item.fileType)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {item.fileName}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(item.fileSize)}</span>
                    <span>{formatDate(item.uploadTime)}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {t('uploaded')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <a
                    href={item.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    title={t('viewFile')}
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={(e) => handleCopyUrl(item, e)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title={t('copyLink')}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id)
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title={t('deleteFile')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}