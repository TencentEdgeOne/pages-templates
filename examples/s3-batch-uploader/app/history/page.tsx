'use client'

import { useState } from 'react'
import HistoryList from '../../components/History/HistoryList'
import { HistoryHeader } from '../../components/History/HistoryHeader'
import { HistoryStats } from '../../components/History/HistoryStats'
import { HistoryFilters } from '../../components/History/HistoryFilters'
import { HistoryActions } from '../../components/History/HistoryActions'
import { ErrorDisplay } from '../../components/History/ErrorDisplay'
import { ExportDialog } from '../../components/History/ExportDialog'
import { Button } from '../../components/UI/Button'
import { useS3Files } from '../../hooks/useS3Files'
import { useHistoryFilters } from '../../hooks/useHistoryFilters'
import { useHistorySelection } from '../../hooks/useHistorySelection'
import MainLayout from '../../components/Layout/MainLayout'

function HistoryPage() {
  const [showExportDialog, setShowExportDialog] = useState(false)

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

  const {
    searchTerm,
    filterType,
    sortBy,
    sortOrder,
    filteredItems,
    setSearchTerm,
    setFilterType,
    handleSortChange
  } = useHistoryFilters({ items })

  const {
    selectedItems,
    handleItemSelect,
    handleSelectAll,
    handleClearSelection,
    removeFromSelection
  } = useHistorySelection()

  const handleDelete = async (id: string) => {
    const item = items.find(item => item.id === id)
    if (!item?.s3Key) return

    if (window.confirm(`Are you sure you want to delete file "${item.fileName}"? This will permanently delete the file from the S3 bucket and cannot be undone.`)) {
      try {
        await deleteFile(item.s3Key)
        removeFromSelection(id)
      } catch (error) {
        alert('Failed to delete file: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const handleExport = () => {
    setShowExportDialog(true)
  }

  const handleSelectAllWrapper = () => {
    handleSelectAll(filteredItems)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <HistoryHeader
        loading={loading}
        itemsCount={items.length}
        onRefresh={refreshFiles}
        onExport={handleExport}
      />

      {error && (
        <ErrorDisplay error={error} onRetry={refreshFiles} />
      )}

      <HistoryStats items={items} />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <HistoryFilters
          searchTerm={searchTerm}
          filterType={filterType}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterType}
          onSortChange={handleSortChange}
        />

        <HistoryActions
          selectedItems={selectedItems}
          filteredItems={filteredItems}
          totalItems={items.length}
          onSelectAll={handleSelectAllWrapper}
          onClearSelection={handleClearSelection}
        />
      </div>

      <HistoryList 
        items={filteredItems} 
        onDelete={handleDelete}
        loading={loading}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        onSelectAll={handleSelectAllWrapper}
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