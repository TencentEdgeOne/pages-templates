'use client'

import { useState, useCallback, useRef } from 'react'
import { UploadFile, UploadConfig } from '../types/upload'
import { validateFile, generateFilePreview } from '../lib/upload-utils'
import { addToUploadHistory } from '../lib/storage'
import { v4 as uuidv4 } from 'uuid'

export function useFileUpload(config: UploadConfig) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const uploadQueue = useRef<string[]>([])
  const activeUploads = useRef<Set<string>>(new Set())
  const xhrRefs = useRef<Map<string, XMLHttpRequest>>(new Map())

  const addFiles = useCallback(async (newFiles: File[]) => {
    const validFiles: UploadFile[] = []
    
    for (const file of newFiles) {
      // Validate file
      const error = validateFile(file, config.maxFileSize)
      if (error) {
        console.warn(`File ${file.name} rejected: ${error}`)
        continue
      }

      // Check if file already exists in current state
      const existingFile = files.find(f => f.file.name === file.name && f.file.size === file.size)
      if (existingFile) {
        console.warn(`File ${file.name} already exists`)
        continue
      }

      try {
        // Generate preview for the file
        const preview = await generateFilePreview(file)
        
        const uploadFile: UploadFile = {
          id: uuidv4(),
          file,
          selected: true,
          status: 'pending',
          progress: 0,
          preview, // Add the generated preview
        }

        validFiles.push(uploadFile)
      } catch (error) {
        console.warn(`Failed to generate preview for ${file.name}:`, error)
        // Still add the file without preview
        const uploadFile: UploadFile = {
          id: uuidv4(),
          file,
          selected: true,
          status: 'pending',
          progress: 0,
        }
        validFiles.push(uploadFile)
      }
    }

    if (validFiles.length > 0) {
      setFiles(prev => {
        const combined = [...prev, ...validFiles]
        return combined.slice(0, config.maxFiles)
      })
    }
  }, [config.maxFileSize, config.maxFiles, files])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    // Cancel upload if in progress
    if (activeUploads.current.has(id)) {
      activeUploads.current.delete(id)
    }
    // Remove from queue
    uploadQueue.current = uploadQueue.current.filter(fileId => fileId !== id)
  }, [])

  const toggleFileSelection = useCallback((id: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, selected: !f.selected } : f
    ))
  }, [])

  const selectAll = useCallback(() => {
    setFiles(prev => prev.map(f => ({ ...f, selected: true })))
  }, [])

  const deselectAll = useCallback(() => {
    setFiles(prev => prev.map(f => ({ ...f, selected: false })))
  }, [])

  const clearFiles = useCallback(() => {
    // Cancel all active uploads
    activeUploads.current.clear()
    uploadQueue.current = []
    setFiles([])
    setIsUploading(false)
  }, [])

  const updateFileStatus = useCallback((id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ))
  }, [])

  const uploadFile = useCallback(async (file: UploadFile): Promise<void> => {
    try {
      updateFileStatus(file.id, { status: 'uploading', progress: 0 })
      
      // 使用预签名URL单次上传
      const publicUrl = await uploadFileWithPresignedUrl(file)

      // 上传成功
      updateFileStatus(file.id, {
        status: 'success',
        progress: 100,
        s3Url: publicUrl,
      })

      // 添加到历史记录
      addToUploadHistory({
        id: file.id,
        fileName: file.file.name,
        fileSize: file.file.size,
        fileType: file.file.type,
        s3Url: publicUrl,
        uploadTime: new Date().toISOString(),
      })

    } catch (error) {
      console.error('Upload error:', error)
      updateFileStatus(file.id, {
        status: 'error',
        error: error instanceof Error ? error.message : '上传失败',
      })
    } finally {
      activeUploads.current.delete(file.id)
      xhrRefs.current.delete(file.id)
      // 延迟触发队列处理检查，确保状态更新完成
      setTimeout(() => {
        processUploadQueue()
      }, 200)
    }
  }, [updateFileStatus])

  // 预签名URL单次上传
  const uploadFileWithPresignedUrl = useCallback(async (file: UploadFile): Promise<string> => {
    // 第一步：获取预签名 URL
    updateFileStatus(file.id, { progress: 10 })
    const presignResponse = await fetch('/api/upload-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.file.name,
        contentType: file.file.type,
        fileSize: file.file.size,
      }),
    })

    if (!presignResponse.ok) {
      const errorData = await presignResponse.json()
      throw new Error(errorData.error || 'Failed to get upload URL')
    }

    const { uploadUrl, fields, publicUrl } = await presignResponse.json()
    updateFileStatus(file.id, { progress: 20 })

    // 第二步：使用 XMLHttpRequest 上传到 S3 以获取真实进度
    const uploadFormData = new FormData()
    
    // 添加预签名字段
    Object.entries(fields).forEach(([key, value]) => {
      uploadFormData.append(key, value as string)
    })
    
    // 添加文件（必须最后添加）
    uploadFormData.append('file', file.file)

    // 使用 XMLHttpRequest 进行上传以获取进度
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      // 存储 XMLHttpRequest 引用以便暂停/取消
      xhrRefs.current.set(file.id, xhr)
      
      // 上传进度监听
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 80) + 20 // 20-100%
          updateFileStatus(file.id, { progress: percentComplete })
        }
      })
      
      xhr.addEventListener('load', () => {
        xhrRefs.current.delete(file.id)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`上传失败: ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        xhrRefs.current.delete(file.id)
        reject(new Error('网络错误'))
      })
      
      xhr.addEventListener('abort', () => {
        xhrRefs.current.delete(file.id)
        reject(new Error('上传被取消'))
      })
      
      xhr.open('POST', uploadUrl)
      xhr.send(uploadFormData)
    })

    return publicUrl
  }, [updateFileStatus])

  const processUploadQueue = useCallback(() => {
    // 获取当前文件状态
    setFiles(currentFiles => {
      // 处理队列中的文件
      while (uploadQueue.current.length > 0 && activeUploads.current.size < config.concurrentUploads) {
        const fileId = uploadQueue.current.shift()
        if (!fileId) break

        const file = currentFiles.find(f => f.id === fileId)
        if (!file || !file.selected || file.status !== 'pending') continue

        activeUploads.current.add(fileId)
        // 异步执行上传，不阻塞队列处理
        uploadFile(file).catch(console.error)
      }

      // 检查是否所有上传都已完成
      const hasActiveUploads = activeUploads.current.size > 0
      const hasQueuedUploads = uploadQueue.current.length > 0
      const hasUploadingFiles = currentFiles.some(f => f.status === 'uploading')
      
      if (!hasActiveUploads && !hasQueuedUploads && !hasUploadingFiles) {
        setIsUploading(false)
      }

      return currentFiles
    })
  }, [config.concurrentUploads, uploadFile])

  const startUpload = useCallback(async () => {
    const selectedFiles = files.filter(f => f.selected && f.status === 'pending')
    
    if (selectedFiles.length === 0) {
      return
    }

    setIsUploading(true)
    uploadQueue.current = selectedFiles.map(f => f.id)
    processUploadQueue()
  }, [files, processUploadQueue])

  const retryFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id)
    if (!file) return

    updateFileStatus(id, { status: 'pending', error: undefined, progress: 0 })
    
    if (!isUploading) {
      setIsUploading(true)
    }
    
    uploadQueue.current.push(id)
    processUploadQueue()
  }, [files, isUploading, updateFileStatus, processUploadQueue])

  const cancelFile = useCallback((id: string) => {
    const xhr = xhrRefs.current.get(id)
    if (xhr) {
      xhr.abort()
    }
    
    // 从所有相关状态中移除文件
    activeUploads.current.delete(id)
    xhrRefs.current.delete(id)
    uploadQueue.current = uploadQueue.current.filter(fileId => fileId !== id)
    
    // 移除文件
    removeFile(id)
  }, [removeFile])

  const closeErrorDialog = useCallback((id: string) => {
    // 关闭错误弹窗，将状态重置为 pending，但保留错误信息以便用户查看
    updateFileStatus(id, { status: 'pending' })
  }, [updateFileStatus])

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    toggleFileSelection,
    selectAll,
    deselectAll,
    clearFiles,
    startUpload,
    retryFile,
    cancelFile,
    closeErrorDialog,
  }
}