'use client'
import React, { useRef } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'
import type { AppTypeValue } from '@/config'
import { useCustomerService } from './use-customer-service'
import { useContainerBreakpoints } from '@/hooks/use-container-breakpoints'
import MessageList from './message-list'
import Composer from './composer'
import SessionSidebar from './session-sidebar'
// CSS Modules
import styles from './customer-service.module.css'

export type AppParams = {
  text_to_speech?: { enabled?: boolean }
  speech_to_text?: { enabled?: boolean }
  file_upload?: { enabled?: boolean; number_limits?: number }
  suggested_questions_after_answer?: { enabled?: boolean }
  user_input_form?: unknown
  default_language?: string
  name?: string
}

type Props = {
  appType: AppTypeValue
  appParams: AppParams | null
  appName?: string
  appIcon?: string
  /** true = launch in embedded widget mode */
  isEmbed?: boolean
  /** initial conversationId */
  initialConversationId?: string | null
}

/**
 * Unified customer service shell
 *
 * Regardless of appType (chat / agent / workflow), all use this UI:
 * - Full page: left history sidebar + right message area + bottom input bar
 * - Embedded widget: compact header + message area + drawer history + bottom input bar
 */
const CustomerServiceShell: React.FC<Props> = ({
  appType,
  appParams,
  appName,
  appIcon,
  isEmbed = false,
  initialConversationId = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const containerSize = useContainerBreakpoints(containerRef)
  const isNarrow = containerSize === 'narrow'
  const isMedium = containerSize === 'medium'
  const useDrawer = isEmbed || isNarrow || isMedium

  const {
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
  } = useCustomerService({
    appType,
    appParams,
    isEmbed,
    initialConversationId,
  })

  const ttsEnabled = appParams?.text_to_speech?.enabled === true
  const sttEnabled = appParams?.speech_to_text?.enabled === true
  const fileUploadEnabled = appParams?.file_upload?.enabled === true

  return (
    <div
      ref={containerRef}
      className={[
        styles.shell,
        isEmbed ? styles['shell--embed'] : '',
        isNarrow ? styles['shell--narrow'] : '',
      ].filter(Boolean).join(' ')}
    >
      {/* ── Header ── */}
      <header className={[styles.shell__header, isEmbed || isNarrow ? styles['shell__header--compact'] : ''].filter(Boolean).join(' ')}>
        {/* App icon */}
        {appIcon
          ? <img src={appIcon} alt={appName ?? ''} className={styles['shell__app-icon']} />
          : (
            <div className={styles['shell__app-icon-placeholder']} aria-hidden="true">
              {appName?.[0] ?? 'A'}
            </div>
          )}

        {/* History entry (shown in drawer mode) */}
        {useDrawer && (
          <button
            type="button"
            className={styles['shell__header-btn']}
            onClick={() => setHistoryDrawerOpen(true)}
            title="Open history"
            aria-label="Open history"
          >
            <ClockIcon className={styles['shell__header-icon']} aria-hidden="true" />
          </button>
        )}
      </header>

      {/* ── Main body ── */}
      <div className={styles.shell__body}>
        {/* Session sidebar (always visible in non-drawer mode) */}
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={switchSession}
          onNew={startNewSession}
          drawerMode={useDrawer}
          drawerOpen={embedState.historyDrawerOpen}
          onCloseDrawer={() => setHistoryDrawerOpen(false)}
          appName={appName}
        />

        {/* Main content area */}
        <main className={styles.shell__main}>
          {/* Message stream */}
          <MessageList
            messages={messages}
            appName={appName}
            appIcon={appIcon}
            ttsEnabled={ttsEnabled}
            ttsPlayingMessageId={ttsPlayingMessageId}
            onTts={handleTts}
            onFeedback={handleFeedback}
          />

          {/* Input area */}
          <Composer
            value={inputText}
            onChange={setInputText}
            onSend={handleSend}
            onStop={handleStop}
            isResponding={isResponding}
            attachedFiles={attachedFiles}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            fileUploadEnabled={fileUploadEnabled}
            sttEnabled={sttEnabled}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            suggestedQuestions={suggestedQuestions}
            isNarrow={isNarrow}
          />
        </main>
      </div>
    </div>
  )
}

export default CustomerServiceShell
