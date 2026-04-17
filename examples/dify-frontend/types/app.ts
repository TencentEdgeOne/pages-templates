import type { Locale } from '@/i18n'

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

export type WorkflowProcess = {
  status: WorkflowRunningStatus
  tracing: NodeTracing[]
  expand?: boolean // for UI
}

export enum CodeLanguage {
  python3 = 'python3',
  javascript = 'javascript',
  json = 'json',
}

// ────────────────────────────────────────────────
// Chat / Agent types
// ────────────────────────────────────────────────

export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}

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

export type ChatMessage = {
  id: string
  conversation_id: string
  role: MessageRole
  /** Streamed or final content */
  content: string
  /** True while the assistant reply is still streaming */
  isStreaming?: boolean
  feedback?: Feedbacktype
  agent_thoughts?: AgentThought[]
  /** Files attached to this user message (images / documents). */
  attachments?: MessageAttachment[]
  created_at: number
}

export type Conversation = {
  id: string
  name: string
  inputs: Record<string, any>
  introduction: string
  created_at: number
  updated_at: number
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
