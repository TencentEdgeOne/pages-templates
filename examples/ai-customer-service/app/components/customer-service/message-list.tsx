'use client'
import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { HandThumbUpIcon, HandThumbDownIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import type { UnifiedMessage, Feedbacktype } from '@/types/app'
import WorkflowEventCard from './workflow-event-card'

type Props = {
  messages: UnifiedMessage[]
  appName?: string
  appIcon?: string
  ttsEnabled?: boolean
  ttsPlayingMessageId: string | null
  onTts: (messageId: string, text: string) => void
  onFeedback: (messageId: string, feedback: Feedbacktype) => void
}

// Extract each kind to a specific type for sub-components
type UserMsg = Extract<UnifiedMessage, { kind: 'user' }>
type AssistantMsg = Extract<UnifiedMessage, { kind: 'assistant' }>
type AgentThoughtMsg = Extract<UnifiedMessage, { kind: 'agent_thought' }>

const UserBubble: React.FC<{ msg: UserMsg }> = ({ msg }) => (
  <div className="msg-row msg-row--user">
    <div className="msg-bubble msg-bubble--user">
      <p className="msg-bubble__text">{msg.content}</p>
      {msg.attachments && msg.attachments.length > 0 && (
        <div className="msg-attachments">
          {msg.attachments.map((att, i) =>
            att.previewUrl && att.mimeType.startsWith('image/')
              ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={att.previewUrl} alt={att.name} className="msg-attachment-img" />
                )
              : (
                  <span key={i} className="msg-attachment-doc">{att.name}</span>
                ),
          )}
        </div>
      )}
    </div>
  </div>
)

const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = 'none'
}

const AppAvatar: React.FC<{ appName?: string; appIcon?: string }> = ({ appName, appIcon }) => (
  <div className="msg-avatar">
    <span className="msg-avatar__initial" aria-hidden={!!appIcon}>
      {appName?.[0] ?? 'A'}
    </span>
    {appIcon && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={appIcon}
        alt={appName}
        className="msg-avatar__img"
        onError={handleAvatarError}
      />
    )}
  </div>
)

const AgentThoughtBubble: React.FC<{
  msg: AgentThoughtMsg
  appName?: string
  appIcon?: string
}> = ({ msg, appName, appIcon }) => (
  <div className="msg-row msg-row--assistant">
    <AppAvatar appName={appName} appIcon={appIcon} />
    <div className="msg-bubble msg-bubble--assistant">
      <details className="msg-thought">
        <summary>View thinking process</summary>
        {msg.agentThought.thought && <p>{msg.agentThought.thought}</p>}
        {msg.agentThought.tool && (
          <p className="msg-thought__tool">Tool: {msg.agentThought.tool}</p>
        )}
        {/* TODO: surface observation/tool_input fields when needed */}
      </details>
    </div>
  </div>
)

const AssistantBubble: React.FC<{
  msg: AssistantMsg
  appName?: string
  appIcon?: string
  ttsEnabled?: boolean
  ttsPlaying: boolean
  onTts: () => void
  onFeedback: (f: Feedbacktype) => void
}> = ({ msg, appName, appIcon, ttsEnabled, ttsPlaying, onTts, onFeedback }) => (
  <div className="msg-row msg-row--assistant">
    <AppAvatar appName={appName} appIcon={appIcon} />
    <div className="msg-bubble msg-bubble--assistant">
      <div className="msg-bubble__markdown">
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
      {msg.isStreaming && <span className="msg-cursor" aria-hidden="true" />}
      {!msg.isStreaming && msg.difyMessageId && (
        <div className="msg-actions">
          {ttsEnabled && (
            <button
              type="button"
              className={`msg-action-btn${ttsPlaying ? ' msg-action-btn--active' : ''}`}
              onClick={onTts}
              title={ttsPlaying ? 'Stop reading' : 'Read aloud'}
            >
              <SpeakerWaveIcon className="msg-action-icon" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className={`msg-action-btn${msg.feedback?.rating === 'like' ? ' msg-action-btn--active' : ''}`}
            onClick={() => onFeedback({ rating: msg.feedback?.rating === 'like' ? null : 'like' })}
            title="Helpful"
          >
            <HandThumbUpIcon className="msg-action-icon" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`msg-action-btn${msg.feedback?.rating === 'dislike' ? ' msg-action-btn--active' : ''}`}
            onClick={() => onFeedback({ rating: msg.feedback?.rating === 'dislike' ? null : 'dislike' })}
            title="Not helpful"
          >
            <HandThumbDownIcon className="msg-action-icon" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  </div>
)

export const MessageList: React.FC<Props> = ({
  messages,
  appName,
  appIcon,
  ttsEnabled,
  ttsPlayingMessageId,
  onTts,
  onFeedback,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when a new message is added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="msg-empty">
        <p>How can I help you?</p>
      </div>
    )
  }

  return (
    <div className="msg-list" role="log" aria-live="polite">
      {messages.map((msg) => {
        if (msg.kind === 'user') return <UserBubble key={msg.id} msg={msg} />
        if (msg.kind === 'workflow_event')
          return <WorkflowEventCard key={msg.id} event={msg.workflowEvent} />
        if (msg.kind === 'agent_thought')
          return <AgentThoughtBubble key={msg.id} msg={msg} appName={appName} appIcon={appIcon} />
        return (
          <AssistantBubble
            key={msg.id}
            msg={msg}
            appName={appName}
            appIcon={appIcon}
            ttsEnabled={ttsEnabled}
            ttsPlaying={ttsPlayingMessageId === msg.difyMessageId}
            onTts={() => msg.difyMessageId && onTts(msg.difyMessageId, msg.content)}
            onFeedback={f => msg.difyMessageId && onFeedback(msg.difyMessageId, f)}
          />
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList
