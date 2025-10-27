'use client'

import { useState, useCallback } from 'react'
import { HistoryItem } from '../types/upload'

export function useHistorySelection() {
  const [selectedItems, setSelectedItems] = useState<HistoryItem[]>([])

  const handleItemSelect = useCallback((item: HistoryItem, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, item])
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id))
    }
  }, [])

  const handleSelectAll = useCallback((filteredItems: HistoryItem[]) => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems([...filteredItems])
    }
  }, [selectedItems.length])

  const handleClearSelection = useCallback(() => {
    setSelectedItems([])
  }, [])

  const removeFromSelection = useCallback((id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return {
    selectedItems,
    handleItemSelect,
    handleSelectAll,
    handleClearSelection,
    removeFromSelection
  }
}