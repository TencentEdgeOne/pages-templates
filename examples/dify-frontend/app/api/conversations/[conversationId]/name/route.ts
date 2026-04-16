import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL } from '@/config'
import { getInfo } from '@/app/api/utils/common'

const chatClient = new ChatClient(API_KEY, API_URL || undefined)

/**
 * 重命名 / 自动命名对话
 *
 * @route POST /api/conversations/[conversationId]/name
 * @dify  POST /v1/conversations/{conversation_id}/name
 *
 * @requestBody {object} JSON
 *   - name          {string}  可选 — 自定义名称（与 auto_generate 二选一）
 *   - auto_generate {boolean} 可选 — 由 Dify 自动生成名称
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params
  const { user } = getInfo(request)
  const body = await request.json()
  const { name, auto_generate = false } = body
  try {
    const res = await chatClient.renameConversation(
      conversationId,
      name || '',
      user,
      auto_generate,
    )
    return NextResponse.json(res.data ?? res)
  }
  catch (e: any) {
    const status = e?.response?.status ?? 500
    const body = e?.response?.data ?? { message: e?.message ?? 'Internal Server Error' }
    return NextResponse.json(body, { status })
  }
}
