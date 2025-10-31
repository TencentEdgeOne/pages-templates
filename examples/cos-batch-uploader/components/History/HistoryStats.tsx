'use client'

import { HistoryItem } from '../../types/upload'

interface HistoryStatsProps {
  items: HistoryItem[]
}

export function HistoryStats({ items }: HistoryStatsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalSize = items.reduce((sum, item) => sum + item.fileSize, 0)
  const imageCount = items.filter(item => item.fileType.startsWith('image/')).length
  const videoCount = items.filter(item => item.fileType.startsWith('video/')).length

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