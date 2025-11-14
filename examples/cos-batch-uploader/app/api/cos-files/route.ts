import { NextRequest, NextResponse } from 'next/server'
import { listObjects, deleteObject } from '../../../lib/cos-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const continuationToken = searchParams.get('continuationToken') || searchParams.get('marker')
    const maxKeys = parseInt(searchParams.get('maxKeys') || searchParams.get('pageSize') || '50')

    const result = await listObjects('uploads/', maxKeys, continuationToken || undefined)
    
    const files = result.objects.map(obj => {
      // Ensure fileSize is a valid number
      let fileSize = 0
      if (typeof obj.Size === 'number') {
        fileSize = obj.Size
      } else if (typeof obj.Size === 'string') {
        fileSize = parseInt(obj.Size, 10) || 0
      }
      
      // Validate fileSize is reasonable (not negative or extremely large)
      if (fileSize < 0 || fileSize > 1099511627776) { // 1TB limit
        console.warn(`Invalid file size for ${obj.Key}: ${obj.Size}, setting to 0`)
        fileSize = 0
      }
      
      return {
        id: obj.Key,
        s3Key: obj.Key,
        fileName: obj.Key.split('/').pop() || obj.Key,
        fileSize,
        fileType: getFileType(obj.Key),
        uploadTime: obj.LastModified || new Date().toISOString(),
      }
    })

    return NextResponse.json({
      files,
      isTruncated: result.isTruncated,
      hasMore: result.isTruncated,
      nextContinuationToken: result.nextMarker,
    })
  } catch (error) {
    console.error('Error listing COS files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      )
    }

    await deleteObject(key)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting COS file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

function getFileType(key: string): string {
  const extension = key.split('.').pop()?.toLowerCase()
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
  
  if (imageExtensions.includes(extension || '')) {
    return `image/${extension === 'jpg' ? 'jpeg' : extension}`
  }
  
  if (videoExtensions.includes(extension || '')) {
    return `video/${extension}`
  }
  
  return 'application/octet-stream'
}
