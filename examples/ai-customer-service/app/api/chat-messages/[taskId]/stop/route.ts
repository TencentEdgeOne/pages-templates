import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo } from '@/app/api/utils/common'

/**
 * 停止对话消息生成
 *
 * @route POST /api/chat-messages/[taskId]/stop
 * @dify  POST /v1/chat-messages/{task_id}/stop
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params
  const { user } = getInfo(request)
  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  try {
    const res = await fetch(`${baseUrl}/chat-messages/${taskId}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    })

    // Body may be empty on success (204) or contain JSON on error
    const text = await res.text()
    const data = text ? JSON.parse(text) : { result: 'success' }

    return NextResponse.json(data, { status: res.ok ? 200 : res.status })
  }
  catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? 'Internal Server Error' },
      { status: 500 },
    )
  }
}
