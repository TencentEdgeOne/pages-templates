'use client'

import { HistoryItem } from '../../types/upload'
import { formatFileSize } from '../../lib/utils'

interface HistoryStatsProps {
  items: HistoryItem[]
}

export function HistoryStats({ items }: HistoryStatsProps) {


  // Calculate total size with validation
  const totalSize = items.reduce((sum, item) => {
    const size = typeof item.fileSize === 'number' && isFinite(item.fileSize) ? item.fileSize : 0
    // Log suspicious file sizes for debugging
    if (size > 1099511627776) { // > 1TB
      console.warn('Suspicious file size detected:', item.fileName, size)
    }
    return sum + size
  }, 0)
  
  const imageCount = items.filter(item => item.fileType?.startsWith('image/')).length
  const videoCount = items.filter(item => item.fileType?.startsWith('video/')).length

  // Log total size for debugging
  if (totalSize > 1099511627776) { // > 1TB
    console.warn('Total size exceeds 1TB:', totalSize, 'bytes')
    console.warn('Items:', items.map(i => ({ name: i.fileName, size: i.fileSize })))
  }

  const stats = [
    { label: 'Total Files', value: items.length },
    { label: 'Image Files', value: imageCount },
    { label: 'Video Files', value: videoCount },
    { label: 'Total Storage Size', value: formatFileSize(totalSize), isSize: true }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">
            {stat.isSize ? stat.value : stat.value}
          </div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}