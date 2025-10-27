'use client'

import { useState, useMemo } from 'react'
import { HistoryItem } from '../types/upload'

interface UseHistoryFiltersProps {
  items: HistoryItem[]
}

export function useHistoryFilters({ items }: UseHistoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredItems = useMemo(() => {
    return items
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
  }, [items, searchTerm, filterType, sortBy, sortOrder])

  const handleSortChange = (by: 'date' | 'name' | 'size', order: 'asc' | 'desc') => {
    setSortBy(by)
    setSortOrder(order)
  }

  return {
    searchTerm,
    filterType,
    sortBy,
    sortOrder,
    filteredItems,
    setSearchTerm,
    setFilterType,
    handleSortChange
  }
}