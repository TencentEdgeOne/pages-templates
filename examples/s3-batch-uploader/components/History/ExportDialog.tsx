'use client'

import { useState } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from '../UI/Button'
import { Modal } from '../UI/Modal'
import { HistoryItem } from '../../types/upload'
import { useTranslation } from '../../app/[locale]/i18n-provider'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  items: HistoryItem[]
  selectedCount?: number
}

export type ExportFormat = 'csv' | 'json'

export function ExportDialog({ isOpen, onClose, items, selectedCount = 0 }: ExportDialogProps) {
  const { t } = useTranslation()
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')

  const handleExport = () => {
    if (items.length === 0) {
      alert(t('noFilesFound'))
      return
    }

    const headers = [t('fileName'), t('fileSize'), t('fileType'), t('uploadTime'), t('s3Url')]
    const data = items.map(item => [
      item.fileName,
      formatFileSize(item.fileSize),
      item.fileType,
      formatDate(item.uploadTime),
      item.s3Url || '' // 如果没有预签名 URL，使用空字符串
    ])

    if (exportFormat === 'csv') {
      exportToCSV(headers, data)
    } else {
      exportToJSON(headers, data)
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
    return date.toLocaleString(undefined, {
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
    link.setAttribute('download', `${t('exportDialog')}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = (headers: string[], data: string[][]) => {
    const json = JSON.stringify(
      data.map(row => ({
        [headers[0]]: row[0],
        [headers[1]]: row[1],
        [headers[2]]: row[2],
        [headers[3]]: row[3],
        [headers[4]]: row[4],
      })),
      null,
      2
    )
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${t('exportDialog')}_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getExportTitle = () => {
    return t('exportDialog')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('exportDialog')}
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
              ? t('selectedFilesOnly')
              : t('allFiles')
            }
          </p>
        </div>

        {/* Export Format */}
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium text-gray-700 block mb-4">{t('exportFormat')}</label>
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
                  <span className="text-base text-gray-900 font-medium">{t('csvFormat')}</span>
                  <p className="text-sm text-gray-500 mt-1"></p>
                </div>
              </label>
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-base text-gray-900 font-medium">{t('jsonFormat')}</span>
                  <p className="text-sm text-gray-500 mt-1"></p>
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
            {t('cancel')}
          </Button>
          <Button
            onClick={handleExport}
            disabled={items.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            {t('export')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}