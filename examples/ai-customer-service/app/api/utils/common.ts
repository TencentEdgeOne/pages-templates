import { type NextRequest } from 'next/server'
import { CompletionClient, ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID, IS_CHAT_APP } from '@/config'

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
  return { 'Set-Cookie': `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Secure` }
}

export const client = IS_CHAT_APP
  ? new ChatClient(API_KEY, API_URL || undefined)
  : new CompletionClient(API_KEY, API_URL || undefined)

export const isChatClient = IS_CHAT_APP
