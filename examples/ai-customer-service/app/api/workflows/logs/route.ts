import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * 获取工作流执行日志
 *
 * @route GET /api/workflows/logs
 * @dify  GET /v1/workflows/logs
 *
 * @description 分页获取工作流的历史执行记录。
 *              用于 History 面板展示每次运行的状态、耗时、Token 用量等摘要信息。
 *
 * @queryParam page    {string} 可选 — 页码，默认 "1"
 * @queryParam limit   {string} 可选 — 每页条数，默认 "20"
 * @queryParam status  {string} 可选 — 按状态筛选（succeeded / failed / stopped）
 * @queryParam keyword {string} 可选 — 搜索关键词
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {object} JSON
 *   - data      {Array<WorkflowLogItem>} 日志列表
 *     - id              {string} 日志 ID
 *     - workflow_run     {object} 运行详情（id, status, elapsed_time, total_tokens, total_steps 等）
 *     - created_at      {number} 创建时间戳（秒）
 *   - has_more  {boolean}                是否还有更多数据
 *   - total     {number}                 总记录数
 *
 * @errorResponse
 *   - 401 — API Key 无效
 *   - 500 — 服务端内部错误
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
