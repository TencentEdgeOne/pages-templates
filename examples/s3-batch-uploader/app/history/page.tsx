'use client'

import { useState } from 'react'
import { Search, Filter, Download, Trash2, RefreshCw, AlertCircle, ChevronDown } from 'lucide-react'
import HistoryList from '../../components/History/HistoryList'
import { ExportDialog } from '../../components/History/ExportDialog'
import { Button } from '../../components/UI/Button'
import { HistoryItem } from '../../types/upload'
import { useS3Files } from '../../hooks/useS3Files'
import MainLayout from '../../components/Layout/MainLayout'

function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedItems, setSelectedItems] = useState<HistoryItem[]>([])

  const { 
    files: items, 
    loading, 
    error, 
    hasMore, 
    refreshFiles, 
    loadMoreFiles, 
    deleteFile 
  } = useS3Files({
    autoRefresh: false,
    refreshInterval: 0
  })

  const handleDelete = async (id: string) => {
    const item = items.find(item => item.id === id)
    if (!item?.s3Key) return

    if (window.confirm(`Are you sure you want to delete file "${item.fileName}"? This will permanently delete the file from the S3 bucket and cannot be undone.`)) {
      try {
        await deleteFile(item.s3Key)
        setSelectedItems(prev => prev.filter(i => i.id !== id))
      } catch (error) {
        alert('Failed to delete file: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Upload History</h1>
            <p className="text-gray-600">
              View uploaded file records and detailed information {loading && <span className="text-blue-600">(Loading...)</span>}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={handleRefresh} disabled={loading} className="hidden lg:flex">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button variant="secondary" onClick={handleRefresh} disabled={loading} className="lg:hidden" size="sm">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            <Button variant="primary" onClick={handleExport} disabled={items.length === 0 || loading} className="hidden lg:flex">
              <Download className="w-4 h-4 mr-2" />
              Export Records
            </Button>
            <Button variant="primary" onClick={handleExport} disabled={items.length === 0 || loading} className="lg:hidden" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold">Error loading S3 files</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <Button variant="error" size="sm" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">{items.length}</div>
          <div className="text-sm text-gray-600">Total Files</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {items.filter(item => item.fileType.startsWith('image/')).length}
          </div>
          <div className="text-sm text-gray-600">Image Files</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {items.filter(item => item.fileType.startsWith('video/')).length}
          </div>
          <div className="text-sm text-gray-600">Video Files</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">{formatFileSize(totalSize)}</div>
          <div className="text-sm text-gray-600">Total Storage Size</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search file names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clean-input w-full pl-12 pr-4 py-3 text-base"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'image' | 'video')}
                className="clean-input appearance-none px-4 py-3 text-base min-w-[120px] pr-10"
              >
                <option value="all">All Types</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-')
                  setSortBy(by as 'date' | 'name' | 'size')
                  setSortOrder(order as 'asc' | 'desc')
                }}
                className="clean-input appearance-none px-4 py-3 text-base min-w-[140px] pr-10"
              >
                <option value="date-desc">Latest Upload</option>
                <option value="date-asc">Earliest Upload</option>
                <option value="name-asc">File Name A-Z</option>
                <option value="name-desc">File Name Z-A</option>
                <option value="size-desc">File Size Large-Small</option>
                <option value="size-asc">File Size Small-Large</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={selectedItems.length === filteredItems.length ? handleClearSelection : handleSelectAll}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? (
                <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : selectedItems.length > 0 ? (
                <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-white rounded-sm" />
                </div>
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded hover:border-blue-600 transition-colors" />
              )}
              <span>{selectedItems.length === filteredItems.length && filteredItems.length > 0 ? 'Deselect All' : 'Select All'}</span>
            </button>
            
            {selectedItems.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  Selected {selectedItems.length} files
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear Selection
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {filteredItems.length !== items.length && (
              <span className="px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
                Showing {filteredItems.length} / {items.length} files
              </span>
            )}
          </div>
        </div>
      </div>

      <HistoryList 
        items={filteredItems} 
        onDelete={handleDelete}
        loading={loading}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      {hasMore && !loading && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={loadMoreFiles} className="w-full max-w-md">
            Load More Files
          </Button>
        </div>
      )}

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        items={selectedItems.length > 0 ? selectedItems : filteredItems}
        selectedCount={selectedItems.length}
      />
    </div>
  )
}

export default function History() {
  return (
    <MainLayout>
      <HistoryPage />
    </MainLayout>
  )
}