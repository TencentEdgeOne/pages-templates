import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

const chatClient = new ChatClient(API_KEY, API_URL || undefined)

/**
 * 获取对话列表
 *
 * @route GET /api/conversations
 * @dify  GET /v1/conversations
 */
export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const first_id = searchParams.get('first_id') || null
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20

  try {
    const { data }: any = await chatClient.getConversations(user, first_id, limit, null)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  }
  catch (e: any) {
    const status = e?.response?.status ?? 500
    const body = e?.response?.data ?? { message: e?.message ?? 'Internal Server Error' }
    return NextResponse.json(body, { status })
  }
}
