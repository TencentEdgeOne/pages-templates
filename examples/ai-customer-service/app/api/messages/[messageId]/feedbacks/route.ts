import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * Message feedback (like/dislike)
 *
 * @route POST /api/messages/:messageId/feedbacks
 * @dify  POST /v1/messages/{message_id}/feedbacks
 *
 * @description Provide feedback (like or dislike) on a generated result.
 *              Feedback data is sent to the Dify platform for model optimization and quality tracking.
 *
 * @pathParam messageId {string} Required — Message ID (message_id from Completion or workflow_run_id from Workflow)
 *
 * @requestBody {object} JSON
 *   - rating {string | null} Required — Rating value
 *     - "like"    — Like (positive feedback)
 *     - "dislike" — Dislike (negative feedback)
 *     - null      — Revoke previous feedback
 *
 * @cookie session_id {string} Optional — User session identifier
 *
 * @returns {object} JSON — Feedback result from Dify
 *   - result {string} "success" indicates feedback was recorded
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
  catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? 'Internal Server Error' },
      { status: e?.response?.status ?? 500 },
    )
  }
}
