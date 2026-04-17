import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * Stop workflow execution
 *
 * @route POST /api/workflows/:taskId/stop
 * @dify  POST /v1/workflows/{task_id}/stop
 *
 * @description Stop a Workflow task in progress.
 *              Called when the user clicks the "Stop" button, combined with client-side AbortController to abort the SSE connection.
 *              Only effective for tasks in streaming mode.
 *
 * @pathParam taskId {string} Required — Task ID (obtained from the task_id field in the workflow_started SSE event)
 *
 * @requestBody No body required (user info is auto-populated by the server)
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {object} JSON
 *   - result {string} "success" indicates the task was stopped
 *
 * @errorResponse
 *   - 404 — task_id does not exist or task is already completed
 *   - 500 — Internal server error
 *
 * @example
 *   POST /api/workflows/d9e8f7a6-5b4c-3d2e-1f0a-9b8c7d6e5f4a/stop
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { sessionId, user } = getInfo(request)
  const { taskId } = await params
  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  try {
    const res = await fetch(`${baseUrl}/workflows/${taskId}/stop`, {
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
        { error: errorData.message || 'Failed to stop workflow' },
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
