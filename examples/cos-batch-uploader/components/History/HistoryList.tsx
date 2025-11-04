'use client'

import { useState, useEffect } from 'react'
import { Clock, Copy, Trash2, Eye, FileText, Image, Video, File, Check, Download, Grid3X3, List } from 'lucide-react'
import { HistoryItem } from '../../types/upload'
import { usePresignedUrl } from '../../hooks/usePresignedUrl'

interface HistoryListProps {
  items: HistoryItem[]
  onDelete: (id: string) => void
  loading?: boolean
  selectedItems: HistoryItem[]
  onItemSelect: (item: HistoryItem, selected: boolean) => void
  onSelectAll: () => void
  onClearSelection: () => void
}

export default function HistoryList({
  items,
  onDelete,
  loading = false,
  selectedItems,
  onItemSelect,
  onSelectAll,
  onClearSelection,
}: HistoryListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [itemsWithUrls, setItemsWithUrls] = useState<HistoryItem[]>([])
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [isProcessingUrls, setIsProcessingUrls] = useState(false)
  const { getBatchPresignedUrls } = usePresignedUrl()


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isSelected = (item: HistoryItem) => {
    return selectedItems.some(selected => selected.id === item.id)
  }

  const handleItemClick = (item: HistoryItem) => {
    const selected = isSelected(item)
    onItemSelect(item, !selected)
  }

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev)
      newSet.add(itemId)
      return newSet
    })
  }

  // Load presigned URLs
  useEffect(() => {
    const loadPresignedUrls = async () => {
      if (items.length === 0) {
        setItemsWithUrls([])
        setIsProcessingUrls(false)
        return
      }

      setIsProcessingUrls(true)

      try {
        const s3Keys = items.map(item => item.s3Key).filter(Boolean)
        
        if (s3Keys.length === 0) {
          setItemsWithUrls(items)
          setIsProcessingUrls(false)
          return
        }

        const presignedUrls = await getBatchPresignedUrls(s3Keys)
        
        const updatedItems = items.map(item => ({
          ...item,
          s3Url: presignedUrls[item.s3Key] || '',
        }))
        setItemsWithUrls(updatedItems)
      } catch (error) {
        console.error('Failed to load presigned URLs:', error)
        // If getting presigned URLs fails, still show file list but without image preview
        setItemsWithUrls(items.map(item => ({ ...item, s3Url: '' })))
      } finally {
        setIsProcessingUrls(false)
      }
    }

    loadPresignedUrls()
  }, [items, getBatchPresignedUrls])

  const handleCopyLink = async (item: HistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.s3Url || '')
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = item.s3Url || ''
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-green-500" />
    } else if (fileType.startsWith('video/')) {
      return <Video className="w-5 h-5 text-blue-500" />
    } else {
      return <File className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading || isProcessingUrls) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">
            Loading file list...
          </span>
        </div>
      </div>
    )
  }

  if (itemsWithUrls.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No file records found
          </h3>
          <p className="text-gray-500">
            No files have been uploaded yet, or no files match the current filter criteria
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            File List {itemsWithUrls.length} files
          </h3>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {itemsWithUrls.map((item) => (
              <div
                key={item.id}
                className={`relative group bg-white rounded-lg border-2 overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                  isSelected(item) ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleItemClick(item)}
              >
                {/* Selection checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected(item) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-white border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {isSelected(item) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.s3Url && (
                    <a
                      href={item.s3Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="Preview File"
                    >
                      <Eye className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyLink(item)
                    }}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 text-gray-600 hover:text-green-600 transition-colors"
                    title="Copy Link"
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
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-gray-200 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* File preview area */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {item.fileType.startsWith('image/') ? (
                    item.s3Url && !imageErrors.has(item.id) ? (
                      <img
                        src={item.s3Url}
                        alt={item.fileName}
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.log('Image load error for:', item.fileName, item.s3Url)
                          handleImageError(item.id)
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Image className="w-12 h-12 mb-2" />
                        <span className="text-xs">Image</span>
                        {!item.s3Url && <span className="text-xs text-red-400 mt-1">No URL</span>}
                        {imageErrors.has(item.id) && <span className="text-xs text-red-400 mt-1">Load Error</span>}
                      </div>
                    )
                  ) : item.fileType.startsWith('video/') ? (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Video className="w-12 h-12 mb-2" />
                      <span className="text-xs">Video File</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <File className="w-12 h-12 mb-2" />
                      <span className="text-xs">File</span>
                    </div>
                  )}
                </div>

                {/* File information */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-1" title={item.fileName}>
                    {item.fileName}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(item.fileSize)}</span>
                    <span>{new Date(item.uploadTime).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {itemsWithUrls.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border-2 ${
                  isSelected(item) ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  {getFileIcon(item.fileType)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.fileName}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatFileSize(item.fileSize)}</span>
                      <span>{new Date(item.uploadTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.s3Url && (
                    <a
                      href={item.s3Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="Preview File"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  {item.s3Url && (
                    <a
                      href={item.s3Url}
                      download={item.fileName}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyLink(item)
                    }}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Copy Link"
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
                    title="Delete File"
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