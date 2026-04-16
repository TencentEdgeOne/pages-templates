import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL } from '@/config'
import { getInfo } from '@/app/api/utils/common'

const chatClient = new ChatClient(API_KEY, API_URL || undefined)

/**
 * 删除对话
 *
 * @route DELETE /api/conversations/[conversationId]
 * @dify  DELETE /v1/conversations/{conversation_id}
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params
  const { user } = getInfo(request)
  try {
    const res = await chatClient.deleteConversation(conversationId, user)
    return NextResponse.json(res.data ?? { result: 'success' })
  }
  catch (e: any) {
    const status = e?.response?.status ?? 500
    const body = e?.response?.data ?? { message: e?.message ?? 'Internal Server Error' }
    return NextResponse.json(body, { status })
  }
}
