'use client'
import React, { useRef, useEffect, KeyboardEvent } from 'react'
import {
  PaperAirplaneIcon,
  StopIcon,
  PaperClipIcon,
  MicrophoneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type { AttachedFile } from '@/types/app'

type Props = {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onStop: () => void
  isResponding: boolean
  // Attachments
  attachedFiles: AttachedFile[]
  onAddFiles: (files: File[]) => void
  onRemoveFile: (id: string) => void
  fileUploadEnabled: boolean
  // Voice
  sttEnabled: boolean
  isRecording: boolean
  onToggleRecording: () => void
  // Suggested questions
  suggestedQuestions: string[]
  // Layout
  isNarrow?: boolean
  placeholder?: string
}

export const Composer: React.FC<Props> = ({
  value,
  onChange,
  onSend,
  onStop,
  isResponding,
  attachedFiles,
  onAddFiles,
  onRemoveFile,
  fileUploadEnabled,
  sttEnabled,
  isRecording,
  onToggleRecording,
  suggestedQuestions,
  isNarrow = false,
  placeholder = 'Type your message…',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea height (max 160px)
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [value])

  // Declare canSend before handleKeyDown so the closure can reference it
  const canSend =
    value.trim().length > 0
    && !isResponding
    && !attachedFiles.some(f => f.progress >= 0 && f.progress < 100)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) onSend()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onAddFiles(files)
    e.target.value = ''
  }

  return (
    <div className={['composer', isNarrow && 'composer--narrow'].filter(Boolean).join(' ')}>
      {/* Suggested questions */}
      {suggestedQuestions.length > 0 && !isResponding && (
        <div className="composer__suggestions">
          {suggestedQuestions.map(q => (
            <button
              type="button"
              key={q}
              className="composer__suggestion-chip"
              onClick={() => onChange(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Attachment preview strip */}
      {attachedFiles.length > 0 && (
        <div className="composer__attachments">
          {attachedFiles.map(f => (
            <div
              key={f._id}
              className={['composer__attachment', f.progress === -1 && 'composer__attachment--error'].filter(Boolean).join(' ')}
            >
              {f.previewUrl
                ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.previewUrl} alt={f.name} className="composer__attachment-thumb" />
                )
                : (
                  <span className="composer__attachment-name">{f.name}</span>
                )}
              {f.progress >= 0 && f.progress < 100 && (
                <div
                  className="composer__attachment-progress"
                  style={{ width: `${f.progress}%` }}
                />
              )}
              <button
                type="button"
                className="composer__attachment-remove"
                onClick={() => onRemoveFile(f._id)}
                aria-label={`Remove ${f.name}`}
              >
                <XMarkIcon className="composer__icon composer__icon--sm" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main input row */}
      <div className="composer__row">
        <textarea
          ref={textareaRef}
          className="composer__textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isResponding}
          aria-label="Message input"
        />

        <div className="composer__actions">
          {/* Attach file button */}
          {fileUploadEnabled && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx"
              />
              <button
                type="button"
                className="composer__btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files"
                disabled={isResponding}
              >
                <PaperClipIcon className="composer__icon" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Voice input button */}
          {sttEnabled && (
            <button
              type="button"
              className={['composer__btn', isRecording && 'composer__btn--recording'].filter(Boolean).join(' ')}
              onClick={onToggleRecording}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              disabled={isResponding && !isRecording}
            >
              <MicrophoneIcon className="composer__icon" aria-hidden="true" />
            </button>
          )}

          {/* Stop / Send */}
          {isResponding
            ? (
              <button
                type="button"
                className="composer__btn composer__btn--stop"
                onClick={onStop}
                title="Stop generating"
              >
                <StopIcon className="composer__icon" aria-hidden="true" />
              </button>
            )
            : (
              <button
                type="button"
                className={['composer__btn', 'composer__btn--send', canSend && 'composer__btn--send-active'].filter(Boolean).join(' ')}
                onClick={onSend}
                disabled={!canSend}
                title="Send (Enter)"
              >
                <PaperAirplaneIcon className="composer__icon" aria-hidden="true" />
              </button>
            )}
        </div>
      </div>
    </div>
  )
}

export default Composer
