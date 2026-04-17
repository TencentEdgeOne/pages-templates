import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * Get workflow execution logs
 *
 * @route GET /api/workflows/logs
 * @dify  GET /v1/workflows/logs
 *
 * @description Paginated retrieval of workflow execution history.
 *              Used in the History panel to display summary info for each run (status, duration, token usage, etc.).
 *
 * @queryParam page    {string} Optional — Page number, default "1"
 * @queryParam limit   {string} Optional — Items per page, default "20"
 * @queryParam status  {string} Optional — Filter by status (succeeded / failed / stopped)
 * @queryParam keyword {string} Optional — Search keyword
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {object} JSON
 *   - data      {Array<WorkflowLogItem>} Log list
 *     - id              {string} Log ID
 *     - workflow_run     {object} Run details (id, status, elapsed_time, total_tokens, total_steps, etc.)
 *     - created_at      {number} Creation timestamp (seconds)
 *   - has_more  {boolean}                Whether more data is available
 *   - total     {number}                 Total record count
 *
 * @errorResponse
 *   - 401 — Invalid API Key
 *   - 500 — Internal server error
 *
 * @example
 *   GET /api/workflows/logs?page=1&limit=10
 *   GET /api/workflows/logs?status=failed&page=2&limit=20
 */
export async function GET(request: NextRequest) {
  const { sessionId } = getInfo(request)
  const { searchParams } = new URL(request.url)

  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  const status = searchParams.get('status') || ''
  const keyword = searchParams.get('keyword') || ''

  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  const params = new URLSearchParams()
  params.append('page', page)
  params.append('limit', limit)
  if (status)
    params.append('status', status)
  if (keyword)
    params.append('keyword', keyword)

  try {
    const res = await fetch(`${baseUrl}/workflows/logs?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch workflow logs' },
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
