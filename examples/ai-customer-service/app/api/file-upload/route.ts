import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * File upload
 *
 * @route POST /api/file-upload
 * @dify  POST /v1/files/upload
 *
 * @description Upload a file to Dify for multimodal input scenarios (e.g., image recognition).
 *              Returns a file ID on success, which can be referenced via the files parameter when sending messages.
 *
 * @requestBody {FormData} multipart/form-data
 *   - file {File} Required — The file to upload (supports images, documents, etc., depending on app configuration)
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {string} The uploaded file ID (upload_file_id)
 *
 * @example
 *   POST /api/file-upload
 *   Content-Type: multipart/form-data
 *   Body: file=<binary>
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = getInfo(request)
    formData.append('user', user)
    const res = await client.fileUpload(formData)
    return new Response(res.data.id as any)
  }
  catch (e: any) {
    return new Response(
      JSON.stringify({ message: e?.message ?? 'Upload failed' }),
      { status: e?.response?.status ?? 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
