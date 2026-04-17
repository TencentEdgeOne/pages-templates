import { type NextRequest } from 'next/server'
import { CompletionClient, ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

/**
 * Returns the Dify base URL without a trailing `/v1` segment.
 * Audio routes need to call `/v1/audio-to-text` and `/v1/text-to-audio`
 * directly via fetch (the SDK doesn't expose them), so we strip `/v1` first.
 */
export const getDifyBaseUrl = () => API_URL.replace(/\/v1\/?$/, '')

export const chatClient = new ChatClient(API_KEY, API_URL || undefined)
export const completionClient = new CompletionClient(API_KEY, API_URL || undefined)
