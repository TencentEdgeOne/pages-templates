import { type NextRequest } from 'next/server'
import { completionClient, getInfo } from '@/app/api/utils/common'

/**
 * Send a completion message (Completion Message)
 *
 * @route POST /api/completion-messages
 * @dify  POST /v1/completion-messages
 *
 * @description Sends a message to a Dify Completion app and returns a streaming response.
 *              For single-turn text generation (not multi-turn chat), returns an SSE stream.
 *
 * @requestBody {object} JSON
 *   - inputs  {Record<string, any>} required — key-value pairs matching the app's prompt_variables
 *   - files   {Array<VisionFile>}   optional — multimodal files (images etc.), must be uploaded via /api/file-upload first
 *
 * @cookie session_id {string} optional — user session identifier; auto-generated if absent
 *
 * @returns {ReadableStream} SSE event stream (text/event-stream)
 *   - event: message     — streamed text chunk
 *   - event: message_end — generation complete
 *
 * @example
 *   POST /api/completion-messages
 *   { "inputs": { "topic": "The future of AI" } }
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    files,
  } = body
  const { user } = getInfo(request)
  const res = await completionClient.createCompletionMessage(inputs, user, true, files)
  return new Response(res.data as any)
}
