import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * Stop completion message generation
 *
 * @route POST /api/completion-messages/:taskId/stop
 * @dify  POST /v1/completion-messages/{task_id}/stop
 *
 * @description Stops an in-progress streaming Completion task.
 *              Called when the user clicks "Stop"; works together with the client-side
 *              AbortController to cancel the SSE connection.
 *              Only effective for tasks running in streaming mode.
 *
 * @pathParam taskId {string} required — task ID (obtained from the task_id field in SSE events)
 *
 * @requestBody none (user info is populated server-side)
 *
 * @cookie session_id {string} optional — user session identifier
 *
 * @returns {object} JSON
 *   - result {string} "success" when stopped successfully
 *
 * @errorResponse
 *   - 404 — task_id not found or task already completed
 *   - 500 — internal server error
 *
 * @example
 *   POST /api/completion-messages/d9e8f7a6-5b4c-3d2e-1f0a-9b8c7d6e5f4a/stop
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { sessionId, user } = getInfo(request)
  const { taskId } = await params
  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  try {
    const res = await fetch(`${baseUrl}/completion-messages/${taskId}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to stop completion' },
        { status: res.status, headers: setSession(sessionId) },
      )
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  }
  catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: setSession(sessionId) },
    )
  }
}
