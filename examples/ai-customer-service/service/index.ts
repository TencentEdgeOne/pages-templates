import type { IOnCompleted, IOnData, IOnError, IOnNodeFinished, IOnNodeStarted, IOnTaskId, IOnWorkflowFinished, IOnWorkflowStarted, IOnMessageEnd, IOnAgentMessage, IOnAgentThought } from './base'
import { get, post, del, ssePost, upload } from './base'
import type { Feedbacktype } from '@/types/app'
import { API_PREFIX } from '@/config'

export const sendCompletionMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onError,
    onTaskId,
    abortController,
  }: {
    onData: IOnData
    onCompleted: IOnCompleted
    onError: IOnError
    onTaskId?: IOnTaskId
    abortController?: AbortController
  },
) => {
  return ssePost('completion-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, onError, onTaskId, abortController })
}

export const sendWorkflowMessage = async (
  body: Record<string, any>,
  {
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
    onError,
    onTaskId,
    abortController,
  }: {
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
    onError?: IOnError
    onTaskId?: IOnTaskId
    abortController?: AbortController
  },
) => {
  return ssePost('workflows/run', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onNodeStarted, onWorkflowStarted, onWorkflowFinished, onNodeFinished, onError, onTaskId, abortController })
}

export const stopCompletionMessage = async (taskId: string) => {
  return post(`completion-messages/${taskId}/stop`)
}

export const stopWorkflow = async (taskId: string) => {
  return post(`workflows/${taskId}/stop`)
}

export const fetchAppParams = async () => {
  return get('parameters')
}

export const fetchWorkflowLogs = async (params?: { page?: number; limit?: number; status?: string; keyword?: string }) => {
  const query: Record<string, string> = {}
  if (params?.page) query.page = String(params.page)
  if (params?.limit) query.limit = String(params.limit)
  if (params?.status) query.status = params.status
  if (params?.keyword) query.keyword = params.keyword
  return get('workflows/logs', { params: query })
}

export const fetchWorkflowRunDetail = async (id: string) => {
  return get(`workflows/run/${id}`)
}

export const fetchAppMeta = async () => {
  return get('meta')
}

export const fetchMessages = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId } })
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

// ────────────────────────────────────────────────
// Chat / Agent APIs
// ────────────────────────────────────────────────

export const sendChatMessage = async (
  body: {
    query: string
    inputs?: Record<string, any>
    conversation_id?: string
    files?: any[]
  },
  {
    onData,
    onCompleted,
    onError,
    onTaskId,
    onMessageEnd,
    onAgentMessage,
    onAgentThought,
    abortController,
  }: {
    onData: IOnData
    onCompleted?: IOnCompleted
    onError?: IOnError
    onTaskId?: IOnTaskId
    onMessageEnd?: IOnMessageEnd
    onAgentMessage?: IOnAgentMessage
    onAgentThought?: IOnAgentThought
    abortController?: AbortController
  },
) => {
  return ssePost('chat-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, onError, onTaskId, onMessageEnd, onAgentMessage, onAgentThought, abortController })
}

export const stopChatMessage = async (taskId: string) => {
  return post(`chat-messages/${taskId}/stop`)
}

export const fetchSuggestedQuestions = async (messageId: string) => {
  return get(`messages/${messageId}/suggested`)
}

export const fetchConversations = async (params?: { first_id?: string; limit?: number }) => {
  const query: Record<string, string> = {}
  if (params?.first_id) query.first_id = params.first_id
  if (params?.limit) query.limit = String(params.limit)
  return get('conversations', { params: query })
}

export const deleteConversation = async (conversationId: string) => {
  return del(`conversations/${conversationId}`)
}

export const renameConversation = async (
  conversationId: string,
  name: string,
  autoGenerate = false,
) => {
  return post(`conversations/${conversationId}/name`, {
    body: { name, auto_generate: autoGenerate },
  })
}

// ────────────────────────────────────────────────
// Multimodal: STT / TTS / File Upload
// ────────────────────────────────────────────────

/**
 * Send an audio blob to Dify's speech-to-text endpoint and return the
 * transcribed text string.
 */
export const audioToText = async (blob: Blob): Promise<string> => {
  const formData = new FormData()
  formData.append('file', blob, 'recording.webm')
  const res: any = await globalThis.fetch(`${API_PREFIX}/audio-to-text`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(r => r.json())
  return res.text ?? ''
}

/**
 * Convert text to speech via Dify and return an audio Blob.
 * @param text       The text to synthesise.
 * @param messageId  Optional Dify message ID for voice cloning / consistency.
 */
export const textToAudio = async (text: string, messageId?: string): Promise<Blob> => {
  const res = await globalThis.fetch(`${API_PREFIX}/text-to-audio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ text, message_id: messageId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `TTS request failed (${res.status})` }))
    throw new Error(err.message || `TTS request failed (${res.status})`)
  }
  return res.blob()
}

/**
 * Upload a generic file (image or document) to Dify's file-upload endpoint.
 * Progress is reported via `onProgressCallback` (0–100).
 * @returns Promise resolving to the Dify upload_file_id string.
 */
export const uploadFile = (
  file: File,
  onProgressCallback: (progress: number) => void,
  onSuccessCallback: (fileId: string) => void,
  onErrorCallback: () => void,
) => {
  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', file.type.startsWith('image/') ? 'image' : 'document')

  upload({
    xhr,
    url: `${API_PREFIX}/file-upload`,
    data: formData,
    headers: {},
    onprogress: (e: ProgressEvent) => {
      if (e.lengthComputable)
        onProgressCallback(Math.round((e.loaded / e.total) * 100))
    },
  }).then((res: any) => {
    // upload() resolves with { id: xhr.response } where xhr.response is the
    // raw file ID string returned by /api/file-upload (just a UUID, not JSON).
    const fileId: string = res.id ?? ''
    if (fileId)
      onSuccessCallback(fileId)
    else
      onErrorCallback()
  }).catch(() => {
    onErrorCallback()
  })
}