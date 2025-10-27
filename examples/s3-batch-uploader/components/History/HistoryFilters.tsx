'use client'

import { Search, ChevronDown } from 'lucide-react'

interface HistoryFiltersProps {
  searchTerm: string
  filterType: 'all' | 'image' | 'video'
  sortBy: 'date' | 'name' | 'size'
  sortOrder: 'asc' | 'desc'
  onSearchChange: (value: string) => void
  onFilterChange: (value: 'all' | 'image' | 'video') => void
  onSortChange: (by: 'date' | 'name' | 'size', order: 'asc' | 'desc') => void
}

export function HistoryFilters({
  searchTerm,
  filterType,
  sortBy,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortChange
}: HistoryFiltersProps) {
  const handleSortChange = (value: string) => {
    const [by, order] = value.split('-')
    onSortChange(by as 'date' | 'name' | 'size', order as 'asc' | 'desc')
  }

  // Filter type options
  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' }
  ]

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Latest Upload' },
    { value: 'date-asc', label: 'Earliest Upload' },
    { value: 'name-asc', label: 'File Name A-Z' },
    { value: 'name-desc', label: 'File Name Z-A' },
    { value: 'size-desc', label: 'File Size Large-Small' },
    { value: 'size-asc', label: 'File Size Small-Large' }
  ]

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6 mb-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search file names..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="clean-input w-full pl-12 pr-4 py-3 text-base"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'image' | 'video')}
            className="clean-input appearance-none px-4 py-3 text-base min-w-[120px] pr-10"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="clean-input appearance-none px-4 py-3 text-base min-w-[140px] pr-10"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}