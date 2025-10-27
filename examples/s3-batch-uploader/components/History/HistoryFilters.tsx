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
            <option value="all">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
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
  )
}