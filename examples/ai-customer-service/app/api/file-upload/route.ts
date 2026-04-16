import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * 文件上传
 *
 * @route POST /api/file-upload
 * @dify  POST /v1/files/upload
 *
 * @description 上传文件到 Dify，用于多模态输入场景（如图片识别）。
 *              上传成功后返回文件 ID，后续在发送消息时通过 files 参数引用。
 *
 * @requestBody {FormData} multipart/form-data
 *   - file {File} 必填 — 要上传的文件（支持图片、文档等，具体格式取决于应用配置）
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {string} 上传成功后返回的文件 ID（upload_file_id）
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
