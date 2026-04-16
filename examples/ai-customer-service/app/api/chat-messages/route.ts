import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

const chatClient = new ChatClient(API_KEY, API_URL || undefined)

/**
 * 发送对话消息（Chat Message）
 *
 * @route POST /api/chat-messages
 * @dify  POST /v1/chat-messages
 *
 * @description 向 Dify Chat / Agent 类型应用发送消息并获取流式响应（SSE）。
 *              支持多轮对话 —— 传入 conversation_id 即可保持上下文。
 *
 * @requestBody {object} JSON
 *   - query           {string}              必填 — 用户消息内容
 *   - inputs          {Record<string,any>}  可选 — 额外变量
 *   - conversation_id {string}              可选 — 对话 ID（续接历史对话）
 *   - files           {Array<VisionFile>}   可选 — 多模态文件
 *
 * @returns {ReadableStream} SSE 事件流
 *   - event: message        — 逐段生成的文本
 *   - event: agent_message  — Agent 模式下的逐段文本
 *   - event: agent_thought  — Agent 思考过程
 *   - event: message_end    — 生成结束（含 conversation_id）
 */
export async function POST(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const body = await request.json()
  const {
    inputs = {},
    query,
    conversation_id,
    files,
  } = body

  try {
    const res = await chatClient.createChatMessage(
      inputs,
      query,
      user,
      true, // streaming
      conversation_id || null,
      files || null,
    )
    return new Response(res.data as any, {
      headers: {
        ...setSession(sessionId),
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  }
  catch (e: any) {
    const status: number = e?.response?.status ?? 500

    // e.response.data from a streaming Axios request is a Node.js Readable stream,
    // not a plain object — directly passing it to NextResponse.json causes a
    // "Converting circular structure to JSON" error. Read the stream first.
    let message: string = e?.message ?? 'Internal Server Error'
    try {
      const raw = e?.response?.data
      if (raw && typeof raw.read === 'function') {
        // Node.js stream — collect chunks into a string
        const chunks: Buffer[] = []
        for await (const chunk of raw)
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        const text = Buffer.concat(chunks).toString('utf-8')
        if (text) {
          const parsed = JSON.parse(text)
          if (parsed?.message) message = parsed.message
        }
      }
      else if (raw && typeof raw === 'object' && raw.message) {
        message = raw.message
      }
    }
    catch {
      // parse failure — keep the original e.message
    }

    return NextResponse.json({ message }, { status })
  }
}
