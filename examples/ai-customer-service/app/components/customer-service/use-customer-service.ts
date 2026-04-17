'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  sendChatMessage,
  sendWorkflowMessage,
  stopChatMessage,
  stopWorkflow,
  fetchMessages,
  fetchConversations,
  fetchWorkflowLogs,
  fetchSuggestedQuestions,
  uploadFile,
  audioToText,
  textToAudio,
  updateFeedback,
} from '@/service'
import type {
  UnifiedMessage,
  UnifiedSession,
  EmbedUIState,
  WorkflowEventMessage,
  AttachedFile,
  VisionFile,
  Feedbacktype,
} from '@/types/app'
import { WorkflowRunningStatus, TransferMethod } from '@/types/app'
import type { AppTypeValue } from '@/config'
import type { AppParams } from './index'

export type UseCustomerServiceOptions = {
  appType: AppTypeValue
  appParams: AppParams | null
  isEmbed?: boolean
  /** initial conversationId (passed from URL or parent component) */
  initialConversationId?: string | null
}

export type UseCustomerServiceReturn = {
  // ── Message stream ──
  messages: UnifiedMessage[]
  isResponding: boolean
  // ── Input ──
  inputText: string
  setInputText: (v: string) => void
  attachedFiles: AttachedFile[]
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  suggestedQuestions: string[]
  // ── Send / Stop ──
  handleSend: () => Promise<void>
  handleStop: () => void
  // ── Session history ──
  sessions: UnifiedSession[]
  activeSessionId: string | null
  switchSession: (id: string) => void
  startNewSession: () => void
  // ── embed UI ──
  embedState: EmbedUIState
  setHistoryDrawerOpen: (open: boolean) => void
  // ── Feedback ──
  handleFeedback: (messageId: string, feedback: Feedbacktype) => Promise<void>
  // ── TTS ──
  ttsPlayingMessageId: string | null
  handleTts: (messageId: string, text: string) => Promise<void>
  // ── STT ──
  isRecording: boolean
  handleToggleRecording: () => Promise<void>
}

/** Convert AttachedFile[] to the VisionFile[] format expected by Dify */
function toVisionFiles(files: AttachedFile[]): VisionFile[] {
  return files
    .filter(f => f.uploadFileId && f.progress === 100)
    .map(f => ({
      type: f.mimeType.startsWith('image/') ? 'image' : 'document',
      transfer_method: TransferMethod.local_file,
      url: '',
      upload_file_id: f.uploadFileId,
    }))
}

const MAX_FILES = 5

