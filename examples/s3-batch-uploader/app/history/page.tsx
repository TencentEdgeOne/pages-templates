'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import { HistoryList } from '../components/History/HistoryList'
import { ExportDialog } from '../components/History/ExportDialog'
import { Button } from '../components/UI/Button'
import { HistoryItem } from '../types/upload'
import { useS3Files } from '../hooks/useS3Files'

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<HistoryItem[]>([])

  // 使用S3 Hook获取文件列表
  const { 
    files: items, 
    loading, 
    error, 
    hasMore, 
    refreshFiles, 
    loadMoreFiles, 
    deleteFile 
  } = useS3Files({
    autoRefresh: true,
    refreshInterval: 60000 // 每分钟自动刷新
  })

  const handleDelete = async (id: string) => {
    const item = items.find(item => item.id === id)
    if (!item?.s3Key) return

    if (window.confirm(`确定要删除文件 "${item.fileName}" 吗？此操作将从S3存储桶中永久删除文件，不可恢复。`)) {
      try {
        await deleteFile(item.s3Key)
        // 从选中列表中移除
        setSelectedItems(prev => prev.filter(i => i.id !== id))
      } catch (error) {
        alert('删除文件失败：' + (error instanceof Error ? error.message : '未知错误'))
      }
    }
  }

  const handleRefresh = () => {
    refreshFiles()
  }

  const handleExport = () => {
    setShowExportDialog(true)
  }

  const handleItemSelect = (item: HistoryItem, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, item])
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id))
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems([...filteredItems])
    }
  }

  const handleClearSelection = () => {
    setSelectedItems([])
  }

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || 
        (filterType === 'image' && item.fileType.startsWith('image/')) ||
        (filterType === 'video' && item.fileType.startsWith('video/'))
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime()
          break
        case 'name':
          comparison = a.fileName.localeCompare(b.fileName)
          break
        case 'size':
          comparison = a.fileSize - b.fileSize
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const totalSize = items.reduce((sum, item) => sum + item.fileSize, 0)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">上传历史</h1>
            <p className="text-gray-600">
              查看已上传的文件记录和详细信息 {loading && <span className="text-blue-600">(加载中...)</span>}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={loading}
              className="hidden sm:flex"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={loading}
              className="sm:hidden"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="primary"
              onClick={handleExport}
              disabled={items.length === 0 || loading}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              导出记录
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={items.length === 0 || loading}
              className="sm:hidden"
              size="sm"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">加载S3文件时出错</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <Button
              variant="error"
              size="sm"
              onClick={handleRefresh}
            >
              重试
            </Button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">{items.length}</div>
          <div className="text-sm text-gray-600">总文件数</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {items.filter(item => item.fileType.startsWith('image/')).length}
          </div>
          <div className="text-sm text-gray-600">图片文件</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {items.filter(item => item.fileType.startsWith('video/')).length}
          </div>
          <div className="text-sm text-gray-600">视频文件</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">{formatFileSize(totalSize)}</div>
          <div className="text-sm text-gray-600">总存储大小</div>
        </div>
      </div>

      {/* 统一控制面板 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* 第一行：搜索和筛选 */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6 mb-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clean-input w-full pl-12 pr-4 py-3 text-base"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter by type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'image' | 'video')}
              className="clean-input px-4 py-3 text-base min-w-[120px]"
            >
              <option value="all">所有类型</option>
              <option value="image">图片</option>
              <option value="video">视频</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-')
                setSortBy(by as 'date' | 'name' | 'size')
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="clean-input px-4 py-3 text-base min-w-[140px]"
            >
              <option value="date-desc">最新上传</option>
              <option value="date-asc">最早上传</option>
              <option value="name-asc">文件名 A-Z</option>
              <option value="name-desc">文件名 Z-A</option>
              <option value="size-desc">文件大小 大-小</option>
              <option value="size-asc">文件大小 小-大</option>
            </select>
          </div>
        </div>

        {/* 第二行：选择控制和统计信息 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={selectedItems.length === filteredItems.length ? handleClearSelection : handleSelectAll}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? (
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              )}
              <span>{selectedItems.length === filteredItems.length && filteredItems.length > 0 ? '取消全选' : '全选'}</span>
            </button>
            
            {selectedItems.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  已选择 {selectedItems.length} 个文件
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  清除选择
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {filteredItems.length !== items.length && (
              <span className="px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
                显示 {filteredItems.length} / {items.length} 个文件
              </span>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      <HistoryList 
        items={filteredItems} 
        onDelete={handleDelete}
        loading={loading}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={loadMoreFiles}
            className="w-full max-w-md"
          >
            加载更多文件
          </Button>
        </div>
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        items={selectedItems.length > 0 ? selectedItems : filteredItems}
        selectedCount={selectedItems.length}
      />
    </div>
  )
}