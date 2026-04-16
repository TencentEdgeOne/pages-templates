import type { Locale } from '@/i18n'
import type { AppTypeValue } from '@/config'

export type AppInfo = {
  title: string
  description: string
  default_language: Locale
  copyright?: string
  privacy_policy?: string
}

export type PromptVariable = {
  key: string
  name: string
  type: string
  default?: string | number
  required?: boolean
  options?: string[]
  max_length?: number
}

export type PromptConfig = {
  prompt_template: string
  prompt_variables: PromptVariable[]
}

export type TextTypeFormItem = {
  label: string
  variable: string
  required: boolean
  max_length: number
}

export type SelectTypeFormItem = {
  label: string
  variable: string
  required: boolean
  options: string[]
}
/**
 * User Input Form Item
 */
export type UserInputFormItem = {
  'text-input': TextTypeFormItem
} | {
  'select': SelectTypeFormItem
}

export type MessageRating = 'like' | 'dislike' | null

export type Feedbacktype = {
  rating: MessageRating
  content?: string | null
}

export enum Resolution {
  low = 'low',
  high = 'high',
}

export enum TransferMethod {
  all = 'all',
  local_file = 'local_file',
  remote_url = 'remote_url',
}

export type VisionSettings = {
  enabled: boolean
  number_limits: number
  detail: Resolution
  transfer_methods: TransferMethod[]
  image_file_size_limit?: number | string
}

export type ImageFile = {
  type: TransferMethod
  _id: string
  fileId: string
  file?: File
  progress: number
  url: string
  base64Url?: string
  deleted?: boolean
}

export type VisionFile = {
  id?: string
  type: string
  transfer_method: TransferMethod
  url: string
  upload_file_id: string
}

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  Tool = 'tool',
}

export type NodeTracing = {
  id: string
  index: number
  predecessor_node_id: string
  node_id: string
  node_type: BlockEnum
  title: string
  inputs: any
  process_data: any
  outputs?: any
  status: string
  error?: string
  elapsed_time: number
  execution_metadata: {
    total_tokens: number
    total_price: number
    currency: string
  }
  created_at: number
  created_by: {
    id: string
    name: string
    email: string
  }
  finished_at: number
  extras?: any
  expand?: boolean // for UI
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

// ────────────────────────────────────────────────
// Chat / Agent types
// ────────────────────────────────────────────────

export type AgentThought = {
  id: string
  message_id: string
  position: number
  thought: string
  observation: string
  tool: string
  tool_input: string
  created_at: number
  message_files: string[]
}

/** Lightweight snapshot of an attachment stored on a sent user message for display purposes. */
export type MessageAttachment = {
  name: string
  mimeType: string
  /** Object URL for image thumbnails — revoked on component unmount. */
  previewUrl?: string
}

// ────────────────────────────────────────────────
// File Attachment (multimodal upload)
// ────────────────────────────────────────────────

export type AttachedFile = {
  /** Stable client-side identifier (uuid v4) used to key React state updates. */
  _id: string
  /** Original browser {@link File} object, kept for re-upload if needed. */
  file: File
  /** Display name shown in the preview strip (mirrors `file.name`). */
  name: string
  /** File size in bytes (mirrors `file.size`). */
  size: number
  /** MIME type string, e.g. `"image/png"` or `"application/pdf"` (mirrors `file.type`). */
  mimeType: string
  /**
   * Dify `upload_file_id` returned by `/v1/files/upload` once the XHR
   * completes. Empty string while the upload is still in progress.
   */
  uploadFileId: string
  /**
   * Upload progress as an integer percentage.
   * - `0–99` — in flight
   * - `100`  — completed successfully
   * - `-1`   — upload failed
   */
  progress: number
  /**
   * Object URL (`blob:…`) created via `URL.createObjectURL` for image
   * thumbnails. Only populated for `image/*` files; must be revoked
   * with `URL.revokeObjectURL` when the file is removed or sent.
   */
  previewUrl?: string
}

// ────────────────────────────────────────────────
// Unified Customer Service Session types
// ────────────────────────────────────────────────

/** A single unified message (the basic unit of the message stream) */
export type UnifiedMessage =
  | {
      kind: 'user'
      id: string
      content: string
      attachments?: MessageAttachment[]
      createdAt: number
    }
  | {
      kind: 'assistant'
      id: string
      content: string
      isStreaming?: boolean
      /** Dify message_id for this message (written by the message_end event in chat mode) */
      difyMessageId?: string
      feedback?: Feedbacktype
      createdAt: number
    }
  | {
      kind: 'agent_thought'
      id: string
      /** Each agent_thought event produces its own message rather than being appended to the previous one. */
      agentThought: AgentThought
      createdAt: number
    }
  | {
      kind: 'workflow_event'
      id: string
      workflowEvent: WorkflowEventMessage
      createdAt: number
    }

/** Unified message kind discriminant */
export type UnifiedMessageKind = UnifiedMessage['kind']

/** Data model for the workflow event card */
export type WorkflowEventMessage = {
  /** Dify workflow run id */
  runId: string
  status: WorkflowRunningStatus
  /** List of completed node traces (appended continuously while running) */
  nodes: NodeTracing[]
  /** Final workflow output text (written after succeeded) */
  outputText?: string
  /** Error message (written after failed) */
  error?: string
  /** Total elapsed time in ms (written after succeeded / failed) */
  elapsedMs?: number
  /** Whether the node details section is expanded (transient UI state — can be omitted during serialization) */
  expanded?: boolean
}

/**
 * Unified session identifier. The message list is held externally in a
 * messageMap: Map<string, UnifiedMessage[]> rather than embedded here,
 * to avoid deep-copying large arrays.
 * - chat / agent → id = Dify conversation_id
 * - workflow      → id = Dify workflow run_id (local temporary uuid before submission)
 */
export type UnifiedSession = {
  /** Corresponding Dify conversation_id or workflow run_id */
  id: string
  /** Display name — chat uses the Dify conversation name, workflow uses a timestamp */
  name: string
  /** Source app type of the session */
  appType: Exclude<AppTypeValue, 'completion'>
  createdAt: number
}

/** Embed widget UI state */
export type EmbedUIState = {
  /** true = render in embedded / widget mode (compact header, drawer history, condensed buttons) */
  isEmbed: boolean
  /** Whether the history drawer is open (in embed mode) */
  historyDrawerOpen: boolean
}
