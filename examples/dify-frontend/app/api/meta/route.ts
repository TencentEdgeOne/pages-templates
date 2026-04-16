import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * 获取应用元信息
 *
 * @route GET /api/meta
 * @dify  GET /v1/meta
 *
 * @description 获取 Dify 应用的元数据信息，包括工具图标等。
 *              用于在前端自动填充应用名称、图标，减少硬编码配置。
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {object} JSON
 *   - tool_icons {Record<string, string | object>} 应用中使用的工具图标映射
 *
 * @errorResponse
 *   - 401 — API Key 无效或未配置
 *   - 500 — 服务端内部错误
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
