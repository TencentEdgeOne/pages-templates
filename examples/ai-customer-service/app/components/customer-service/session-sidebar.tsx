'use client'
import React from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { UnifiedSession } from '@/types/app'

type Props = {
  sessions: UnifiedSession[]
  activeSessionId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  /** true = render as overlay drawer (embed / narrow container) */
  drawerMode: boolean
  drawerOpen: boolean
  onCloseDrawer: () => void
  appName?: string
}

const SessionItem: React.FC<{
  session: UnifiedSession
  isActive: boolean
  onSelect: () => void
}> = ({ session, isActive, onSelect }) => {
  const date = new Date(session.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <button
      type="button"
      className={`sidebar__item${isActive ? ' sidebar__item--active' : ''}`}
      onClick={onSelect}
    >
      <span className="sidebar__item-name">{session.name}</span>
      <span className="sidebar__item-date">{date}</span>
    </button>
  )
}

export const SessionSidebar: React.FC<Props> = ({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
  drawerMode,
  drawerOpen,
  onCloseDrawer,
  appName,
}) => {
  const content = (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar__header">
        <span className="sidebar__title">{appName ? `${appName} · History` : 'History'}</span>
        <div className="sidebar__header-actions">
          <button type="button" className="sidebar__new-btn" onClick={onNew} title="New session" aria-label="New session">
            <PlusIcon className="sidebar__icon" aria-hidden="true" />
          </button>
          {drawerMode && (
            <button type="button" className="sidebar__close-btn" onClick={onCloseDrawer} title="Close" aria-label="Close">
              <XMarkIcon className="sidebar__icon" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Session list */}
      <div className="sidebar__list">
        {sessions.length === 0
          ? (
              <p className="sidebar__empty">No history yet</p>
            )
          : sessions.map(s => (
              <SessionItem
                key={s.id}
                session={s}
                isActive={s.id === activeSessionId}
                onSelect={() => onSelect(s.id)}
              />
            ))}
      </div>
    </div>
  )

  if (!drawerMode) return content

  // Drawer mode: overlay on top of content
  return (
    <>
      {/* Overlay */}
      {drawerOpen && (
        <div className="sidebar-overlay" onClick={onCloseDrawer} aria-hidden="true" />
      )}
      <div
        className={`sidebar-drawer${drawerOpen ? ' sidebar-drawer--open' : ''}`}
        role="complementary"
        aria-label="History"
      >
        {content}
      </div>
    </>
  )
}

export default SessionSidebar
