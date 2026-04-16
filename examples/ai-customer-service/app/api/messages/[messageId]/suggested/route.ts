import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

/**
 * 获取建议问题
 *
 * @route GET /api/messages/[messageId]/suggested
 * @dify  GET /v1/messages/{message_id}/suggested
 *
 * @description 基于上一条消息，返回 Dify 推荐的跟进问题列表。
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params
  const { sessionId, user } = getInfo(request)
  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  try {
    const res = await fetch(
      `${baseUrl}/messages/${messageId}/suggested?user=${encodeURIComponent(user)}`,
      {
        headers: { 'Authorization': `Bearer ${API_KEY}` },
      },
    )

    const text = await res.text()
    const data = text ? JSON.parse(text) : {}

    return NextResponse.json(data, {
      status: res.ok ? 200 : res.status,
      headers: setSession(sessionId),
    })
  }
  catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? 'Internal Server Error' },
      { status: 500 },
    )
  }
}
