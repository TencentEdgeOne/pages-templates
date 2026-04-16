import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { chatClient as client, getInfo } from '@/app/api/utils/common'

/**
 * 消息反馈（点赞/踩）
 *
 * @route POST /api/messages/:messageId/feedbacks
 * @dify  POST /v1/messages/{message_id}/feedbacks
 *
 * @description 对生成结果进行反馈评价（点赞或踩）。
 *              反馈数据会发送到 Dify 平台，用于模型优化和质量追踪。
 *
 * @pathParam messageId {string} 必填 — 消息 ID（Completion 返回的 message_id 或 Workflow 的 workflow_run_id）
 *
 * @requestBody {object} JSON
 *   - rating {string | null} 必填 — 评分值
 *     - "like"    — 点赞（正面反馈）
 *     - "dislike" — 踩（负面反馈）
 *     - null      — 撤销之前的反馈
 *
 * @cookie session_id {string} 可选 — 用户会话标识
 *
 * @returns {object} JSON — Dify 返回的反馈结果
 *   - result {string} "success" 表示反馈成功
 *
 * @example
 *   POST /api/messages/abc-123/feedbacks
 *   { "rating": "like" }
 */
export async function POST(request: NextRequest, { params }: {
  params: Promise<{ messageId: string }>
}) {
  const body = await request.json()
  const {
    rating,
  } = body
  const { messageId } = await params
  const { user } = getInfo(request)
  try {
    const { data } = await client.messageFeedback(messageId, rating, user)
    return NextResponse.json(data)
  }
  catch (e) {
    return NextResponse.json(e)
  }
}
