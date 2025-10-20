'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Copy, Trash2, FileText, Image, Video, Eye, Square, CheckSquare } from 'lucide-react'
import { HistoryItem } from '../../types/upload'
import { Button } from '../UI/Button'
import { Modal } from '../UI/Modal'
import { formatFileSize } from '../../lib/upload-utils'

interface HistoryListProps {
  items: HistoryItem[]
  onDelete: (id: string) => void
  loading?: boolean
  selectedItems?: HistoryItem[]
  onItemSelect?: (item: HistoryItem, selected: boolean) => void
  onSelectAll?: () => void
  onClearSelection?: () => void
}

export function HistoryList({ 
  items, 
  onDelete, 
  loading = false,
  selectedItems = [],
  onItemSelect,
  onSelectAll,
  onClearSelection
}: HistoryListProps) {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})

  const isItemSelected = (item: HistoryItem) => {
    return selectedItems.some(selected => selected.id === item.id)
  }

  const handleItemToggle = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onItemSelect) {
      const isSelected = isItemSelected(item)
      onItemSelect(item, !isSelected)
    }
  }

  // 生成文件缩略图
  useEffect(() => {
    const generateThumbnails = async () => {
      const newThumbnails: Record<string, string> = {}
      
      for (const item of items) {
        if (item.fileType.startsWith('image/')) {
          newThumbnails[item.id] = item.s3Url
        } else if (item.fileType.startsWith('video/')) {
          try {
            const thumbnail = await generateVideoThumbnail(item.s3Url)
            newThumbnails[item.id] = thumbnail
          } catch (error) {
            console.error('Failed to generate video thumbnail:', error)
          }
        }
      }
      
      setThumbnails(newThumbnails)
    }
    
    generateThumbnails()
  }, [items])

  const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.crossOrigin = 'anonymous'
      video.currentTime = 1
      
      video.onloadeddata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error('Canvas context not available'))
        }
      }
      
      video.onerror = () => reject(new Error('Video load error'))
      video.src = videoUrl
    })
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(id)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-gray-500" />
    } else if (fileType.startsWith('video/')) {
      return <Video className="w-5 h-5 text-gray-500" />
    } else {
      return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading && items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">正在加载文件列表</h3>
          <p className="text-gray-600">从S3存储桶获取数据中，请稍候...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flat-card p-12 max-w-md mx-auto">
          <div className="w-12 h-12 bg-gray-100 mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无文件</h3>
          <p className="text-gray-600">S3存储桶中没有找到文件</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`
              flat-card flat-card-hover cursor-pointer transition-all relative
              ${isItemSelected(item) ? 'selected-minimal' : ''}
            `}
            style={{ maxWidth: '200px' }}
            onClick={() => setSelectedItem(item)}
          >
            {/* Selection Checkbox - Always show */}
            <div className="absolute top-2 left-2 z-30">
              <button
                onClick={(e) => handleItemToggle(item, e)}
                className="w-6 h-6 bg-white border border-gray-300 rounded flex items-center justify-center transition-all hover:bg-gray-50 shadow-md"
              >
                {isItemSelected(item) ? (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="w-4 h-4 border border-gray-400 rounded-sm bg-white"></div>
                )}
              </button>
            </div>

            {/* File Preview */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
              {thumbnails[item.id] ? (
                <img
                  src={thumbnails[item.id]}
                  alt={item.fileName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-gray-400 flex items-center justify-center w-full h-full">
                          ${item.fileType.startsWith('image/') ? 
                            '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>' :
                            '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>'
                          }
                        </div>
                      `
                    }
                  }}
                />
              ) : (
                <div className="text-gray-400 flex items-center justify-center">
                  {getFileIcon(item.fileType)}
                </div>
              )}
              
              {/* 文件类型标识 */}
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                  {item.fileType.startsWith('image/') ? (
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  ) : item.fileType.startsWith('video/') ? (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      <path d="M8 9l3 2-3 2V9z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>


            </div>

            {/* File Info */}
            <div className="p-3 space-y-2">
              <div>
                <h3
                  className="text-sm font-medium text-gray-900 truncate"
                  title={item.fileName}
                >
                  {item.fileName}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <span>{formatFileSize(item.fileSize)}</span>
                  <span>{formatDate(item.uploadTime).split(' ')[0]}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(item.s3Url, item.id)
                  }}
                  className="flex-1 flat-button text-xs px-2 py-1.5 h-7 flex items-center justify-start"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copiedUrl === item.id ? '已复制' : '复制'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                  className="flat-button text-xs px-2 py-1.5 h-7 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(item.s3Url, '_blank')
                  }}
                  className="flat-button text-xs px-2 py-1.5 h-7"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="文件详情"
        size="xl"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* File Preview */}
            <div className="aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
              {thumbnails[selectedItem.id] ? (
                <img
                  src={thumbnails[selectedItem.id]}
                  alt={selectedItem.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  {getFileIcon(selectedItem.fileType)}
                </div>
              )}
            </div>

            {/* File Information */}
            <div className="space-y-4">
              <div className="flat-card p-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">文件名</label>
                <p className="text-gray-900">{selectedItem.fileName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flat-card p-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">文件大小</label>
                  <p className="text-gray-900">{formatFileSize(selectedItem.fileSize)}</p>
                </div>
                <div className="flat-card p-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">文件类型</label>
                  <p className="text-gray-900">{selectedItem.fileType}</p>
                </div>
              </div>

              <div className="flat-card p-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">上传时间</label>
                <p className="text-gray-900">{formatDate(selectedItem.uploadTime)}</p>
              </div>

              <div className="flat-card p-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">S3 地址</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={selectedItem.s3Url}
                    readOnly
                    className="flex-1 flat-input px-3 py-2"
                  />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(selectedItem.s3Url, selectedItem.id)}
                    className="flat-button-primary px-4 py-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedUrl === selectedItem.id ? '已复制' : '复制'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => setSelectedItem(null)}
                className="flat-button px-4 py-2"
              >
                关闭
              </Button>
              <Button
                onClick={() => window.open(selectedItem.s3Url, '_blank')}
                className="flat-button-primary px-4 py-2"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                在新窗口打开
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}