import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getInfo, setSession } from '@/app/api/utils/common'
import { API_KEY, API_URL } from '@/config'

/**
 * 停止工作流执行
 *
 * @route POST /api/workflows/:taskId/stop
 * @dify  POST /v1/workflows/{task_id}/stop
 *
 * @description 停止一个正在执行中的 Workflow 任务。
 *              前端在用户点击"停止"按钮时调用，同时配合客户端 AbortController 中断 SSE 连接。
 *              仅对 streaming 模式下的任务有效。
 *
 * @pathParam taskId {string} 必填 — 任务 ID（从 SSE 事件 workflow_started 中的 task_id 字段获取）
 *
 * @requestBody 无需请求体（user 信息由服务端自动填充）
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {object} JSON
 *   - result {string} "success" 表示停止成功
 *
 * @errorResponse
 *   - 404 — task_id 不存在或任务已完成
 *   - 500 — 服务端内部错误
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
