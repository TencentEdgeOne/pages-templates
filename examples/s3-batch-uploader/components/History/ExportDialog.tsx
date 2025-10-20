'use client'

import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from '../UI/Button'
import { Modal } from '../UI/Modal'
import { HistoryItem } from '../../types/upload'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  items: HistoryItem[]
  selectedCount?: number
}

export type ExportFormat = 'csv' | 'excel'

export function ExportDialog({ isOpen, onClose, items, selectedCount = 0 }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')

  const handleExport = () => {
    if (items.length === 0) {
      alert('没有可导出的数据')
      return
    }

    const headers = ['文件名', '文件大小', '文件类型', '上传时间', 'S3地址']
    const data = items.map(item => [
      item.fileName,
      formatFileSize(item.fileSize),
      item.fileType,
      formatDate(item.uploadTime),
      item.s3Url
    ])

    if (exportFormat === 'csv') {
      exportToCSV(headers, data)
    } else {
      exportToExcel(headers, data)
    }

    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const exportToCSV = (headers: string[], data: string[][]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // 添加 BOM 以支持中文
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `文件导出记录_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = (headers: string[], data: string[][]) => {
    // 简单的 Excel 导出（实际上是 CSV 格式，但使用 .xls 扩展名）
    const csvContent = [
      headers.join('\t'),
      ...data.map(row => row.join('\t'))
    ].join('\n')

    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `文件导出记录_${new Date().toISOString().split('T')[0]}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getExportTitle = () => {
    if (selectedCount > 0) {
      return `导出选中的文件记录 (${selectedCount} 个文件)`
    }
    return `导出所有文件记录 (${items.length} 个文件)`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="导出文件记录"
      size="md"
    >
      <div className="space-y-6">
        {/* Export Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            {getExportTitle()}
          </h3>
          <p className="text-blue-700 text-sm">
            {selectedCount > 0 
              ? '将导出您选中的文件信息，包括文件名、大小、类型、上传时间和S3地址。'
              : '将导出所有文件信息，包括文件名、大小、类型、上传时间和S3地址。'
            }
          </p>
        </div>

        {/* Export Format */}
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium text-gray-700 block mb-4">选择导出格式</label>
            <div className="space-y-3">
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-base text-gray-900 font-medium">CSV 格式</span>
                  <p className="text-sm text-gray-500 mt-1">适用于 Excel、Google Sheets 等表格软件</p>
                </div>
              </label>
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-base text-gray-900 font-medium">Excel 格式</span>
                  <p className="text-sm text-gray-500 mt-1">直接在 Microsoft Excel 中打开</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            onClick={handleExport}
            disabled={items.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            开始导出
          </Button>
        </div>
      </div>
    </Modal>
  )
}