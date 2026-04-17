import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

/**
 * Send a completion message (Completion Message)
 *
 * @route POST /api/completion-messages
 * @dify  POST /v1/completion-messages
 *
 * @description Send a message to a Dify Completion app and receive a streaming response.
 *              Suitable for single-shot text generation (not multi-turn conversation), returns an SSE stream.
 *
 * @requestBody {object} JSON
 *   - inputs  {Record<string, any>} Required — Key-value pairs of user input variables, corresponding to the app's prompt_variables
 *   - files   {Array<VisionFile>}   Optional — Multimodal file list (images, etc.), must be uploaded via /api/file-upload first
 *
 * @cookie session_id {string} Optional — User session identifier, auto-generated if not present
 *
 * @returns {ReadableStream} SSE event stream (text/event-stream)
 *   - event: message     — Incrementally generated text content
 *   - event: message_end — Generation finished
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
  const res = await client.createCompletionMessage(inputs, user, true, files)
  return new Response(res.data as any)
}
