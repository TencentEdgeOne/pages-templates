'use client'

import { useCallback } from 'react'

class StorageRefreshManager {
  private listeners: Set<() => void> = new Set()

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => void this.listeners.delete(listener)
  }

  refresh() {
    this.listeners.forEach(listener => listener())
  }
}

export const storageRefreshManager = new StorageRefreshManager()

export function useStorageRefresh() {
  const refreshStorage = useCallback(() => {
    storageRefreshManager.refresh()
  }, [])

  return { refreshStorage }
}