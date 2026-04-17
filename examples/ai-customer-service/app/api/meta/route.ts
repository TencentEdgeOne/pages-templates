import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * Get application meta information
 *
 * @route GET /api/meta
 * @dify  GET /v1/meta
 *
 * @description Get the Dify application's metadata, including tool icons.
 *              Used on the frontend to auto-populate the app name and icon, reducing hardcoded configuration.
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {object} JSON
 *   - tool_icons {Record<string, string | object>} Tool icon mapping used in the application
 *
 * @errorResponse
 *   - 401 — Invalid or unconfigured API Key
 *   - 500 — Internal server error
 *
 * @example
 *   GET /api/meta
 */
export async function GET(request: NextRequest) {
  const { sessionId } = getInfo(request)
  const baseUrl = API_URL || 'https://api.dify.ai/v1'

  try {
    const res = await fetch(`${baseUrl}/meta`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch app meta' },
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
