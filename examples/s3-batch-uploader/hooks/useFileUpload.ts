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
      
      // Use presigned URL for single upload
      const publicUrl = await uploadFileWithPresignedUrl(file)

      // Upload successful
      updateFileStatus(file.id, {
        status: 'success',
        progress: 100,
        s3Url: publicUrl,
      })

      // Add to history
      addToUploadHistory({
        id: file.id,
        s3Key: file.id, // Use file ID as S3 key
        fileName: file.file.name,
        fileSize: file.file.size,
        fileType: file.file.type,
        uploadTime: new Date().toISOString(),
      })

    } catch (error) {
      console.error('Upload error:', error)
      updateFileStatus(file.id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      })
    } finally {
      activeUploads.current.delete(file.id)
      xhrRefs.current.delete(file.id)
      // Delay queue processing check to ensure state update completion
      setTimeout(() => {
        processUploadQueue()
      }, 200)
    }
  }, [updateFileStatus])

  // Presigned URL single upload
  const uploadFileWithPresignedUrl = useCallback(async (file: UploadFile): Promise<string> => {
    // Step 1: Get presigned URL
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

    const responseData = await presignResponse.json()
    const { uploadUrl, publicUrl, multipart, uploadId, key } = responseData
    updateFileStatus(file.id, { progress: 20 })

    // Check if it's multipart upload (for large files)
    if (multipart && uploadId) {
      // For now, show error message for multipart uploads as they need special handling
      throw new Error('Large file uploads (>50MB) are not fully supported yet. Please use smaller files or contact support.')
    }

    // Ensure uploadUrl exists for direct upload
    if (!uploadUrl) {
      throw new Error('No upload URL received from server')
    }

    // Step 2: Use XMLHttpRequest to upload file directly to presigned URL
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      // Store XMLHttpRequest reference for pause/cancel
      xhrRefs.current.set(file.id, xhr)
      
      // Upload progress listener
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
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })
      
      xhr.addEventListener('error', () => {
        xhrRefs.current.delete(file.id)
        reject(new Error('Network error'))
      })
      
      xhr.addEventListener('abort', () => {
        xhrRefs.current.delete(file.id)
        reject(new Error('Upload cancelled'))
      })
      
      // Use PUT method to upload file directly to presigned URL
      xhr.open('PUT', uploadUrl)
      // Remove Content-Type header, let browser handle automatically
      xhr.send(file.file)
    })

    return publicUrl
  }, [updateFileStatus])

  const processUploadQueue = useCallback(() => {
    // Get current file status
    setFiles(currentFiles => {
      // Process files in queue
      while (uploadQueue.current.length > 0 && activeUploads.current.size < config.concurrentUploads) {
        const fileId = uploadQueue.current.shift()
        if (!fileId) break

        const file = currentFiles.find(f => f.id === fileId)
        if (!file || !file.selected || file.status !== 'pending') continue

        activeUploads.current.add(fileId)
        // Execute upload asynchronously, don't block queue processing
        uploadFile(file).catch(console.error)
      }

      // Check if all uploads are completed
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
    
    // Remove file from all related states
    activeUploads.current.delete(id)
    xhrRefs.current.delete(id)
    uploadQueue.current = uploadQueue.current.filter(fileId => fileId !== id)
    
    // Remove file
    removeFile(id)
  }, [removeFile])

  const closeErrorDialog = useCallback((id: string) => {
    // Close error dialog, reset status to pending, but keep error info for user reference
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