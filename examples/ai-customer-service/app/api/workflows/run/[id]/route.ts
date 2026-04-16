import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * 获取工作流运行详情
 *
 * @route GET /api/workflows/run/:id
 * @dify  GET /v1/workflows/run/{id}
 *
 * @description 获取某次工作流执行的完整详情，包括输入参数、输出结果、
 *              各节点执行状态、耗时、Token 用量等。
 *              用于 History 面板中点击某条记录后展示详细信息。
 *
 * @pathParam id {string} 必填 — 工作流运行 ID（workflow_run_id，从日志列表或 SSE 事件中获取）
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {object} JSON — 工作流运行详情
 *   - id             {string}  运行 ID
 *   - workflow_id    {string}  工作流 ID
 *   - status         {string}  运行状态（succeeded / failed / stopped / running）
 *   - inputs         {object}  输入参数
 *   - outputs        {object}  输出结果
 *   - error          {string}  错误信息（仅失败时存在）
 *   - total_steps    {number}  总执行步骤数
 *   - total_tokens   {number}  总 Token 消耗
 *   - elapsed_time   {number}  总耗时（秒）
 *   - created_at     {number}  创建时间戳（秒）
 *   - finished_at    {number}  完成时间戳（秒）
 *
 * @errorResponse
 *   - 404 — 运行记录不存在
 *   - 500 — 服务端内部错误
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
