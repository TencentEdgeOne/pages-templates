import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * Get workflow run details
 *
 * @route GET /api/workflows/run/:id
 * @dify  GET /v1/workflows/run/{id}
 *
 * @description Get full details of a workflow execution, including input parameters, output results,
 *              node execution statuses, elapsed time, token usage, etc.
 *              Used to display detailed info when clicking a record in the History panel.
 *
 * @pathParam id {string} Required — Workflow run ID (workflow_run_id, from log list or SSE events)
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {object} JSON — Workflow run details
 *   - id             {string}  Run ID
 *   - workflow_id    {string}  Workflow ID
 *   - status         {string}  Run status (succeeded / failed / stopped / running)
 *   - inputs         {object}  Input parameters
 *   - outputs        {object}  Output results
 *   - error          {string}  Error message (only present on failure)
 *   - total_steps    {number}  Total execution steps
 *   - total_tokens   {number}  Total token consumption
 *   - elapsed_time   {number}  Total elapsed time (seconds)
 *   - created_at     {number}  Creation timestamp (seconds)
 *   - finished_at    {number}  Completion timestamp (seconds)
 *
 * @errorResponse
 *   - 404 — Run record does not exist
 *   - 500 — Internal server error
 *
 * @example
 *   GET /api/workflows/run/wfr-abc123-def456
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionId, user } = getInfo(request)
  const { id } = await params
  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  try {
    const res = await fetch(`${baseUrl}/workflows/run/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch workflow run detail' },
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
