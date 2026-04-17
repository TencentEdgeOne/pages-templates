'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useBoolean } from 'ahooks'
import {
  PaperAirplaneIcon,
  StopIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  SparklesIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/solid'
import ReactMarkdown from 'react-markdown'
import Toast from '@/app/components/base/toast'
import Loading from '@/app/components/base/loading'
import {
  sendChatMessage,
  stopChatMessage,
  fetchSuggestedQuestions,
  fetchMessages,
  fetchAppParams,
  audioToText,
  textToAudio,
  uploadFile,
  updateFeedback,
} from '@/service'
import { v4 as uuidv4 } from 'uuid'
import { stripMarkdown, toDifyMessageId } from './utils'
import type { ChatMessage, AttachedFile, MessageAttachment, MessageRating } from '@/types/app'
import { MessageRole, TransferMethod } from '@/types/app'
import type { AppTypeValue } from '@/config'
import s from './chat-styles.module.css'

// ─── Types ────────────────────────────────────────────────────────────

type Props = {
  /** Active conversation ID (managed by parent / ConversationSidebar) */
  conversationId: string | null
  /** App type passed from parent (runtime-detected) */
  appType?: AppTypeValue
  /** Raw /v1/parameters response forwarded from AppEntry — avoids a second fetch */
  appParams?: any
  /** Called when first assistant reply arrives with new conversation ID */
  onConversationCreated?: (id: string) => void
  /** Called whenever messages change (e.g. to refresh sidebar) */
  onMessagesChange?: () => void
}

// Accepted file MIME types / extensions
const ACCEPTED_FILE_TYPES = [
  'image/png', 'image/jpeg', 'image/webp', 'image/gif',
  'application/pdf', 'text/plain', 'text/markdown',
  'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
].join(',')

const MAX_FILES = 5

// ─── Component ────────────────────────────────────────────────────────

const ChatGeneration: React.FC<Props> = ({
  conversationId,
  appType,
  appParams,
  onConversationCreated,
  onMessagesChange,
}) => {
  const { t } = useTranslation()
  const isAgentApp = appType === 'agent'

  // ── App capability flags (derived from appParams passed by parent) ──
  const ttsEnabled = appParams?.text_to_speech?.enabled === true
  const sttEnabled = appParams?.speech_to_text?.enabled === true

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isResponding, { setTrue: startResponding, setFalse: stopResponding }] = useBoolean(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Refs
  const abortControllerRef = useRef<AbortController>(new AbortController())
  const messageListRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messageCountRef = useRef<number>(0)
  const currentTaskIdRef = useRef<string | null>(null)
  // Set to true when a new conversation ID is assigned during an active stream,
  // so the conversationId-change effect doesn't abort the stream or clear messages.
  const skipNextResetRef = useRef(false)

  // ── STT state ──────────────────────────────────────────────────────
  type SttPhase = 'idle' | 'recording' | 'transcribing'
  const [sttPhase, setSttPhase] = useState<SttPhase>('idle')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // ── TTS state ──────────────────────────────────────────────────────
  type TtsState =
    | { status: 'idle' }
    | { status: 'loading'; id: string }
    | { status: 'playing'; id: string }
  const [ttsState, setTtsState] = useState<TtsState>({ status: 'idle' })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioBlobUrlRef = useRef<string | null>(null)

  // ── File attachment state ──────────────────────────────────────────
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const attachedFilesRef = useRef<AttachedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Tracks blob URLs copied into sent message attachments so they can be
  // revoked on unmount (they outlive attachedFilesRef which is cleared on send).
  const sentAttachmentUrlsRef = useRef<string[]>([])

  // Keep ref in sync so handleSend doesn't need attachedFiles in its deps
  useEffect(() => {
    attachedFilesRef.current = attachedFiles
  }, [attachedFiles])

  // ── Scroll to bottom ───────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messageListRef.current)
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    })
  }, [])

  useEffect(() => {
    if (messages.length !== messageCountRef.current) {
      messageCountRef.current = messages.length
      scrollToBottom()
    }
  }, [messages.length, scrollToBottom])

  // ── Cleanup audio + recording on unmount ──────────────────────────
  useEffect(() => {
    return () => {
      // Stop any active recording and release the mic
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive')
        mediaRecorderRef.current.stop()
      if (audioBlobUrlRef.current)
        URL.revokeObjectURL(audioBlobUrlRef.current)
      audioRef.current?.pause()
      // Revoke any leftover file preview URLs (pending input strip)
      attachedFilesRef.current.forEach(f => {
        if (f.previewUrl)
          URL.revokeObjectURL(f.previewUrl)
      })
      // Revoke blob URLs that were copied into sent message attachment snapshots
      sentAttachmentUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  // ── Reset when switching conversation ──────────────────────────────
  useEffect(() => {
    // When a new conversation is created mid-stream, the parent updates
    // conversationId from null → real ID. We must NOT abort or clear in that case.
    if (skipNextResetRef.current) {
      skipNextResetRef.current = false
      return
    }

    // Abort any in-flight request from the previous conversation
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()

    setMessages([])
    setSuggestedQuestions([])
    currentTaskIdRef.current = null
    stopResponding()
    messageCountRef.current = 0

    // Stop any TTS on conversation switch
    audioRef.current?.pause()
    setTtsState({ status: 'idle' })

    if (!conversationId) return

    const loadConversationHistory = async () => {
      setLoadingHistory(true)
      try {
        const res: any = await fetchMessages(conversationId)
        if (res?.code) {
          Toast.notify({ type: 'error', message: res.message || t('app.chat.historyLoadFailed') })
          return
        }

        if (res?.data && Array.isArray(res.data)) {
          // Map Dify response fields to frontend format.
          // Each Dify message contains both query (user) and answer (assistant),
          // so we reconstruct both sides of the conversation.
          const normalizedMessages = res.data.map((m: any) => {
            const assistantMsg: ChatMessage = {
              id: m.id,
              conversation_id: m.conversation_id,
              role: MessageRole.Assistant,
              content: m.answer || m.content || '',
              isStreaming: false,
              feedback: m.feedback,
              agent_thoughts: m.agent_thoughts || [],
              created_at: m.created_at,
            }

            if (m.query && m.query.trim().length > 0) {
              const userMsg: ChatMessage = {
                id: `user-${m.id}`,
                conversation_id: m.conversation_id,
                role: MessageRole.User,
                content: m.query,
                isStreaming: false,
                agent_thoughts: [],
                created_at: m.created_at - 1,
              }
              return [userMsg, assistantMsg]
            }

            return assistantMsg
          })
          setMessages((normalizedMessages as (ChatMessage | ChatMessage[])[]).flat() as ChatMessage[])
        }
      }
      catch (e: any) {
        Toast.notify({ type: 'error', message: e.message || t('app.chat.historyLoadFailed') })
      }
      finally {
        setLoadingHistory(false)
      }
    }

    loadConversationHistory()
  }, [conversationId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle suggested questions (with pre-flight validation) ────────
  const [suggestEnabled, setSuggestEnabled] = useState(false)
  const [suggestChecking, setSuggestChecking] = useState(false)

  const handleSuggestToggle = useCallback(async () => {
    if (suggestEnabled) {
      setSuggestEnabled(false)
      return
    }

    setSuggestChecking(true)
    try {
      // Use params forwarded from parent to avoid a redundant fetch
      const enabled = appParams?.suggested_questions_after_answer?.enabled
        // If parent params not yet available, fall back to a one-time fetch
        ?? await fetchAppParams().then((res: any) => res?.data?.suggested_questions_after_answer?.enabled).catch(() => false)
      if (enabled) {
        setSuggestEnabled(true)
      }
      else {
        Toast.notify({ type: 'error', message: t('app.chat.suggestionsNotEnabled') })
      }
    }
    catch {
      Toast.notify({ type: 'error', message: t('app.chat.suggestionsCheckFailed') })
    }
    finally {
      setSuggestChecking(false)
    }
  }, [suggestEnabled, appParams])

  // ── Textarea auto-resize ───────────────────────────────────────────
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }, [])

  // ── STT: microphone recording ──────────────────────────────────────
  const handleMicClick = useCallback(async () => {
    if (sttPhase === 'transcribing') return

    if (sttPhase === 'recording') {
      // Stop recording — this triggers ondataavailable + onstop
      mediaRecorderRef.current?.stop()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0)
          audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        // Stop all tracks to release mic indicator
        stream.getTracks().forEach(t => t.stop())
        setSttPhase('transcribing')
        try {
          const blob = new Blob(audioChunksRef.current, { type: mimeType })
          const text = await audioToText(blob)
          if (text)
            setInputValue(prev => prev ? `${prev} ${text}` : text)
          else
            Toast.notify({ type: 'info', message: t('app.chat.noSpeechDetected') })
        }
        catch {
          Toast.notify({ type: 'error', message: t('app.chat.transcriptionFailed') })
        }
        finally {
          setSttPhase('idle')
        }
      }

      recorder.start()
      setSttPhase('recording')
    }
    catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError')
        Toast.notify({ type: 'error', message: t('app.chat.micDenied') })
      else
        Toast.notify({ type: 'error', message: t('app.chat.micFailed') })
    }
  }, [sttPhase])

  // ── TTS: text-to-speech playback ───────────────────────────────────
  const handleSpeak = useCallback(async (msg: ChatMessage) => {
    if (!msg.content) return

    // If already speaking this message → stop
    if (ttsState.status === 'playing' && ttsState.id === msg.id) {
      audioRef.current?.pause()
      setTtsState({ status: 'idle' })
      return
    }

    // Stop any current playback
    audioRef.current?.pause()
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current)
      audioBlobUrlRef.current = null
    }
    setTtsState({ status: 'loading', id: msg.id })

    try {
      // Strip markdown so TTS doesn't speak raw syntax characters
      const plainText = stripMarkdown(msg.content)

      if (!plainText) return

      // Only pass message_id if it's a real Dify UUID (not a local placeholder)
      const messageId = toDifyMessageId(msg.id)

      const blob = await textToAudio(plainText, messageId)
      const url = URL.createObjectURL(blob)
      audioBlobUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        // Guard against double-revoke: only revoke if this URL is still current
        if (audioBlobUrlRef.current === url) {
          URL.revokeObjectURL(url)
          audioBlobUrlRef.current = null
        }
        setTtsState({ status: 'idle' })
      }
      audio.onerror = () => {
        if (audioBlobUrlRef.current === url) {
          URL.revokeObjectURL(url)
          audioBlobUrlRef.current = null
        }
        setTtsState({ status: 'idle' })
        Toast.notify({ type: 'error', message: t('app.chat.ttsPlaybackFailed') })
      }

      setTtsState({ status: 'playing', id: msg.id })
      await audio.play()
    }
    catch (err: any) {
      // Reset state only if we're still in loading (play() failed before audio started)
      setTtsState(prev => prev.status === 'loading' ? { status: 'idle' } : prev)
      Toast.notify({ type: 'error', message: err?.message || t('app.chat.ttsFailed') })
    }
  }, [ttsState])

  // ── File attachment: process selected files ────────────────────────
  const processFiles = useCallback((rawFiles: File[]) => {
    const remaining = MAX_FILES - attachedFilesRef.current.length
    if (remaining <= 0) {
      Toast.notify({ type: 'error', message: t('app.chat.maxFilesExceeded', { max: MAX_FILES }) })
      return
    }

    const toAdd = rawFiles.slice(0, remaining)

    // Build all entries first, then do a single state update
    const newEntries: AttachedFile[] = toAdd.map((file) => {
      const isImage = file.type.startsWith('image/')
      return {
        _id: uuidv4(),
        file,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        uploadFileId: '',
        progress: 0,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      }
    })

    setAttachedFiles(prev => [...prev, ...newEntries])

    // Trigger uploads separately after state is queued
    newEntries.forEach((entry) => {
      uploadFile(
        entry.file,
        (progress) => {
          setAttachedFiles(prev =>
            prev.map(f => f._id === entry._id ? { ...f, progress } : f),
          )
        },
        (fileId) => {
          setAttachedFiles(prev =>
            prev.map(f => f._id === entry._id ? { ...f, uploadFileId: fileId, progress: 100 } : f),
          )
        },
        () => {
          setAttachedFiles(prev =>
            prev.map(f => f._id === entry._id ? { ...f, progress: -1 } : f),
          )
          Toast.notify({ type: 'error', message: t('app.chat.fileUploadFailed', { name: entry.name }) })
        },
      )
    })
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) processFiles(files)
    // Reset input so the same file can be re-selected if needed
    e.target.value = ''
  }, [processFiles])

  const handleRemoveFile = useCallback((_id: string) => {
    setAttachedFiles(prev => {
      const target = prev.find(f => f._id === _id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(f => f._id !== _id)
    })
  }, [])

  // ── Drag-and-drop ─────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!isDragOver)
      setIsDragOver(true)
  }, [isDragOver])

  const handleDragLeave = useCallback(() => {
    if (isDragOver)
      setIsDragOver(false)
  }, [isDragOver])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) processFiles(files)
  }, [processFiles])

  // ── Send message ───────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const query = inputValue.trim()
    if (!query || isResponding) return

    setInputValue('')
    if (textareaRef.current)
      textareaRef.current.style.height = 'auto'
    setSuggestedQuestions([])

    // Read from ref so this callback doesn't need attachedFiles in its deps
    const currentFiles = attachedFilesRef.current

    // Build Dify files payload from uploaded attachments
    const files = currentFiles
      .filter(f => f.uploadFileId && f.progress === 100)
      .map(f => ({
        type: f.mimeType.startsWith('image/') ? 'image' : 'document',
        transfer_method: TransferMethod.local_file,
        upload_file_id: f.uploadFileId,
      }))

    // Snapshot attachments for display in the user message bubble.
    // previewUrls are kept alive intentionally — they are registered below
    // for revocation on unmount via sentAttachmentUrlsRef.
    const attachmentSnapshots: MessageAttachment[] = currentFiles.map(f => ({
      name: f.name,
      mimeType: f.mimeType,
      previewUrl: f.previewUrl,
    }))

    // Register image blob URLs so the unmount cleanup can revoke them.
    // (attachedFilesRef is cleared on send, so they would otherwise leak.)
    currentFiles.forEach(f => { if (f.previewUrl) sentAttachmentUrlsRef.current.push(f.previewUrl) })
    setAttachedFiles([])

    // Batch both optimistic messages into a single setState call
    const placeholderId = `assistant-${Date.now()}`
    const now = Math.floor(Date.now() / 1000)
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        conversation_id: conversationId || '',
        role: MessageRole.User,
        content: query,
        isStreaming: false,
        agent_thoughts: [],
        attachments: attachmentSnapshots.length > 0 ? attachmentSnapshots : undefined,
        created_at: now,
      } as ChatMessage,
      {
        id: placeholderId,
        conversation_id: conversationId || '',
        role: MessageRole.Assistant,
        content: '',
        isStreaming: true,
        agent_thoughts: [],
        created_at: now,
      } as ChatMessage,
    ])

    startResponding()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Track the real message ID once the server assigns one
    let resolvedMsgId = placeholderId
    let resolvedConvId = conversationId

    // Shared handler for both onData (chat) and onAgentMessage (agent app)
    const handleStreamChunk = (text: string, _isFirst: boolean, { conversationId: cid, messageId }: { conversationId?: string; messageId?: string }) => {
      if (cid && !resolvedConvId) {
        resolvedConvId = cid
        skipNextResetRef.current = true
        onConversationCreated?.(cid)
      }
      if (messageId)
        resolvedMsgId = messageId

      setMessages(prev =>
        prev.map(m =>
          m.id === placeholderId || m.id === resolvedMsgId
            ? { ...m, id: resolvedMsgId, content: m.content + text, isStreaming: true }
            : m,
        ),
      )
      scrollToBottom()
    }

    await sendChatMessage(
      {
        query,
        inputs: {},
        conversation_id: conversationId || undefined,
        ...(files.length > 0 ? { files } : {}),
      },
      {
        onData: handleStreamChunk,
        onAgentMessage: handleStreamChunk,

        onAgentThought: (thought) => {
          setMessages(prev =>
            prev.map((m) => {
              if (m.id !== placeholderId && m.id !== resolvedMsgId) return m
              const existing = m.agent_thoughts || []
              const idx = existing.findIndex((t: any) => t.id === thought.data?.id)
              const newThoughts
                = idx === -1
                  ? [...existing, thought.data]
                  : existing.map((t: any, i: number) => (i === idx ? thought.data : t))
              return { ...m, agent_thoughts: newThoughts }
            }),
          )
        },

        onMessageEnd: (messageId, cid) => {
          if (cid && !resolvedConvId) {
            resolvedConvId = cid
            skipNextResetRef.current = true
            onConversationCreated?.(cid)
          }
          resolvedMsgId = messageId

          setMessages(prev =>
            prev.map(m =>
              m.id === placeholderId || m.id === resolvedMsgId
                ? { ...m, id: messageId, isStreaming: false }
                : m,
            ),
          )
          onMessagesChange?.()

          if (suggestEnabled && messageId) {
            fetchSuggestedQuestions(messageId)
              .then((res: any) => {
                if (Array.isArray(res?.data))
                  setSuggestedQuestions(res.data)
              })
              .catch(() => { /* silently ignore */ })
          }
        },

        onCompleted: () => {
          setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m))
          stopResponding()
        },

        onError: (msg) => {
          Toast.notify({ type: 'error', message: msg })
          setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m))
          stopResponding()
        },

        onTaskId: (taskId) => {
          currentTaskIdRef.current = taskId
        },

        abortController,
      },
    )
  }, [
    inputValue,
    isResponding,
    conversationId,
    suggestEnabled,
    startResponding,
    stopResponding,
    scrollToBottom,
    onConversationCreated,
    onMessagesChange,
  ])

  // ── Stop responding ────────────────────────────────────────────────
  const handleStop = useCallback(async () => {
    abortControllerRef.current.abort()
    const taskId = currentTaskIdRef.current
    if (taskId) {
      try { await stopChatMessage(taskId) }
      catch (_) { }
    }
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m))
    stopResponding()
  }, [stopResponding])

  // ── Message feedback (like / dislike) ─────────────────────────────
  const handleFeedback = useCallback(async (msgId: string, currentRating: MessageRating, action: 'like' | 'dislike') => {
    // Clicking the active rating again → revoke (set to null)
    const newRating: MessageRating = currentRating === action ? null : action

    // Optimistic update
    setMessages(prev =>
      prev.map(m => m.id === msgId ? { ...m, feedback: { rating: newRating } } : m),
    )

    try {
      await updateFeedback({
        url: `messages/${msgId}/feedbacks`,
        body: { rating: newRating },
      })
    }
    catch {
      // Revert on failure
      setMessages(prev =>
        prev.map(m => m.id === msgId ? { ...m, feedback: { rating: currentRating } } : m),
      )
      Toast.notify({ type: 'error', message: t('app.chat.feedbackFailed') })
    }
  }, [t])

  // ── Keyboard: Enter to send, Shift+Enter for newline ──────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className={cn(s.chatContainer, 'flex flex-col h-full')}>
      {/* Message list */}
      <div ref={messageListRef} className={cn(s.messageList, 'grow')}>
        {loadingHistory && (
          <div className="flex justify-center items-center h-full">
            <Loading type="area" />
          </div>
        )}

        {!loadingHistory && messages.length === 0 && (
          <div className={s.emptyState}>
            <ChatBubbleOvalLeftEllipsisIcon className={s.emptyStateIcon} />
            <div className={s.emptyStateTitle}>{t('app.chat.emptyTitle')}</div>
            <div className={s.emptyStateDesc}>
              {t('app.chat.emptyDesc')}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              s.messageRow,
              msg.role === MessageRole.User ? s.messageRowUser : s.messageRowAssistant,
            )}
          >
            {/* Avatar */}
            <div className={cn(s.avatar, msg.role === MessageRole.User ? s.avatarUser : s.avatarAssistant)}>
              {msg.role === MessageRole.User ? 'U' : 'AI'}
            </div>

            {/* Bubble content */}
            <div className={s.messageBody}>
              {/* Agent thoughts */}
              {isAgentApp && msg.agent_thoughts && msg.agent_thoughts.length > 0 && (
                <div className="mb-2 space-y-1">
                  {msg.agent_thoughts.map((thought: any) => (
                    <div key={thought.id} className={s.agentThought}>
                      <div className={s.agentThoughtLabel}>{t('app.chat.thinkingLabel')}</div>
                      <div>{thought.thought}</div>
                      {thought.tool && (
                        <div className="mt-1 text-xs">
                          🔧 <strong>{thought.tool}</strong>
                          {thought.tool_input && ` — ${thought.tool_input}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Main bubble */}
              <div
                className={cn(
                  s.bubble,
                  msg.role === MessageRole.User ? s.bubbleUser : s.bubbleAssistant,
                  msg.isStreaming && s.cursor,
                )}
              >
                {msg.role === MessageRole.Assistant
                  ? (
                    <ReactMarkdown className="prose prose-sm max-w-none break-words">
                      {msg.content || (msg.isStreaming ? ' ' : '')}
                    </ReactMarkdown>
                  )
                  : (
                    <>
                      {/* Attachments shown inside user bubble, above the text */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className={s.msgAttachmentList}>
                          {msg.attachments.map((att) =>
                            att.previewUrl
                              ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img key={att.previewUrl} src={att.previewUrl} alt={att.name} className={s.msgAttachmentImg} />
                              )
                              : (
                                <div key={att.name} className={s.msgAttachmentDoc}>
                                  <DocumentIcon className="w-3 h-3 flex-shrink-0" />
                                  <span className={s.msgAttachmentDocName}>{att.name}</span>
                                </div>
                              ),
                          )}
                        </div>
                      )}
                      {msg.content}
                    </>
                  )}
              </div>

              {/* TTS speak button — only for completed assistant messages when TTS is enabled */}
              {ttsEnabled && msg.role === MessageRole.Assistant && !msg.isStreaming && msg.content && (
                <button
                  className={cn(s.speakButton, ttsState.status === 'playing' && ttsState.id === msg.id && s.speakButtonActive)}
                  onClick={() => handleSpeak(msg)}
                  disabled={ttsState.status === 'loading' && ttsState.id === msg.id}
                  title={ttsState.status === 'playing' && ttsState.id === msg.id ? t('app.chat.stopSpeakingTitle') as string : t('app.chat.readAloudTitle') as string}
                >
                  {ttsState.status === 'loading' && ttsState.id === msg.id
                    ? (
                      <span className={s.loadingEllipsis}>…</span>
                    )
                    : (
                      <>
                        <SpeakerWaveIcon className="w-3 h-3" />
                        <span>{ttsState.status === 'playing' && ttsState.id === msg.id ? t('app.chat.stopSpeakingBtn') : t('app.chat.listenBtn')}</span>
                      </>
                    )}
                </button>
              )}

              {/* Feedback (like / dislike) — only for completed assistant messages with a real Dify ID */}
              {msg.role === MessageRole.Assistant && !msg.isStreaming && msg.content && !msg.id.startsWith('assistant-') && (
                <div className={s.messageActions}>
                  <button
                    className={cn(s.feedbackBtn, msg.feedback?.rating === 'like' && s.feedbackBtnActive)}
                    onClick={() => handleFeedback(msg.id, msg.feedback?.rating ?? null, 'like')}
                    title={t('app.chat.likeTitle') as string}
                  >
                    <HandThumbUpIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className={cn(s.feedbackBtn, msg.feedback?.rating === 'dislike' && s.feedbackBtnActiveDislike)}
                    onClick={() => handleFeedback(msg.id, msg.feedback?.rating ?? null, 'dislike')}
                    title={t('app.chat.dislikeTitle') as string}
                  >
                    <HandThumbDownIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested questions — outside the scroll area */}
      {suggestEnabled && suggestedQuestions.length > 0 && !isResponding && (
        <div className="px-10 pb-3">
          <div className={s.suggestedList}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                className={s.suggestedItem}
                onClick={() => {
                  setInputValue(q)
                  textareaRef.current?.focus()
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      {/* Input area */}
      <div
        className={s.inputArea}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Toolbar */}
        <div className={s.inputToolbar}>
          <button
            className={cn(s.suggestToggle, suggestEnabled && s.suggestToggleActive)}
            onClick={handleSuggestToggle}
            disabled={suggestChecking}
            title={suggestEnabled ? t('app.chat.suggestionsDisableTitle') as string : t('app.chat.suggestionsEnableTitle') as string}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>{t('app.chat.suggestions')}</span>
          </button>
        </div>

        {/* File preview area */}
        {attachedFiles.length > 0 && (
          <div className={s.filePreviewArea}>
            <div className={s.filePreviewList}>
              {attachedFiles.map(f => (
                <div
                  key={f._id}
                  className={cn(s.filePreviewItem, f.progress === -1 && s.filePreviewItemError)}
                  title={f.name}
                >
                  {/* Thumbnail or icon */}
                  {f.previewUrl
                    ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.previewUrl} alt={f.name} className={s.filePreviewThumb} />
                    )
                    : (
                      <div className={s.filePreviewIcon}>
                        <DocumentIcon className="w-4 h-4" />
                      </div>
                    )}

                  {/* File name */}
                  <div className={s.filePreviewName}>{f.name}</div>

                  {/* Progress bar */}
                  {f.progress >= 0 && f.progress < 100 && (
                    <div
                      className={s.fileProgressBar}
                      style={{ width: `${f.progress}%` }}
                    />
                  )}
                  {f.progress === -1 && (
                    <div className={cn(s.fileProgressBar, s.fileProgressBarError)} />
                  )}

                  {/* Remove button */}
                  <button
                    className={s.fileRemoveBtn}
                    onClick={() => handleRemoveFile(f._id)}
                    title={t('app.chat.removeFileTitle') as string}
                  >
                    <XMarkIcon className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn(s.inputWrapper, isDragOver && s.inputWrapperDragOver)}>
          {/* Attach button */}
          <button
            className={s.attachButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isResponding || attachedFiles.length >= MAX_FILES}
            title={t('app.chat.attachTitle') as string}
          >
            <PaperClipIcon className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            className={s.inputTextarea}
            placeholder={t('app.chat.inputPlaceholder') as string}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isResponding}
          />

          {/* Mic button — only shown when STT is enabled */}
          {sttEnabled && (
          <button
            className={cn(s.micButton, sttPhase === 'recording' && s.micButtonActive)}
            onClick={handleMicClick}
            disabled={sttPhase === 'transcribing' || isResponding}
            title={sttPhase === 'recording' ? t('app.chat.stopRecordTitle') as string : sttPhase === 'transcribing' ? t('app.chat.transcribingPlaceholder') as string : t('app.chat.recordTitle') as string}
          >
            {sttPhase === 'transcribing'
              ? <span className={s.loadingEllipsis}>…</span>
              : <MicrophoneIcon className="w-4 h-4" />}
          </button>
          )}

          {isResponding
            ? (
              <button className={s.stopButton} onClick={handleStop}>
                <StopIcon className="w-3.5 h-3.5" />
                <span>{t('app.chat.stopBtn')}</span>
              </button>
            )
            : (
              <button
                className={s.sendButton}
                onClick={handleSend}
                disabled={!inputValue.trim()}
                title="Send"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            )}
        </div>

        <div className={s.inputHint}>{t('app.chat.inputHint')}</div>
      </div>
    </div>
  )
}

export default React.memo(ChatGeneration)
