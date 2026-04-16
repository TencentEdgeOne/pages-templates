import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { chatClient as client, getInfo, setSession } from '@/app/api/utils/common'

/**
 * 获取对话消息列表
 *
 * @route GET /api/messages
 * @dify  GET /v1/messages
 *
 * @description 获取指定对话的消息历史记录。
 *              适用于 Chat / Agent 类型应用的多轮对话消息回溯。
 *
 * @queryParam conversation_id {string} 必填 — 对话 ID，用于指定要获取消息的对话
 *
 * @cookie session_id {string} 可选 — 用户会话标识，若不存在则自动生成
 *
 * @returns {object} JSON
 *   - data {Array<Message>} 消息列表，每条消息包含 id、role、content、created_at 等
 *
 * @example
 *   GET /api/messages?conversation_id=abc-123
 */
export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')

  try {
    const res: any = await client.getConversationMessages(user, conversationId as string)
    return NextResponse.json(res.data ?? res, {
      headers: setSession(sessionId),
    })
  }
  catch (e: any) {
    const status: number = e?.response?.status ?? 500
    let message = e?.message ?? 'Internal Server Error'
    // If the error message mentions wrong endpoint (Dify 404), map to a user-friendly message
    if (status === 404 && message?.includes('/v1/messages')) {
      message = 'This conversation cannot be loaded at this time.'
    }
    try {
      const raw = e?.response?.data
      if (raw && typeof raw === 'object' && raw.message) message = raw.message
    }
    catch { /* ignore */ }
    return NextResponse.json({ message }, {
      status,
      headers: setSession(sessionId),
    })
  }
}
