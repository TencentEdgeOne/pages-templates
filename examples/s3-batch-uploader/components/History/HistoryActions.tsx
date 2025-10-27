'use client'

import { HistoryItem } from '../../types/upload'

interface HistoryActionsProps {
  selectedItems: HistoryItem[]
  filteredItems: HistoryItem[]
  totalItems: number
  onSelectAll: () => void
  onClearSelection: () => void
}

export function HistoryActions({
  selectedItems,
  filteredItems,
  totalItems,
  onSelectAll,
  onClearSelection
}: HistoryActionsProps) {
  const isAllSelected = selectedItems.length === filteredItems.length && filteredItems.length > 0
  const hasPartialSelection = selectedItems.length > 0 && selectedItems.length < filteredItems.length

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-100">
      <div className="flex items-center space-x-4">
        <button
          onClick={isAllSelected ? onClearSelection : onSelectAll}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isAllSelected ? (
            <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          ) : hasPartialSelection ? (
            <div className="w-4 h-4 bg-blue-600 border-2 border-blue-600 rounded flex items-center justify-center">
              <div className="w-2 h-0.5 bg-white rounded-sm" />
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-gray-300 rounded hover:border-blue-600 transition-colors" />
          )}
          <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
        </button>
        
        {selectedItems.length > 0 && (
          <>
            <span className="text-sm text-gray-600">
              Selected {selectedItems.length} files
            </span>
            <button
              onClick={onClearSelection}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear Selection
            </button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        {filteredItems.length !== totalItems && (
          <span className="px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
            Showing {filteredItems.length} / {totalItems} files
          </span>
        )}
      </div>
    </div>
  )
}