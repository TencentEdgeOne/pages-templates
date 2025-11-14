'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '../UI/Button'

interface ErrorDisplayProps {
  error: string
  onRetry: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800 font-semibold">Error loading S3 files</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
      <Button variant="error" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}