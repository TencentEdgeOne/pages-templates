import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { chatClient as client, getInfo, setSession } from '@/app/api/utils/common'

/**
 * Get conversation message list
 *
 * @route GET /api/messages
 * @dify  GET /v1/messages
 *
 * @description Get the message history for a specific conversation.
 *              Used for message history retrieval in Chat / Agent type applications.
 *
 * @queryParam conversation_id {string} Required — Conversation ID to retrieve messages from
 *
 * @cookie session_id {string} Optional — User session identifier, auto-generated if not present
 *
 * @returns {object} JSON
 *   - data {Array<Message>} Message list, each containing id, role, content, created_at, etc.
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