export function useCustomerService({
  appType,
  appParams,
  isEmbed = false,
  initialConversationId = null,
}: UseCustomerServiceOptions): UseCustomerServiceReturn {
  // ── Message stream ──
  const [messages, setMessages] = useState<UnifiedMessage[]>([])
  const [isResponding, setIsResponding] = useState(false)

  // ── Input ──
  const [inputText, setInputText] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])

  // ── Sessions ──
  const [sessions, setSessions] = useState<UnifiedSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(initialConversationId)

  // ── Embed ──
  const [embedState, setEmbedState] = useState<EmbedUIState>({
    isEmbed,
    historyDrawerOpen: false,
  })

  // ── TTS ──
  const [ttsPlayingMessageId, setTtsPlayingMessageId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ── STT ──
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // ── Abort ──
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentTaskIdRef = useRef<string | null>(null)

  // ── Skip sidebar refresh when conversation is created mid-stream ──
  const skipNextResetRef = useRef(false)

  // ── Load session history list ──
  const loadSessions = useCallback(async () => {
    try {
      if (appType === 'chat' || appType === 'agent') {
        const res: any = await fetchConversations({ limit: 50 })
        const data: UnifiedSession[] = (res?.data ?? []).map((c: any) => ({
          id: c.id,
          name: c.name || 'New session',
          appType,
          createdAt: (c.created_at ?? 0) * 1000,
        }))
        setSessions(data)
      }
      else {
        // workflow: load recent run logs
        const res: any = await fetchWorkflowLogs({ limit: 50 })
        const data: UnifiedSession[] = (res?.data ?? []).map((log: any) => ({
          id: log.id,
          name: new Date(log.created_at * 1000).toLocaleString(),
          appType: 'workflow' as const,
          createdAt: (log.created_at ?? 0) * 1000,
        }))
        setSessions(data)
      }
    }
    catch {
      // Silently fail — history will simply not be shown
    }
  }, [appType])

  // ── Switch session / load history messages ──
  const switchSession = useCallback(async (id: string) => {
    if (id === activeSessionId) return
    setActiveSessionId(id)
    setMessages([])
    setSuggestedQuestions([])

    if (appType === 'chat' || appType === 'agent') {
      try {
        const res: any = await fetchMessages(id)
        const loaded: UnifiedMessage[] = (res?.data ?? []).flatMap((m: any): UnifiedMessage[] => {
          const userMsg: UnifiedMessage = {
            id: `${m.id}-user`,
            kind: 'user',
            content: m.query ?? '',
            createdAt: (m.created_at ?? 0) * 1000,
            attachments: m.message_files?.map((f: any) => ({
              name: f.filename ?? '',
              mimeType: f.mime_type ?? '',
              previewUrl: f.url,
            })) ?? [],
          }
          const assistantMsg: UnifiedMessage = {
            id: m.id,
            kind: 'assistant',
            content: m.answer ?? '',
            difyMessageId: m.id,
            feedback: m.feedback,
            createdAt: (m.created_at ?? 0) * 1000,
          }
          return [userMsg, assistantMsg]
        })
        setMessages(loaded)
      }
      catch {
        // Silently fail
      }
    }
    // Workflow sessions don't load historical messages (each run is independent)
  }, [activeSessionId, appType])

  // ── New session ──
  const startNewSession = useCallback(() => {
    setActiveSessionId(null)
    setMessages([])
    setSuggestedQuestions([])
    setAttachedFiles([])
    skipNextResetRef.current = false
  }, [])

  // ── File management ──
  const addFiles = useCallback((files: File[]) => {
    const visionEnabled = appParams?.file_upload?.enabled ?? false
    if (!visionEnabled) return

    const maxFiles: number = appParams?.file_upload?.number_limits ?? MAX_FILES
    setAttachedFiles((prev) => {
      const remaining = maxFiles - prev.length
      const toAdd = files.slice(0, remaining)
      const newEntries: AttachedFile[] = toAdd.map(f => ({
        _id: uuidv4(),
        file: f,
        name: f.name,
        size: f.size,
        mimeType: f.type,
        uploadFileId: '',
        progress: 0,
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      }))

      // Trigger upload
      newEntries.forEach((entry) => {
        uploadFile(
          entry.file,
          (p) => {
            setAttachedFiles(cur =>
              cur.map(x => x._id === entry._id ? { ...x, progress: p } : x),
            )
          },
          (fileId) => {
            setAttachedFiles(cur =>
              cur.map(x => x._id === entry._id ? { ...x, uploadFileId: fileId, progress: 100 } : x),
            )
          },
          () => {
            setAttachedFiles(cur =>
              cur.map(x => x._id === entry._id ? { ...x, progress: -1 } : x),
            )
          },
        )
      })

      return [...prev, ...newEntries]
    })
  }, [appParams])

  const removeFile = useCallback((id: string) => {
    setAttachedFiles((prev) => {
      const entry = prev.find(f => f._id === id)
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl)
      return prev.filter(f => f._id !== id)
    })
  }, [])

  // ── Send ──
  const handleSend = useCallback(async () => {
    const query = inputText.trim()
    if (!query || isResponding) return

    // Wait for all attachments to finish uploading
    const hasUploading = attachedFiles.some(f => f.progress >= 0 && f.progress < 100)
    if (hasUploading) return

    const userMsg: UnifiedMessage = {
      id: uuidv4(),
      kind: 'user',
      content: query,
      createdAt: Date.now(),
      attachments: attachedFiles.map(f => ({
        name: f.name,
        mimeType: f.mimeType,
        previewUrl: f.previewUrl,
      })),
    }

    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setSuggestedQuestions([])

    const visionFiles = toVisionFiles(attachedFiles)
    setAttachedFiles([])

    setIsResponding(true)
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    if (appType === 'chat' || appType === 'agent') {
      // ── Chat / Agent stream ──
      const assistantMsgId = uuidv4()
      const assistantMsg: UnifiedMessage = {
        id: assistantMsgId,
        kind: 'assistant',
        content: '',
        isStreaming: true,
        createdAt: Date.now(),
      }
      setMessages(prev => [...prev, assistantMsg])

      await sendChatMessage(
        {
          query,
          inputs: appParams?.user_input_form ? {} : undefined,
          conversation_id: activeSessionId ?? undefined,
          files: visionFiles.length > 0 ? visionFiles : undefined,
        },
        {
          abortController,
          onTaskId: (taskId) => { currentTaskIdRef.current = taskId },
          onData: (_token, isFirst, moreInfo) => {
            if (isFirst && moreInfo?.conversationId && !activeSessionId) {
              skipNextResetRef.current = true
              setActiveSessionId(moreInfo.conversationId)
            }
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantMsgId && m.kind === 'assistant'
                  ? { ...m, content: m.content + _token }
                  : m,
              ),
            )
          },
          onMessageEnd: (difyMessageId) => {
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantMsgId && m.kind === 'assistant'
                  ? { ...m, isStreaming: false, difyMessageId }
                  : m,
              ),
            )
            // Load suggested questions
            if (difyMessageId && appParams?.suggested_questions_after_answer?.enabled) {
              fetchSuggestedQuestions(difyMessageId)
                .then((res: any) => setSuggestedQuestions(res?.data ?? []))
                .catch(() => {})
            }
          },
          onAgentThought: (thought) => {
            // agent_thought: add as a separate message (one per event)
            const thoughtMsg: UnifiedMessage = {
              id: uuidv4(),
              kind: 'agent_thought',
              agentThought: thought as any,
              createdAt: Date.now(),
            }
            setMessages(prev => [...prev, thoughtMsg])
          },
          onCompleted: (hasError?: boolean) => {
            setIsResponding(false)
            if (!hasError) {
              if (!skipNextResetRef.current)
                loadSessions()
              else
                skipNextResetRef.current = false
            }
          },
          onError: () => {
            setMessages(prev =>
              prev.map(m =>
                m.id === assistantMsgId && m.kind === 'assistant'
                  ? { ...m, isStreaming: false, content: m.content || '[Request failed, please retry]' }
                  : m,
              ),
            )
            setIsResponding(false)
          },
        },
      )
    }
    else {
      // ── Workflow stream ──
      const wfMsgId = uuidv4()
      const wfMsg: UnifiedMessage = {
        id: wfMsgId,
        kind: 'workflow_event',
        workflowEvent: {
          runId: wfMsgId,
          status: WorkflowRunningStatus.Waiting,
          nodes: [],
        },
        createdAt: Date.now(),
      }
      setMessages(prev => [...prev, wfMsg])

      const updateWfEvent = (updater: (prev: WorkflowEventMessage) => WorkflowEventMessage) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === wfMsgId && m.kind === 'workflow_event' && m.workflowEvent
              ? { ...m, workflowEvent: updater(m.workflowEvent) }
              : m,
          ),
        )
      }

      await sendWorkflowMessage(
        {
          inputs: { query },
          files: visionFiles.length > 0 ? visionFiles : undefined,
        },
        {
          abortController,
          onTaskId: (taskId) => { currentTaskIdRef.current = taskId },
          onWorkflowStarted: (data) => {
            updateWfEvent(ev => ({
              ...ev,
              runId: data.workflow_run_id ?? ev.runId,
              status: WorkflowRunningStatus.Running,
            }))
          },
          onNodeStarted: (_data) => {
            // Node start: do not append yet, wait for finished event
          },
          onNodeFinished: (data) => {
            const nd = data.data
            updateWfEvent(ev => ({
              ...ev,
              nodes: [
                ...ev.nodes,
                {
                  id: nd.id ?? uuidv4(),
                  index: nd.index ?? ev.nodes.length,
                  predecessor_node_id: nd.predecessor_node_id ?? '',
                  node_id: nd.node_id ?? '',
                  node_type: nd.node_type as any,
                  title: nd.node_type ?? '',
                  inputs: nd.inputs,
                  process_data: nd.process_data ?? null,
                  outputs: nd.outputs,
                  status: nd.status ?? 'succeeded',
                  error: nd.error,
                  elapsed_time: nd.elapsed_time ?? 0,
                  execution_metadata: nd.execution_metadata ?? { total_tokens: 0, total_price: 0, currency: '' },
                  created_at: nd.created_at ?? Date.now() / 1000,
                  created_by: { id: '', name: '', email: '' },
                  finished_at: Date.now() / 1000,
                  expand: false,
                },
              ],
            }))
          },
          onWorkflowFinished: (data) => {
            const outputText = data.data?.outputs
              ? (typeof data.data.outputs === 'string'
                  ? data.data.outputs
                  : (data.data.outputs.text ?? data.data.outputs.answer ?? JSON.stringify(data.data.outputs)))
              : ''

            updateWfEvent(ev => ({
              ...ev,
              status: data.data?.status === 'succeeded'
                ? WorkflowRunningStatus.Succeeded
                : WorkflowRunningStatus.Failed,
              outputText,
              error: data.data?.error,
              elapsedMs: data.data?.elapsed_time ? Math.round(data.data.elapsed_time * 1000) : undefined,
            }))

            // Append workflow output as an assistant message for easy reading
            if (outputText) {
              const answerMsg: UnifiedMessage = {
                id: uuidv4(),
                kind: 'assistant',
                content: outputText,
                createdAt: Date.now(),
              }
              setMessages(prev => [...prev, answerMsg])
            }

            setIsResponding(false)
            loadSessions()
          },
          onError: () => {
            updateWfEvent(ev => ({
              ...ev,
              isStreaming: false,
              status: WorkflowRunningStatus.Failed,
            }))
            setIsResponding(false)
          },
        },
      )
    }
  }, [inputText, isResponding, attachedFiles, appType, appParams, activeSessionId, loadSessions])

  // ── Stop ──
  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort()
    if (currentTaskIdRef.current) {
      if (appType === 'chat' || appType === 'agent')
        stopChatMessage(currentTaskIdRef.current).catch(() => {})
      else
        stopWorkflow(currentTaskIdRef.current).catch(() => {})
      currentTaskIdRef.current = null
    }
    setIsResponding(false)
    setMessages(prev =>
      prev.map(m => 'isStreaming' in m && m.isStreaming ? { ...m, isStreaming: false } : m),
    )
  }, [appType])

  // ── Feedback ──
  const handleFeedback = useCallback(async (messageId: string, feedback: Feedbacktype) => {
    await updateFeedback({ url: `messages/${messageId}/feedbacks`, body: feedback })
    setMessages(prev =>
      prev.map(m => m.kind === 'assistant' && m.difyMessageId === messageId ? { ...m, feedback } : m),
    )
  }, [])

  // ── TTS ──
  const handleTts = useCallback(async (messageId: string, text: string) => {
    if (ttsPlayingMessageId === messageId) {
      audioRef.current?.pause()
      setTtsPlayingMessageId(null)
      return
    }
    try {
      const blob = await textToAudio(text, messageId)
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }
      const audio = new Audio(url)
      audioRef.current = audio
      setTtsPlayingMessageId(messageId)
      audio.onended = () => setTtsPlayingMessageId(null)
      audio.play()
    }
    catch {
      setTtsPlayingMessageId(null)
    }
  }, [ttsPlayingMessageId])

  // ── STT ──
  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      audioChunksRef.current = []
      mediaRecorder.ondataavailable = (e) => { audioChunksRef.current.push(e.data) }
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(t => t.stop())
        try {
          const text = await audioToText(blob)
          if (text) setInputText(prev => prev + (prev ? ' ' : '') + text)
        }
        catch {
          // Silently fail
        }
      }
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    }
    catch {
      // User denied microphone access
    }
  }, [isRecording])

  // ── Embed history drawer ──
  const setHistoryDrawerOpen = useCallback((open: boolean) => {
    setEmbedState(prev => ({ ...prev, historyDrawerOpen: open }))
  }, [])

  // ── Initialization ──
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      audioRef.current?.pause()
      attachedFiles.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    messages,
    isResponding,
    inputText,
    setInputText,
    attachedFiles,
    addFiles,
    removeFile,
    suggestedQuestions,
    handleSend,
    handleStop,
    sessions,
    activeSessionId,
    switchSession,
    startNewSession,
    embedState,
    setHistoryDrawerOpen,
    handleFeedback,
    ttsPlayingMessageId,
    handleTts,
    isRecording,
    handleToggleRecording,
  }
}
