import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * 发送补全消息（Completion Message）
 *
 * @route POST /api/completion-messages
 * @dify  POST /v1/completion-messages
 *
 * @description 向 Dify Completion 类型应用发送消息并获取流式响应。
 *              适用于单次文本生成场景（非多轮对话），返回 SSE 流。
 *
 * @requestBody {object} JSON
 *   - inputs  {Record<string, any>} 必填 — 用户输入的变量键值对，对应应用配置的 prompt_variables
 *   - files   {Array<VisionFile>}   可选 — 多模态文件列表（图片等），需先通过 /api/file-upload 上传
 *
 * @cookie session_id {string} 可选 — 用户会话标识，若不存在则自动生成
 *
 * @returns {ReadableStream} SSE 事件流（text/event-stream）
 *   - event: message   — 逐段生成的文本内容
 *   - event: message_end — 生成结束
 *
 * @example
 *   POST /api/completion-messages
 *   { "inputs": { "topic": "AI 的未来" } }
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    files,
  } = body
  const { user } = getInfo(request)
  const res = await client.createCompletionMessage(inputs, user, true, files)
  return new Response(res.data as any)
}
