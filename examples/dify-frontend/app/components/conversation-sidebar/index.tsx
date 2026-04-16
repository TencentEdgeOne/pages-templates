'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import Loading from '@/app/components/base/loading'
import Toast from '@/app/components/base/toast'
import { fetchConversations, deleteConversation, renameConversation } from '@/service'
import type { Conversation } from '@/types/app'
import type { AppTypeValue } from '@/config'
import s from './sidebar-styles.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  /** Currently active conversation ID */
  activeConversationId: string | null
  /** When user clicks a conversation or creates a new one */
  onSelectConversation: (id: string | null) => void
  /** External signal to reload list (increment to trigger) */
  refreshSignal?: number
  /** App type, passed from parent */
  appType?: AppTypeValue
}

// ─── Component ────────────────────────────────────────────────────────────────

const ConversationSidebar: React.FC<Props> = ({
  activeConversationId,
  onSelectConversation,
  refreshSignal,
}) => {
  const { t } = useTranslation()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)

  // Rename state
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  // ── Load conversations ─────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    setLoading(true)
    try {
      const res: any = await fetchConversations({ limit: 50 })
      // API returned a Dify error object instead of a list (e.g. not_chat_app)
      if (res?.code) {
        const hint = res.code === 'not_chat_app'
          ? t('app.sidebar.notChatApp')
          : (res.message || t('app.sidebar.loadFailed'))
        Toast.notify({ type: 'error', message: hint })
        return
      }
      if (res && res.data)
        setConversations(res.data)
    }
    catch (e: any) {
      Toast.notify({ type: 'error', message: e.message || t('app.sidebar.loadFailed') })
    }
    finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadConversations()
  }, [loadConversations, refreshSignal])

  // Auto-focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current)
      renameInputRef.current.focus()
  }, [renamingId])

  // ── Start rename ───────────────────────────────────────────────────────────
  const startRename = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation()
    setRenamingId(conv.id)
    setRenameValue(conv.name)
  }

  // ── Commit rename ──────────────────────────────────────────────────────────
  const commitRename = async (id: string) => {
    const trimmed = renameValue.trim()
    setRenamingId(null)
    if (!trimmed) return
    try {
      const res: any = await renameConversation(id, trimmed)
      if (res?.code) {
        Toast.notify({ type: 'error', message: res.message || t('app.sidebar.renameFailed') })
        loadConversations()
        return
      }
      setConversations(prev =>
        prev.map(c => c.id === id ? { ...c, name: trimmed } : c),
      )
    }
    catch {
      Toast.notify({ type: 'error', message: t('app.sidebar.renameFailed') })
      loadConversations()
    }
  }

  // ── Delete conversation ────────────────────────────────────────────────────
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!window.confirm(t('app.sidebar.deleteConfirm') as string)) return
    try {
      const res: any = await deleteConversation(id)
      if (res?.code) {
        Toast.notify({ type: 'error', message: res.message || t('app.sidebar.deleteFailed') })
        return
      }
      setConversations(prev => prev.filter(c => c.id !== id))
      if (activeConversationId === id)
        onSelectConversation(null)
    }
    catch {
      Toast.notify({ type: 'error', message: t('app.sidebar.deleteFailed') })
    }
  }

  // ── Format relative time ───────────────────────────────────────────────────
  const relativeTime = (ts: number) => {
    const diff = Date.now() / 1000 - ts
    if (diff < 60) return t('app.sidebar.justNow')
    if (diff < 3600) return `${Math.floor(diff / 60)}${t('app.sidebar.minutesSuffix')}`
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t('app.sidebar.hoursSuffix')}`
    return `${Math.floor(diff / 86400)}${t('app.sidebar.daysSuffix')}`
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={s.sidebar}>
      {/* Header */}
      <div className={s.sidebarHeader}>
        <div className={s.sidebarTitle}>{t('app.sidebar.title')}</div>
        <button
          className={s.newChatButton}
          onClick={() => onSelectConversation(null)}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          {t('app.sidebar.newChat')}
        </button>
      </div>

      {/* List */}
      <div className={s.conversationList}>
        {loading && conversations.length === 0 && (
          <div className="flex justify-center py-8">
            <Loading type="area" />
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className={s.emptyList}>
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-300" />
            <div>{t('app.sidebar.emptyTitle')}</div>
            <div>{t('app.sidebar.emptyDesc')}</div>
          </div>
        )}

        {conversations.map(conv => (
          <div
            key={conv.id}
            className={cn(s.conversationItem, activeConversationId === conv.id && s.conversationItemActive)}
            onClick={() => {
              if (renamingId === conv.id) return
              onSelectConversation(conv.id)
            }}
          >
            {renamingId === conv.id
              ? (
                <>
                  <input
                    ref={renameInputRef}
                    className={s.renameInput}
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(conv.id)
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                  <button
                    className={s.actionBtn}
                    onClick={(e) => { e.stopPropagation(); commitRename(conv.id) }}
                    title={t('app.sidebar.saveTitle') as string}
                  >
                    <CheckIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className={s.actionBtn}
                    onClick={(e) => { e.stopPropagation(); setRenamingId(null) }}
                    title={t('app.sidebar.cancelTitle') as string}
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </>
                )
              : (
                <>
                  <span className={s.convName} title={conv.name}>
                    {conv.name || t('app.sidebar.untitled')}
                  </span>
                  <span className={s.convTime}>{relativeTime(conv.updated_at || conv.created_at)}</span>
                  <div className={s.actionButtons}>
                    <button
                      className={s.actionBtn}
                      onClick={e => startRename(e, conv)}
                      title={t('app.sidebar.renameTitle') as string}
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                    <button
                      className={cn(s.actionBtn, s.actionBtnDanger)}
                      onClick={e => handleDelete(e, conv.id)}
                      title={t('app.sidebar.deleteTitle') as string}
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </>
                )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConversationSidebar
