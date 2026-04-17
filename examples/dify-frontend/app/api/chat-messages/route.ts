import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL } from '@/config'
import { getInfo, setSession } from '@/app/api/utils/common'

const chatClient = new ChatClient(API_KEY, API_URL || undefined)

/**
 * Send a chat message (Chat Message)
 *
 * @route POST /api/chat-messages
 * @dify  POST /v1/chat-messages
 *
 * @description Sends a message to a Dify Chat / Agent app and returns a streaming response (SSE).
 *              Supports multi-turn conversations — pass conversation_id to maintain context.
 *
 * @requestBody {object} JSON
 *   - query           {string}              required — user message
 *   - inputs          {Record<string,any>}  optional — extra variables
 *   - conversation_id {string}              optional — conversation ID (continue existing conversation)
 *   - files           {Array<VisionFile>}   optional — multimodal files
 *
 * @returns {ReadableStream} SSE event stream
 *   - event: message        — streamed text chunk
 *   - event: agent_message  — streamed text chunk in agent mode
 *   - event: agent_thought  — agent reasoning step
 *   - event: message_end    — generation complete (includes conversation_id)
 */
export async function POST(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const body = await request.json()
  const {
    inputs = {},
    query,
    conversation_id,
    files,
  } = body

  try {
    const res = await chatClient.createChatMessage(
      inputs,
      query,
      user,
      true, // streaming
      conversation_id || null,
      files || null,
    )
    return new Response(res.data as any, {
      headers: {
        ...setSession(sessionId),
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  }
  catch (e: any) {
    const status: number = e?.response?.status ?? 500

    // e.response.data from a streaming Axios request is a Node.js Readable stream,
    // not a plain object — directly passing it to NextResponse.json causes a
    // "Converting circular structure to JSON" error. Read the stream first.
    let message: string = e?.message ?? 'Internal Server Error'
    try {
      const raw = e?.response?.data
      if (raw && typeof raw.read === 'function') {
        // Node.js stream — collect chunks into a string
        const chunks: Buffer[] = []
        for await (const chunk of raw)
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        const text = Buffer.concat(chunks).toString('utf-8')
        if (text) {
          const parsed = JSON.parse(text)
          if (parsed?.message) message = parsed.message
        }
      }
      else if (raw && typeof raw === 'object' && raw.message) {
        message = raw.message
      }
    }
    catch {
      // parse failure — keep the original e.message
    }

    return NextResponse.json({ message }, { status })
  }
}
