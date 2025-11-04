'use client'

import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { Modal } from '../UI/Modal'
import { Button } from '../UI/Button'
import { HistoryItem } from '../../types/upload'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  items: HistoryItem[]
  selectedCount?: number
}

type ExportFormat = 'csv' | 'json'

export function ExportDialog({ isOpen, onClose, items, selectedCount = 0 }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')
  const [includeFields, setIncludeFields] = useState({
    fileName: true,
    fileSize: true,
    fileType: true,
    uploadTime: true,
    s3Url: true
  })

  const handleExport = () => {
    if (items.length === 0) {
      alert('No files found')
      return
    }

    if (exportFormat === 'csv') {
      exportAsCSV()
    } else {
      exportAsJSON()
    }
    
    onClose()
  }

  const exportAsCSV = () => {
    const headers = ['File Name', 'File Size', 'File Type', 'Upload Time', 'S3 URL']
    const data = items.map(item => [
      item.fileName,
      formatFileSize(item.fileSize),
      item.fileType,
      new Date(item.uploadTime).toLocaleString(),
      item.s3Url
    ])

    const csvContent = [headers, ...data]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Export File Records_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAsJSON = () => {
    const json = JSON.stringify(items, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Export File Records_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1)
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getExportTitle = () => {
    return 'Export File Records'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export File Records"
      size="md"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {selectedCount > 0
              ? 'Selected Files Only'
              : 'All Files'
            } ({items.length} files)
          </p>
          
          <div>
            <label className="text-base font-medium text-gray-700 block mb-4">Export Format</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-base text-gray-900 font-medium">CSV Format</span>
                  <p className="text-sm text-gray-500 mt-1"></p>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-base text-gray-900 font-medium">JSON Format</span>
                  <p className="text-sm text-gray-500 mt-1"></p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </Modal>
  )
}