'use client'

import { RefreshCw, Download } from 'lucide-react'
import { Button } from '../UI/Button'

interface HistoryHeaderProps {
  loading: boolean
  itemsCount: number
  onRefresh: () => void
  onExport: () => void
}

export function HistoryHeader({ loading, itemsCount, onRefresh, onExport }: HistoryHeaderProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Upload History</h1>
          <p className="text-gray-600">
            View uploaded file records and detailed information {loading && <span className="text-blue-600">(Loading...)</span>}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={onRefresh} disabled={loading} className="hidden lg:flex">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button variant="secondary" onClick={onRefresh} disabled={loading} className="lg:hidden" size="sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button variant="primary" onClick={onExport} disabled={itemsCount === 0 || loading} className="hidden lg:flex">
            <Download className="w-4 h-4 mr-2" />
            Export Records
          </Button>
          <Button variant="primary" onClick={onExport} disabled={itemsCount === 0 || loading} className="lg:hidden" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}